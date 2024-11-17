<template>
    <div class="success-message-container">
      <div class="message-box">
        <p class="message-text">Đơn hàng #{{ orderId }} đã được thanh toán thành công!</p>
        <div class="button-container">
          <button @click="goToHome" class="btn-home">Về trang chủ</button>
          <button @click="goToOrderPage" class="btn-order">Xem đơn hàng</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
 import db from '@/api/db';
  export default {
    data() {
      return {
        orderId: '', // Example order ID
      };
    },
    async mounted() {
        // check is logged in or not
        let user = JSON.parse(localStorage.getItem("user"));
        if (user != null) {
            user = await db.getUser(user.username, user.password);
        }

        if (user == null) {
            localStorage.removeItem('user');
            this.$router.push('/login');
            return;
        }
        
        const data = this.$route.query;
        if ((!data) || (!data.id) || (data.id.length < 1)) {
            this.$router.push('/');
            return;
        }

        this.orderId = data.id;
    },
    methods: {
      goToHome() {
        this.$router.push('/'); // Redirect to the home page
      },
      goToOrderPage() {
        this.$router.push(`/order`); // Redirect to the order page
      }
    }
  };
  </script>
  
  <style scoped>
  .success-message-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
    font-family: 'Arial', sans-serif;
  }
  
  .message-box {
    text-align: center;
    background-color: #ffffff;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    max-width: 450px;
    width: 100%;
    animation: fadeIn 1s ease-in-out;
  }
  
  .message-text {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 25px;
    letter-spacing: 1px;
  }

  body.dark-mode .message-text {
    color: white;
  }
  
  .button-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }
  
  button {
    padding: 14px 28px;
    font-size: 18px;
    font-weight: 600;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 48%;
  }
  
  .btn-home {
    background: linear-gradient(145deg, #4CAF50, #2e8b57);
    color: white;
  }
  
  .btn-home:hover {
    background: linear-gradient(145deg, #45a049, #1c7430);
    transform: scale(1.1);
  }
  
  .btn-order {
    background: linear-gradient(145deg, #2196F3, #1976D2);
    color: white;
  }
  
  .btn-order:hover {
    background: linear-gradient(145deg, #1976D2, #1565C0);
    transform: scale(1.1);
  }
  
  body.dark-mode .message-box {
    background-color: #333;
    color: white;
  }
  
  body.dark-mode .btn-home {
    background: linear-gradient(145deg, #76c7c0, #4caeaf);
  }
  
  body.dark-mode .btn-order {
    background: linear-gradient(145deg, #5c8fbd, #4e7f9c);
  }
  
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  