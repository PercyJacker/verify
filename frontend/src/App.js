import React from 'react';
import OTPForm from './component/OTPForm.jsx';
import VerifyOTPForm from './component/VerifyOTPForm.jsx';
import Home from './component/Home.jsx';

function App() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>OTP Authentication</h1>
      <OTPForm />
      <Home/>
    </div>
  );
}

export default App;
