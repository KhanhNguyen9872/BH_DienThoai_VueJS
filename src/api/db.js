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
      const response = await fetch(`${API_URL}/products/${productId}`);
      if (!response.ok) throw new Error(`Failed to fetch product with ID ${productId}`);
      const data = await response.json();

      return data;
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
  async addAccount(newUser) {
    if ((!newUser) || (newUser.password == undefined)) {
      return null;
    }

    newUser.password = CryptoJS.MD5(newUser.password).toString();
    try {
      const response = await fetch(`${API_URL}/accounts`, {
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

  async addFavorite(productId, userId) {
    if ((!productId) || (!userId)) {
      return null;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/products/${productId}/favorite`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      });
      if (!response.ok) throw new Error("Failed to favorite product");
      return await response.json();
    } catch (error) {
      console.error("Error favorite product:", error);
      return null;
    }
  },

  async removeFavorite(productId, userId) {
    if ((!productId) || (!userId)) {
      return null;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/products/${productId}/favorite`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      });
      if (!response.ok) throw new Error("Failed to delete favorite product");
      return await response.json();
    } catch (error) {
      console.error("Error delete favorite product:", error);
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
      const response = await fetch(`${API_URL}/accounts/forgot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email
        }),
      });
      if (!response.ok) throw new Error(`Failed to fetch user`);
      const data = await response.json();

      return data.newPassword;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // Get a user by username
  async getUser(accessToken) {
      if (!accessToken) {
          return null;
      }

      try {
          const response = await fetch(`${API_URL}/user`, { // Correct endpoint and method
              method: 'GET',  // Use GET
              headers: {
                  'Authorization': `Bearer ${accessToken}` // Include the token
              }
          });

          if (!response.ok) {
              if (response.status === 401 || response.status === 403) {
                  // Token is invalid or expired
                  console.warn("Token invalid:", response.status);
                  return null; // Or redirect to login
              }
              throw new Error(`Failed to fetch user: ${response.status}`); // General error
          }

          const data = await response.json(); // Assuming your server returns JSON

          if (data) {
              return data; // Return the user object
          } else {
              console.warn("No user data in response:", data);
              return null; // Handle case where user data is missing
          }

      } catch (error) {
          console.error("Error fetching user:", error);
          return null;
      }
  },
  async loginUser(username, password) {
    if ((!username) || (!password)) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/accounts/auth`, { // Changed to /auth endpoint
        method: 'POST', // Changed to POST
        headers: {
          'Content-Type': 'application/json' // Important!
        },
        body: JSON.stringify({ // Send username and hashed password in the body
          username: username,
          password: password // send normal password
        })
      });

      if (!response.ok) {
        // Handle different error status codes appropriately
        if (response.status === 401) {
          throw new Error('Invalid credentials');
        } else if (response.status === 403) {
          return { lock: true };
        }
        else {
          throw new Error(`Login failed with status: ${response.status}`);
        }
      }

      const data = await response.json();
      if (data && data.accessToken) {
        // Login successful: return the access token
        return { accessToken: data.accessToken, lock: false };
      } else {
        // Login failed (but the server didn't return an error status)
        console.warn("Login was successful but didn't return accessToken", data);
        return null; // Or handle this case as appropriate
      }
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
  async addAddress(address) {
    if (!address) {
      return null;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/address`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });
      if (!response.ok) throw new Error(`Failed to add address`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async deleteAddress(id) {
    if (!id) {
      return null;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/address/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Failed to delete address`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // Add new Address by UserID
  async updateAddress(id, address) {
    if (!id || !address) {
      return null;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/address/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });
      if (!response.ok) throw new Error(`Failed to update address`);
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

  async changePassword(oldPassword, newPassword) {
    if (!oldPassword || !newPassword) {
      return null;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/accounts/password`, {
        method: "PUT", // Use PATCH method for updating
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword
        }),
      });
  
      if (!response.ok) throw new Error("Failed to update password");
      return await response.json(); // Return the updated user object
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  },
  
  // check voucher
  async checkVoucher(userId, voucherCode) {
    if ((!userId) || (!voucherCode)) {
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

      let isAllowed = false;
      if (data[0].limit.length > 0) {
        for(const id of data[0].limit) {
          if (id === userId) {
            isAllowed = true;
            break;
          }
        }
      } else {
        isAllowed = true;
      }

      for(const id of data[0].usedId) {
        if (id === userId) {
          return null;
        }
      }

      if (isAllowed) {
        return data[0];
      }
      
      return null;
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
  async useVoucher(userId, voucherCode) {
    if ((!userId) || (!voucherCode)) {
      return false;
    }
    try {
      let voucher = await this.checkVoucher(userId, voucherCode);
      if (!voucher) {
        return false;
      }
      if (voucher.count > 0) {
        voucher.count--;
        voucher.usedId.push(userId);
        console.log(voucher.usedId);
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
