import CryptoJS from "crypto-js";

const API_URL = "http://127.0.0.1:5000";

export default {
    getAPI_URL() {
        return API_URL;
    },
    randomStr(length) {
      return Math.random().toString(36).substring(2, 2 + length);
    },
  // Get all products
  async getAllProducts() {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error("Failed to fetch products");
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return null; // Return an object with error
    }
  },

  // Get a single product by ID
  async getProduct(productId) {
    if (!productId) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/products/?id=${productId}`);
      if (!response.ok) throw new Error(`Failed to fetch product with ID ${productId}`);
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // Modify a product by ID
  async modifyProduct(productId, updatedProduct) {
    if ((!productId) || (!updatedProduct)) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) throw new Error(`Failed to update product with ID ${productId}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // Add a new user
  async addUser(newUser) {
    if ((!newUser) || (newUser.password == undefined)) {
      return null;
    }

    newUser.password = CryptoJS.MD5(newUser.password).toString();
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error("Failed to add user");
      return await response.json();
    } catch (error) {
      console.error("Error adding user:", error);
      return null;
    }
  },

  // Create new cart by userId
  async createCart(userId) {
    if (!userId) {
      return null;
    }
    try {
      const cartData = {
        id: userId,
        carts: []
      };
      const response = await fetch(`${API_URL}/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartData),
      });
      if (!response.ok) throw new Error("Failed to create cart");
      await response.json();
    } catch (error) {
      console.error("Error creating cart:", error);
      return null;
    }
  },

  async isExistUser(username) {
    if (!username) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/users?username=${username}`);
      if (!response.ok) throw new Error(`Failed to fetch user`);
      const data = await response.json();
      if (data.length == 0) {
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async resetPasswordUser(username, email) {
    if ((!username) || (!email)) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/users?username=${username}&email=${email}`);
      if (!response.ok) throw new Error(`Failed to fetch user`);
      const data = await response.json();
      if (data.length == 0) {
        return null;
      }

      let password = this.randomStr(8);
      if (data[0].password != undefined) {
        data[0].password = password;
        this.updateUser(data[0]);
      }
      return password;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // Get a user by username
  async getUser(username, password) {
    if ((!username) || (!password)) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/users?username=${username}&password=${password}`);
      if (!response.ok) throw new Error(`Failed to fetch user`);
      const users = await response.json();

      return users.length > 0 ? users[0] : null; // Return the first user found or null if none
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async loginUser(username, password) {
    if ((!username) || (!password)) {
      return null;
    }
    password = CryptoJS.MD5(password).toString();
    try {
      const response = await fetch(`${API_URL}/users?username=${username}&password=${password}`);
      if (!response.ok) throw new Error(`Failed to fetch user`);
      const users = await response.json();

      return users.length > 0 ? users[0] : null; // Return the first user found or null if none
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // Add a product to the cart
  async addProductToCart(userId, productId, quantity) {
    if ((!userId) || (!productId) || (!quantity)) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity,
        }),
      });
      if (!response.ok) throw new Error("Failed to add product to cart");
      return await response.json();
    } catch (error) {
      console.error("Error adding product to cart:", error);
      return null;
    }
  },

  async updateCarts(id, updatedCarts) {
    if ((!id) || (!updatedCarts)) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/carts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carts: updatedCarts
        }),
      });
      if (!response.ok) throw new Error(`Failed to modify cart item with ID ${id}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // Delete a product from the cart by ID
  async deleteProductFromCart(cartId) {
    if (!cartId) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/carts/${cartId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Failed to delete cart item with ID ${cartId}`);
      return await response.json(); // Usually, it will return an empty object
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // Get a cart by UserID
  async getCartItemsByUserId(userId) {
    if (!userId) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/carts?id=${userId}`);
      if (!response.ok) throw new Error(`Failed to fetch cart items for user ID ${userId}`);
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async getAllAddress(userId) {
    if (!userId) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/users?id=${userId}`);
      if (!response.ok) throw new Error(`Failed to fetch information for user ID ${userId}`);
      const data = await response.json();
      return data[0].information;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // Add new Address by UserID
  async updateAddress(userId, address) {
    if ((!userId) || (!address)) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          information: address
        }),
      });
      if (!response.ok) throw new Error(`Failed to modify cart item with ID ${userId}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async updateUser(updatedUser) {
    const userId = updatedUser.id;
    updatedUser.password = CryptoJS.MD5(updatedUser.password).toString();
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH", // Use PATCH method for updating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
  
      if (!response.ok) throw new Error("Failed to update user");
      return await response.json(); // Return the updated user object
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  },
  
  // check voucher
  async checkVoucher(voucherCode) {
    if (!voucherCode) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/vouchers/?code=${voucherCode}`);
      if (!response.ok) throw new Error(`Failed to fetch voucher with code ${voucherCode}`);
      const data = await response.json();
      if (!data[0]) {
        return null;
      }
      if (data[0].count < 1) {
        return null;
      }
      return data[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async updateVoucher(updatedVoucher) {
    const voucherId = updatedVoucher.id;
    try {
      const response = await fetch(`${API_URL}/vouchers/${voucherId}`, {
        method: "PATCH", // Use PATCH method for updating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVoucher),
      });
  
      if (!response.ok) throw new Error("Failed to update user");
      return await response.json(); // Return the updated user object
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  },

  // using voucher
  async useVoucher(voucherCode) {
    if (!voucherCode) {
      return false;
    }
    try {
      let voucher = await this.checkVoucher(voucherCode);
      if (!voucher) {
        return false;
      }
      if (voucher.count > 0) {
        voucher.count--;
        this.updateVoucher(voucher);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  // Create order by userId
  async createOrder(userId) {
    if (!userId) {
      return null;
    }
    try {
      const orderData = {
        id: userId,
        orders: []
      };
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error("Failed to create cart");
      await response.json();
    } catch (error) {
      console.error("Error creating cart:", error);
      return null;
    }
  },

  // get Order by userId
  async getAllOrder(userId) {
    if (!userId) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/orders?id=${userId}`);
      if (!response.ok) throw new Error(`Failed to fetch information for user ID ${userId}`);
      const data = await response.json();
      if (!data[0]) {
        await this.createOrder(userId);
        return [];
      }
      return data[0].orders;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // get a order by orderId
  async getAOrder(userId, orderId) {
    if (!userId) {
      return null;
    }
    try {
      const data = await this.getAllOrder(userId);
      if (!data) {
        return null;
      }
      
      const order = data.filter((order) => order.id === orderId);
      if (!order) {
        return null;
      }

      return order[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // Add update Order by UserID
  async updateOrders(userId, orders) {
    if ((!userId) || (!orders)) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/orders/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orders: orders
        }),
      });
      if (!response.ok) throw new Error(`Failed to modify orders with ID ${userId}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // cancel a order by orderId
  async cancelOrder(userId, orderId) {
    if (!userId) {
      return false;
    }
    try {
      const data = await this.getAllOrder(userId);
      if (!data) {
        return false;
      }
      
      const order = data.filter((order) => order.id === orderId);
      if (!order) {
        return false;
      }

      const products = await this.getAllProducts();
      if (!products) {
        return false;
      }

      for (const order of data) {
        await (async () => { 
          if (order.id === orderId) {
            order.status = "Đã hủy";

            for (const i of order.products) {
              await (async () => { 
                const p = products.filter((j) => i.id === j.id);
                const pColor = p[0].color.filter((j) => j.name === i.color);
                pColor[0].quantity = pColor[0].quantity + i.quantity;
                
                await this.modifyProduct(i.id, p[0]);
              })();
            }
            
            return;
          }
        })();
      }

      const result = await this.updateOrders(userId, data);
      if (!result) {
        return false;
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async successPaymentOrder(userId, orderId) {
    if (!userId) {
      return false;
    }
    try {
      const data = await this.getAllOrder(userId);
      if (!data) {
        return false;
      }
      
      const order = data.filter((order) => order.id === orderId);
      if (!order) {
        return false;
      }

      data.forEach((order) => {
        if (order.id === orderId) {
          order.status = "Đang chờ xác nhận";
          return;
        }
      });

      const result = await this.updateOrders(userId, data);
      if (!result) {
        return false;
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  // Add new order by userId
  async addOrder(userId, newOrder) {
    if ((!userId) || (!newOrder)) {
      return null;
    }

    const allOrder = await this.getAllOrder(userId);
    if (!allOrder) {
      return null;
    }

    allOrder.push(newOrder);

    try {
      const response = await fetch(`${API_URL}/orders/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orders: allOrder
        }),
      });
      if (!response.ok) throw new Error(`Failed to modify cart item with ID ${userId}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
