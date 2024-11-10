<template>
  <body>
  <header>
    <h1 v-if="this.searchQuery && this.searchQuery.length > 0">{{ "KẾT QUẢ TÌM KIẾM: " + this.searchQuery }}</h1>
    <h1 v-else>TẤT CẢ SẢN PHẨM</h1>
    
    <div class="price-filter">
      <label for="minPrice">Giá từ (VND):</label>
      <input type="number" v-model="minPrice" id="minPrice" placeholder="Giá" />
      
      <label for="maxPrice">Giá đến (VND):</label>
      <input type="number" v-model="maxPrice" id="maxPrice" placeholder="Giá" />
    </div>
  </header>
  
  <div v-if="this.filteredProducts.length > 0" class="product-container">
    <Product v-for="item in paginatedProducts" :key="item.id" :product="item" />
  </div>
  <div v-else class="no-products">
    <p>🛒 Không tìm thấy sản phẩm nào. Hãy thử tìm kiếm lại nhé!</p>
  </div>

  <div v-if="this.filteredProducts.length > 0" class="pagination">
    <button @click="goToPage(1)" v-if="totalPages > 1" :disabled="currentPage === 1">&laquo;</button>
    <button @click="prevPage" v-if="totalPages > 1" :disabled="currentPage === 1">&lt;</button>

    <button 
      v-for="page in totalPagesArray" 
      :key="page" 
      @click="goToPage(page)" 
      :class="{ active: currentPage === page }"
    >
      {{ page }}
    </button>

    <button @click="nextPage" v-if="totalPages > 1" :disabled="currentPage === totalPages">&gt;</button>
    <button @click="goToPage(totalPages)" v-if="totalPages > 1" :disabled="currentPage === totalPages">&raquo;</button>
  </div>
</body>
</template>

<script>
import Product from './ComProduct.vue'
import db from '@/api/db'

export default {
  name: 'ComHome',
  components: {
    Product
  },
  data() {
    return {
      products: [],
      filteredProducts: [],  
      currentPage: 1,        
      itemsPerPage: 8,       
      searchQuery: '',
      minPrice: null,
      maxPrice: null, 
      isDarkMode: false,
    }
  },
  computed: {
    filteredAndPricedProducts() {
      return this.filteredProducts.filter(product => {
        const price = product.color[0].money; 
        const withinMinPrice = this.minPrice ? price >= this.minPrice : true;
        const withinMaxPrice = this.maxPrice ? price <= this.maxPrice : true;
        return withinMinPrice && withinMaxPrice;
      });
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredAndPricedProducts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredAndPricedProducts.length / this.itemsPerPage);
    },
    totalPagesArray() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
  },
  methods: {
    handleStorageChange(event) {
      // If the theme is changed in localStorage, update the theme
      if (event.key === 'theme') {
        this.isDarkMode = event.newValue === 'dark';
        this.updateTheme();
      }
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    goToPage(page) {
      this.currentPage = page;
    },
    filterProducts(query) {
      if (!query) {
        this.filteredProducts = this.products;  
      } else {
        this.filteredProducts = this.products.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase())
        );
      }
    }
  },
  created() {
    // Listen to the storage event for theme changes in other tabs/windows
    
  },
  async mounted() {
    const allProductsResult = await db.getAllProducts();
    this.products = allProductsResult;
    this.filteredProducts = allProductsResult;  

    this.searchQuery = this.$route.query.search;
    if (this.searchQuery) {
      this.filterProducts(this.searchQuery);
    }

    document.title = "Trang chủ | KhanhStore";
  },

  watch: {
    '$route.query.search'(newSearchQuery) {
      this.searchQuery = newSearchQuery;
      if (this.searchQuery != '') {
        this.currentPage = 1;
      }
      this.filterProducts(newSearchQuery);
    }
  }
}
</script>

<style scoped>
.price-filter {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.price-filter label {
  font-size: 16px;
  font-weight: bold;
}

.price-filter input {
  padding: 5px;
  font-size: 14px;
  width: 100px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.price-filter button {
  padding: 6px 12px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.price-filter button:hover {
  background-color: #45a049;
}

.no-products {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px; /* Adjust the height as needed */
  font-size: 18px;
  color: #333;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
  padding: 20px;
  flex-direction: column;
}

.no-products p {
  margin: 0;
  font-weight: bold;
  color: #555;
}

.no-products p span {
  font-size: 24px; /* Larger emoji */
  margin-bottom: 10px;
}
header {
  background-color: #4f4f4f;
  color: white;
  padding: 20px;
  text-align: center;
}

body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
}

.product-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 30px;
}

.pagination button {
  margin: 0 5px;
  padding: 8px 12px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background-color: #ddd;
  color: #333;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.pagination button.active {
  background-color: #4f4f4f;
  color: white;
}

.pagination button:hover {
  background-color: #bbb;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination button.active:hover {
  background-color: #4f4f4f;
}
</style>
