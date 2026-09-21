import logging
import os
import sqlite3
import time
import jwt
import smtplib
from email.message import EmailMessage
from datetime import datetime, timedelta
from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

from content import (
    ContentError, add_item, delete_item, init_content, read_all,
    read_section, reset_section, update_item, write_section,
)

load_dotenv()

app = Flask(__name__)

FLASK_ENV = os.getenv('FLASK_ENV', 'production').lower()
FLASK_DEBUG = os.getenv('FLASK_DEBUG', '0').lower() in ('1', 'true', 'yes')
IS_DEV = FLASK_ENV != 'production' or FLASK_DEBUG

SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    if IS_DEV:
        logging.warning('SECRET_KEY is not set. Using insecure development secret key.')
        SECRET_KEY = 'dev-secret-key'
    else:
        raise RuntimeError('SECRET_KEY environment variable must be set in production')

app.config['SECRET_KEY'] = SECRET_KEY
app.config['JWT_EXPIRATION_HOURS'] = int(os.getenv('JWT_EXPIRATION_HOURS', '24'))
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

cors_origins = os.getenv('CORS_ORIGINS')
if cors_origins:
    allowed_origins = [origin.strip() for origin in cors_origins.split(',') if origin.strip()]
else:
    allowed_origins = ['http://localhost:5173', 'http://127.0.0.1:5173'] if IS_DEV else []

if not allowed_origins and not IS_DEV:
    raise RuntimeError('CORS_ORIGINS environment variable must be set in production')

CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

DATABASE = os.path.join(os.path.dirname(__file__), 'auth.db')

SMTP_HOST = os.getenv('SMTP_HOST')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
SMTP_USER = os.getenv('SMTP_USER')
SMTP_PASS = os.getenv('SMTP_PASS')
CONTACT_RECEIVER_EMAIL = os.getenv('CONTACT_RECEIVER_EMAIL')

# ── Chat assistant ────────────────────────────────────────────────────────
# The widget works without any of this — the frontend ships a scripted
# knowledge base and only upgrades to Claude when /api/chat reports ready.
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')
CHAT_MODEL = os.getenv('CHAT_MODEL', 'claude-opus-5')

# This endpoint is unauthenticated and spends money per call, so it is capped
# per IP. In-memory, so it resets on restart and is per-process — good enough
# for a single-instance deploy; move to Redis if you run more than one worker.
CHAT_RATE_LIMIT = int(os.getenv('CHAT_RATE_LIMIT', '20'))       # messages...
CHAT_RATE_WINDOW = int(os.getenv('CHAT_RATE_WINDOW', '3600'))   # ...per hour
CHAT_MAX_CHARS = 2000        # per message
CHAT_MAX_HISTORY = 12        # turns kept from the client's transcript

_chat_hits = {}

# Stated facts only — everything here is already published on the site.
# Keep in sync with src/services/chatKnowledge.js.
CHAT_SYSTEM_PROMPT = """You are the assistant on CodeNode's website, a digital \
product studio. You answer questions from prospective clients browsing the site.

## What CodeNode does
Eight service lines: web development (React/Next.js, Node.js, cloud), AI and \
machine learning (LLM features, NLP, computer vision, predictive analytics, ML \
pipelines), UI/UX design, mobile apps (native iOS/Android and React Native), \
cloud and DevOps (AWS/Azure/GCP, CI/CD, containers), digital marketing (SEO, \
paid media, content), cybersecurity (penetration testing, audits, SOC 2 and ISO \
27001 compliance), and performance engineering (Core Web Vitals, caching).

## Facts you may state
- The studio was founded in 2025 and is deliberately small: 10 people, all based in Pakistan, working remotely.
- Budgets start at $2,000 for targeted projects and scale with scope.
- Pricing is fixed-price for well-scoped work, time & materials for exploratory work.
- A focused landing page takes 2-3 weeks; a full SaaS platform takes 3-6 months.
- Every project includes a 30-day post-launch warranty; monthly retainers are available after that.
- They work with both early-stage startups (lean MVP sprints) and larger teams (ongoing retainers).
- They take over existing codebases, starting with an audit and a remediation plan.
- Preferred stack: React/Next.js, Node.js or Python, PostgreSQL or MongoDB, AWS or GCP. Stack-agnostic but opinionated.
- The team designs and engineers in-house, so there is no handoff between the two.
- Individual specialists can be hired directly, by the hour, for a sprint, or embedded in a client team. \
Published hourly rates run from $20 (UX research) to $50 (strategy and lead engineering). Every team member has a profile \
page at /team/<name> showing their rate, availability, skills and selected work, with a \
"Request an interview" button. Direct people to /team to browse; do not quote a rate for a \
specific named person unless the person asks about someone whose rate you were told here.
- WhatsApp: +92 311 0868172. The contact form on the site reaches a human within one business day.

## How to answer
Answer only from the facts above. If you are asked something they do not cover \
- a specific quote for a described project, availability on a date, whether a \
named technology is supported, anything about a particular past client - say \
plainly that you do not have that detail and point the person at the contact \
form, which reaches a human. Never invent a price, a date, a client name, a \
statistic, or a capability.

Keep replies short: two or three sentences, or a few brief lines. This is a chat \
widget in the corner of a page, not a document. Write plainly, no marketing \
superlatives, no bullet-point walls, no emoji. Do not open with pleasantries \
like "Great question" - answer the question.

Do not include internal or system XML tags in your response."""


