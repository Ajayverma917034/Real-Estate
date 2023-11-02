import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
const App = () => {

  return (
  <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>}/>

      <Route element={<PrivateRoute/>}>
        <Route path='/profile' element={<Profile/>}/>
      </Route>
      <Route element={<PrivateRoute/>}>
        <Route path='/create-listing' element={<CreateListing/>}/>
      </Route>

      <Route path='/sign-in' element={<SignIn/>}/>
      <Route path='/sign-up' element={<SignUp/>}/>
      <Route path='/about' element={<About/>}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App