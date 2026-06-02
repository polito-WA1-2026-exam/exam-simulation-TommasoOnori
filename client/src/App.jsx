import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useState } from 'react';

import Navigation from './components/Navigation';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import StudyPlan from './components/StudyPlan';
import API from './API';

function AppLayout({ loggedIn, user, handleLogout }) {
  return (
    <>
      <Navigation loggedIn={loggedIn} user={user} handleLogout={handleLogout} />

      <main className="container mt-4">
        <Outlet />
      </main>
    </>
  );
}

function NotFound() { return <h2 className="text-danger">Error 404 - Page Not Found</h2>; }

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user);
    } catch (err) {
      throw err;
    }
  }

  const handleLogout = async () => {
    try {
      await API.logOut();
      setLoggedIn(false);
      setUser(null);
    } catch (err) {
      throw new Error("Logout Error", err);
    }
  };

  return (
    <BrowserRouter>
      <Routes>

        <Route element={<AppLayout loggedIn={loggedIn} user={user} handleLogout={handleLogout} />}>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm login={handleLogin} />} />
          <Route path="/studyPlan" element={<StudyPlan user={user} />} />
          <Route path="*" element={<NotFound />} />

        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App