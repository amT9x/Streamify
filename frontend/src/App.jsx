import React, { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import OnBoardingPage from './pages/OnBoardingPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import CallPage from './pages/CallPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'

const App = () => {
  const {data, isLoading, error} = useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data = await res.json();
      return data;
    }
  });
  console.log(data);

  return (
    <div className= 'h-screen' data-theme="night">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnBoardingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App