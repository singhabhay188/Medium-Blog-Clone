import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { newPostSchema, updatePostSchema } from "@singhbetu188/medium-blog-common";

export const postRouter = new Hono<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
  Variables: { userId?: string };
}>();

// /api/v1/post/
postRouter.use("/*", async (c, next) => {
  try {
    const token = c.req.header("authorization");

    if (!token) {
      c.status(403);
      return c.json({ success: false, error: "Unauthorized" });
    }

    const decoded = await verify(token, c.env.JWT_SECRET);

    if (decoded.id) {
      c.set("userId", String(decoded.id));
      await next();
    } else {
      c.status(403);
      return c.json({ success: false, error: "Unauthorized" });
    }
  } catch (err) {
    c.status(500);
    return c.json({ success: false, error: "Internal Server Error" });
  }
});

postRouter.get("/all", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const res = await prisma.post.findMany();

    c.status(200);
    return c.json({ success: true, posts: res });
  } catch (err) {
    c.status(500);
    return c.json({ success: false, error: "Internal Server Error" });
  }
});

postRouter.post("/", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.parseBody();

    // Validate input using schema
    const parsedData = newPostSchema.safeParse(body);

    if (!parsedData.success) {
      c.status(400);
      return c.json({ success: false, error: "Invalid Data Provided" });
    }

    const { title, content } = parsedData.data;
    const userId = c.get("userId") || "";

    //add new post
    const npost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
      },
    });

    c.status(201);
    return c.json({ success: true, npost });
  } catch (err) {
    c.status(500);
    return c.json({ success: false, error: "Internal Server Error" });
  }
});

postRouter.put("/", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const userId = c.get("userId") || "";
    const body = await c.req.parseBody();

    // Validate input using schema
    const parsedData = updatePostSchema.safeParse(body);

    if (!parsedData.success) {
      c.status(400);
      return c.json({ success: false, error: "Invalid Data Provided" });
    }

    const { id, title, content } = parsedData.data;

    const post = await prisma.post.update({
      where: {
        id,
        authorId: userId,
      },
      data: {
        title,
        content,
      },
    });

    if (!post) {
      c.status(404);
      return c.json({
        success: false,
        error: "Post not found or Unauthorized",
      });
    }

    c.status(200);
    return c.json({ success: true, post });
  } catch (e) {
    console.log(e);
    c.status(500);
    return c.json({ success: false, error: "Internal Server Error" });
  }
});

postRouter.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
	
	const post = await prisma.post.findUnique({
		where: {
			id
		}
	});

    if(!post){
        c.status(404);
        return c.json({success: false, error: "Post not found"});
    }

    c.status(200);
	return c.json({success:true,post});
  } catch (e) {
    console.log(e);
    c.status(500);
    return c.json({ success: false, error: "Internal Server Error" });
  }
});
