import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/home'); 
    } else {
      // Handle error, maybe redirect to login with an error message
      navigate('/login?error=auth_failed');
    }
  }, [searchParams, navigate]);

  // You can show a loading spinner here
  return <div>Loading...</div>;
};

export default AuthCallback; 