<template>
    <div v-if="visible" class="overlay" @click.self="closePopup">
      <div class="popup">
        <button class="btn-close" @click="closePopup">×</button>
        <h2>Đã thêm thành công</h2>
        <p>Sản phẩm của bạn đã được thêm vào giỏ hàng</p>
        <div class="button-group">
          <button class="btn" @click="closePopup">Tiếp tục mua sắp</button>
          <button class="btn go-to-cart" @click="goToCart">Đi tới giỏ hàng</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['close', 'goToCart'],
    methods: {
      closePopup() {
        this.$emit('close');
      },
      goToCart() {
        this.$router.push('/cart');
      },
    },
  };
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .popup {
    background: white;
    width: 300px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    text-align: center;
    transform: translateY(-20px);
    opacity: 0;
    transition: all 0.3s ease;
  }
  .overlay .popup {
    transform: translateY(0);
    opacity: 1;
  }
  .popup h2 {
    margin-top: 0;
    color: #4CAF50;
  }
  .popup p {
    color: #333;
  }
  .popup .btn-close {
    background: none;
    border: none;
    font-size: 16px;
    color: #999;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .popup .btn-close:hover {
    color: #666;
  }
  .button-group {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 15px;
  }
  .btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  }
  .btn:hover {
    background-color: #45a049;
  }
  .go-to-cart {
    background-color: #FF5722;
  }
  .go-to-cart:hover {
    background-color: #E64A19;
  }
  </style>
  