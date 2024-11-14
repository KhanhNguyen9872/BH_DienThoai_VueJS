import CryptoJS from "crypto-js";

const API_URL = "https://khanhhutao.github.io/KhanhStore_data";

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
      const response = await fetch(`${API_URL}/data.json`);
      if (!response.ok) throw new Error("Failed to fetch products");
      
      const data = await response.json();
      return data.products;
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
      const response = await fetch(`${API_URL}/data.json`);
      if (!response.ok) throw new Error(`Failed to fetch product with ID ${productId}`);
      const data = await response.json();
      const products = data.products;
      const product = products.filter((i) => i.id === productId);
      return product[0];
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

  getAllUsers() {
    let users = localStorage.getItem('users');
    if (users == null || users.length == 0) {
      users = [];
      localStorage.setItem('users', JSON.stringify(users));
    } else {
      users = JSON.parse(users);
    }

    return users;
  },

  getAllCarts() {
    let carts = localStorage.getItem('carts');
    if (carts == null || carts.length == 0) {
      carts = [];
      localStorage.setItem('carts', JSON.stringify(carts));
    } else {
      carts = JSON.parse(carts);
    }

    return carts;
  },

  getAllOrders() {
    let orders = localStorage.getItem('orders');
    if (orders == null || orders.length == 0) {
      orders = [];
      localStorage.setItem('orders', JSON.stringify(orders));
    } else {
      orders = JSON.parse(orders);
    }

    return orders;
  },

  getAllVouchers() {
    let vouchers = localStorage.getItem('vouchers');
    if (vouchers == null || vouchers.length == 0) {
      vouchers = [];
      localStorage.setItem('vouchers', JSON.stringify(vouchers));
    } else {
      vouchers = JSON.parse(vouchers);
    }

    return vouchers;
  },

  // Add a new user
  async addUser(newUser) {
    if ((!newUser) || (newUser.password == undefined)) {
      return null;
    }

    newUser.password = CryptoJS.MD5(newUser.password).toString();

    const users = this.getAllUsers();

    users.push({ id: this.randomStr(16), ...newUser });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  },

  // Create new cart by userId
  async createCart(userId) {
    if (!userId) {
      return null;
    }

    let cartData = {
      id: userId,
      carts: []
    };

    let carts = this.getAllCarts();
    carts = carts.filter((i) => i.id !== userId);
    
    carts.push(cartData);

    localStorage.setItem('carts', JSON.stringify(carts));
  },

  async isExistUser(username) {
    if (!username) {
      return null;
    }

    const users = this.getAllUsers();

    const user = users.filter((i) => i.username === username);

    if (user.length == 0) {
      return false;
    }

    return true;
  },

  async resetPasswordUser(username, email) {
    if ((!username) || (!email)) {
      return null;
    }

    const users = this.getAllUsers();

    const user = users.filter((i) => i.username === username && i.email === email);

    if (user.length == 0) {
      return null;
    }

    let password = this.randomStr(8);

    user[0].password = CryptoJS.MD5(password).toString();
    this.updateUser(user[0]);

    return password;
  },

  // Get a user by username
  async getUser(username, password) {
    if ((!username) || (!password)) {
      return null;
    }
    
    const users = this.getAllUsers();
    const user = users.filter((i) => (i.username === username) && (i.password === password));

    if (user.length == 0) {
      return null;
    }

    return user[0];
  },

  async loginUser(username, password) {
    if ((!username) || (!password)) {
      return null;
    }
    password = CryptoJS.MD5(password).toString();

    const users = this.getAllUsers();
    const user = users.filter((i) => (i.username === username) && (i.password === password));

    if (user.length == 0) {
      return null;
    }

    return user[0];
  },

  // Add a product to the cart
  async addProductToCart(userId, productId, quantity) {
    if ((!userId) || (!productId) || (!quantity)) {
      return null;
    }

    const carts = this.getAllCarts();

    carts.push({ userId, productId, quantity });

    localStorage.setItem('carts', JSON.stringify(carts));
    return true;
  },

  async updateCarts(id, updatedCarts) {
    if ((!id) || (!updatedCarts)) {
      return null;
    }

    const carts = this.getAllCarts();
    let cart = carts.filter((i) => i.id === id);
    if (cart.length == 0) {
      return null;
    }

    cart[0].carts = updatedCarts;

    localStorage.setItem('carts', JSON.stringify(carts));
  },

  // Delete a product from the cart by ID
  async deleteProductFromCart(cartId) {
    if (!cartId) {
      return null;
    }

    const carts = this.getAllCarts();

    if (carts.length == 0) {
      return null;
    }

    let newCarts = carts.filter((i) => i.id !== cartId);

    localStorage.setItem('carts', JSON.stringify(newCarts));
    return newCarts;
  },

  // Get a cart by UserID
  async getCartItemsByUserId(userId) {
    if (!userId) {
      return null;
    }
    
    const carts = this.getAllCarts();

    const cart = carts.filter((i) => i.id === userId);

    if (cart.length == 0) {
      return null;
    }

    return cart[0];
  },

  async getAllAddress(userId) {
    if (!userId) {
      return null;
    }

    const users = this.getAllUsers();

    const user = users.filter((i) => i.id === userId);
    if (user.length == 0) {
      return null;
    }

    return user[0].information;
  },

  // Add new Address by UserID
  async updateAddress(userId, address) {
    if ((!userId) || (!address)) {
      return null;
    }

    const users = this.getAllUsers();

    const user = users.filter((i) => i.id === userId);

    if (user.length == 0) {
      return null;
    }

    user[0].information = address

    localStorage.setItem('users', JSON.stringify(users));
  },

  async updateUser(updatedUser) {
    const userId = updatedUser.id;

    const users = this.getAllUsers();
    const newUsers = users.filter((i) => i.id !== userId);
    newUsers.push(updatedUser);

    localStorage.setItem('users', JSON.stringify(newUsers));
    return true;
  },
  
  // check voucher
  async checkVoucher(voucherCode) {
    if (!voucherCode) {
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/data.json`);
      if (!response.ok) throw new Error(`Failed to fetch voucher with code ${voucherCode}`);
      const data = await response.json();
      if (!data) {
        return null;
      }

      const vouchers = data.vouchers;
      
      const voucher = vouchers.filter((v) => v.code === voucherCode);
      if (voucher.length == 0) {
        return null;
      }

      if (voucher[0].count < 1) {
        return null; // het luot
      }

      return voucher[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async updateVoucher(updatedVoucher) {
    return updatedVoucher;
  },

  // using voucher
  async useVoucher(voucherCode) {
    if (!voucherCode) {
      return false;
    }
    return true;
  },

  // Create order by userId
  async createOrder(userId) {
    if (!userId) {
      return null;
    }

    let orderData = {
      id: userId,
      orders: []
    };

    let orders = this.getAllOrders();
    orders = orders.filter((i) => i.id !== userId);
    
    orders.push(orderData);

    localStorage.setItem('orders', JSON.stringify(orders));
    return orderData;
  },

  // get Order by userId
  async getAllOrder(userId) {
    if (!userId) {
      return null;
    }

    const orders = this.getAllOrders();
    const order = orders.filter((i) => i.id === userId);
    if (order.length == 0) {
      let data = await this.createOrder(userId);
      return data.orders;
    }

    return order[0].orders;
  },

  // get a order by orderId
  async getAOrder(userId, orderId) {
    if (!userId) {
      return null;
    }
    const orders = this.getAllOrders();
    const order = orders.filter((i) => i.id === userId);
    if (order.length == 0) {
      return null;
    }

    const aOrder = order[0].orders.filter((i) => i.id === orderId);
    if (aOrder.length == 0) {
      return null;
    }

    return aOrder[0];
  },

  // Add update Order by UserID
  async updateOrders(userId, o) {
    if ((!userId) || (!o)) {
      return null;
    }

    const orders = this.getAllOrders();
    const newOrders = orders.filter((i) => i.id !== userId);
    
    newOrders.push({ id: userId, orders: o });

    localStorage.setItem('orders', JSON.stringify(newOrders));
    return true;
  },

  // cancel a order by orderId
  async cancelOrder(userId, orderId) {
    if (!userId) {
      return false;
    }
    try {
      const orders = this.getAllOrders();
      const order = orders.filter((i) => i.id === userId);
      
      if (order.length == 0) {
        return false;
      }
      
      const listOrder = order[0].orders.filter((o) => o.id === orderId);
      if (listOrder.length == 0) {
        return false;
      }

      console.log(listOrder);

      listOrder.forEach((order) => {
        if (order.id === orderId) {
          order.status = "Đã hủy";
          return;
        }
      });

      const result = await this.updateOrders(userId, order[0].orders);
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

    const orders = this.getAllOrders();

    let order = orders.filter((i) => i.id === userId);
    if (order.length == 0) {
      order = await this.createOrder(userId);
      orders.push(order);
      order = [order];
    }
    
    order[0].orders.push(newOrder);

    localStorage.setItem('orders', JSON.stringify(orders));
  },
};
