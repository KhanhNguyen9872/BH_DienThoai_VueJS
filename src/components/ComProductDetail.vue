<template>
    <Loading v-if="!this.isLoaded"/>
    <main>
        <!-- Overlay and Popup -->
        <div v-if="isShowPopup" class="overlay">
            <div class="popup">
                <button class="btn-close" @click="closePopup">×</button>
                <h2>Đã thêm thành công</h2>
                <p>Sản phẩm của bạn đã được thêm vào giỏ hàng</p>
                <div class="button-group">
                <button class="btn" @click="closePopup">Tiếp tục mua sắp</button>
                <button class="btn go-to-cart" @click="goToCart">Đi tới giỏ hàng</button>
                </div>
            </div>
        </div>

        <div class="product-detail">
            <div v-if="this.isNotFoundProduct" class="product-not-found">
                <div class="icon">
                    <i class="fas fa-box-open"></i>
                </div>
                <h2>Sản phẩm không tồn tại</h2>
                <p>Rất tiếc, sản phẩm bạn đang tìm kiếm không tồn tại hoặc không còn nữa.</p>
                <router-link to="/" class="back-home">Quay về trang chủ</router-link>
            </div>
            <div v-else class="product-content">
                <div class="image-gallery">
                    <img :src="currentImg" alt="{{ product.name }}" class="main-image" />
                    <div class="thumbnail-container">
                        <img v-for="(color, index) in product.color" :key="index" :src="getURLImage(color.img)" alt="Thumbnail" class="thumbnail" @click="updateImage(color.img)" />
                    </div>
                </div>
                <div class="product-info">
                    <h2>{{ product.name }}</h2>
                    
                    <div v-if="this.selectedColor !== null && this.totalM !== this.currentMoney">
                        <h4 style="text-decoration: line-through;">Giá: {{ this.formatMoney(totalM) }} VND</h4>
                        <h4 style="color: red">Giảm còn: {{ this.formatMoney(currentMoney) }} VND</h4>
                    </div>
                    <div v-else>
                        <h4 v-if="this.selectedColor !== null">Giá: {{ this.formatMoney(currentMoney) }} VND</h4>
                    </div>
                    <h4 v-if="this.selectedColor !== null">Hiện còn: {{ this.product.quantity || 0 }} sản phẩm</h4>

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
                        <button @click="decreaseQuantity" :disabled="currentQuantity <= 0 || this.selectedColor == null">-</button>
                        <input type="number" v-model="currentQuantity" min="1" readonly />
                        <button @click="increaseQuantity" :disabled="currentQuantity >= product.quantity || this.selectedColor == null">+</button>

                        <!-- Favorites Button -->
                        <button
                            class="favorites-button"
                            :class="{ active: isFavorite }"
                            @click="addToFavorites"
                            >
                            ❤️ {{ this.favoriteCount }}
                        </button>
                    </div>

                    <div class="total-money">
                        <h3>Tổng tiền: {{ totalMoney }} VND</h3>
                    </div>
                    
                    <p class="error-message" v-if="this.error.length > 0">{{ this.error }}</p>
                    <button v-if="this.selectedColor === null || this.product.quantity > 0" class="add-to-cart" @click="addToCart()">Thêm vào giỏ hàng</button>
                    <button v-else class="out-of-stock" disabled>Đã hết hàng</button>
                    <hr style="margin-top: 30px;">
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
 import Loading from './ComLoading';
import db from '@/api/db';
import tools from '@/api/tools';

