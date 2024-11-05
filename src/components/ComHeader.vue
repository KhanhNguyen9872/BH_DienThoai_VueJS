<template>
    <header>
        <div class="header">
            <a href="#default" class="logo">Khanh Store</a>
            <div class="header-left">
                <router-link to="/" class="active">Trang chủ</router-link>
                <router-link to="/products">Sản phẩm</router-link>
                <router-link to="/gioithieu">Giới thiệu</router-link>
                <router-link to="/contact">Liên hệ</router-link>
            </div>
            <div class="header-right">
                <div v-if="user == undefined">
                    <button><router-link to="/login" class="active">Đăng nhập</router-link></button>
                </div>
                <div v-else>
                    <p>Xin chào {{ user.name }}</p>
                    <router-link to="/cart" class="cart-link">🛒 Giỏ hàng</router-link>
                </div>
            </div>
        </div>
    </header>
 <!-- lấy nội dung component được link tới thì dùng -->
<router-view/>
</template>

<script>
export default {
    data() {
        return {
            user: JSON.parse(localStorage.getItem("user"))
        }
    } 
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #333;
    color: white;
}

.logo {
    font-size: 24px;
    font-weight: bold;
    color: white;
    text-decoration: none;
}

.header-left {
    display: flex;
    gap: 15px;
}

.header-left a,
.header-right .cart-link {
    color: white;
    text-decoration: none;
    font-size: 16px;
    padding: 8px;
}

.header-left a:hover,
.header-right .cart-link:hover {
    background-color: #555;
    border-radius: 5px;
}

.header-right button {
    background-color: #4CAF50; /* Green background */
    color: white;
    border: none;
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.header-right button:hover {
    background-color: #45a049; /* Darker green on hover */
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .header {
        flex-direction: column;
    }

    .header-left,
    .header-right {
        justify-content: center;
        width: 100%;
    }
}
</style>