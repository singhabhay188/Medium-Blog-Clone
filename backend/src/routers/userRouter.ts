import { Hono } from "hono"
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { logInSchema, signUpSchema } from "@singhbetu188/medium-blog-common";

export const userRouter = new Hono<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
  Variables: { userId?: string };
}>();

userRouter.get("/development", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const res = await prisma.user.findMany();

    c.status(201);
    return c.json({ success: true, users: res });
  } catch (err) {
    c.status(500);
    return c.json({ success: false, error: "Internal Server Error" });
  }
});

userRouter.post("/signup", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.parseBody();

    // Validate input using schema
    const parsedData = signUpSchema.safeParse(body);

    if (!parsedData.success) {
      c.status(400);
      return c.json({ success: false, error: "Invalid Data Provided" });
    }

    const { email, password, name } = parsedData.data;

    // check if email already exists
    const res = await prisma.user.findFirst({
      where: { email },
    });

    if (res) {
      c.status(400);
      return c.json({ success: false, error: "Email already exists" });
    }

    //create a new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });

    const token = await sign({ id: newUser.id }, c.env.JWT_SECRET);

    c.status(201);
    return c.json({ success: true, token });
  } catch (err) {
    c.status(500);
    return c.json({ success: false, error: "Internal Server Error" });
  }
});

userRouter.post("user/login", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.parseBody();

    // Validate input using schema
    const parsedData = logInSchema.safeParse(body);

    if (!parsedData.success) {
      c.status(400);
      return c.json({ success: false, error: "Invalid Data Provided" });
    }

    const { email, password } = parsedData.data;

    // check if email already exists
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user || user.password !== password) {
      c.status(400);
      return c.json({ success: false, error: "Invalid Credentials" });
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    c.status(200);
    return c.json({ success: true, token });
  } catch (err) {
    c.status(500);
    return c.json({ success: false, error: "Internal Server Error" });
  }
});
