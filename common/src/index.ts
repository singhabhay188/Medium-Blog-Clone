import { z } from "zod"

export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(3),
});
export const logInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
export const updatePostSchema = z.object({
    id: z.string(),
    title: z.string().min(3),
    content: z.string(),
});
export const newPostSchema = z.object({
    title: z.string().min(3),
    content: z.string(),
});