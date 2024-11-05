<template>
    <div class="center">
        <div class="container">
            <form class="login-form" @submit.prevent="register">
                <h2>Đăng ký tài khoản</h2>
                <div class="input-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" v-model="username" required>
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model="password" required>
                </div>
                <div class="input-group">
                    <label for="phone">Số điện thoại</label>
                    <input type="text" id="phone" v-model="phone" required>
                </div>
                <button type="submit">Đăng ký</button>
                <div class="links">
                    <a><router-link to="/login" class="login">Đăng nhập</router-link></a>
                </div>
            </form>
        </div>
    </div>
</template>
  
<script>
// import eventBus from '../event/eventBus.js';
// import users from '@/data/users'; // Assuming you have a users array

export default {
    name: 'ComRegister',
    data() {
        return {
            username: '',
            password: '',
            phone: '',
            error: '',
            // users: users
        };
    },
    methods: {
        register() {
            // Check if username already exists
            // const existingUser = this.users.find(user => user.username === this.username);
            // if (existingUser) {
            //     this.error = "Tên người dùng đã tồn tại.";
            //     return;
            // }

            // // Create a new user object
            // const newUser = {
            //     username: this.username,
            //     password: this.password,
            //     phone: this.phone
            // };

            // // Save to localStorage or send to server
            // this.users.push(newUser);
            // localStorage.setItem('users', JSON.stringify(this.users)); // Save updated user list to localStorage
            // eventBus.emit('registerSuccess', newUser); // Emit event for successful registration
            // this.$router.push('/'); // Redirect after registration
        }
    }
}
</script>

  
<style scoped>
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