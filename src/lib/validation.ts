import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().optional(),
  tags: z.string().optional(),
  published: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
  coverImageId: z.string().optional().nullable(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const addImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  publicId: z.string().min(1, 'Public ID is required'),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  format: z.string().optional(),
  alt: z.string().optional().default(''),
  sortOrder: z.number().int().optional().default(0),
  projectId: z.string().min(1, 'Project ID is required'),
});

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be under 5000 characters'),
});

export const updateImageSchema = z.object({
  alt: z.string().optional(),
  sortOrder: z.number().int().optional(),
});
