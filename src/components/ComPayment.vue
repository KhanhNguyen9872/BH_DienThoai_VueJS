<template>
  <Loading v-if="!this.isLoaded"/>
  <!-- Overlay and Popup -->
  <div v-if="isShowPopup" class="overlay">
      <div class="popup">
          <h2>Không có địa chỉ nhận hàng</h2>
          <p>Vào hồ sơ và thêm địa chỉ nhận hàng của bạn</p>
          <div class="button-group">

          <button class="btn" @click="goToProfile">Đi tới hồ sơ</button>
          </div>
      </div>
  </div>

  <div class="payment-container">
    <h2>Thanh toán</h2>
    
    <table class="order-table">
      <thead>
        <tr>
          <th>STT</th>
          <th>Sản phẩm</th>
          <th>Giá</th>
          <th>Số lượng</th>
          <th>Tổng</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cartItems" :key="item.id">
          <td>{{ item.stt }}</td>
          <td><strong>{{ item.name }}</strong> {{ "(" + item.color + ")" }}</td>
          <td>{{ formatMoney(item.price) }} VND</td>
          <td>{{ item.quantity }}</td>
          <td>{{ formatMoney(item.price * item.quantity) }} VND</td>
        </tr>
      </tbody>
    </table>

    <hr>

    <div class="payment-method">
      <label for="address">Địa chỉ</label>
      <select id="address" v-model="selectedAddress">
        <option v-for="address in addresses" :key="address.id" :value="address.id">
          {{ address.name }} - {{ address.phone }} | {{ address.address }}
        </option>
      </select>
    </div>

    <hr>

    <div class="voucher-section">
      <label for="address">Mã giảm giá</label>
      <input v-model="voucherCode" placeholder="Nhập mã voucher" />
      <button @click="applyVoucher">Áp dụng</button>
    </div>

    <!-- Result message section with flex layout -->
    <div class="result-message" v-if="this.voucherCodeInfo && this.voucherCodeInfo.length > 0">
      <span class="voucher-label">{{ this.voucherCodeInfo }}</span>
      <button class="delete-btn" @click="clearVoucher">Xóa</button>
    </div>
    <!-- <p class="result-message" v-if="this.resultVoucher != null && this.resultVoucher.length > 0">{{ this.resultVoucher }}</p> -->
    <p class="error-message" v-if="this.errorVoucher != null && this.errorVoucher.length > 0">{{ this.errorVoucher }}</p>

    <hr>

    <div class="payment-method">
      <label for="payment">Phương thức thanh toán</label>
      <select id="payment" v-model="selectedPaymentMethod">
        <option value="tienmat">Thanh toán khi nhận hàng</option>
        <option value="momo">Ví MoMo</option>
        <option value="nganhang">Ngân hàng</option>
      </select>
    </div>

    <hr>

    <div class="summary-section">
      <p>Tổng tiền hàng: {{ formatMoney(totalAmount) }} VND</p>
      <p style="color: #ff0000" v-if="this.discount > 0">Giảm giá: -{{ formatMoney(totalAmount * discount) }} VND</p>
      <p class="final-total">Tổng thanh toán: {{ formatMoney(finalAmount) }} VND</p>
    </div>

    <p class="result-message" v-if="this.result != null && this.result.length > 0">{{ this.result }}</p>
    <p class="error-message" v-if="this.error != null && this.error.length > 0">{{ this.error }}</p>
    <button class="confirm-button" @click="confirmPayment">Xác nhân đặt hàng</button>
  </div>
</template>

<script>
import Loading from './ComLoading.vue';
import db from '@/api/db';
import tools from '@/api/tools';

