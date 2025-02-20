<template>
  <Loading v-if="!this.isLoaded"/>
    <div class="form-container">
      <form @submit.prevent="submitForm">
        <h2>Sửa địa chỉ</h2>
        
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
        <button type="submit">Sửa</button>
      </form>
    </div>
  </template>
  
  <script>
  import Loading from './ComLoading.vue';
  import db from '@/api/db';
  export default {
    components: {
      Loading
    },
    data() {
      return {
        addressId: '',
        userId: '',
        fullName: '',
        address: '',
        phone: '',
        error: '',
        isLoaded: false,
      };
    },
    async mounted() {
        // check is logged in or not
        let user = localStorage.getItem("accessToken");
        if (user != null) {
            const u = await db.getUser(user);

            user = u;
        }

        if (user == null) {
            localStorage.removeItem('accessToken');
            this.$router.push('/login');
            return;
        }

        this.userId = user.id;
        this.information = user.information;
        
        const editData = this.$route.query;
        this.addressId = editData.id;

        if (this.addressId == undefined) {
          this.$router.push('/');
          return;
        }

        const data = this.information.find((info) => info.id == this.addressId);

        if (data == undefined) {
          this.$router.push('/');
          return;
        }
        this.fullName = data.fullName;
        this.address = data.address;
        this.phone = data.phone;

        document.title = "Sửa địa chỉ (ID: " + this.addressId + ") | KhanhStore";
        await new Promise(resolve => setTimeout(resolve, 300));
        this.isLoaded = true;
    },
    methods: {
        submitForm() {
            if (this.fullName.length < 1) {
                this.error = 'Họ và tên không được để trống!'
                return;
            }
            
            if (this.address.length < 1) {
                this.error = 'Địa chỉ không được để trống!'
                return;
            }

            if (this.phone.length < 1) {
                this.error = 'Số điện thoại không được để trống!'
                return;
            }

            const tmp = this.information.find((info) => info.id == this.addressId);
            if (tmp == null) {
                this.error = 'Địa chỉ này không tồn tại! Không thể sửa!';
                return;
            } else {
                this.information = this.information.filter((info) => info.id !== this.addressId);
            }

            this.error = '';

            db.updateAddress(this.addressId, { fullName: this.fullName, address: this.address, phone: this.phone });
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
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
  }

  body.dark-mode .form-container {
    background-color: #333;
  }
  
  form h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }

  body.dark-mode form h2 {
    color: #ffffff;
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

  body.dark-mode .input-group label {
    color: #dfdfdf;
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
    margin-top: 10px;
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
  