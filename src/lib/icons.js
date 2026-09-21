/**
 * Icon registry.
 *
 * Content that lives in the database can only carry strings, so a service,
 * a culture stat or a contact channel stores an icon *name* — 'Brain',
 * 'Mail' — and the component resolves it here. Importing named icons keeps
 * tree-shaking intact; a bare `import * as lucide` would pull the whole
 * thousand-icon set into the bundle.
 *
 * Adding an icon to the admin's vocabulary means adding it to this map.
 * Anything unknown renders the fallback rather than crashing the section,
 * because a typo in a CMS field should not blank a page.
 */
import {
  Code2, Palette, Brain, Smartphone, BarChart3, Cloud, Shield, Zap,
  Globe2, FlaskConical, Heart, Rocket, Trophy, Lock, Headphones,
  GitBranch, HeartHandshake, Clock, CheckCircle2, Layers, Sparkles,
  Mail, Phone, MapPin, MessageSquare, Send,
  Linkedin, Twitter, Github, Instagram, Dribbble, Globe,
} from 'lucide-react'

export const ICONS = {
  Code2, Palette, Brain, Smartphone, BarChart3, Cloud, Shield, Zap,
  Globe2, FlaskConical, Heart, Rocket, Trophy, Lock, Headphones,
  GitBranch, HeartHandshake, Clock, CheckCircle2, Layers, Sparkles,
  Mail, Phone, MapPin, MessageSquare, Send,
  Linkedin, Twitter, Github, Instagram, Dribbble, Globe,
}

/** Names the admin UI offers in its icon picker. */
export const ICON_NAMES = Object.keys(ICONS)

/**
 * Resolve a stored name to a component.
 * @param {string} name     value from the content record
 * @param {React.ComponentType} fallback  used when the name is unknown
 */
export const iconFor = (name, fallback = Sparkles) => ICONS[name] ?? fallback
