import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono,Context } from 'hono';
import { env } from 'hono/adapter';
import { z } from 'zod';
import { sign, verify } from 'hono/jwt'

type Variables = {
  userId?: string
}
type Bindings = {
  DATABASE_URL: string
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>().basePath('/api/v1');

//welcome route
app.get('/',(c)=>{
  return c.json({success: true,message: 'Welcome to the API'});
});

//user routes
app.get('/user/development',async (c)=>{
  try{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const res = await prisma.user.findMany();

    c.status(201);
    return c.json({success: true, users:res});
  }
  catch(err){
    c.status(500);
    return c.json({success: false,error: 'Internal Server Error'});
  }
})

app.post('user/signup',async (c)=>{
  try{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const body = await c.req.parseBody();

    // Define schema
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(3)
    });

    // Validate input using schema
    const parsedData = schema.safeParse(body);

    if (!parsedData.success) {
      c.status(400);
      return c.json({ success: false, error: 'Invalid Data Provided' });
    }

    const { email, password, name } = parsedData.data;

    // check if email already exists
    const res = await prisma.user.findFirst({
      where: { email }
    });

    if (res) {
      c.status(400);
      return c.json({ success: false, error: 'Email already exists' });
    }

    //create a new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        name
      }
    });

    const token = await sign({id:newUser.id},c.env.JWT_SECRET);

    c.status(201);
    return c.json({success: true, token});
  }
  catch(err){
    c.status(500);
    return c.json({success: false,error: 'Internal Server Error'});
  }
});

app.post('user/login',async (c)=>{
  try{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const body = await c.req.parseBody();

    // Define schema
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6)
    });

    // Validate input using schema
    const parsedData = schema.safeParse(body);

    if (!parsedData.success) {
      c.status(400);
      return c.json({ success: false, error: 'Invalid Data Provided' });
    }

    const { email, password } = parsedData.data;

    // check if email already exists
    const user = await prisma.user.findFirst({
      where: { email }
    });

    if (!user || user.password !== password) {
      c.status(400);
      return c.json({ success: false, error: 'Invalid Credentials' });
    }

    const token = await sign({id:user.id},c.env.JWT_SECRET);

    c.status(200);
    return c.json({success: true, token});
  }
  catch(err){
    c.status(500);
    return c.json({success: false,error: 'Internal Server Error'});
  }
});

//posts routes
app.use('/post/*',async (c,next)=>{
  try{
    const token = c.req.header("authorization");

    if(!token){
      c.status(403);
      return c.json({success: false,error: 'Unauthorized'});
    };

    const decoded = await verify(token,c.env.JWT_SECRET);

    if(decoded.id){
      c.set('userId', String(decoded.id));
      await next();
    }
    else {
      c.status(403);
      return c.json({success: false,error: 'Unauthorized'});
    }
  }
  catch(err){
    c.status(500);
    return c.json({success: false,error: 'Internal Server Error'});
  }
});

app.get('/post/all',async (c)=>{
  try{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const res = await prisma.post.findMany();

    c.status(200);
    return c.json({success: true, posts:res});
  }
  catch(err){
    c.status(500);
    return c.json({success: false,error: 'Internal Server Error'});
  }
});

app.post('/post',async (c)=>{
  try{
      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
      }).$extends(withAccelerate());
  
      const body = await c.req.parseBody();
  
      // Define schema
      const schema = z.object({
        title: z.string().min(3),
        content: z.string()
      });
  
      // Validate input using schema
      const parsedData = schema.safeParse(body);
  
      if (!parsedData.success) {
        c.status(400);
        return c.json({ success: false, error: 'Invalid Data Provided' });
      }
  
      const { title, content } = parsedData.data;
      const userId = c.get("userId") || "";
  
      //add new post
      const npost = await prisma.post.create({
          data:{
              title,
              content,
              authorId: userId
          }
      });
  
      c.status(201);
      return c.json({success: true, npost});
    }
    catch(err){
      c.status(500);
      return c.json({success: false,error: 'Internal Server Error'});
    }
});

app.put('/post',async (c)=>{
  try{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
    
    const userId = c.get("userId") || "";
    const body = await c.req.parseBody();

    // Define schema
    const schema = z.object({
      id: z.string(),
      title: z.string().min(3),
      content: z.string()
    });

    // Validate input using schema
    const parsedData = schema.safeParse(body);

    if (!parsedData.success) {
      c.status(400);
      return c.json({ success: false, error: 'Invalid Data Provided' });
    }

    const { id, title, content } = parsedData.data;

    const post = await prisma.post.update({
      where: { 
        id,
        authorId: userId
      },
      data: {
        title,
        content
      }
    });

    if(!post){
      c.status(404);
      return c.json({success: false,error: 'Post not found or Unauthorized'});
    }

    c.status(200);
    return c.json({success: true, post});
  }
  catch(e){
    console.log(e);
    c.status(500);
    return c.json({success: false,error: 'Internal Server Error'});
  }
});


export default app;
