import Registration from './components/Registration/Registration';
import LandingPage from './components/LandingPage/LandingPage';
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./components/LoginPage/LoginPage";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import Blogs from "./components/Blogs/Blogs";
import Training from "./components/Training/Training";
import OpenedBlog from "./components/Blogs/OpenedBlog/OpenedBlog";
import ProgramProvider from "./components/Context/Program/ProgramProvider";
import BlogProvider from "./components/Context/Blog/BlogProvider";
import AdminPage from "./components/AdminPage/AdminPage";



function App() {



    //Program státusz nem frissül, ha letellik akkor nem írja át

  return (
   <div>
       <ProgramProvider>
           <BlogProvider>
               <BrowserRouter>
                   <Routes>
                       <Route index element={<LandingPage />} />
                       <Route path="/landingPage" element={<LandingPage/>} />
                       <Route path="/adminPage" element={<AdminPage/>} />
                       <Route path="/login" element={<LoginPage/>} />
                       <Route path="/registration" element={<Registration />} />
                       <Route path="/blogs" element={<Blogs  />} />
                       <Route path="/openedBlog/:id" element={<OpenedBlog />} />
                       <Route path="/training" element={<Training  />} />
                       <Route path="*" element={<PageNotFound />} />
                   </Routes>
               </BrowserRouter>
           </BlogProvider>
       </ProgramProvider>

   </div>
  );
}

export default App;
