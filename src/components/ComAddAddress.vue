<template>
    <div class="form-container">
      <form @submit.prevent="submitForm">
        <h2>Thêm địa chỉ mới</h2>
        
        <div class="input-group">
          <label for="fullname">Họ và tên</label>
          <input type="text" id="fullname" v-model="fullName" />
        </div>
        
        <div class="input-group">
          <label for="address">Địa chỉ</label>
          <input type="text" id="address" v-model="address" />
        </div>
        
        <div class="input-group">
          <label for="numberphone">Số điện thoại</label>
          <input type="tel" id="numberphone" v-model="phone" />
        </div>
        
        <p class="error-message" v-if="this.error.length > 0">{{ this.error }}</p>
        <button type="submit">Thêm địa chỉ</button>
      </form>
    </div>
  </template>
  
  <script>
  import db from '@/api/db';
  export default {
    data() {
      return {
        userId: '',
        fullName: '',
        address: '',
        phone: '',
        error: '',
      };
    },
    async created() {
        // check is logged in or not
        let user = JSON.parse(localStorage.getItem("user"));
        if (user != null) {
            const u = await db.getUser(user.username, user.password);

            user = u;
        }

        if (user == null) {
            localStorage.removeItem('user');
            this.$router.push('/login');
            return;
        }

        this.userId = user.id;
        this.information = user.information;
        if (this.information.length >= 3) {
            this.error = 'Số lượng địa chỉ đã đạt 3! Vui lòng xóa bớt địa chỉ để có thể thêm mới!';
        }
    },
    mounted() {
        document.title = "Thêm địa chỉ | KhanhStore";
    },
    methods: {
        generateRandomId(length) {
            return Math.random().toString(36).substring(2, 2 + length);
        },
        submitForm() {
            if (this.information.length >= 3) {
                this.error = 'Số lượng địa chỉ đã đạt 3! Vui lòng xóa bớt địa chỉ để có thể thêm mới!';
                return;
            }

            if (this.fullName.length < 1) {
                this.error = 'Họ và tên không được để trống'
                return;
            }
            
            if (this.address.length < 1) {
                this.error = 'Địa chỉ không được để trống'
                return;
            }

            if (this.phone.length < 1) {
                this.error = 'Số điện thoại không được để trống'
                return;
            }

            this.error = '';

            let newAddress = { id: this.generateRandomId(10), fullName: this.fullName, address: this.address, phone: this.phone };
            this.information.push(newAddress);
            db.updateAddress(this.userId, this.information);
            window.location.href = '/profile';
        }
    }
  };
  </script>
  
  <style scoped>
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

  .form-container {
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  form h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }
  
  .input-group {
    margin-bottom: 15px;
    margin-right: 20px;
  }
  
  .input-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: #555;
  }
  
  .input-group input {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    transition: border-color 0.3s;
  }
  
  .input-group input:focus {
    border-color: #45a049;
    outline: none;
  }
  
  button {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    background-color: #4CAF50;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  