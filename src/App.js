import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {LoginPage} from './Routes.js'
import {SignUpPage} from './Routes.js'

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route path='/login' element=<LoginPage/> />
      <Route path='/signup' element=<SignUpPage/> />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App