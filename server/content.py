"""
Editable site content.

The marketing site used to hardcode its roster, services, case studies,
posts, courses and about/contact copy in the frontend bundle, so changing a
job title meant a code change and a deploy. Those sections now live here, in
one `site_content` table, and the frontend reads them from /api/content.

Design notes:

* One row per section holding a JSON document, rather than a table per
  content type. The shapes are nested and irregular (a course has months,
  each with topics; a team member has skills, languages and portfolio
  entries), and normalising them would buy nothing — nothing queries across
  them. The tradeoff is that SQL cannot enforce the shape, so writes are
  validated here instead.

* Seeded from seed/content.json, which is generated from the frontend's own
  data modules by `npm run content:seed`. Seeding only fills in sections
  that do not exist yet: it never overwrites an edit, so a redeploy cannot
  silently revert someone's work. Restoring the seed is an explicit action
  (POST /api/content/<key>/reset).

* Collections are lists of records identified by a stable id field (usually
  a slug), which is what lets the admin edit one record at a time instead of
  PUTting the whole list and racing another editor.
"""

import json
import os
import re
import sqlite3

SEED_PATH = os.path.join(os.path.dirname(__file__), 'seed', 'content.json')

# Section name -> how it is stored and edited.
#   collection: a list of records, each identified by `id_field`
#   document:   a single object
CONTENT_SPEC = {
    'team':      {'kind': 'collection', 'id_field': 'slug'},
    'services':  {'kind': 'collection', 'id_field': 'slug'},
    'portfolio': {'kind': 'collection', 'id_field': 'slug'},
    'posts':     {'kind': 'collection', 'id_field': 'slug'},
    'courses':   {'kind': 'collection', 'id_field': 'slug'},
    'about':     {'kind': 'document'},
    'contact':   {'kind': 'document'},
    'advisor':   {'kind': 'document'},
    'coursesPage': {'kind': 'document'},
}

CONTENT_KEYS = tuple(CONTENT_SPEC)

# Documents are small by nature — a few hundred lines of copy at most. The
# cap is here so a malformed or hostile request cannot push megabytes into
# SQLite and out to every visitor.
MAX_DOCUMENT_BYTES = 512 * 1024

SLUG_RE = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')


class ContentError(Exception):
    """A bad request the caller can fix. Carries the HTTP status to use."""

    def __init__(self, message, status=400):
        super().__init__(message)
        self.message = message
        self.status = status


