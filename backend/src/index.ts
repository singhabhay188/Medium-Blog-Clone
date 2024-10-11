import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userRouter } from './routers/userRouter';
import { postRouter } from './routers/postRouter';

const app = new Hono<{ 
  Bindings: { DATABASE_URL: string,JWT_SECRET: string },
  Variables: {userId?: string} 
}>();

app.use('/api/v1/*', cors());

//welcome route
app.get('/api/v1',(c)=>{
  return c.json({success: true,message: 'Welcome to the API'});
});

//user routes
app.route('/api/v1/user',userRouter);

//posts routes
app.route('/api/v1/post',postRouter);


export default app;
