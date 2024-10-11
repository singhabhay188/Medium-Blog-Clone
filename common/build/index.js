"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPostSchema = exports.updatePostSchema = exports.logInSchema = exports.signUpSchema = void 0;
const zod_1 = require("zod");
exports.signUpSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(3),
});
exports.logInSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.updatePostSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string().min(3),
    content: zod_1.z.string(),
});
exports.newPostSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    content: zod_1.z.string(),
});
