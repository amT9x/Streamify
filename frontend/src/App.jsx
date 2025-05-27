import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import OnBoardingPage from './pages/OnBoardingPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import CallPage from './pages/CallPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import toast, { Toaster } from 'react-hot-toast'
import PageLoader from './components/PageLoader.jsx'
import useAuthUser from './hooks/useAuthUser.js'

const App = () => {

  const {isLoading, authUser} = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser?.isOnBoarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className= 'h-screen' data-theme="night">
      <Routes>
        <Route path="/" element=
          {
            isAuthenticated && isOnBoarded ? 
            (<HomePage />) : 
            (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)
          }
        />
        <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage />  : <Navigate to="/" />} />
        <Route path="/onboarding" element={isAuthenticated ?
        ( !isOnBoarded ?
          (
            <OnBoardingPage />
          ) : 
          (
            <Navigate to="/" />
          )
        ) :
        (
          <Navigate to="/login" />
        )} />
        <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/call" element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App