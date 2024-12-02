import React, { useState } from 'react';
import axios from 'axios';

function VerifyOTPForm({ email }) {
  const [otp, setOtp] = useState('');

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/verify-otp', {
        email,
        otp,
      });
      alert(response.data); // Show success message
    } catch (err) {
      console.error(err);
      alert(err.response?.data || 'Error verifying OTP');
      
    }
  };

  return (
    <form onSubmit={handleVerifyOTP}>
      <label>
        Enter OTP:
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          style={{ marginLeft: '10px' }}
        />
      </label>
      <button type="submit" style={{ marginLeft: '10px' }}>
        Verify OTP
      </button>
    </form>
  );
}

export default VerifyOTPForm;
