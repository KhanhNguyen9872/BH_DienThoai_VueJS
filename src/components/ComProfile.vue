<template>
    <div class="profile-info">
        <h2>Thông tin cá nhân</h2>
        
        <form @submit.prevent="updateProfile">
            <div class="input-group">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" v-model="profile.firstName" required>
            </div>

            <div class="input-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" v-model="profile.lastName" required>
            </div>

            <div class="input-group">
                <label for="username">Username</label>
                <input type="text" id="username" v-model="profile.username" required>
            </div>

            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" v-model="profile.password" required>
            </div>

            <button type="submit">Cập nhật thông tin</button>
        </form>
    </div>
</template>

<script>
import db from '@/api/db';

export default {
    name: 'ProfileInfo',
    data() {
        return {
            profile: {
                user: null,
                firstName: '',
                lastName: '',
                username: '',
                password: ''
            }
        };
    },
    async created() {
        // check is logged in or not
        this.user = JSON.parse(localStorage.getItem("user"));
        if (this.user != null) {
            const user = await db.getUser(this.user.password, this.user.password);

            if (user == null) {
                this.user = null;
            } else {
                this.user = user;
            }
        }

        if (this.user == null) {
            this.$router.push('/login');
            return;
        }
    },
    methods: {
        updateProfile() {
            // Handle profile update logic here
            console.log("Updating profile:", this.profile);
        }
    }
}
</script>

<style scoped>
.profile-info {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    max-width: 400px;
    margin: 0 auto;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
}

.input-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}

.input-group label {
    font-weight: bold;
    margin-bottom: 5px;
    color: #555;
}

.input-group input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #45a049;
}
</style>
