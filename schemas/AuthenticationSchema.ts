import { z as zod } from 'zod';

export const SignUpSchema = zod.object({
    email: zod
        .string()
        .min(1, {
            message: 'Email is required',
        })
        .email({
            message: 'Please enter a valid email',
        }),
    password: zod
        .string()
        .min(1, {
            message: 'Password is required',
        })
        .min(8, {
            message: 'Password must be at least 8 characters long',
        }),
    confirmPassword: zod
        .string()
        .min(1, {
            message: 'Please confirm your password',
        })
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});


export const SignInSchema = zod.object({
    email: zod
        .string()
        .min(1, {
            message: 'Email is required',
        })
        .email({
            message: 'Please enter a valid email',
        }),
    password: zod
        .string()
        .min(1, {
            message: 'Password is required',
        })
        .min(8, {
            message: 'Password must be at least 8 characters long',
        }),
});