export default {
  components: {
    Loading
  },
  beforeRouteLeave(to, from, next) {
    let answer = true;
    if (!this.isSkipPrevent) {
      answer = window.confirm('Thanh toán sẽ bị hủy nếu bạn rời khỏi, bạn có muốn rời không?');
    }
    
    if (answer) {
      next(); // Allow navigation
    } else {
      next(false); // Cancel navigation
    }
  },
  data() {
    return {
      user: null,
      orderId: '',
      cartItems: [],
      addresses: [],
      selectedAddress: null,
      voucherCode: '',
      voucherCodeInfo: '',
      discount: 0,
      selectedPaymentMethod: '',
      errorVoucher: '',
      error: '',
      result: '',
      isSkipPrevent: false,
      isShowPopup: false,
      isLoaded: false,
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
        this.isSkipPrevent = true;
        localStorage.removeItem('accessToken');
        this.$router.push('/login');
        return;
    }

    const selectedItem = JSON.parse(localStorage.getItem('payment'));
    localStorage.removeItem('payment');
    if (!selectedItem) {
      this.isSkipPrevent = true;
      this.$router.push('/');
      return;
    }

    if (this.user.information.length == 0) {
      await new Promise(resolve => setTimeout(resolve, 300));
      this.isLoaded = true;
      this.isShowPopup = true;
      return;
    }

    let stt = 0;
    this.cartItems = [];
    selectedItem.forEach((item) => {
      stt++;
      item.stt = stt;
      this.cartItems = [ ...this.cartItems, item ];
    });

    this.addresses = [];
    this.user.information.forEach(info => {
      let newAddr = { id: info.id, name: info.fullName, phone: info.phone, address: info.address };
      this.addresses = [ ...this.addresses, newAddr ];
    });

    window.addEventListener('beforeunload', this.handleBeforeUnload);
    await new Promise(resolve => setTimeout(resolve, 300));
    this.isLoaded = true;
  },
  beforeUnmount() {
    if (!this.isSkipPrevent) {
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }
  },
  computed: {
    totalAmount() {
      return this.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
    finalAmount() {
      return this.totalAmount * (1 - this.discount);
    },
  },
  methods: {
    clearVoucher() {
      this.discount = 0;
      this.voucherCode = '';
      this.voucherCodeInfo = '';
    },
    goToProfile() {
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
      this.isSkipPrevent = true;
      this.$router.push('/profile');
    },
    handleBeforeUnload(event) {
      // Ask user for confirmation before reloading or closing the page
      const confirmationMessage = 'Are you sure you want to leave without saving?';
      event.returnValue = confirmationMessage;  // Standard for modern browsers
      return confirmationMessage;  // For older browsers (optional but can be useful)
    },
    formatMoney(money) {
      return tools.formatMoney(money);
    },
    async applyVoucher() {
      this.errorVoucher = '';
      this.resultVoucher = '';

      if (!this.voucherCode) {
        this.errorVoucher = 'Mã voucher không được để trống!';
        return;
      }

      this.isLoaded = false;

      this.voucherCode = this.voucherCode.toUpperCase();

      const v = await db.checkVoucher(this.user.id, this.voucherCode);

      await new Promise(resolve => setTimeout(resolve, 750));

      this.isLoaded = true;
      if (v == undefined || v == null) {
        this.errorVoucher = 'Mã voucher này không tồn tại, đã dùng hoặc đã hết lượt!';
        return;
      }

      if (v.count > 0) {
        this.discount = +v.discount;
        this.voucherCodeInfo = this.voucherCode + ' (Giảm ' + (this.discount * 100) + '%)'
        return;
      }
      
    },
    isItemInPayment(item) {
      if (!item) {
        return false;
      }

      const result = this.cartItems.filter((i) => ((i.id === item.productId) && (i.color === item.color)));
      return (result.length == 0);
    },
    async removeItem() {
      const allCart = await db.getCartItemsByUserId(this.user.id);
      if (!allCart) {
        return false;
      }

      let newCart = allCart.carts.filter((item) => {
        return !this.isItemInPayment(item);
      });
      
      const result = db.deleteProductFromCart(newCart[0].id, newCart[0].color);
      if (!result) {
        return false;
      }
      return true;
    },
    async confirmPayment() {
      if (!this.selectedAddress) {
        this.error = 'Vui lòng chọn địa chỉ nhận hàng';
        return;
      }

      if (!this.selectedPaymentMethod) {
        this.error = 'Vui lòng chọn phương thức thanh toán';
        return;
      }

      this.isLoaded = false;

      this.error = '';

      // create new order
      let listProduct = [];
      this.cartItems.forEach((item) => {
        listProduct = [ ...listProduct, { id: item.id, name: item.name, color: item.color, quantity: item.quantity, price: item.price, totalPrice: (item.price * item.quantity) } ];
      });
      
      // let address = { name: this.selectedAddress.name, phone: this.selectedAddress.phone, address: this.selectedAddress.address };
      let newOrder = { payment: this.selectedPaymentMethod, address: this.selectedAddress, products: listProduct, voucherCode: this.voucherCode };

      // if (this.voucherCodeInfo.length > 0) {
      //   const resultUseVoucher = await db.useVoucher(this.voucherCode);
      //   if (!resultUseVoucher) {
      //     this.error = 'Không thể đặt hàng, mã voucher không tồn tại hoặc đã hết lượt!';
      //     this.clearVoucher();
      //     this.isLoaded = true;
      //     return;
      //   }
      // }

      // delete product in cart after order
      const resultRemoveItem = await this.removeItem();
      if (!resultRemoveItem) {
        this.error = 'Không thể đặt hàng, giỏ hàng của bạn có dấu hiệu bất thường!';
        this.isLoaded = true;
        return;
      }

      const data = await db.addOrder(newOrder);
    
      if (!data) {
        this.error = 'Không thể tạo đơn hàng này vì lý do lỗi!';
        this.isLoaded = true;
        return;
      }

      // added Order, then decrease quantity in products
      // const products = await db.getAllProducts();

      // for (const i of this.cartItems) {
      //   await (async () => { 
      //     const p = products.filter((j) => i.id === j.id);
      //     const pColor = p[0].color.filter((j) => j.name === i.color);
      //     pColor[0].quantity = pColor[0].quantity - i.quantity;
          
      //     await db.modifyProduct(i.id, p[0]);
      //   })();
      // }

      //

      this.isLoaded = true;
      this.isSkipPrevent = true;
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
      if (this.selectedPaymentMethod === "tienmat") {
        this.$router.push({ name: 'OrderCreated', query: { id: data.orderId }});
      } else {
        this.$router.push({ name: 'SimulatePayment', query: { id: data.orderId }});
      }
    },
  },
};
</script>

<style scoped>
hr {
  margin-top: 20px; 
  margin-bottom: 15px;
}

.delete-btn {
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.delete-btn:hover {
  background-color: darkred;
}

.voucher-label {
  font-size: 14px;
  color: #333;
}

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
    body.dark-mode .popup {
        background: #6e6e6e;
    }
  .overlay .popup {
    transform: translateY(0);
    opacity: 1;
  }
  .popup h2 {
    margin-top: 0;
    color: #4CAF50;
  }
  body.dark-mode .popup h2 {
    color: #61e166;
    }
  .popup p {
    color: #333;
  }
  body.dark-mode .popup p {
    color: #000000;
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
  
.result-message {
    justify-content: space-between; /* Space between label and delete button */
    align-items: center; /* Vertically center content */
    color: #4CAF50; /* Green color to indicate success */
    background-color: #e7f5e9; /* Light green background for better visibility */
    border: 1px solid #4CAF50; /* Green border to match the text color */
    padding: 10px; /* Some padding for better spacing */
    border-radius: 5px; /* Rounded corners */
    margin: 15px 0; /* Margin to separate from other content */
    font-size: 14px; /* Font size */
    display: flex; /* Optional: Flexbox for better alignment */
    align-items: center; /* Center vertically */
}

.result-message span {
  color: #4CAF50; /* Green color to indicate success */
}

.error-message {
    color: #d9534f; /* Bootstrap's danger color */
    background-color: #f2dede; /* Light red background */
    border: 1px solid #ebccd1; /* Border color matching the background */
    padding: 10px; /* Some padding for better spacing */
    border-radius: 5px; /* Rounded corners */
    margin: 15px 0; /* Margin to separate from other content */
    font-size: 14px; /* Font size */
    display: flex; /* Optional: Flexbox for better alignment */
    align-items: center; /* Center vertically */
}

/* Base Styles */
body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
  transition: background-color 0.3s, color 0.3s;
}

.payment-container {
  max-width: 700px;
  margin: 20px auto;
  background-color: white;
  color: #333;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, color 0.3s;
}

.payment-container h2 {
  color: #000000;
}

body.dark-mode .payment-container h2 {
  color: #fff;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5rem;
}

/* Table Styles */
.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.order-table th,
.order-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  color: #333;
}

.order-table th {
  font-size: 1.1rem;
  background-color: #f5f5f5;
  font-weight: bold;
  color: #333;
}

.order-table td {
  font-size: 0.8rem;
  background-color: #ffffff;
  color: #555;
}

/* Address Section */
.summary-section {
  margin-top: 20px;
}

/* Voucher Section */
.voucher-section {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.voucher-section label {
  align-content: center;
  justify-content: center;
  font-size: 1.2rem;
  width: 220px;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  margin-right: 5px;
}

body.dark-mode .voucher-section label {
  color: #e1e1e1;
}

.voucher-section input {
  margin-right: 10px;
  padding: 12px;
  font-size: 1rem;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  color: #333;
  transition: background-color 0.3s, border-color 0.3s;
  box-sizing: border-box;
}

.voucher-section input:hover {
  border-color: #ddd;
  background-color: #f0f0f0;
}

.voucher-section input:focus {
  outline: none;
  border-color: #007bff;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.voucher-section button {
  padding: 12px;
  font-size: 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 30%;
}

.voucher-section button:hover {
  background-color: #45a049;
}

/* Payment Method */
.payment-method {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.payment-method label {
  width: 155px;
  align-content: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #333;
  font-weight: bold;
  display: block;
}

.payment-method select {
  padding: 12px;
  font-size: 0.75rem;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  color: #333;
  transition: background-color 0.3s, border-color 0.3s;
  box-sizing: border-box;
}

.payment-method select:hover {
  border-color: #ddd;
  background-color: #f0f0f0;
}

.payment-method select:focus {
  outline: none;
  border-color: #007bff;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Summary Section */
.summary-section {
  font-size: 1.2rem;
  text-align: right;
  margin-top: 20px;
}

.final-total {
  font-size: 1.4rem;
  font-weight: bold;
  color: #000000;
}

/* Confirm Payment Button */
.confirm-button {
  width: 100%;
  padding: 12px;
  font-size: 1.2rem;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.confirm-button:hover {
  background-color: #4cae4c;
}

/* Dark Mode Styles */
body.dark-mode {
  background-color: #1e1e1e;
}

body.dark-mode .payment-container {
  background-color: #333;
  color: #e0e0e0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

body.dark-mode .order-table th,
body.dark-mode .order-table td {
  color: #e0e0e0;
  background-color: #474747;
}

body.dark-mode .order-table th {
  background-color: #333;
}

body.dark-mode .voucher-section input {
  background-color: #2b2b2b;
  color: #e0e0e0;
  border-color: #444;
}

body.dark-mode .voucher-section input:hover {
  background-color: #333;
}

body.dark-mode .voucher-section input:focus {
  border-color: #0069d9;
  background-color: #474747;
}

body.dark-mode .voucher-section button {
  background-color: #007bff;
  color: white;
}

body.dark-mode .voucher-section button:hover {
  background-color: #0069d9;
}

body.dark-mode .payment-method select {
  background-color: #2b2b2b;
  color: #e0e0e0;
  border-color: #444;
}

body.dark-mode .payment-method label {
  color: #cccccc;
  border-color: #444;
}

body.dark-mode .payment-method select:hover {
  background-color: #333;
}

body.dark-mode .payment-method select:focus {
  border-color: #0069d9;
  background-color: #474747;
}

body.dark-mode .final-total {
  color: #ffffff;
}

body.dark-mode .confirm-button {
  background-color: #28a745;
  color: white;
}

body.dark-mode .confirm-button:hover {
  background-color: #218838;
}
</style>
