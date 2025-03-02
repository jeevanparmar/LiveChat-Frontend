import React from 'react'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Signup from './pages/Signup'


export default function App() {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Chat/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup/>} />
    </Routes>
    </div>
  )
}
