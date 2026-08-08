import { Resume, ResumeSection } from '@careerhub/shared';

export interface ResumeCustomization {
  font?: string;
  fontSize?: string;
  headingSize?: string;
  lineHeight?: string;
  margins?: string;
  spacing?: string;
  accentColor?: string;
  pageSize?: string;
}

export interface ClientResume extends Omit<Resume, 'customization'> {
  customization: ResumeCustomization;
}

export interface TemplateInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  category: 'modern' | 'professional' | 'creative' | 'minimal' | 'executive';
}

export const SUPPORTED_TEMPLATES: TemplateInfo[] = [
  {
    id: 't1',
    name: 'Classic ATS',
    slug: 'classic-ats',
    description: 'Strict, single-column serif formatting designed to pass parsers with zero layout friction.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=300&q=80',
    category: 'professional'
  },
  {
    id: 't2',
    name: 'Modern Professional',
    slug: 'modern-professional',
    description: 'Elegant sans-serif design with clear dividing lines and strong typographic hierarchy.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80',
    category: 'modern'
  },
  {
    id: 't3',
    name: 'Minimal',
    slug: 'minimal',
    description: 'Ultra-clean layout utilizing centered headings and generous breathing room for high readability.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=300&q=80',
    category: 'minimal'
  },
  {
    id: 't4',
    name: 'Software Developer',
    slug: 'software-developer',
    description: 'High-density monospace styling showcasing skill categorization and project repositories first.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=300&q=80',
    category: 'creative'
  },
  {
    id: 't5',
    name: 'Fresh Graduate',
    slug: 'fresh-graduate',
    description: 'Highlight education, achievements, and course work prominently to offset shorter experience.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=300&q=80',
    category: 'executive'
  }
];

export const FONTS_LIST = ['Inter', 'Roboto', 'Lora', 'Playfair Display', 'Fira Code'];
export const FONT_SIZES_LIST = ['9pt', '10pt', '11pt', '12pt'];
export const HEADING_SIZES_LIST = ['13pt', '14pt', '16pt', '18pt'];
export const LINE_HEIGHTS_LIST = ['1.2', '1.3', '1.4', '1.5', '1.6'];
export const MARGINS_LIST = ['0.4in', '0.5in', '0.75in', '1in'];
export const SPACING_LIST = ['0.25rem', '0.35rem', '0.5rem', '0.75rem', '1rem'];
export const ACCENT_COLORS_LIST = [
  { name: 'Sky Blue', hex: '#0284c7' },
  { name: 'Classic Slate', hex: '#1e293b' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Warm Amber', hex: '#d97706' },
  { name: 'Crimson', hex: '#dc2626' },
  { name: 'Royal Purple', hex: '#7c3aed' }
];
