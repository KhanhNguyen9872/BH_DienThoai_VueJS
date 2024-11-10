<template>
    <div class="center">
        <div class="container">
            <form class="login-form" @submit.prevent="register">
                <h2>Đăng ký tài khoản</h2>
                
                <div class="input-group">
                    <label for="firstname">Tên của bạn</label>
                    <input type="text" id="firstname" v-model="firstname" required>
                </div>
                
                <div class="input-group">
                    <label for="lastname">Họ của bạn</label>
                    <input type="text" id="lastname" v-model="lastname" required>
                </div>

                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="email" required>
                </div>

                <div class="input-group">
                    <label for="username">Tên đăng nhập</label>
                    <input type="text" id="username" v-model="username" required>
                </div>

                <div class="input-group">
                    <label for="password">Mật khẩu</label>
                    <input type="password" id="password" v-model="password" required>
                </div>

                <div class="input-group">
                    <label for="repassword">Nhập lại mật khẩu</label>
                    <input type="password" id="repassword" v-model="repassword" required>
                </div>

                <p class="error-message" v-if="this.error != null && this.error.length > 0">{{ this.error }}</p>
                <p class="result-message" v-if="this.result != null && this.result.length > 0">{{ this.result }} <a style="margin-left: 10px;" href="#" @click="handleClickLogin">Đăng nhập ngay</a></p>
                <button type="submit">Đăng ký</button>
                
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
            firstname: '',
            lastname: '',
            email: '',
            username: '',
            password: '',
            repassword: '',
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
        document.title = "Đăng ký | KhanhStore";

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
        async register() {
            if (this.password.length < 1) {
                this.error = 'Mật khẩu không được để trống!';
                return;
            }

            if (this.password === this.repassword) {
                if (this.firstname.length < 1) {
                    this.error = 'Tên của bạn không được để trống!';
                    return;
                }
                if (this.lastname.length < 1) {
                    this.error = 'Họ của bạn không được để trống!';
                    return;
                }
                if (this.email.length < 1) {
                    this.error = 'Email không được để trống!';
                    return;
                }
                if (this.username.length < 1) {
                    this.error = 'Tên đăng nhập không được để trống!';
                    return;
                }

                const isExistUser = await db.isExistUser(this.username);
                if (isExistUser) {
                    this.error = 'Tên người dùng này đã tồn tại!';
                    return;
                }

                let newUser = { username: this.username, password: this.password, email: this.email, firstName: this.firstname, lastName: this.lastname, lock: false, information: [] };
                await db.addUser(newUser);

                this.result = 'Đăng ký thành công!';
            } else {
                this.error = 'Hai mật khẩu phải trùng khớp với nhau!';
                return;
            }
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
    justify-content: center;
    align-items: center;
}

.container {
    background-color: white;
    border-radius: 10px;
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
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.input-group label {
    flex: 0 0 30%;
    margin-right: 20px;
    font-weight: bold;
    text-align: right;
}

.input-group input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 20px;
}

.input-group input[type="email"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 20px;
    font-size: 16px;
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
    color: #007BFF;
    font-weight: bold;
    padding: 10px 15px;
    border-radius: 5px;
    border: 1px solid transparent;
    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

body.dark-mode .links a {
    color: #004997;
}


</style>
