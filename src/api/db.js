import CryptoJS from "crypto-js";

const API_URL = "http://127.0.0.1:5000";

export default {
    getAPI_URL() {
        return API_URL;
    },
    generateRandom(length) {
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
    if (newUser.password == undefined) {
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

  // Add a new user
  async createCart(userId) {
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
    }
  },

  async isExistUser(username) {
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
    try {
      const response = await fetch(`${API_URL}/users?username=${username}&email=${email}`);
      if (!response.ok) throw new Error(`Failed to fetch user`);
      const data = await response.json();
      if (data.length == 0) {
        return null;
      }

      let password = this.generateRandom(8);
      if (data[0].password != undefined) {
        console.log(data[0]);
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
    if (password == undefined || password == null || password.length < 1) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/users?username=${username}&password=${password}`);
      if (!response.ok) throw new Error(`Failed to fetch user`);
      const users = await response.json();

      return users.length > 0 ? users[0] : null; // Return the first user found or null if none
    } catch (error) {
      console.error(error);
    }
  },

  async loginUser(username, password) {
    if (password == undefined || password == null || password.length < 1) {
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
    }
  },

  // Add a product to the cart
  async addProductToCart(userId, productId, quantity) {
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
    }
  },

  async updateCarts(id, updatedCarts) {
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
    }
  },

  // Delete a product from the cart by ID
  async deleteProductFromCart(cartId) {
    try {
      const response = await fetch(`${API_URL}/carts/${cartId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Failed to delete cart item with ID ${cartId}`);
      return await response.json(); // Usually, it will return an empty object
    } catch (error) {
      console.error(error);
    }
  },

  // Get a cart by UserID
  async getCartItemsByUserId(userId) {
    try {
      const response = await fetch(`${API_URL}/carts?id=${userId}`);
      if (!response.ok) throw new Error(`Failed to fetch cart items for user ID ${userId}`);
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error(error);
    }
  },

  async getAllAddress(userId) {
    try {
      const response = await fetch(`${API_URL}/users?id=${userId}`);
      if (!response.ok) throw new Error(`Failed to fetch information for user ID ${userId}`);
      const data = await response.json();
      return data[0].information;
    } catch (error) {
      console.error(error);
    }
  },

  // Add new Address by UserID
  async updateAddress(userId, address) {
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
    }
  },
  
  // check voucher
  async checkVoucher(voucherCode) {
    try {
      const response = await fetch(`${API_URL}/vouchers/?code=${voucherCode}`);
      if (!response.ok) throw new Error(`Failed to fetch voucher with code ${voucherCode}`);
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error(error);
    }
  },
};
