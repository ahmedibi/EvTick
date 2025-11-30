import React from 'react'
import Home from '../features/home/Home'
import { Route, Routes } from 'react-router'

export default function AppRouter() {
  return (
    <>
    
     <Routes>
      <Route path="/" element={<Home />} />
     </Routes>
    
    </>
  )
}
