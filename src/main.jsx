import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

//import TopBar from './components/TopBar.jsx'
import MainPage from './components/MainPage.jsx'
import SignIn from './components/SignIn.jsx'
import SignUp from './components/SignUp.jsx'
import ForgotPassword from './components/ForgotPassword.jsx'
import ResetPassword from './components/ResetPassword.jsx'
import UserProfile from './components/UserProfile.jsx'
import Dashboard from './components/Dashboard.jsx'
import ViewFood from './components/ViewFood.jsx'

import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/*<TopBar /> FIX AND IMPLEMENT LATER*/}
      <Routes>
        <Route path="/" element={<MainPage />}/>
        <Route path="/SignIn" element={<SignIn />}/>
        <Route path="/SignUp" element={<SignUp />}/>
        <Route path='/ForgotPassword' element={<ForgotPassword />} />
        <Route path='/ResetPassword' element={<ResetPassword />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/Dashboard" element={<Dashboard />}/>
        <Route path="/ViewFood" element={<ViewFood />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
