<template>
    <header>
      <h1>TẤT CẢ SẢN PHẨM</h1>
    </header>
    
    <div class="product-container">
      <Product v-for="item in products" :key="item.id" :product="item"/>
    </div>
</template>

<script>
import Product from './ComProduct.vue'
import db from '../api/db'
export default {
    name:'ComHome',
    components:{
      Product
    },
    data(){
      return{
        products: []
      }
    },
    async mounted() {
      const allProductsResult = await db.getAllProducts();
      this.products = allProductsResult; // Assign the product list
    },
}
</script>

<style scoped>
header {
    background-color: #4f4f4f;
    color: white;
    padding: 20px;
    text-align: center;
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
</style>