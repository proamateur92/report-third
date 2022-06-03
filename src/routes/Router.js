import SignUp from './SignUp';
import Login from './Login';
import Write from './Write';
import Main from './Main';
import Notice from './Notice';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/write' element={<Write />} />
        <Route path='/write/:id' element={<Write />} />
        <Route path='/notice' element={<Notice />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