export default {
    components: {
        Loading
    },
    data() {
        return {
            product:{},
            selectedColor: null, // Store the selected color
            currentQuantity: 0,

            currentImg: null,
            totalM: 0,
            currentMoney: 0,
            userId: -1,
            isLoggedIn: false,
            error: '',
            isPopupVisible: false,
            isNotFoundProduct: false,
            isShowPopup: false,
            isLoaded: false,
            isFavorite: false,
            favoriteCount: 0,
        }
    },
    async mounted() {
        let id = this.$route.params.id;
        // db
        const data = await db.getProduct(id);
        if (data == undefined) {
            this.isNotFoundProduct = true;
            this.isLoaded = true;
            return;
        }

        this.product = data;

        // format money
        this.updateImage(this.product.color[0].img);
        this.updateMoney(this.product.color[0].money, null);

        this.favoriteCount = this.product.favorite.length;

        this.colorQuery = this.$route.query.color;
        if (this.colorQuery) {  
            const color = this.product.color.find((i) => i.name === this.colorQuery);
            if (color) {
                this.selectColor(color);
            }
        }

        // is logged in
        const user = localStorage.getItem("accessToken");
        if (user != null) {
            const u = await db.getUser(user);

            if (u != null) {
                this.userId = u.id;
                this.isLoggedIn = true;

                this.product.favorite.forEach((i) => {
                    if (i === this.userId) {
                        this.isFavorite = true;
                        return;
                    }
                });
            }
        }

        document.title = this.product.name + " | KhanhStore";
        this.isLoaded = true;        
    },
    computed: {
        totalMoney() {
            return this.formatMoney(parseInt(this.currentMoney) * this.currentQuantity);
        },
    },
    methods: {
        async addToFavorites() {
            if (!this.isLoggedIn) {
                localStorage.removeItem('accessToken');
                const data = { productId: this.product.id, error: "Vui lòng đăng nhập trước khi yêu thích sản phẩm!" };
                this.$router.push({ name: 'Login', query: data}); // Redirect to login page
            } else {
                if (!this.isFavorite) {
                    this.product.favorite.push(this.userId);
                    this.favoriteCount++;
                    await db.addFavorite(this.product.id, this.userId);
                } else {
                    this.product.favorite = this.product.favorite.filter((i) => i !== this.userId);
                    this.favoriteCount--;
                    await db.removeFavorite(this.product.id, this.userId);
                }
                
                this.isFavorite = !this.isFavorite;
            }
        },
        formatMoney(money) {
            if (money) {
                return tools.formatMoney(money);
            }
            return '0';
        },
        closePopup() {
            this.isShowPopup = false;
        },
        showPopup() {
            this.isShowPopup = true;
        },
        goToCart() {
            this.$router.push('/cart');
        },
        getURLImage(image) {
            return db.getAPI_URL() + image;
        },
        selectColor(color) {
            this.selectedColor = color.name;
            this.product.quantity = color.quantity;
            if (this.currentQuantity > this.product.quantity) {
                this.currentQuantity = 0;
            }
            this.updateImage(color.img);
            this.updateMoney(color.money, color.moneyDiscount);
        },
        updateImage(image) {
            this.currentImg = this.getURLImage(image);
        },
        updateMoney(money, moneyDiscount) {
            this.totalM = money;
            this.currentMoney = moneyDiscount || money;
        },
        getColor(color) {
            return tools.getColor(color);
        },
        increaseQuantity() {
            this.currentQuantity++;
        },
        decreaseQuantity() {
            if (this.currentQuantity > 0) {
                this.currentQuantity--; 
            }
        },
        async addToCart() {
            if (!this.isLoggedIn) {
                localStorage.removeItem('accessToken');
                const data = { productId: this.product.id, error: "Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng!" };
                this.$router.push({ name: 'Login', query: data}); // Redirect to login page
            } else {
                if (this.selectedColor == null) {
                    this.error = 'Vui lòng chọn màu sắc';
                    return;
                }

                if (this.currentQuantity < 1) {
                    this.error = 'Vui lòng chọn số lượng';
                    return;
                }

                this.error = "";
                
                let infoCart = await db.getCartItemsByUserId(this.userId);
                if (infoCart == undefined) {
                    infoCart = {};
                    infoCart.id = this.userId;
                    infoCart.carts = [];
                }
                const cartItems = infoCart.carts;

                const cart = cartItems.find((item) => {
                    return item.productId == this.product.id && this.selectedColor == item.color;
                });

                if (cart == undefined) {
                    let newCart = {productId: this.product.id, quantity: this.currentQuantity, color: this.selectedColor};
                    db.addCart(newCart);
                } else {
                    //
                    if ((cart.quantity + this.currentQuantity) > this.product.quantity) {
                        this.error = 'Bạn đã có ' + cart.quantity + ' sản phẩm trong giỏ hàng. Không thể thêm số lượng đã chọn vào giỏ hàng vì sẽ vượt quá giới hạn mua hàng của bạn!';
                        return;
                    }

                    cart.quantity = cart.quantity + this.currentQuantity;
                }

                this.currentQuantity = 0;
                this.selectedColor = null;

                this.showPopup();
            }
        },
    }
 }
