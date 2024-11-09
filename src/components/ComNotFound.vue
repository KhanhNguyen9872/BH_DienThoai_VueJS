<template>
    <div class="not-found">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <router-link to="/">Go back to Home</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound',
    mounted() {
      document.title = "Không tìm thấy | KhanhStore";
    }
  };
  </script>
  
  <style scoped>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh; /* Full height of the viewport */
    text-align: center;
    background-color: #f9f9f9; /* Light background color */
    color: #333; /* Text color */
  }
  
  h1 {
    font-size: 5rem; /* Large font size for the 404 */
    margin: 0;
  }
  
  p {
    font-size: 1.5rem; /* Medium font size for the message */
  }
  
  router-link {
    margin-top: 20px; /* Space above the link */
    text-decoration: none; /* Remove underline */
    color: #4CAF50; /* Green color for the link */
  }
  
  router-link:hover {
    text-decoration: underline; /* Underline on hover */
  }
  </style>
  