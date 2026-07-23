export const SITE_NAME = "Maria's Portfolio";
export const SITE_DESCRIPTION =
  'A curated collection of 3D modeling and creative work.';

export const PROJECTS_PER_PAGE = 12;
export const IMAGES_PER_PAGE = 24;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];

// CMS setting defaults — used by reset buttons and fallbacks
export const CMS_DEFAULTS: Record<string, string> = {
  home_hero_title: "Maria's Portfolio",
  home_hero_description: 'A curated collection of 3D modeling and creative work.',
  home_about_snippet:
    "Welcome to my portfolio. I'm a 3D modeler and creative artist with a passion for bringing ideas to life. Each project represents a unique vision and a distinct creative journey.",
  site_primary_color: '#8a7658',
  site_accent_color: '#1a1a2e',
};
