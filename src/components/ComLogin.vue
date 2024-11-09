<template>
    <div class="center">
        <div class="container">
            <form class="login-form" @submit.prevent="handleSubmit">
                <h2>Đăng nhập tài khoản</h2>
                <div class="input-group">
                    <label for="username">Tên đăng nhập</label>
                    <input type="text" v-model="username" name="username" required>
                </div>
                <div class="input-group">
                    <label for="password">Mật khẩu</label>
                    <input type="password" v-model="password" name="password" required>
                </div>
                <p class="error-message" v-if="this.error.length > 0">{{ this.error }}</p>
                <button @click="login">Đăng nhập</button>
                <div class="links">
                    <a><router-link to="/register" class="register">Đăng ký</router-link></a>
                    <a><router-link to="/forgot" class="forgot-password">Quên mật khẩu</router-link></a>
                </div>
            </form>
        </div>
    </div>
</template>
  
<script>
// import eventBus from '../event/eventBus.js'
// import users from '@/data/users'
import db from '../api/db';
export default {
    name:'ComLogin',
    data() {
        return {
            username: '', 
            password: '', 
            error: '',
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
        document.title = "Đăng nhập | KhanhStore";
        const editData = this.$route.query;
        if (editData) {
            this.productId = editData.productId;
            this.error = editData.error;
        }
    },
    methods:{
        async login() {
            const user = await db.getUser(this.username, this.password);

            if (user == null) {
                this.error = 'Tên tài khoản hoặc mật khẩu không đúng!';
                return;
            }

            if (user.lock) {
                this.error = 'Tài khoản này đã bị khóa!';
                return;
            }

            localStorage.setItem('user', JSON.stringify({id: user.id, username: user.username, password: user.password}));
            if (this.productId) {
                window.location.href = '/product/' + this.productId;
            } else {
                window.location.href = '/';
            }
        }
    }
}
</script>
  
<style scoped>
@import '../styles/css/font-awesome.css';
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

.login-form {
    display: flex;
    flex-direction: column;
}

h2 {
    margin-bottom: 20px;
    text-align: center;
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
label {
    margin-bottom: 5px;
    font-weight: bold;
}

input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
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