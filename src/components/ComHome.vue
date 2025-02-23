<template>
    <Loading v-if="!this.isLoaded"/>
    <div class="home-page">
      <!-- Banner Section -->
      <div class="banner">
        <img :src="bannerImg" alt="Banner" />
      </div>
  
      <!-- New Phones Section -->
      <div class="section new-phones">
        <h2>Sản phẩm ngẫu nhiên</h2>
        <div class="product-list">
          <div
            class="product-card"
            v-for="product in randomProducts"
            :key="product.id"
          >
            <img :src="product.image" :alt="product.name" />
            <h3>{{ product.name }}</h3>
            <div class="price-container">
                <p class="price">{{ product.price }} VND</p>
                <p class="favorites-label">
                    ❤️ {{ product.favoriteCount }}
                </p>
            </div>
            <button @click="handleClick(product.id)" class="buy-now">Mua ngay</button>
          </div>
        </div>
      </div>
  
      <!-- Most Favorite Products Section -->
      <div class="section most-favorites">
        <h2>Được yêu thích nhiều nhất</h2>
        <div class="product-list">
          <div
            class="product-card favorite"
            v-for="product in favoriteProducts"
            :key="product.id"
          >
            <img :src="product.image" :alt="product.name" />
            <h3>{{ product.name }}</h3>
            <div class="price-container">
                <p class="price">{{ product.price }} VND</p>
                <p class="favorites-label">
                    ❤️ {{ product.favoriteCount }}
                </p>
            </div>
            
            <button @click="handleClick(product.id)" class="buy-now">Mua ngay</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Loading from './ComLoading.vue';
    import tools from '../api/tools';
    import db from '../api/db';
  export default {
    components: {
        Loading,
    },
    data() {
      return {
        bannerImg: require('@/assets/banner.png'),
        randomProducts: [],
        favoriteProducts: [],
        isLoaded: false,
      };
    },
    async mounted() {
        const allProductsResult = await db.getAllProducts();
        
        // //
        this.randomProducts = [];
        const randomNumbers = tools.getUniqueRandomNumbers(0, allProductsResult.length - 1, 3);
        randomNumbers.forEach((i) => {
            this.randomProducts.push( { id: allProductsResult[i].id, name: allProductsResult[i].name, price: this.formatMoney(allProductsResult[i].color[0].money), image: db.getAPI_URL() + allProductsResult[i].color[0].img, favoriteCount: allProductsResult[i].favorite.length } );
        })

        //
        const latestFavorites = allProductsResult
            .sort((a, b) => b.favorite.length - a.favorite.length) // Sort by favorite count, descending
            .slice(0, 3); // Get the top 3 objects

        this.favoriteProducts = [];
        latestFavorites.forEach((i) => {
            this.favoriteProducts.push({ id: i.id, name: i.name, price: this.formatMoney(i.color[0].money), image: db.getAPI_URL() + i.color[0].img, favoriteCount: i.favorite.length });
        });

        await new Promise(resolve => setTimeout(resolve, 750));
        this.isLoaded = true;
    },
    methods: {
        formatMoney(money) {
            return tools.formatMoney(money);
        },
        handleClick(id) {
            this.$router.push('/product/' + id);
        }
    }
  };
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
  padding: 4px 14px;
  border-radius: 12px;
  margin-left: 14px; /* Add some space between the price and the label */
}
  .home-page {
    font-family: 'Poppins', Arial, sans-serif;
    color: #333;
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }
  
  /* Banner Section */
  .banner {
    position: relative;
    text-align: center;
    overflow: hidden;
    margin: 0 auto 40px;
    width: 85%; /* Reduced banner size to 70% of the screen width */
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .banner img {
    width: 100%;
    height: auto;
    filter: brightness(80%);
    border-radius: 15px;
  }
  
  .banner-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.7);
  }
  
  .banner-text h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }
  
  .banner-text p {
    font-size: 1.2rem;
  }
  
  /* Section Styling */
  .section {
    padding: 40px 20px;
  }
  
  .section h2 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 30px;
    color: #007bff;
    font-weight: bold;
  }
  
  /* Product List Styling */
  .product-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    justify-content: center;
  }
  
  .product-card {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .product-card:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .product-card img {
    max-width: 55%;
    border-radius: 8px;
    margin-bottom: 15px;
  }
  
  .product-card h3 {
    font-size: 1.5rem;
    margin: 10px 0;
    color: #333;
  }
  
  .product-card .price {
    font-size: 1.2rem;
    color: #007bff;
    font-weight: bold;
    margin: 10px 0;
  }
  
  .product-card .buy-now {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .product-card .buy-now:hover {
    background-color: #0056b3;
  }
  
  /* Highlighted Card for Most Favorites */
  .product-card.favorite {
    border: 2px solid #ff9800;
    box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
  }
  
  .product-card.favorite:hover {
    transform: scale(1.08);
    box-shadow: 0 8px 20px rgba(255, 152, 0, 0.4);
  }

  body.dark-mode .product-card {
    background-color: #333;
  }
  body.dark-mode .product-card h3 {
    color: white;
  }
  </style>
  