def _ensure_table(cursor):
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS site_content (
            key TEXT PRIMARY KEY,
            data TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_by INTEGER
        )
    ''')


def init_content(cursor):
    """Create the table and seed any section that is missing. Idempotent."""
    _ensure_table(cursor)

    seed = _load_seed()
    if not seed:
        return

    cursor.execute('SELECT key FROM site_content')
    existing = {row[0] for row in cursor.fetchall()}

    for key in CONTENT_KEYS:
        if key in existing or key not in seed:
            continue
        cursor.execute(
            'INSERT INTO site_content (key, data) VALUES (?, ?)',
            (key, json.dumps(seed[key], ensure_ascii=False)),
        )


def _load_seed():
    """The generated seed, or {} when it has not been built yet."""
    try:
        with open(SEED_PATH, encoding='utf-8') as fh:
            return json.load(fh)
    except FileNotFoundError:
        return {}
    except (OSError, ValueError):
        # A corrupt seed must not take the API down — the frontend still
        # has its bundled copy of every section.
        return {}


def read_all(conn):
    """Every section, as a dict. Missing sections are simply absent."""
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT key, data, updated_at FROM site_content')
    except sqlite3.OperationalError:
        # The table is created by init_db(), which only runs when app.py is
        # executed directly. Under a WSGI server that has not happened yet,
        # and an empty answer is the honest one: the frontend then renders
        # the copy that shipped with the build.
        return {}, {}
    content, updated = {}, {}
    for row in cursor.fetchall():
        key = row['key'] if isinstance(row, sqlite3.Row) else row[0]
        if key not in CONTENT_SPEC:
            continue
        try:
            content[key] = json.loads(row['data'] if isinstance(row, sqlite3.Row) else row[1])
        except ValueError:
            continue
        updated[key] = row['updated_at'] if isinstance(row, sqlite3.Row) else row[2]
    return content, updated


def read_section(conn, key):
    """One section's value, or None when it has never been stored."""
    _require_key(key)
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT data FROM site_content WHERE key = ?', (key,))
    except sqlite3.OperationalError:
        return None
    row = cursor.fetchone()
    if not row:
        return None
    try:
        return json.loads(row['data'] if isinstance(row, sqlite3.Row) else row[0])
    except ValueError:
        return None


def write_section(conn, key, value, admin_id, action='REPLACE_CONTENT'):
    """Validate and store a whole section, logging who changed it."""
    _require_key(key)
    validate_section(key, value)

    payload = json.dumps(value, ensure_ascii=False)
    if len(payload.encode('utf-8')) > MAX_DOCUMENT_BYTES:
        raise ContentError('Content is too large', 413)

    cursor = conn.cursor()
    # Writes create the table if a WSGI server started the app without ever
    # running init_db(); reads stay tolerant of it being absent.
    _ensure_table(cursor)
    cursor.execute('''
        INSERT INTO site_content (key, data, updated_at, updated_by)
        VALUES (?, ?, CURRENT_TIMESTAMP, ?)
        ON CONFLICT(key) DO UPDATE SET
            data = excluded.data,
            updated_at = CURRENT_TIMESTAMP,
            updated_by = excluded.updated_by
    ''', (key, payload, admin_id))

    cursor.execute('''
        INSERT INTO admin_logs (admin_id, action, details)
        VALUES (?, ?, ?)
    ''', (admin_id, action, f'section "{key}"'))
    conn.commit()
    return value


def add_item(conn, key, item, admin_id):
    """Append a record to a collection. The id must be new."""
    items = _collection(conn, key)
    id_field = CONTENT_SPEC[key]['id_field']
    _validate_item(key, item)

    item_id = item.get(id_field)
    if any(existing.get(id_field) == item_id for existing in items):
        raise ContentError(f'{id_field} "{item_id}" already exists', 409)

    items.append(item)
    write_section(conn, key, items, admin_id, action='ADD_CONTENT_ITEM')
    return item


def update_item(conn, key, item_id, item, admin_id):
    """Replace one record in a collection, keeping its position."""
    items = _collection(conn, key)
    id_field = CONTENT_SPEC[key]['id_field']
    _validate_item(key, item)

    index = next((i for i, existing in enumerate(items)
                  if existing.get(id_field) == item_id), None)
    if index is None:
        raise ContentError(f'No {key} item with {id_field} "{item_id}"', 404)

    new_id = item.get(id_field)
    if new_id != item_id and any(e.get(id_field) == new_id for e in items):
        raise ContentError(f'{id_field} "{new_id}" already exists', 409)

    items[index] = item
    write_section(conn, key, items, admin_id, action='UPDATE_CONTENT_ITEM')
    return item


def delete_item(conn, key, item_id, admin_id):
    """Remove one record from a collection."""
    items = _collection(conn, key)
    id_field = CONTENT_SPEC[key]['id_field']

    remaining = [i for i in items if i.get(id_field) != item_id]
    if len(remaining) == len(items):
        raise ContentError(f'No {key} item with {id_field} "{item_id}"', 404)

    write_section(conn, key, remaining, admin_id, action='DELETE_CONTENT_ITEM')
    return remaining


def reset_section(conn, key, admin_id):
    """Restore a section to the seed the build shipped with."""
    _require_key(key)
    seed = _load_seed()
    if key not in seed:
        raise ContentError(f'No seed available for "{key}"', 404)
    return write_section(conn, key, seed[key], admin_id, action='RESET_CONTENT')


# ── Validation ────────────────────────────────────────────────────────────
# The frontend keeps a bundled copy of every section and falls back to it
# when a section looks wrong, so the job here is to reject what would break
# a page — not to police every field. Copy is the editor's business.

def validate_section(key, value):
    _require_key(key)
    spec = CONTENT_SPEC[key]

    if spec['kind'] == 'document':
        if not isinstance(value, dict):
            raise ContentError(f'"{key}" must be an object')
        return

    if not isinstance(value, list):
        raise ContentError(f'"{key}" must be a list')

    id_field = spec['id_field']
    seen = set()
    for item in value:
        _validate_item(key, item)
        item_id = item[id_field]
        if item_id in seen:
            raise ContentError(f'Duplicate {id_field} "{item_id}" in {key}')
        seen.add(item_id)


def _validate_item(key, item):
    spec = CONTENT_SPEC[key]
    if spec['kind'] != 'collection':
        raise ContentError(f'"{key}" is not a collection')
    if not isinstance(item, dict):
        raise ContentError(f'Each {key} entry must be an object')

    id_field = spec['id_field']
    item_id = item.get(id_field)
    if not isinstance(item_id, str) or not item_id.strip():
        raise ContentError(f'Each {key} entry needs a "{id_field}"')
    # Slugs end up in URLs (/team/<slug>, /courses/<slug>), so keep them to
    # what is safe and readable in a path.
    if not SLUG_RE.match(item_id):
        raise ContentError(
            f'"{item_id}" is not a valid {id_field}: use lowercase letters, '
            'numbers and single hyphens'
        )


def _collection(conn, key):
    _require_key(key)
    if CONTENT_SPEC[key]['kind'] != 'collection':
        raise ContentError(f'"{key}" is a single document, not a list', 400)
    value = read_section(conn, key)
    if value is None:
        seed = _load_seed()
        value = seed.get(key, [])
    if not isinstance(value, list):
        raise ContentError(f'Stored "{key}" is not a list', 500)
    return value


def _require_key(key):
    if key not in CONTENT_SPEC:
        raise ContentError(f'Unknown content section "{key}"', 404)
