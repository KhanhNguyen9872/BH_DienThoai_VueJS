<template>
  <main>
    <router-link :to="{name: 'ProductDetail', params:{id}}" class="router-link">
        <div class="product-card">
            <img :src="img" alt="Điện thoại 1">
            <h2>{{ product.name }}</h2>
            <p class="price">Giá: {{ tools.formatMoney(this.money) }} VND</p>
            <button>Mua</button>
        </div>
    </router-link>
  </main>
</template>


<script>
import db from '../api/db.js'
import tools from '../api/tools'

export default {
    props:['product'],
    data() {
        return {
            id : this.product.id,
            tools: tools,
            money: this.product.color[0].money,
            img: db.getAPI_URL() + this.product.color[0].img
        }
    }
}
</script>

<style scoped>
.router-link {
    text-decoration: none;
}

body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
}

.product-container {
    display: flex;
    justify-content: center; /* Center the product cards */
    flex-wrap: wrap;
    padding: 20px;
}

.product-card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 10px; /* More rounded corners */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    margin: 15px;
    padding: 20px; /* Increased padding */
    text-align: center;
    width: 220px; /* Slightly wider card */
    transition: transform 0.2s; /* Animation effect on hover */
}

.product-card:hover {
    transform: translateY(-5px); /* Lift effect on hover */
}

.product-card img {
    max-width: 100%;
    max-height: 150px; /* Adjust this value to control the maximum height */
    object-fit: contain; /* This will keep the image aspect ratio */
    border-radius: 10px; /* Match image corners with card */
}

.description {
    font-size: 14px; /* Smaller font size for description */
    color: #555; /* Gray color for description */
    margin: 10px 0; /* Spacing around description */
}

.price {
    font-weight: bold;
    color: #333;
    margin: 10px 0; /* Add some space above and below */
}

button {
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.3s; /* Transition for button hover */
    width: 100%; /* Full-width button */
    margin-top: 15px;
}

button:hover {
    background-color: #45a049;
}

</style>