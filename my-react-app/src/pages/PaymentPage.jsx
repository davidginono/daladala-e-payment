import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PaymentPage.css';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { stop, busId } = location.state || { stop: null, busId: '' };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // useEffect(() => {
  //    Check if passenger is registered
  //   const passengerId = localStorage.getItem('passengerId');
  //   if (!passengerId) {
  //     navigate('/register');
  //   }
  // }, [navigate]);

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      const passengerId = localStorage.getItem('passengerId');
      if (!passengerId) {
        setError('Please register first');
        return;
      }

      const paymentData = new URLSearchParams({
        accountId: busId,
        passengerId: passengerId,
        amount: stop.price,
      });

      const paymentResponse = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/payment/initiate`,
        paymentData,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      const paymentResult = paymentResponse.data;
      console.log('Payment Initiation Response:', paymentResult);

      if (paymentResult.status === 'success') {
        const orderId = paymentResult.order_id;

        await new Promise((resolve) => setTimeout(resolve, 4000)); // optional wait

        const statusData = new URLSearchParams({ orderId });

        const statusResponse = await axios.post(
          `${import.meta.env.VITE_API_BACKEND_URL}/api/payment/status`,
          statusData,
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          }
        );

        const statusResult = statusResponse.data;
        console.log('Payment Status Response:', statusResult);

        navigate('/success', {
          state: {
            stop,
            busId,
            paymentStatus: statusResult,
          },
        });
      } else {
        throw new Error(paymentResult.message || 'Payment processing failed');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      setError(
        error.response?.data?.message || error.message || 'Payment processing failed'
      );
    } finally{
      setLoading(false);
    }
  };

  if (!stop) {
    return (
      <div className="container">
        <h1>Error</h1>
        <p>No stop information available.</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Confirm Your Journey</h1>
      
      <div className="payment-details">
        <h2>Journey Summary</h2>
        <p>Bus ID: {busId}</p>
        <p>Stop: {stop.stop_name}</p>
        <p>Price: ${stop.price}</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <button 
        onClick={handleConfirm}
        disabled={loading}
        className="confirm-button"
      >
        {loading ? 'Processing...' : 'PAY'}
      </button>

      <button 
        className="back-button"
        onClick={() => navigate('/stops', { state: { stops: [stop], busId } })}
      >
        Back to Stops
      </button>
    </div>
  );
}

export default PaymentPage; 