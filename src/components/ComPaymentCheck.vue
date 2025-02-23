<template>
    <Loading v-if="!this.isLoaded"/>
    <p class="checking-message">Đơn hàng #{{ this.orderId }}</p>
    <div class="payment-checking-page">
        
        <p class="checking-message">Đang kiểm tra thanh toán...</p>
    </div>
  </template>
  
  <script>
 import db from '@/api/db';
 import Loading from './ComLoading.vue';
  export default {
    name: "PaymentChecking",
    components: {
        Loading
    },
    data() {
      return {
        orderId: '', // Example order ID
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

        this.isLoaded = true;

        db.successPaymentOrder(this.orderId);
        setTimeout(() => {
          this.$router.push({ name: 'PaymentSuccess', query: { id: this.orderId }});
        }, 4000);
    },
  };
  </script>
  
  <style scoped>
  .payment-checking-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    font-family: 'Arial', sans-serif;
    background-color: #f9f9f9;
    text-align: center;
  }
  
  .checking-message {
    font-size: 24px;
    color: #4CAF50;
    animation: fadeIn 1s ease-in-out;
  }
  
  /* Dark Mode */
  body.dark-mode .payment-checking-page {
    background-color: #333;
  }
  
  body.dark-mode .checking-message {
    color: #ddd;
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
  