<template>
  <Loading v-if="!this.isLoaded"/>
  <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <h2 class="popup-title">{{ popupMessage }}</h2>
        <div class="popup-buttons">
          <button @click="handleYes" class="btn btn-no">Hủy</button>
          <button @click="handleNo" class="btn btn-yes">Không</button>
        </div>
      </div>
    </div>
    <div class="order-history-page">
      <h1>Đơn hàng của bạn</h1>
  
      <div v-if="orders.length > 0">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <h2>Đơn hàng #{{ order.id }}</h2>
          <p><strong>Thanh toán: </strong>{{ order.payment }}</p>
          <p><strong>Người nhận: </strong>{{ order.address.name }}</p>
          <p><strong>Số điện thoại: </strong>{{ order.address.phone }}</p>
          <p><strong>Địa chỉ nhận: </strong>{{ order.address.address }}</p>
          <p><strong>Ngày đặt: </strong>{{ formatDateTime(order.date) }}</p>
          <p><strong>Trạng thái: </strong><span :class="statusClass(order.status)">{{ order.status }}</span></p> 
  
          <table class="order-details">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Tổng cộng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.products" :key="item.id">
                <td><strong>{{ item.name }}</strong> ({{ item.color }})</td>
                <td>{{ item.quantity }}</td>
                <td>{{ formatMoney(item.price) + " VND" }}</td>
                <td>{{ formatMoney(item.totalPrice) + " VND" }}</td>
                <td><router-link to="#" @click="handleViewProduct(item.id)" class="button-link">Xem sản phẩm</router-link></td>
              </tr>
            </tbody>
          </table>

          <div class="price-container">
            <div class="order-total" v-if="order.discount > 0">
                <strong>Giảm giá:</strong> -{{ formatMoney(order.discount) + " VND" }}
            </div>
            <div class="order-total">
              <strong>Tổng tiền:</strong> {{ formatMoney(order.total) + " VND" }}
            </div>
          </div>
          <div class="order-actions-container">
            <div class="order-actions">
              <button class="cancel-button" v-if="order.isShowCancel" @click="cancelOrder(order.id)">Hủy đơn hàng</button>
              <button class="payment-button" v-if="order.isShowPayment" @click="proceedToPayment(order.id)">Thanh toán</button>
            </div>
          </div>
        </div>
      </div>
  
      <div v-else class="product-not-found">
        <div class="icon">
            <i class="fas fa-box-open"></i>
        </div>
        <p>Hiện tại bạn chưa có đơn hàng nào.</p>
      </div>
    </div>
  </template>
  
  <script>
