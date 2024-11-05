<template>
    <main>  
        <div class="product-detail">
            <div class="product-content">
                <div class="image-gallery">
                    <img :src="currentImg" alt="{{ product.name }}" class="main-image" />
                    <div class="thumbnail-container">
                        <img v-for="(color, index) in product.color" :key="index" :src="getURLImage(color.img)" alt="Thumbnail" class="thumbnail" @click="updateImage(color.img)" />
                    </div>
                </div>
                <div class="product-info">
                    <h2>{{ product.name }}</h2>
                    <h4>Giá: {{ moneyProduct }} VND</h4>

                    <div class="color-selector">
                        <h3 style="margin-right: 20px;">Chọn màu sắc:</h3>
                        <div class="colors">
                            <span 
                            v-for="(color, index) in product.color" 
                            :key="index" 
                            class="color-swatch" 
                            :style="{ backgroundColor: getColor(color.name) }" 
                            @click="selectColor(color)"
                            :class="{ selected: selectedColor === color.name }">
                            </span>
                        </div>
                    </div>

                    <div class="quantity-selector">
                        <h3 style="margin-right: 20px;">Số lượng:</h3>
                        <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
                        <input type="number" v-model="quantity" min="1" readonly />
                        <button @click="increaseQuantity" :disabled="quantity >= product.quantity">+</button>
                    </div>

                    <div class="total-money">
                        <h3>Tổng tiền: {{ totalMoney }} VND</h3>
                    </div>
                    
                    <button class="add-to-cart" @click="addToCart()">Thêm vào giỏ hàng</button>

                    <h2>Mô tả sản phẩm</h2>
                    <p class="description">
                        {{ product.description }}
                    </p>
                </div>
            </div>
        </div>
     </main>
 </template>
 
 <script>

import db from '../api/db';
import tools from '../api/tools';

export default {
     // nhận giá trị từ cha props:['bientruyen']
    //  props:['product']
    data() {
        return {
            product:{
                
            },
            selectedColor: null, // Store the selected color
            quantity: 1,
            currentImg: null,
            isLoggedIn: false,
        }
    },
    async mounted() {
        let id = this.$route.params.id;
        // db
        const data = await db.getProduct(id);
        this.product = data;

        // format money
        this.updateImage(this.product.main_img);

        // is logged in
        const user = JSON.parse(localStorage.getItem("user"));
        if (user != null) {
            const u = await db.getUser(user.password, user.password);

            if (u != null) {
                this.isLoggedIn = true;
            }
        }
    },
    computed: {
        moneyProduct() {
            if (this.product.money == undefined) {
                return '0';
            }
            return tools.formatMoney(this.product.money);
        },
        totalMoney() {
            return tools.formatMoney(parseInt(this.product.money) * this.quantity);
        },
    },
    methods: {
        getURLImage(image) {
            return db.getAPI_URL() + image;
        },
        selectColor(color) {
            this.selectedColor = color.name;
            this.updateImage(color.img);
        },
        updateImage(image) {
            this.currentImg = this.getURLImage(image);
        },
        getColor(color) {
            return tools.getColor(color);
        },
        increaseQuantity() {
            this.quantity++;
        },
        decreaseQuantity() {
            if (this.quantity > 1) {
                this.quantity--; 
            }
        },
        addToCart() {
            
            if (!this.isLoggedIn) {
                this.$router.push('/login'); // Redirect to login page
            } else {
                // Proceed with adding to cart
                // Your logic to add the product to the cart
                
            }
        },
    }
 }
</script>
 
<style scoped>
.color-selector {
    display: flex;                /* Use flexbox for layout */
    align-items: center;         /* Vertically center items */
    margin-bottom: 20px;         /* Space below the color selector */
}

.color-selector h3 {
    margin: 0;                   /* Remove default margins */
    margin-right: 10px;          /* Add space between heading and swatches */
}

.colors {
    display: flex;               /* Align color swatches in a row */
    gap: 10px;                  /* Adds space between swatches */
}

.color-swatch {
    width: 30px;                /* Fixed width for color swatches */
    height: 30px;               /* Fixed height for color swatches */
    border-radius: 50%;         /* Make swatches circular */
    cursor: pointer;            /* Change cursor to pointer on hover */
    border: 2px solid transparent; /* Border for the selected state */
    transition: border-color 0.3s; /* Smooth transition for border color */
}

.color-swatch.selected {
    border-color: #000;         /* Change border color for the selected swatch */
}

/* General Styles */
.product-detail {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f4;
    padding: 20px;
}

/* Flexbox layout for product content */
.product-content {
    display: flex;
    flex-direction: column; /* Stacks elements on small screens */
    max-width: 1200px;
    margin: auto;
}

/* Image gallery styles */
.image-gallery {
    margin-bottom: 20px; /* Space below image gallery on mobile */
}

.main-image {
    width: 100%; /* Full width for main image */
    max-width: 600px; /* Max width for larger screens */
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.thumbnail-container {
    display: flex;
    margin-top: 10px;
    justify-content: center;
    flex-wrap: wrap; /* Wrap thumbnails on smaller screens */
}

.thumbnail {
    width: 70px;
    height: 70px;
    border-radius: 5px;
    margin-right: 10px;
    cursor: pointer;
    transition: transform 0.2s;
}

.thumbnail:hover {
    transform: scale(1.1);
    border: 2px solid #4CAF50;
}

/* Product information styles */
.product-info {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Responsive typography and margins */
.product-info h2 {
    color: #333;
    font-size: 24px; /* Base font size */
}

.description {
    font-size: 16px;
    color: #555;
    margin: 15px 0;
}

/* Button styles */
.add-to-cart {
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 15px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%; /* Full width for mobile */
}

.add-to-cart:hover {
    background-color: #45a049;
}

/* Quantity selector styles */
.quantity-selector {
    display: flex;
    align-items: center;
}

.quantity-selector button {
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.quantity-selector button:disabled {
    background-color: #ccc; /* Gray out button when disabled */
    cursor: not-allowed;
}

.quantity-selector input {
    width: 50px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin: 0 10px; /* Space between buttons and input */
    font-size: 16px; /* Input font size */
}

/* Responsive design for screens larger than 600px */
@media (min-width: 600px) {
    .product-content {
        flex-direction: row; /* Side-by-side layout */
    }

    .image-gallery {
        flex: 1;
        margin-right: 20px; /* Space between image and product info */
    }

    .product-info {
        flex: 1;
    }

    /* Adjust font sizes for larger screens */
    .product-info h2 {
        font-size: 28px;
    }

    .description {
        font-size: 18px;
    }

    /* Responsive button sizes */
    .add-to-cart {
        padding: 12px; /* Slightly smaller padding on larger screens */
    }
}

/* Responsive design for screens larger than 900px */
@media (min-width: 900px) {
    .main-image {
        max-width: 100%; /* Allow main image to scale fully */
    }

    .thumbnail {
        width: 80px; /* Increase thumbnail size for larger screens */
        height: 80px;
    }
}
</style>
