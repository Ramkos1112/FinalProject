import { Routes, Route } from 'react-router';

import Home from './components/pages/Home.tsx';
import Login from './components/pages/Login.tsx';
import Register from './components/pages/Register.tsx';
import Questions from './components/pages/Queries.tsx';
import SpecificQuestion from './components/pages/QueryPage.tsx';
import UserInfo from './components/pages/UserProfile.tsx';
import MainOutlet from './components/outlets/MainOutlet';
import AskQuestion from './components/pages/MakeQuery.tsx';

const App = () => {
  
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/' element={<MainOutlet/>}>
          <Route index element={<Home/>}/>
          <Route path='questions' element={<Questions/>}/>
          <Route path='questions/:_id' element={<SpecificQuestion/>}/>
          <Route path='questions/ask' element={<AskQuestion/>}/>
          <Route path='user' element={<UserInfo/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App;