<template>
    <div v-if="cart.length > 0" class="modal-content">
                      <table style="width: 100%;" class="text-center table">
                          <tr>
                              <th>HÌNH</th>
                              <th>SẢN PHẨM</th>
                              <th>Đơn giá</th>
                              <th>Số lượng</th>
                              <th>Tiền</th>
                              <th></th>
                          </tr>
                          <!-- dùng v-for thể hiện giỏ hàng -->
                          <tr v-for="item in cart" :key="item.id">
                              <td><img :src="item.image" style="height: 100px;width: 100px;"></td>
                              <td class="align-middle">{{item.name}}</td>
                              <td class="align-middle">{{item.price}}</td>
                              <td class="align-middle">
                                <button @click="decreaseQuantity(item)">-</button>
                                {{item.quantity}}
                                <button @click="increaseQuantity(item)">+</button>
                                </td>
                              <td class="align-middle">
                                {{item.price*item.quantity}}
                            </td>
                              <td class="align-middle"><button class="btn btn-danger" @click="removeCart(item)" >Remove
                                      {{ item.id }}</button></td>
                          </tr>
                          <tr>
                              <th>
                              </th>
                              <th></th>
                              <th>Tổng tiền</th>
                              <th>{{ tongSoLuong }}</th>
                              <th>
                                  {{ tongTien }}
                              </th>
                              <th><button class="btn btn-danger" @click="removeAllCart()">Xóa hết : !</button>
                              </th>
                          </tr>
                      </table>
                  </div>
    <p v-else> CHƯA CÓ HÀNG </p>
  </template>
  
<script>
import db from '../api/db';
export default {
    data(){
        return{
            
            cart: db.getCartItemsByUserId(1)
        }
    },
    async created() {
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
        }
    },
      computed: {
        // tongTien() {
        //     return this.cart.reduce((total, item) => total += total + (item.price * item.quantity), 0);
        // },
        // tongSoLuong() {
        //     return this.cart.reduce((total, item) => total += total + item.quantity, 0);
        // }
      },
      methods: {
        // increaseQuantity(item) {
        //     let i = items.find(i => i.id === item.id);
        //     if (item.quantity < i.quality) {
        //         item.quantity++;
        //     }
        // },
        // decreaseQuantity(item) {
        //     if (item.quantity > 1) {
        //         item.quantity--;
        //     } else {
        //         this.removeCart(item);
        //     }
        // },
        // removeCart(i) {
        //     this.cart = this.cart.filter(item => item.id != i.id);
        // },
        // removeAllCart() {
        //     this.cart = [];
        // }
      }
  }
  </script>

  <style>
  
  </style>