<template>
    <div class="payment-page">
      <div v-if="!isPaymentInProgress && !isPaymentSuccess" class="payment-button-container">
        <button @click="startPayment" class="payment-button">Xác nhận thanh toán</button>
      </div>
      
      <!-- Show success message after payment -->
      <div v-if="isPaymentSuccess" class="success-message-container">
        <p class="success-message">Thanh toán thành công!</p>
      </div>
  
      <!-- Show "processing" message when payment is in progress -->
      <div v-if="isPaymentInProgress && !isPaymentSuccess" class="waiting-message-container">
        <p class="waiting-message">Đang thanh toán...</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isPaymentInProgress: false,
        isPaymentSuccess: false
      };
    },
    methods: {
      startPayment() {
        this.isPaymentInProgress = true;
  
        setTimeout(() => {
          // Simulate success payment
          this.isPaymentInProgress = false;
          this.isPaymentSuccess = true;
  
          // Show success message for 2 seconds
          setTimeout(() => {
            // Redirect to success page after 2 seconds
            window.location.href = '/order';
          }, 2250);
        }, 4000); // Simulate 5 seconds for payment processing
      }
    }
  };
  </script>
  
  <style scoped>
  .payment-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    flex-direction: column;
    text-align: center;
    background-color: #f9f9f9;
    font-family: 'Arial', sans-serif;
  }
  
  body.dark-mode .payment-page {
    background-color: #333;
  }
  
  .payment-button-container {
    margin-bottom: 30px;
  }
  
  .payment-button {
    padding: 18px 36px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 50px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s, transform 0.2s;
  }
  
  .payment-button:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }
  
  .waiting-message-container {
    font-size: 24px;
    color: #333;
    animation: fadeIn 1s ease-in-out;
  }
  
  .waiting-message {
    font-size: 28px;
    font-weight: bold;
    color: #4CAF50;
  }
  
  body.dark-mode .waiting-message {
    color: white;
  }
  
  .success-message-container {
    font-size: 24px;
    color: #4CAF50;
    animation: fadeIn 1s ease-in-out;
  }
  
  .success-message {
    font-size: 28px;
    font-weight: bold;
    color: #4CAF50;
  }
  
  body.dark-mode .success-message {
    color: white;
  }
  
  .loading-spinner {
    margin-top: 20px;
    border: 6px solid #f3f3f3;
    border-top: 6px solid #4CAF50;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
  }
  
  /* Spinner Animation */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  /* Fade-in animation */
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  </style>
  