</script>
 
<style scoped>
.product-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 60vh;
  background-color: #f7f9fc;
  padding: 2rem;
  color: #333;
  font-family: Arial, sans-serif;
}

body.dark-mode .product-not-found {
    background-color: #333;
}

.product-not-found .icon {
  font-size: 4rem;
  color: #ff6b6b;
  margin-bottom: 1rem;
}

.product-not-found h2 {
  font-size: 2rem;
  color: #444;
  margin: 0.5rem 0;
}

body.dark-mode .product-not-found h2 {
    color: #ffffff;
}

.product-not-found p {
  color: #666;
  font-size: 1rem;
  max-width: 400px;
}

body.dark-mode .product-not-found p {
    color: #d3d3d3;
}

.back-home {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  background-color: #4a90e2;
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.back-home:hover {
  background-color: #357abf;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .popup {
    background: white;
    width: 300px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    text-align: center;
    transform: translateY(-20px);
    opacity: 0;
    transition: all 0.3s ease;
  }
    body.dark-mode .popup {
        background: #6e6e6e;
    }
  .overlay .popup {
    transform: translateY(0);
    opacity: 1;
  }
  .popup h2 {
    margin-top: 0;
    color: #4CAF50;
  }
  body.dark-mode .popup h2 {
    color: #61e166;
    }
  .popup p {
    color: #333;
  }
  body.dark-mode .popup p {
    color: #000000;
    }
  .popup .btn-close {
    background: none;
    border: none;
    font-size: 16px;
    color: #999;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .popup .btn-close:hover {
    color: #666;
  }
  .button-group {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 15px;
  }
  .btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  }
  .btn:hover {
    background-color: #45a049;
  }
  .go-to-cart {
    background-color: #FF5722;
  }
  .go-to-cart:hover {
    background-color: #E64A19;
  }

.out-of-stock {
  background-color: #D32F2F; /* Red color for out of stock */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: not-allowed;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  opacity: 0.9;
  transition: opacity 0.3s;
}

.out-of-stock:hover {
  opacity: 1; /* Slight increase in opacity on hover */
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

.color-selector {
    display: flex;                /* Use flexbox for layout */
    align-items: center;         /* Vertically center items */
    margin-bottom: 20px;         /* Space below the color selector */
}

.color-selector h3 {
    margin: 0;                   /* Remove default margins */
    margin-right: 10px;          /* Add space between heading and swatches */
}

body.dark-mode .color-selector h3 {
    color: #02002e;
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
    border-color: #c5c5c5;
    border-width: 4px; /* Increase the border width */
}

.color-swatch.selected {
    border-color: #ff0000;         /* Change border color for the selected swatch */
}

/* General Styles */
.product-detail {
    font-family: 'Arial', sans-serif;
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
    max-height: 450px; /* Adjust this value to control the maximum height */
    object-fit: contain; /* This will keep the image aspect ratio */
    border-radius: 10px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
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
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
}

body.dark-mode .product-info {
    background: #6a6a6a;
}

/* Responsive typography and margins */
.product-info h2 {
    color: #333;
    font-size: 24px; /* Base font size */
}

body.dark-mode .product-info h2 {
    color: #000000;
}

body.dark-mode .product-info h4 {
    color: #000000;
}

.description {
    font-size: 16px;
    color: #555;
    margin: 15px 0;
}

body.dark-mode .description {
    color: #e6e6e6;
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

body.dark-mode .quantity-selector h3 {
    color: #02002e;
}

.quantity-selector .favorites-button {
  margin-left: auto;
  background-color: #fff; /* Default white color */
  color: #ff4081; /* Default pink text color */
  font-weight: bold;
  border: 1px solid #ff4081;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.quantity-selector .favorites-button.active {
  background-color: #ff4081; /* Pink when active */
  color: white; /* White text when active */
}

.quantity-selector .favorites-button:hover {
  background-color: #e91e63;
  color: white;
  transform: scale(1.1);
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

body.dark-mode .quantity-selector button {
    color: #000000;
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

body.dark-mode .quantity-selector input {
    background: #7b7b7b;
}

.total-money {
    color: #000000;
}

body.dark-mode .total-money h3 {
    color: #83ff81;
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