def send_contact_email(name, email, service, message):
    """Send a contact notification email if SMTP is configured."""
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASS or not CONTACT_RECEIVER_EMAIL:
        return False

    email_message = EmailMessage()
    email_message['Subject'] = f'New contact request from {name}'
    email_message['From'] = SMTP_USER
    email_message['To'] = CONTACT_RECEIVER_EMAIL
    email_message.set_content(
        f'Name: {name}\nEmail: {email}\nService: {service}\n\nMessage:\n{message}\n'
    )

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as smtp:
        smtp.starttls()
        smtp.login(SMTP_USER, SMTP_PASS)
        smtp.send_message(email_message)

    return True


def save_contact_request(name, email, service, message):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO contact_requests (name, email, service, message)
        VALUES (?, ?, ?, ?)
    ''', (name, email, service, message))
    conn.commit()
    conn.close()


def save_interview_request(payload):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO interview_requests
            (member_slug, member_name, name, email, company, engagement, budget, message)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        payload['member_slug'], payload['member_name'], payload['name'],
        payload['email'], payload['company'], payload['engagement'],
        payload['budget'], payload['message'],
    ))
    conn.commit()
    conn.close()


def send_interview_email(payload):
    """Notify the team of an interview request, if SMTP is configured."""
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASS or not CONTACT_RECEIVER_EMAIL:
        return False

    email_message = EmailMessage()
    email_message['Subject'] = f"Interview request — {payload['member_name']}"
    email_message['From'] = SMTP_USER
    email_message['To'] = CONTACT_RECEIVER_EMAIL
    email_message['Reply-To'] = payload['email']
    email_message.set_content(
        f"Requested team member: {payload['member_name']} ({payload['member_slug']})\n"
        f"From: {payload['name']} <{payload['email']}>\n"
        f"Company: {payload['company'] or '—'}\n"
        f"Engagement: {payload['engagement'] or '—'}\n"
        f"Budget: {payload['budget'] or '—'}\n\n"
        f"{payload['message']}\n"
    )

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
            smtp.starttls()
            smtp.login(SMTP_USER, SMTP_PASS)
            smtp.send_message(email_message)
        return True
    except Exception:
        logging.exception('Failed to send interview request email')
        return False

# Database initialization
def init_db():
    """Initialize the SQLite database"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            is_admin BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Admin logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS admin_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            admin_id INTEGER NOT NULL,
            action TEXT NOT NULL,
            target_user_id INTEGER,
            details TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(admin_id) REFERENCES users(id)
        )
    ''')
    
    # Create default admin user if not exists
    cursor.execute("SELECT * FROM users WHERE username = ?", ('admin',))
    if not cursor.fetchone():
        admin_password = generate_password_hash('admin123')
        cursor.execute('''
            INSERT INTO users (username, email, password, is_admin)
            VALUES (?, ?, ?, ?)
        ''', ('admin', 'admin@example.com', admin_password, 1))

    # Ensure contact_requests table exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contact_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            service TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Ensure interview_requests table exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS interview_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            member_slug TEXT NOT NULL,
            member_name TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            company TEXT,
            engagement TEXT,
            budget TEXT,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Ensure users table has soft-delete column
    cursor.execute("PRAGMA table_info(users)")
    cols = [r[1] for r in cursor.fetchall()]
    if 'is_deleted' not in cols:
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN is_deleted INTEGER DEFAULT 0")
        except Exception:
            pass

    # Editable site content — creates the table and seeds any section that
    # is not stored yet. Never overwrites an existing section.
    init_content(cursor)

    conn.commit()
    conn.close()

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def create_token(user_id, username, is_admin):
    """Create JWT token"""
    payload = {
        'user_id': user_id,
        'username': username,
        'is_admin': is_admin,
        'exp': datetime.utcnow() + timedelta(hours=app.config['JWT_EXPIRATION_HOURS'])
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    """Decorator to require valid JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            request.user_id = data['user_id']
            request.username = data['username']
            request.is_admin = data['is_admin']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    """Decorator to require admin privileges"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not request.is_admin:
            return jsonify({'message': 'Admin privileges required'}), 403
        return f(*args, **kwargs)
    return decorated

# Authentication Endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    username = data['username'].strip()
    email = data['email'].strip()
    password = data['password']
    
    if len(username) < 3:
        return jsonify({'message': 'Username must be at least 3 characters'}), 400
    if len(password) < 6:
        return jsonify({'message': 'Password must be at least 6 characters'}), 400
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        password_hash = generate_password_hash(password)
        cursor.execute('''
            INSERT INTO users (username, email, password, is_admin)
            VALUES (?, ?, ?, ?)
        ''', (username, email, password_hash, 0))
        
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        
        token = create_token(user_id, username, 0)
        return jsonify({
            'message': 'User registered successfully',
            'token': token,
            'user': {'id': user_id, 'username': username, 'email': email, 'is_admin': 0}
        }), 201
    
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Username or email already exists'}), 409

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing username or password'}), 400
    
    username = data['username'].strip()
    password = data['password']
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE username = ? AND IFNULL(is_deleted,0) = 0', (username,))
        user = cursor.fetchone()
        conn.close()
        
        if not user or not check_password_hash(user['password'], password):
            return jsonify({'message': 'Invalid username or password'}), 401
        
        token = create_token(user['id'], user['username'], user['is_admin'])
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'is_admin': user['is_admin']
            }
        }), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user():
    """Get current authenticated user"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT id, username, email, is_admin FROM users WHERE id = ? AND IFNULL(is_deleted,0) = 0', (request.user_id,))
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'is_admin': user['is_admin']
            }
        }), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/api/contact', methods=['POST'])
def contact_request():
    """Receive contact requests and optionally email them."""
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid request payload'}), 400

    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    service = (data.get('service') or '').strip()
    message = (data.get('message') or '').strip()

    if not name or not email or not service or not message:
        return jsonify({'message': 'All fields are required'}), 400

    try:
        save_contact_request(name, email, service, message)
        email_sent = send_contact_email(name, email, service, message)
        response = {'message': 'Contact request received', 'email_sent': email_sent}
        if not email_sent:
            response['warning'] = 'SMTP not configured, saved only to database.'
        return jsonify(response), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Admin Endpoints
@app.route('/api/admin/users', methods=['GET'])
@token_required
@admin_required
def get_all_users():
    """Get all users (admin only)"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT id, username, email, is_admin, created_at FROM users WHERE IFNULL(is_deleted,0) = 0 ORDER BY created_at DESC')
        users = cursor.fetchall()
        conn.close()
        
        return jsonify({
            'users': [dict(user) for user in users]
        }), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_user(user_id):
    """Delete a user (admin only)"""
    if user_id == request.user_id:
        return jsonify({'message': 'Cannot delete your own account'}), 400
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute('SELECT id FROM users WHERE id = ?', (user_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({'message': 'User not found'}), 404
        
        # Soft-delete user (mark as deleted instead of removing row)
        cursor.execute('UPDATE users SET is_deleted = 1 WHERE id = ?', (user_id,))
        
        # Log admin action
        cursor.execute('''
            INSERT INTO admin_logs (admin_id, action, target_user_id, details)
            VALUES (?, ?, ?, ?)
        ''', (request.user_id, 'SOFT_DELETE_USER', user_id, f'Soft-deleted user ID {user_id}'))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'User deleted successfully'}), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/users/<int:user_id>/toggle-admin', methods=['PUT'])
