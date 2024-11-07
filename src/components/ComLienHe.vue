<template>
  <div class="contact">
    <h1>Contact Khanh Store</h1>

    <section class="contact-info">
      <h2>Contact Information</h2>
      <p>If you have any questions or inquiries, feel free to reach out to us:</p>
      <ul>
        <li>Email: <a href="mailto:contact@khanhstore.com">contact@khanhstore.com</a></li>
        <li>Phone: +1 (800) 123-4567</li>
        <li>Address: 1234 Khanh Street, Ho Chi Minh City, Vietnam</li>
      </ul>
    </section>

    <section class="contact-form">
      <h2>Send Us a Message</h2>
      <form @submit.prevent="sendMessage">
        <div class="form-group">
          <label for="name">Your Name</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div class="form-group">
          <label for="email">Your Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="message">Your Message</label>
          <textarea id="message" v-model="message" required></textarea>
        </div>
        <button type="submit">Send Message</button>
      </form>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </section>
  </div>
</template>

<script>
export default {
  name: "Contact KhanhStore",
  data() {
    return {
      name: "",
      email: "",
      message: "",
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async sendMessage() {
      // Mock message sending
      try {
        // Simulate API call or email sending
        const response = await fetch("/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            message: this.message,
          }),
        });

        if (response.ok) {
          this.successMessage = "Your message has been sent successfully!";
          this.errorMessage = "";
        } else {
          this.errorMessage = "Something went wrong. Please try again.";
          this.successMessage = "";
        }
      } catch (error) {
        this.errorMessage = "Error sending message. Please try again later.";
        this.successMessage = "";
      }
    },
  },
};
</script>

<style scoped>
.contact {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

section {
  margin-bottom: 30px;
}

h2 {
  color: #4CAF50;
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: 8px;
}

a {
  color: #007BFF;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>
