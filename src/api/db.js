const API_URL = "http://127.0.0.1:5000";
const API_VERSION = "v1"

export default {
    getAPI_URL() {
        return API_URL;
    },
    randomStr(length) {
      return Math.random().toString(36).substring(2, 2 + length);
    },

    async getImg() {
      try {
        const response = await fetch(`${API_URL}/api/${API_VERSION}/img`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        if (!response.ok) throw new Error("Failed to fetch img");
        const data = await response.json();
  
        return data;
      } catch (error) {
        console.error("Error fetching img:", error);
        return null; // Return an object with error
      }
    },

    async getStatus() {
      try {
        const response = await fetch(`${API_URL}/api/${API_VERSION}/status`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        if (!response.ok) throw new Error("Failed to fetch status");
        const data = await response.json();
  
        return data;
      } catch (error) {
        console.error("Error fetching status:", error);
        return null; // Return an object with error
      }
    },

    async getHistoryChatBot() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/api/${API_VERSION}/chatbot`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          }
        });

        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
  
        return data;
      } catch (error) {
        console.error("Error fetching products:", error);
        return null; // Return an object with error
      }
    },

    async sendMessageToChatBot(message, prompt) {
      if (!message) {
        return null;
      }
      if (!prompt) {
        prompt = "";
      }
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/api/${API_VERSION}/chatbot`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
            prompt: prompt
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        if (data.content) {
          return data.content;
        }
        return null;
      } catch (error) {
        console.error("Error fetching products:", error);
        return null; // Return an object with error
      }
    },

    async clearHistoryChatBot() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/api/${API_VERSION}/chatbot`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          }
        });

        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
  
        return data;
      } catch (error) {
        console.error("Error fetching products:", error);
        return null; // Return an object with error
      }
    },

  // Get all products
  async getAllProducts() {
    try {
      const response = await fetch(`${API_URL}/api/${API_VERSION}/products`);
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
      const response = await fetch(`${API_URL}/api/${API_VERSION}/products/${productId}`);
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
      const response = await fetch(`${API_URL}/api/${API_VERSION}/products/${productId}`, {
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

    try {
      const response = await fetch(`${API_URL}/api/${API_VERSION}/accounts`, {
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
      const response = await fetch(`${API_URL}/api/${API_VERSION}/products/${productId}/favorite`, {
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
      const response = await fetch(`${API_URL}/api/${API_VERSION}/products/${productId}/favorite`, {
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

  async isExistUser(username) {
    if (!username) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/api/${API_VERSION}/users?username=${username}`);
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
      const response = await fetch(`${API_URL}/api/${API_VERSION}/accounts/forgot`, {
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
          const response = await fetch(`${API_URL}/api/${API_VERSION}/user`, { // Correct endpoint and method
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
      const response = await fetch(`${API_URL}/api/${API_VERSION}/accounts/auth`, { // Changed to /auth endpoint
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
      const response = await fetch(`${API_URL}/api/${API_VERSION}/carts`, {
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

  async addCart(product) {
    if (!product) {
      return null;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/${API_VERSION}/carts`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error(`Failed to modify cart item`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async updateCart(productId, product) {
    if ((!productId) || (!product)) {
      return null;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/${API_VERSION}/carts/${productId}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error(`Failed to modify cart item`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // Delete a product from the cart by ID
  async deleteProductFromCart(cartId, color) {
    if ((!cartId) || (!color)) {
      return null;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/${API_VERSION}/carts/${cartId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ color: color }),
      });
      if (!response.ok) throw new Error(`Failed to delete cart item with ID ${cartId}`);
      return await response.json(); // Usually, it will return an empty object
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // Get a cart by UserID
  async getCartItemsByUserId() {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/${API_VERSION}/carts`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch cart items`);
      const data = await response.json();
      return data;
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
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/${API_VERSION}/address`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch information`);
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
      const response = await fetch(`${API_URL}/api/${API_VERSION}/address`, {
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
      const response = await fetch(`${API_URL}/api/${API_VERSION}/address/${id}`, {
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
      const response = await fetch(`${API_URL}/api/${API_VERSION}/address/${id}`, {
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

  async changePassword(oldPassword, newPassword) {
    if (!oldPassword || !newPassword) {
      return null;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/${API_VERSION}/accounts/password`, {
        method: "PATCH", // Use PATCH method for updating
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
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/${API_VERSION}/vouchers/${voucherCode}`, {
        method: "GET", // Use PATCH method for updating
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch voucher with code ${voucherCode}`);
      const data = await response.json();
      if (!data) {
        return null;
      }
      if (data.count < 1) {
        return null;
      }

      let isAllowed = false;
      if (data.limit.length > 0) {
        for(const id of data.limit) {
          if (id === userId) {
            isAllowed = true;
            break;
          }
        }
      } else {
        isAllowed = true;
      }

      for(const id of data.usedId) {
        if (id === userId) {
          return null;
        }
      }

      if (isAllowed) {
        return data;
      }
      
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // using voucher
  async useVoucher(voucherCode) {
    if (!voucherCode) {
      return false;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/${API_VERSION}/vouchers/${voucherCode}`, {
        method: "POST", // Use PATCH method for updating
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) throw new Error("Failed to use voucher code");
      const data = await response.json(); // Return the updated user object
      if (data){
        return true;
      } else{
        return null;
      }
    } catch (error) {
      console.error("Error use voucher code:", error);
      return null;
    }
  },

  // get Order by userId
  async getAllOrder() {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/${API_VERSION}/orders`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch information`);
      const data = await response.json();
      return data.orders;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // get a order by orderId
  async getAOrder(orderId) {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/${API_VERSION}/orders/${orderId}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch information`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // cancel a order by orderId
  async cancelOrder(orderId) {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/${API_VERSION}/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch information}`);
      await response.json();
      return true;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async successPaymentOrder(orderId) {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/${API_VERSION}/orders/${orderId}/success`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch information}`);
      await response.json();
      return true;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // Add new order by userId
  async addOrder(newOrder) {
    if (!newOrder) {
      return null;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/${API_VERSION}/orders`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });
      if (!response.ok) throw new Error(`Failed to modify orders`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