@token_required
@admin_required
def toggle_admin(user_id):
    """Toggle admin status for a user (admin only)"""
    if user_id == request.user_id:
        return jsonify({'message': 'Cannot change your own admin status'}), 400
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Get current admin status
        cursor.execute('SELECT is_admin, IFNULL(is_deleted,0) as is_deleted FROM users WHERE id = ?', (user_id,))
        result = cursor.fetchone()
        if not result:
            conn.close()
            return jsonify({'message': 'User not found'}), 404
        if result['is_deleted']:
            conn.close()
            return jsonify({'message': 'Cannot change admin status of deleted user'}), 400
        
        new_admin_status = 1 - result['is_admin']
        
        # Update admin status
        cursor.execute('UPDATE users SET is_admin = ? WHERE id = ?', (new_admin_status, user_id))
        
        # Log admin action
        action = 'PROMOTE_TO_ADMIN' if new_admin_status else 'DEMOTE_FROM_ADMIN'
        cursor.execute('''
            INSERT INTO admin_logs (admin_id, action, target_user_id, details)
            VALUES (?, ?, ?, ?)
        ''', (request.user_id, action, user_id, f'Changed admin status to {new_admin_status}'))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': f'User admin status updated to {bool(new_admin_status)}'}), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/logs', methods=['GET'])
