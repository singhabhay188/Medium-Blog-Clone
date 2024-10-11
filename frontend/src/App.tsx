import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Blog, Signin, Signup, Signout, SingleBlog, Publish } from './pages'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<SingleBlog />} />
          <Route path="/signout" element={<Signout />} />
          <Route path="/publish" element={<Publish />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App