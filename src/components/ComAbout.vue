<template>
  <div class="about">
    <h1>Giới thiệu về Khanh Store</h1>

    <section class="about-section">
      <h2>Chào mừng đến với Khanh Store</h2>
      <p>
        Tại Khanh Store, chúng tôi đam mê mang đến cho bạn những sản phẩm công nghệ mới nhất và tốt nhất. Sứ mệnh của chúng tôi là cung cấp những chiếc điện thoại thông minh chất lượng cao với giá cả cạnh tranh. Cho dù bạn đang tìm kiếm iPhone mới nhất, một thiết bị Android đầy tính năng, hay một sản phẩm ở giữa, Khanh Store luôn có những lựa chọn tuyệt vời cho bạn.
      </p>
    </section>

    <section class="mission-section">
      <h2>Sứ mệnh của chúng tôi</h2>
      <p>
        Sứ mệnh của chúng tôi rất đơn giản: Cung cấp một trải nghiệm mua sắm tuyệt vời thông qua dịch vụ khách hàng xuất sắc, sản phẩm chất lượng và giá cả phải chăng. Chúng tôi nỗ lực để mỗi lần mua hàng của bạn trở nên dễ dàng và thú vị.
      </p>
    </section>

    <section class="contact-section">
      <h2>Liên hệ với chúng tôi</h2>
      <p>
        Có câu hỏi hoặc cần sự trợ giúp? Hãy liên hệ với chúng tôi qua các kênh dưới đây:
      </p>
      <ul>
        <li>Email: <a href="mailto:contact@khanhstore.com">contact@khanhstore.com</a></li>
        <li>Điện thoại: +1 (800) 123-4567</li>
        <li>Địa chỉ: 1234 Khanh Street, Thành phố Hồ Chí Minh, Việt Nam</li>
      </ul>
    </section>

    <section class="social-media">
      <h2>Theo dõi chúng tôi</h2>
      <p>
        Hãy kết nối với chúng tôi trên các mạng xã hội để nhận được các cập nhật và chương trình khuyến mãi mới nhất:
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
/* General Styles */
.about {
  font-family: Arial, sans-serif;
  padding: 30px;
  max-width: 900px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 2.5rem;
}

section {
  margin-bottom: 30px;
}

h2 {
  color: #4CAF50;
  margin-bottom: 15px;
  font-size: 1.75rem;
  font-weight: bold;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: 10px;
}

a {
  color: #007BFF;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #0056b3;
  text-decoration: underline;
}

.contact-section ul, .social-media ul {
  margin-top: 10px;
}

/* Dark Mode Styles */
body.dark-mode .about {
  background-color: #121212;
  color: #E0E0E0;
}

body.dark-mode h1,
body.dark-mode h2 {
  color: #81C784;
}

body.dark-mode a {
  color: #BB86FC;
}

body.dark-mode a:hover {
  color: #6200EE;
}

body.dark-mode .social-media ul li,
body.dark-mode .contact-section ul li {
  color: #E0E0E0;
}

body.dark-mode .social-media ul li a {
  color: #BB86FC;
}

body.dark-mode .social-media ul li a:hover {
  color: #6200EE;
}

body.dark-mode .about-section,
body.dark-mode .mission-section,
body.dark-mode .contact-section {
  background-color: #1E1E1E;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 20px;
}

/* Responsive Styling */
@media (max-width: 600px) {
  .about {
    padding: 15px;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  ul li {
    font-size: 0.9rem;
  }
}
</style>
