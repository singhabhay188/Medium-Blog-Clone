import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { z } from 'zod';
import { sign, verify } from 'hono/jwt'

const app = new Hono().basePath('/api/v1');

//development routes
app.get('/development/users',async (c)=>{
  try{
    const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
    const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL
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

app.get('',(c)=>{
  return c.json({success: true,message: 'Welcome to the API'});
});

app.get('/url',(c)=>{
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

  return c.json({success: true, url: DATABASE_URL});
});

app.post('/signup',async (c)=>{
  try{
    const { DATABASE_URL,JWT_SECRET } = env<{ DATABASE_URL: string,JWT_SECRET: string }>(c);
    const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL
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

    const token = await sign({id:newUser.id},JWT_SECRET);

    c.status(201);
    return c.json({success: true, token});
  }
  catch(err){
    c.status(500);
    return c.json({success: false,error: 'Internal Server Error'});
  }
});

app.post('/login',async (c)=>{
  try{
    const { DATABASE_URL,JWT_SECRET } = env<{ DATABASE_URL: string,JWT_SECRET: string }>(c);
    const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL
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

    const token = await sign({id:user.id},JWT_SECRET);

    c.status(200);
    return c.json({success: true, token});
  }
  catch(err){
    c.status(500);
    return c.json({success: false,error: 'Internal Server Error'});
  }
});

app.use('/blog/*',async (c,next)=>{
  try{
    const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
    const token = c.req.header("authorization");

    if(!token){
      c.status(403);
      return c.json({success: false,error: 'Unauthorized'});
    }

    const decoded = await verify(token,JWT_SECRET);

    if(decoded.id){
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



export default app;