@token_required
@admin_required
def get_admin_logs():
    """Get admin action logs (admin only)"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT al.id, al.admin_id, u.username as admin_username, al.action, 
                   al.target_user_id, al.details, al.created_at
            FROM admin_logs al
            JOIN users u ON al.admin_id = u.id
            ORDER BY al.created_at DESC
            LIMIT 100
        ''')
        logs = cursor.fetchall()
        conn.close()
        
        return jsonify({
            'logs': [dict(log) for log in logs]
        }), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/interview', methods=['POST'])
def interview_request():
    """Request an interview with a specific team member.

    Stored regardless of SMTP so a request is never lost to a mail
    misconfiguration — the admin can always read the table.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'message': 'Invalid request payload'}), 400

    payload = {
        'member_slug': (data.get('member_slug') or '').strip()[:100],
        'member_name': (data.get('member_name') or '').strip()[:120],
        'name':        (data.get('name') or '').strip()[:120],
        'email':       (data.get('email') or '').strip()[:200],
        'company':     (data.get('company') or '').strip()[:160],
        'engagement':  (data.get('engagement') or '').strip()[:80],
        'budget':      (data.get('budget') or '').strip()[:80],
        'message':     (data.get('message') or '').strip()[:4000],
    }

    missing = [k for k in ('member_slug', 'member_name', 'name', 'email', 'message') if not payload[k]]
    if missing:
        return jsonify({'message': f"Missing required field(s): {', '.join(missing)}"}), 400

    if '@' not in payload['email'] or '.' not in payload['email'].split('@')[-1]:
        return jsonify({'message': 'A valid email address is required'}), 400

    # Same public-endpoint concern as chat: cap submissions per IP.
    if _rate_limited(f"interview:{_client_ip()}"):
        return jsonify({'message': 'Too many requests. Please try again later.'}), 429

    try:
        save_interview_request(payload)
    except Exception as exc:
        logging.exception('Failed to save interview request')
        return jsonify({'message': str(exc) if IS_DEV else 'Could not save your request'}), 500

    email_sent = send_interview_email(payload)
    response = {'message': 'Interview request received', 'email_sent': email_sent}
    if not email_sent:
        response['warning'] = 'SMTP not configured, saved to database only.'
    return jsonify(response), 201


@app.route('/api/admin/interviews', methods=['GET'])
@token_required
@admin_required
def get_interview_requests():
    """List interview requests, newest first (admin only)."""
    try:
        conn = get_db()
        rows = conn.execute(
            'SELECT * FROM interview_requests ORDER BY created_at DESC LIMIT 200'
        ).fetchall()
        conn.close()
        return jsonify({'requests': [dict(r) for r in rows]}), 200
    except Exception as exc:
        logging.exception('Failed to list interview requests')
        return jsonify({'message': str(exc) if IS_DEV else 'Could not load requests'}), 500


# Chat Assistant Endpoints
def _client_ip():
    """Best-effort client IP. Trusts X-Forwarded-For only for the rate limiter,
    where a spoofed value costs the spoofer their own quota, not ours."""
    forwarded = request.headers.get('X-Forwarded-For', '')
    if forwarded:
        return forwarded.split(',')[0].strip()
    return request.remote_addr or 'unknown'


