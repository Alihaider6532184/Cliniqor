import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import PatientList from './components/PatientList';
import PatientDetail from './components/PatientDetail';
import AuthCallback from './components/AuthCallback';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/patients/:category" element={<PatientList />} />
          <Route path="/patient/:id" element={<PatientDetail />} />
          {/* Redirect root to /home for logged-in users */}
          <Route path="/" element={<Navigate to="/home" />} />
        </Route>

        {/* Redirect any other path to the login page */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
