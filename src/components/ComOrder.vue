<template>
    <div class="order-history-page">
      <h1>Danh sách đơn hàng đã đặt</h1>
  
      <!-- Kiểm tra nếu có đơn hàng -->
      <div v-if="orders.length > 0">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <h2>Đơn hàng #{{ order.id }}</h2>
          <p><strong>Ngày đặt:</strong> {{ formatDate(order.date) }}</p>
          <p><strong>Trạng thái:</strong><span :class="statusClass(order.status)">{{ order.status }}</span></p> 
  
          <table class="order-details">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Tổng cộng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.items" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ formatCurrency(item.price) }}</td>
                <td>{{ formatCurrency(item.price * item.quantity) }}</td>
              </tr>
            </tbody>
          </table>
  
          <div class="order-total">
            <strong>Tổng tiền:</strong> {{ formatCurrency(order.total) }}
          </div>
        </div>
      </div>
  
      <!-- Hiển thị khi không có đơn hàng -->
      <div v-else class="no-orders">
        <p>Hiện tại bạn chưa có đơn hàng nào.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        orders: [
          {
            id: 1234,
            date: "2024-11-10",
            status: "Đang giao hàng",
            items: [
              { id: 1, name: "Google Pixel 3", quantity: 2, price: 3000000 },
              { id: 2, name: "Tai nghe Sony WH-1000XM4", quantity: 1, price: 8000000 },
            ],
            total: 14000000,
          },
          {
            id: 5678,
            date: "2024-11-09",
            status: "Đã giao hàng",
            items: [
              { id: 3, name: "iPhone 14 Pro", quantity: 1, price: 25000000 },
            ],
            total: 25000000,
          },
        ],
      };
    },
    methods: {
      formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('vi-VN', options);
      },
      formatCurrency(value) {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
      },
      statusClass(status) {
        switch (status) {
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
    margin-bottom: 20px;
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
  
  .order-total {
    text-align: right;
    font-size: 16px;
    margin-top: 15px;
  }
  
  .no-orders {
    text-align: center;
    padding: 20px;
    color: #888;
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
  
  body.dark-mode .no-orders {
    color: #bbb;
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
  