def _rate_limited(ip):
    """Sliding-window counter. Prunes as it goes so the dict can't grow forever.

    Uses a monotonic clock: an NTP correction or a manual clock change must not
    hand out free quota (or lock everyone out for an hour).
    """
    now = time.monotonic()
    cutoff = now - CHAT_RATE_WINDOW

    for key in [k for k, v in _chat_hits.items() if not v or v[-1] < cutoff]:
        del _chat_hits[key]

    hits = [t for t in _chat_hits.get(ip, []) if t >= cutoff]
    if len(hits) >= CHAT_RATE_LIMIT:
        _chat_hits[ip] = hits
        return True

    hits.append(now)
    _chat_hits[ip] = hits
    return False


def _sanitise_history(raw):
    """Coerce the client transcript into valid alternating Messages API turns.

    The client is untrusted: it decides what history to send, so cap the volume
    and drop anything malformed rather than passing it through to the API.
    """
    messages = []
    for item in raw[-CHAT_MAX_HISTORY:]:
        if not isinstance(item, dict):
            continue
        role = item.get('role')
        content = item.get('content')
        if role not in ('user', 'assistant') or not isinstance(content, str):
            continue
        content = content.strip()[:CHAT_MAX_CHARS]
        if not content:
            continue
        # The API rejects consecutive same-role turns; merge them instead.
        if messages and messages[-1]['role'] == role:
            messages[-1]['content'] = f"{messages[-1]['content']}\n\n{content}"
        else:
            messages.append({'role': role, 'content': content})

    while messages and messages[0]['role'] != 'user':
        messages.pop(0)
    return messages


@app.route('/api/chat', methods=['GET'])
def chat_status():
    """Lets the widget decide once, at mount, whether to offer AI answers."""
    return jsonify({
        'ready': bool(ANTHROPIC_API_KEY),
        'model': CHAT_MODEL if ANTHROPIC_API_KEY else None,
    }), 200


@app.route('/api/chat', methods=['POST'])
def chat():
    """Answer a visitor question with Claude.

    Returns 503 whenever the AI path is unavailable for any reason — no key,
    missing SDK, rate limit, upstream error. The widget treats every 503 the
    same way: fall back to its scripted answer, so the visitor still gets a
    reply rather than an error.
    """
    if not ANTHROPIC_API_KEY:
        return jsonify({'message': 'Chat assistant is not configured', 'fallback': True}), 503

    try:
        from anthropic import Anthropic
    except ImportError:
        logging.warning('anthropic package not installed; chat falling back to scripted replies')
        return jsonify({'message': 'Chat assistant is unavailable', 'fallback': True}), 503

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'message': 'Invalid request payload'}), 400

    messages = _sanitise_history(data.get('messages') or [])
    if not messages or messages[-1]['role'] != 'user':
        return jsonify({'message': 'A user message is required'}), 400

    ip = _client_ip()
    if _rate_limited(ip):
        return jsonify({
            'message': 'Too many messages. Please use the contact form.',
            'fallback': True,
        }), 429

    try:
        client = Anthropic(api_key=ANTHROPIC_API_KEY)
        response = client.messages.create(
            model=CHAT_MODEL,
            max_tokens=1024,
            # A short factual Q&A over a fixed brief: no reasoning needed, and
            # a visitor waiting on a chat bubble notices the latency.
            thinking={'type': 'disabled'},
            output_config={'effort': 'low'},
            system=[{
                'type': 'text',
                'text': CHAT_SYSTEM_PROMPT,
                # The brief is identical on every request — cache it so only
                # the conversation is billed at full rate.
                'cache_control': {'type': 'ephemeral'},
            }],
            messages=messages,
        )
    except Exception as exc:
        logging.exception('Chat completion failed')
        message = str(exc) if IS_DEV else 'Chat assistant is temporarily unavailable'
        return jsonify({'message': message, 'fallback': True}), 503

    if response.stop_reason == 'refusal':
        return jsonify({
            'reply': "I can't help with that one. For anything else, the contact "
                     'form reaches a human here.',
            'source': 'claude',
        }), 200

    reply = ''.join(
        block.text for block in response.content if getattr(block, 'type', None) == 'text'
    ).strip()

    if not reply:
        return jsonify({'message': 'Empty response from model', 'fallback': True}), 503

    return jsonify({'reply': reply, 'source': 'claude'}), 200


# ── Site content ──────────────────────────────────────────────────────────
# Reads are public and unauthenticated: this is the copy on the marketing
# site, not user data. Every write requires an admin token, and every write
# is recorded in admin_logs.