import db from '@/api/db';
import tools from '@/api/tools';
import Loading from './ComLoading.vue';
  export default {
    components: {
      Loading
    },
    data() {
      return {
        user: null,
        isLoaded: false,
        orders: [],
        showPopup: false,
        popupMessage: '',
        selectedOrderId: '',
      };
    },
    async mounted() {
      // check is logged in or not
      this.user = localStorage.getItem("accessToken");
        if (this.user != null) {
            const user = await db.getUser(this.user);

            this.user = user;
        }

        if (this.user == null) {
            localStorage.removeItem('accessToken');
            this.$router.push('/login');
            return;
        }

        const allOrder = await db.getAllOrder(this.user.id);
        this.orders = [];
        allOrder.forEach((order) => {
          let total = 0;
          let products = [];
          order.products.forEach((item) => {
            products = [ ...products, item ];
            total = total + item.totalPrice;
          });

          let isShowCancel = false;
          let isShowPayment = false;

          if (order.status === "Đang chờ thanh toán") {
            isShowCancel = true;
            isShowPayment = true;
          }

          if (order.status == "Đang chờ xác nhận") {
            isShowCancel = true;
          }

          let paymentMethod = 'Không rõ';
          if (order.payment === "momo") {
            paymentMethod = "Ví MoMo";
          } else if (order.payment === "tienmat") {
            paymentMethod = "Tiền mặt";
          } else if (order.payment === "nganhang") {
            paymentMethod = "Ngân hàng";
          }

          this.orders = [ ...this.orders, { 
            id: order.id, 
            date: order.orderAt, 
            address: order.address,
            payment: paymentMethod,
            status: order.status, 
            products: products, 
            discount: (total - order.totalPrice),
            total: order.totalPrice, 
            isShowCancel: isShowCancel, 
            isShowPayment: isShowPayment,
          } ];
        });
        this.orders.sort((a, b) => new Date(b.date) - new Date(a.date));

        await new Promise(resolve => setTimeout(resolve, 750));
        this.isLoaded = true;
    },
    methods: {
      handleViewProduct(id) {
        this.$router.push({ name: 'ProductDetail', params: { id } });
      },
      async handleYes() {
        const result = await db.cancelOrder(this.user.id, this.selectedOrderId);
        this.showPopup = false;    // Hide the popup
        if (!result) {
          console.log("Không thể hủy đơn hàng này vì lý do lỗi!");
          return;
        }
        
        window.location.href = '/order';
      },
      handleNo() {
        this.showPopup = false;    // Hide the popup
      },
      cancelOrder(orderId) {
        this.selectedOrderId = orderId;
        this.popupMessage = "Bạn có muốn hủy đơn hàng #" + orderId + " ?";
        this.showPopup = true;
      },
      proceedToPayment(orderId) {
        this.$router.push({ name: 'SimulatePayment', query: { id: orderId }});
      },
      formatMoney(money) {
        return tools.formatMoney(money);
      },
      formatDateTime(datetime) {
        return tools.formatDateTime(datetime);
      },
      statusClass(status) {
        switch (status) {
          case "Đang chờ thanh toán":
            return "status-shipping";
          case "Đang chờ xác nhận":
            return "status-shipping"; 
          case "Đang giao hàng":
            return "status-shipping";
          case "Đã giao hàng":
            return "status-delivered";
          case "Đã hủy":
            return "status-cancelled";
          default:
            return "";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .button-link {
  display: inline-block;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  background-color: #4CAF50; /* Green background */
  color: white;
  text-align: center;
  text-decoration: none; /* Remove underline */
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.button-link:hover {
  background-color: #45a049; /* Darker green on hover */
  transform: scale(1.05); /* Slight zoom effect */
}

.button-link:focus {
  outline: none; /* Removes the outline when clicked */
}

.button-link:active {
  transform: scale(1); /* Return to normal size when clicked */
}
  /* Popup overlay */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* Popup box */
.popup {
  background: white;
  padding: 25px 40px;
  border-radius: 12px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: slideUp 0.4s ease-in-out;
}

body.dark-mode .popup {
    background-color: #333;
}

@keyframes slideUp {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.popup-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

/* Button styling inside popup */
.popup-buttons {
  display: flex;
  justify-content: space-around;
}

.btn {
  padding: 12px 25px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.btn-yes {
  background-color: #4CAF50;
  color: white;
}

.btn-yes:hover {
  background-color: #45a049;
  transform: scale(1.05);
}

.btn-no {
  background-color: #f44336;
  color: white;
}

.btn-no:hover {
  background-color: #e53935;
  transform: scale(1.05);
}

  .order-history-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  h1 {
    text-align: center;
    color: #333;
  }
  
  .order-card {
    border: 1px solid #ddd;
    padding: 20px;
    margin-bottom: 40px;
    border-radius: 10px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
  }
  
  .order-card h2 {
    margin: 0 0 10px;
  }
  
  .order-details {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  .order-details th,
  .order-details td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  .order-actions-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.price-container {
  display: flex;
  justify-content: right;
  align-items: center;
  margin-top: 15px;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.cancel-button, .payment-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.cancel-button {
  background-color: #ff4d4d;
  color: #fff;
  border: none;
}

.cancel-button:hover {
  background-color: #ff3333;
  transform: scale(1.05);
}

.payment-button {
  background-color: #4CAF50;
  color: #fff;
  border: none;
}

.payment-button:hover {
  background-color: #45a049;
  transform: scale(1.05);
}
  .order-total {
    margin-left: 20px;
    text-align: right;
    font-size: 16px;
    margin-top: 15px;
  }
  
  .product-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 30vh;
  background-color: #f7f9fc;
  padding: 2rem;
  color: #333;
  font-family: Arial, sans-serif;
}

body.dark-mode .product-not-found {
    background-color: #333;
}

.product-not-found .icon {
  font-size: 4rem;
  color: #ff6b6b;
  margin-bottom: 1rem;
}

.product-not-found h2 {
  font-size: 2rem;
  color: #444;
  margin: 0.5rem 0;
}

body.dark-mode .product-not-found h2 {
    color: #ffffff;
}

.product-not-found p {
  color: #666;
  font-size: 1rem;
  max-width: 400px;
}

body.dark-mode .product-not-found p {
    color: #d3d3d3;
}
  
  .status-shipping {
    color: #ff9800; /* Màu trạng thái đang giao hàng */
  }
  
  .status-delivered {
    color: #4caf50; /* Màu trạng thái đã giao */
  }
  
  .status-cancelled {
    color: #f44336; /* Màu trạng thái đã hủy */
  }
  
  /* Dark Mode Styles */
  body.dark-mode .order-history-page {
    background-color: #121212;
    color: #E0E0E0;
  }
  
  body.dark-mode h1 {
    color: #81C784;
  }
  
  body.dark-mode .order-card {
    background-color: #1E1E1E;
    border-color: #333;
  }
  
  body.dark-mode .order-details th,
  body.dark-mode .order-details td {
    background-color: #333;
    color: #E0E0E0;
  }
  
  body.dark-mode .order-total {
    color: #E0E0E0;
  }
  
  body.dark-mode .status-shipping {
    color: #ffb74d;
  }
  
  body.dark-mode .status-delivered {
    color: #81C784;
  }
  
  body.dark-mode .status-cancelled {
    color: #f44336;
  }

  body.dark-mode .popup-title {
  color: white;
 }

  td {
    font-size: 0.8rem;
  }
  
  /* Responsive Styles */
  @media (max-width: 600px) {
    .order-history-page {
      padding: 15px;
    }
  
    h1 {
      font-size: 1.75rem;
    }
  
    .order-card h2 {
      font-size: 1.25rem;
    }
  
    .order-details th,
    .order-details td {
      padding: 8px;
    }
  
    .order-total {
      font-size: 14px;
    }
  }
  </style>
  