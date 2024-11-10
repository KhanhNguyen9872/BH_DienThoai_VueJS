<template>
    <div class="center">
        <div class="container">
            <form class="login-form" @submit.prevent="forgot">
                <h2>Quên mật khẩu</h2>
                <div class="input-group">
                    <label for="username">Tên đăng nhập</label>
                    <input type="text" id="username" v-model="username" required>
                </div>
                <div class="input-group">
                    <label for="email">Email của bạn</label>
                    <input type="email" id="email" v-model="email" required>
                </div>
                <p class="error-message" v-if="this.error != null && this.error.length > 0">{{ this.error }}</p>
                <p class="result-message" v-if="this.result != null && this.result.length > 0">{{ this.result }}</p>
                <button type="submit">Quên mật khẩu</button>
                <div class="links">
                    <a><router-link to="#" @click="handleClickLogin" class="login">Đăng nhập</router-link></a>
                </div>
            </form>
        </div>
    </div>
</template>
  
<script>
import db from '@/api/db';

export default {
    name: 'ComRegister',
    data() {
        return {
            username: '',
            email: '',
            error: '',
            result: '',
            productId: '',
        };
    },
    async beforeMount() {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user != null) {
            const u = await db.getUser(user.password, user.password);

            if (u != null) {
                this.$router.push('/');
            }
        }
    },
    mounted() {
        document.title = "Quên mật khẩu | KhanhStore";

        const editData = this.$route.query;
        if (editData) {
            this.productId = editData.productId;
        }
    },
    methods: {
        handleClickLogin() {
            let data = {};
            if (this.productId) {
                data.productId = this.productId;
            }
            this.$router.push({ name: 'Login', query: data });
        },
        async forgot() {
            if (this.username.length < 1) {
                this.error = 'Tên đăng nhập không được để trống!';
                return;
            }

            if (this.email.length < 1) {
                this.error = 'Email không được để trống!';
                return;
            }

            const isExistUser = await db.isExistUser(this.username);
            if (!isExistUser) {
                this.error = 'Người dùng này không tồn tại!';
                return;
            }

            const result = await db.resetPasswordUser(this.username, this.email);

            if (result == undefined || result == null) {
                this.error = 'Thông tin không chính xác!';
                return;
            }

            this.error = '';
            this.result = "Mật khẩu của bạn là: " + result;
        }
    }
}
</script>

  
<style scoped>
.result-message {
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
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.center {
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    height: 100%; /* Full height of the parent (body) */
}

body {
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.container {
    background-color: white;
    border-radius: 10px;
    /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); */
    padding: 40px;
    width: 500px;
}

body.dark-mode .container {
    background-color: #686868;
}


.login-form {
    display: flex;
    flex-direction: column;
}

h2 {
    margin-bottom: 20px;
    text-align: center;
}

body.dark-mode h2 {
    color: #ffffff;
}


.input-group {
    display: flex; /* Use flexbox for layout */
    align-items: center; /* Center items vertically */
    margin-bottom: 15px; /* Space between input groups */
}

.input-group label {
    flex: 0 0 30%; /* Fixed width for the label (30% of the container) */
    margin-right: 20px; /* Space between label and input */
    font-weight: bold; /* Make label text bold */
    text-align: right; /* Align text to the right for better alignment with input */
}

.input-group input {
    flex: 1; /* Allow the input to take the remaining space */
    padding: 10px; /* Padding inside the input */
    border: 1px solid #ccc; /* Border for the input */
    border-radius: 5px; /* Rounded corners */
    margin-right: 20px;
}

body.dark-mode .input-group label {
    color: #dcdcdc;
}

button {
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #4CAF50;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #45a049;
}

.links {
    margin-top: 30px;
}

.links a {
    margin: 0 5px;
    text-decoration: none;
    color: #007BFF; /* Default link color */
    font-weight: bold; /* Make the text bold */
    padding: 10px 15px; /* Add padding for a button-like appearance */
    border-radius: 5px; /* Rounded corners */
    border: 1px solid transparent; /* Default border */
    transition: background-color 0.3s, color 0.3s, border-color 0.3s; /* Smooth transition for hover effects */
}

body.dark-mode .links a {
    color: #004997;
}

.links a.register {
    background-color: #4CAF50; /* Green background for Register */
    color: white; /* White text color */
}

.links a.register:hover {
    background-color: #45a049; /* Darker green on hover */
    border-color: #4CAF50; /* Optional: Border color on hover */
}

.links a.forgot-password {
    background-color: #f0f0f0; /* Light gray background for Forgot Password */
    color: #007BFF; /* Link color */
}

.links a.forgot-password:hover {
    background-color: #e0e0e0; /* Slightly darker gray on hover */
    border-color: #007BFF; /* Optional: Border color on hover */
}
</style>