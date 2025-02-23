<template>
  <Loading v-if="!this.isLoaded"/>
    <div class="payment-page">
      <div v-if="!isPaymentInProgress && !isPaymentSuccess" class="payment-button-container">
        <div>
          <label>ID đơn hàng: #{{ orderId }}</label>
        </div>
        <div>
          <label>Ngày tạo: {{ formatDateTime(createAt) }}</label>
        </div>
        <div>
          <label>Tổng thanh toán: {{ formatMoney(totalPrice) }} VND</label>
        </div>
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
  import Loading from './ComLoading.vue';
  import tools from '@/api/tools';
  import db from '@/api/db';
  export default {
    components: {
      Loading
    },
    data() {
      return {
        orderId: '',
        createAt: '',
        totalPrice: 0,
        isPaymentInProgress: false,
        isPaymentSuccess: false,
        isLoaded: false,
      };
    },
    async mounted() {
      // check is logged in or not
      let user = localStorage.getItem("accessToken");
      if (user != null) {
          user = await db.getUser(user);
      }

      if (user == null) {
          localStorage.removeItem('accessToken');
          this.$router.push('/login');
          return;
      }
      
      const data = this.$route.query;
      if ((!data) || (!data.id) || (data.id.length < 1)) {
        this.$router.push('/');
        return;
      }

      this.orderId = data.id;

      const order = await db.getAOrder(this.orderId);
      if (!order) {
        this.$router.push('/');
        return;
      }

      if (order.status != "Đang chờ thanh toán") {
        this.$router.push('/');
        return;
      }

      this.createAt = order.orderAt;
      this.totalPrice = order.totalPrice;

      await new Promise(resolve => setTimeout(resolve, 500));
      this.isLoaded = true;
    },
    methods: {
      formatDateTime(datetime) {
        return tools.formatDateTime(datetime);
      },
      formatMoney(money) {
        return tools.formatMoney(money);
      },
      startPayment() {
        this.isPaymentInProgress = true;
  
        setTimeout(() => {
          // Simulate success payment
          this.isPaymentInProgress = false;
          this.isPaymentSuccess = true;
  
          // Show success message for 2 seconds
          setTimeout(() => {
            // Redirect to success page after 2 seconds
            window.location.href = '/payment/verify?id=' + this.orderId;
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
    height: 50vh;
    flex-direction: column;
    text-align: center;
    background-color: #f9f9f9;
    font-family: 'Arial', sans-serif;
  }

  .payment-button-container div {
  margin-bottom: 10px; /* Space between labels */
}

.payment-button-container label {
  display: inline-block;
  font-size: 18px;
  color: #333;
  font-weight: bold;
  margin-right: 10px; /* Space between label text and value */
  text-transform: uppercase; /* Make label text uppercase */
}

.payment-button-container div span {
  font-size: 18px;
  color: #555;
  font-weight: normal;
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: inline-block;
  transition: background-color 0.3s;
}

.payment-button-container div span:hover {
  background-color: #e0e0e0;
}

.payment-button-container label,
.payment-button-container div span {
  transition: color 0.3s, background-color 0.3s; /* Smooth color transition */
}

body.dark-mode .payment-button-container label {
  color: white; /* White color for dark mode */
}

body.dark-mode .payment-button-container div span {
  color: white; /* White color for dark mode */
  background-color: #444; /* Dark background in dark mode */
}
  
  body.dark-mode .payment-page {
    background-color: #333;
  }
  
  .payment-button-container {
    margin-bottom: 30px;
  }
  
  .payment-button {
    margin-top: 20px;
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
  