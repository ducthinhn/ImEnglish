import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .max(100, 'Email must not exceed 100 characters'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must not exceed 50 characters')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores'
      ),
    fullName: z
      .string()
      .max(100, 'Full name must not exceed 100 characters')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must not exceed 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 digit'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    englishLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const, {
      required_error: 'Please select your current English proficiency level',
    }),
    learningGoal: z.enum(['CONVERSATION', 'IELTS', 'BUSINESS', 'TRAVEL'] as const, {
      required_error: 'Please select your primary learning goal',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
