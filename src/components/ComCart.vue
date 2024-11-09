<template>
    <div class="center">
        <div id="app" class="cart-container">
            <div class="cart-title">Giỏ hàng của bạn</div>

            <!-- Cart Items -->
            <div v-if="this.cartItems.length > 0">
                <div class="cart-item" v-for="(item) in this.cartItems" :key="item.id">
                    <input type="checkbox" style="margin-left: 25px; margin-right: 25px;" v-model="item.selected" @change="calcTotalPrice()">
                    <div class="item-details">
                        <img :src="item.img" :alt="item.name">
                        <div class="item-info">
                            <h4>{{ item.name }}</h4>
                            <p style="text-align: left;">Giá: {{ formatMoney(item.price) }} VND</p>

                            <div class="color-select">
                                <label for="color">Màu sắc: </label>
                                <div class="color-preview" :style="{ backgroundColor: item.hex }"></div>
                            </div>
                        </div>
                    </div>
                    <div class="quantity-control">
                        <button @click="decreaseQuantity(item.id, item.color)">-</button>
                        <input type="number" v-model="item.quantity" min="1" readonly>
                        <button @click="increaseQuantity(item.id, item.color)" :disabled="item.isDisabledIncrease">+</button>
                    </div>
                    <div class="price">{{ formatMoney(item.price * item.quantity) }} VND</div>
                    <button class="delete-btn" @click="removeItem(item.id, item.color)">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>

                <!-- Cart Summary -->
                <div class="cart-summary">
                    <p class="error-message" v-if="this.error.length > 0">{{ this.error }}</p>
                    <div class="summary-title">Tóm tắt đơn hàng</div>
                    <div class="total-price">Total: {{ formatMoney(totalPrice) }} VND</div>
                    <button class="checkout-btn" @click="proceedToCheckout()">Thanh toán</button>
                </div>
            </div>
            <div v-else class="no-items">Chưa có hàng</div>
        </div>
    </div>
</template>
  
<script>
import '@/styles/css/font-awesome.css';
import tools from '@/api/tools';
import db from '../api/db';

export default {
    data(){
        return{
            cartItems: [],
            selectedItem: 0,
            totalPrice: 0,
            error: '',
        }
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

        // get items from cart
        let infoCart = await db.getCartItemsByUserId(this.user.id);
        if (infoCart == undefined) {
            // create a new cart
            db.createCart(this.user.id);
            infoCart = {};
            infoCart.id = this.user.id;
            infoCart.carts = [];
        }

        this.cartItems = [];
        infoCart.carts.forEach(async(item) => {
            let cart = {};
            let {productId} = item;

            // get a product
            const data = await db.getProduct(productId);
            const API_URL = db.getAPI_URL();
            const color = data.color.find((c) => c.name === item.color);
            let isDisabledIncrease = false;

            if (color.quantity > 0) {
                if (item.quantity >= color.quantity) {
                    item.quantity = color.quantity;
                    isDisabledIncrease = true;
                }

                cart = { ...cart, id: data.id, name: data.name, img: API_URL + color.img, price: color.money, isDisabledIncrease: isDisabledIncrease, hex: tools.getColor(item.color) };

                // add cart into carts
                cart = {...item, ...cart, selected: false};
                this.cartItems.push(cart);
            }
        });
    },
    methods: {
        calcTotalPrice() {
            let selected = 0;
            let total = 0;
            this.cartItems.forEach((item) => {
                if (item.selected) {
                    total = total + (item.price * item.quantity);
                    selected = selected + 1;
                }
            })
            this.totalPrice = total;
            this.selectedItem = selected;
        },
        formatMoney(money) {
            return tools.formatMoney(money);
        },
        getItem(itemId, color) {
            const item = this.cartItems.find((item) => item.id === itemId && item.color === color);
            return item;
        },
        async getProductItemFromId(itemId) {
            const item = await db.getProduct(itemId);
            return item;
        },
        removeItem(itemId, color) {
            this.cartItems = this.cartItems.filter((i) => {
                return (i.productId == itemId && color == i.color) === false;
            });
            
            this.saveCarts();
        },
        decreaseQuantity(itemId, color) {
            const item = this.getItem(itemId, color);
            if (item.quantity > 1) {
                item.isDisabledIncrease = false;
                item.quantity--;

                this.saveCarts();
            } else {
                console.log(itemId, color);
                this.removeItem(itemId, color);
            }

            this.calcTotalPrice();
        },
        async increaseQuantity(itemId, color) {
            const item = this.getItem(itemId, color);
            const productItem = await this.getProductItemFromId(itemId);
            const colorItem = productItem.color.find((c) => c.name == color);

            if (colorItem) {
                if (item.quantity < colorItem.quantity) {
                    item.quantity++;
                    
                    this.saveCarts();
                }

                if (item.quantity == colorItem.quantity) {
                    item.isDisabledIncrease = true;
                }

                this.calcTotalPrice();
            } else {
                console.log('color item null');
            }
        },
        saveCarts() {
            const newCarts = [];
            this.cartItems.forEach((item) => {
                let newItem = {};
                newItem.productId = item.id;
                newItem.quantity = item.quantity;
                newItem.color = item.color;

                newCarts.push(newItem);
            });

            db.updateCarts(this.user.id, newCarts);
        },
        proceedToCheckout() {
            if (this.selectedItem > 0) {
                this.error = '';
            } else {
                this.error = 'Vui lòng chọn ít nhất 1 món hàng để thanh toán';
            }
        }
      }
  }
  </script>

  <style scoped>
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
.delete-btn {
    margin-right: 20px;
    background-color: #ff4d4f;
    color: white;
    border: none;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    width: 60px;
    justify-content: center;
}

