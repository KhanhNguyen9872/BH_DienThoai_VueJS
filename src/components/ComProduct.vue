<template>
    <main>
      <router-link :to="{name: 'ProductDetail', params:{id}}" class="router-link">
        <div class="product-card">
          <img :src="img" alt="Điện thoại 1">
          <h2>{{ product.name }}</h2>
          <div class="price-container">
            <p class="price">Giá: {{ tools.formatMoney(this.money) }} VND</p>
            <p class="favorites-label">
                ❤️ {{ favoriteCount }}
            </p>
          </div>
          
          <button>Mua</button>
        </div>
      </router-link>
    </main>
  </template>
  
  <script>
  import db from '@/api/db.js'
  import tools from '@/api/tools'
  
  export default {
    props:['product'],
    data() {
        return {
            id: this.product.id,
            tools: tools,
            money: this.product.color[0].money,
            img: db.getAPI_URL() + this.product.color[0].img,
            favoriteCount: 0,
        }
    },
    mounted() {
      const newFavorite = [ ...this.product.favorites ];

      this.favoriteCount = newFavorite.length;

    }
  }
  </script>
  
  <style scoped>
  .price-container {
  display: flex;
  justify-content: center; /* Aligns price and favorites label to the ends */
  align-items: center;
}
  
.favorites-label {
    align-content: center;
    text-align: center;
  font-size: 14px;
  color: #ff4081;
  font-weight: normal;
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 12px;
  margin-left: 10px; /* Add some space between the price and the label */
}
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
        justify-content: center;
        flex-wrap: wrap;
        padding: 20px;
    }
    
    .product-card {
        background: white;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        margin: 15px;
        padding: 20px;
        text-align: center;
        width: 220px;
        transition: transform 0.2s;
    }
  
  /* Dark Mode Styles */
    .product-card {
      transition: background 0.3s, color 0.3s;
    }
    body.dark-mode .product-card {
        background: #474747;
        color: #fff;
    }
  
    .product-card:hover {
        transform: translateY(-5px);
    }
    
    .product-card img {
        max-width: 100%;
        max-height: 150px;
        object-fit: contain;
        border-radius: 10px;
    }
    
    .description {
        font-size: 14px;
        color: #555;
        margin: 10px 0;
    }
    
    .price {
        font-weight: bold;
        color: #333;
        margin: 10px 0;
    }
    
    button {
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px;
        cursor: pointer;
        transition: background-color 0.3s;
        width: 100%;
        margin-top: 15px;
    }
    
    button:hover {
        background-color: #45a049;
    }
    
    /* Dark Mode Button */
    body.dark-mode .button {
        background-color: #333;
        color: white;
    }
    
    body.dark-mode .price {
        color: #fff;
    }
  </style>
  