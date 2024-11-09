<template>
  <div class="about">
    <h1>About Khanh Store</h1>

    <section class="about-section">
      <h2>Welcome to Khanh Store</h2>
      <p>
        At Khanh Store, we are passionate about bringing you the latest and
        best in technology. Our mission is to offer high-quality smartphones at
        competitive prices. Whether you are looking for the latest iPhone, a
        feature-packed Android device, or something in between, Khanh Store has
        something for everyone.
      </p>
    </section>

    <section class="mission-section">
      <h2>Our Mission</h2>
      <p>
        Our mission is simple: To provide an excellent shopping experience
        through outstanding customer service, quality products, and affordable
        prices. We strive to make every purchase smooth and enjoyable.
      </p>
    </section>

    <section class="contact-section">
      <h2>Contact Us</h2>
      <p>
        Have questions or need assistance? Feel free to reach out to us:
      </p>
      <ul>
        <li>Email: <a href="mailto:contact@khanhstore.com">contact@khanhstore.com</a></li>
        <li>Phone: +1 (800) 123-4567</li>
        <li>Location: 1234 Khanh Street, Ho Chi Minh City, Vietnam</li>
      </ul>
    </section>

    <section class="social-media">
      <h2>Follow Us</h2>
      <p>
        Stay connected with us on social media for the latest updates and
        promotions:
      </p>
      <ul>
        <li><a href="https://facebook.com/khanhstore" target="_blank">Facebook</a></li>
        <li><a href="https://twitter.com/khanhstore" target="_blank">Twitter</a></li>
        <li><a href="https://instagram.com/khanhstore" target="_blank">Instagram</a></li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: "About KhanhStore",
  mounted() {
    document.title = "Giới thiệu | KhanhStore";
  },
};
</script>

<style scoped>
.about {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
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

.contact-section ul {
  margin-top: 10px;
}

.social-media ul {
  margin-top: 10px;
}
</style>