.delete-btn i {
    font-size: 18px; /* Icon size */
}

.delete-btn:hover {
    background-color: #ff0000;
    transform: translateY(-2px);
}

.delete-btn:focus {
    outline: none;
}

.delete-btn:active {
    background-color: #e60000;
    transform: translateY(2px);
}

.no-items {
    font-size: 20px;
    font-weight: bold;
    color: #777;
    text-align: center;
    margin-top: 50px;
}

.center {
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    height: 100%; /* Full height of the parent (body) */
}

/* Basic styling for the body */
body {
    font-family: Arial, sans-serif;
    background-color: #f0f2f5;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: #333;
}

/* Main container styling */
.cart-container {
    width: 90%;
    max-width: 800px;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    animation: fadeIn 0.5s ease;
}

/* Title */
.cart-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #444;
    text-align: center;
}

/* Cart items styling */
.cart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    border-bottom: 1px solid #ddd;
    transition: background-color 0.3s ease;
}

.cart-item:hover {
    background-color: #f9f9f9;
}

/* Custom checkbox style */
.cart-item input[type="checkbox"] {
    accent-color: #28a745;
    transform: scale(1.5);
    cursor: pointer;
    margin-right: 10px;
}

/* Item details */
.item-details {
    display: flex;
    align-items: center;
    flex: 1;
}

.cart-item img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-right: 15px;
}

.item-info h4 {
    text-align: left;
    margin: 0;
    font-size: 18px;
    color: #333;
}

.item-info p {
    margin: 5px 0;
    color: #777;
}

/* Color selector */
.color-select {
    display: flex;
    align-items: center;
    margin-top: 10px;
}
.color-preview {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-left: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Quantity control */
.quantity-control {
    display: flex;
    align-items: center;
}

.quantity-control button {
    border: none;
    background-color: #ddd;
    font-size: 16px;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    outline: none;
}

.quantity-control button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.quantity-control button:hover:enabled {
    background-color: #bbb;
}

.quantity-control input {
    width: 50px;
    text-align: center;
    margin: 0 10px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

/* Price display */
.price {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    min-width: 100px;
    text-align: right;
    margin-right: 20px;
    margin-left: 15px;
}

/* Summary section */
.cart-summary {
    margin-top: 30px;
    text-align: center;
    padding-top: 20px;
}

.summary-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.total-price {
    font-size: 24px;
    color: #28a745;
    font-weight: bold;
}

/* Checkout button */
.checkout-btn {
    padding: 12px 25px;
    background-color: #28a745;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s;
}

.checkout-btn:hover {
    background-color: #218838;
}

/* Animation */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Media Query for Mobile Responsiveness */
@media (max-width: 650px) {
    /* Delete button adjustments */
    .delete-btn {
        font-size: 12px; /* Smaller font size */
        padding: 6px 12px; /* Smaller padding */
        width: 80px; /* Adjust button width */
    }

    .delete-btn i {
        font-size: 16px; /* Smaller icon */
    }

    .cart-container {
        width: 95%; /* Make the cart container take more width on small screens */
        padding: 15px; /* Reduce padding */
    }

    .cart-title {
        font-size: 22px; /* Smaller title font size */
    }

    .cart-item {
        flex-direction: column; /* Stack the items vertically */
        align-items: flex-start; /* Align items to the left */
    }

    .cart-item img {
        width: 60px; /* Smaller image */
        height: 60px; /* Smaller image */
    }

    .item-info h4 {
        font-size: 16px; /* Smaller font for item names */
    }

    .price {
        font-size: 16px; /* Smaller price font */
    }

    .checkout-btn {
        padding: 10px 20px; /* Smaller checkout button */
    }

    .summary-title {
        font-size: 18px; /* Smaller summary title */
    }

    .total-price {
        font-size: 20px; /* Smaller total price */
    }
}

  </style>