@app.route('/api/content', methods=['GET'])
def get_content():
    """Every editable section in one response.

    One request rather than seven: the home page alone renders four of
    these sections, and a round trip each would cost more than the payload.
    """
    try:
        conn = get_db()
        content, updated = read_all(conn)
        conn.close()
        return jsonify({'content': content, 'updated': updated}), 200
    except Exception as e:
        logging.exception('Failed to read site content')
        return jsonify({'message': str(e)}), 500


@app.route('/api/content/<key>', methods=['GET'])
def get_content_section(key):
    """One section, for anything that only needs the roster or the courses."""
    try:
        conn = get_db()
        value = read_section(conn, key)
        conn.close()
        if value is None:
            return jsonify({'message': f'No content stored for "{key}"'}), 404
        return jsonify({'key': key, 'data': value}), 200
    except ContentError as e:
        return jsonify({'message': e.message}), e.status
    except Exception as e:
        logging.exception('Failed to read content section %s', key)
        return jsonify({'message': str(e)}), 500


@app.route('/api/content/<key>', methods=['PUT'])
@token_required
@admin_required
def put_content_section(key):
    """Replace a whole section (admin only)."""
    data = request.get_json(silent=True) or {}
    if 'data' not in data:
        return jsonify({'message': 'Request body needs a "data" field'}), 400

    conn = None
    try:
        conn = get_db()
        value = write_section(conn, key, data['data'], request.user_id)
        return jsonify({'key': key, 'data': value}), 200
    except ContentError as e:
        return jsonify({'message': e.message}), e.status
    except Exception as e:
        logging.exception('Failed to write content section %s', key)
        return jsonify({'message': str(e)}), 500
    finally:
        if conn:
            conn.close()


@app.route('/api/content/<key>/items', methods=['POST'])
@token_required
@admin_required
def post_content_item(key):
    """Add one record to a collection (admin only)."""
    data = request.get_json(silent=True) or {}
    if not isinstance(data.get('item'), dict):
        return jsonify({'message': 'Request body needs an "item" object'}), 400

    conn = None
    try:
        conn = get_db()
        item = add_item(conn, key, data['item'], request.user_id)
        return jsonify({'key': key, 'item': item}), 201
    except ContentError as e:
        return jsonify({'message': e.message}), e.status
    except Exception as e:
        logging.exception('Failed to add item to %s', key)
        return jsonify({'message': str(e)}), 500
    finally:
        if conn:
            conn.close()


@app.route('/api/content/<key>/items/<item_id>', methods=['PUT'])
@token_required
@admin_required
def put_content_item(key, item_id):
    """Replace one record in a collection (admin only)."""
    data = request.get_json(silent=True) or {}
    if not isinstance(data.get('item'), dict):
        return jsonify({'message': 'Request body needs an "item" object'}), 400

    conn = None
    try:
        conn = get_db()
        item = update_item(conn, key, item_id, data['item'], request.user_id)
        return jsonify({'key': key, 'item': item}), 200
    except ContentError as e:
        return jsonify({'message': e.message}), e.status
    except Exception as e:
        logging.exception('Failed to update %s/%s', key, item_id)
        return jsonify({'message': str(e)}), 500
    finally:
        if conn:
            conn.close()


@app.route('/api/content/<key>/items/<item_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_content_item(key, item_id):
    """Remove one record from a collection (admin only)."""
    conn = None
    try:
        conn = get_db()
        remaining = delete_item(conn, key, item_id, request.user_id)
        return jsonify({'key': key, 'count': len(remaining)}), 200
    except ContentError as e:
        return jsonify({'message': e.message}), e.status
    except Exception as e:
        logging.exception('Failed to delete %s/%s', key, item_id)
        return jsonify({'message': str(e)}), 500
    finally:
        if conn:
            conn.close()


@app.route('/api/content/<key>/reset', methods=['POST'])
@token_required
@admin_required
def post_content_reset(key):
    """Restore a section to the copy that shipped with the build."""
    conn = None
    try:
        conn = get_db()
        value = reset_section(conn, key, request.user_id)
        return jsonify({'key': key, 'data': value}), 200
    except ContentError as e:
        return jsonify({'message': e.message}), e.status
    except Exception as e:
        logging.exception('Failed to reset %s', key)
        return jsonify({'message': str(e)}), 500
    finally:
        if conn:
            conn.close()


# Health check
@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    init_db()
    app.run(debug=IS_DEV, port=int(os.getenv('PORT', '5000')))
