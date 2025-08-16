
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE;
export const GOOGLE_AUTH_VERIFY_URL = `${API_BASE}/auth/google/verify`;

export default function GoogleLoginButton({ onLoginSuccess }) {
  const handleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;

      const response = await axios.post(GOOGLE_AUTH_VERIFY_URL, {
        id_token: credential,
      });

      onLoginSuccess(response.data);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleError = () => {
    console.error('Login Failed');
    alert('Login Failed');
  };

  return (
    <div className="google-login-container">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap={false}
        theme="filled_blue"
        size="large"
        width="100%"
        text="signin_with"
        shape="rectangular"
      />
    </div>
  );
}
