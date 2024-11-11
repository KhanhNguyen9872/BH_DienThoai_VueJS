<template>
    <footer>
         <div class="footer-container">
             <div class="footer-links">
                 <a href="#">Home</a>
                 <a href="#">About</a>
                 <a href="#">Services</a>
                 <a href="#">Contact</a>
             </div>
             <div class="footer-social">
                 <a href="#"><i class="fab fa-facebook-f"></i> Facebook</a>
                 <a href="#"><i class="fab fa-twitter"></i> Twitter</a>
                 <a href="#"><i class="fab fa-instagram"></i> Instagram</a>
             </div>
             <p>&copy; 2024 Your Website. All Rights Reserved.</p>
         </div>
     </footer>
 </template>
 
 <script>
 export default {
 
 }
 </script>
 
 <style scoped>
 * {
     margin: 0;
     padding: 0;
     box-sizing: border-box;
 }
 
 footer {
     background-color: #003c47; /* Light mode background */
     color: #fff; /* Light mode text color */
     padding: 40px 20px;
     text-align: center;
     font-family: 'Arial', sans-serif;
     transition: background-color 0.3s ease, color 0.3s ease;
 }
 
 body.dark-mode footer {
     background-color: #222; /* Dark mode background */
     color: #ddd; /* Dark mode text color */
 }
 
 /* Footer Container */
 .footer-container {
     display: flex;
     flex-direction: column;
     align-items: center;
     max-width: 1200px;
     margin: 0 auto;
     padding: 0 20px;
 }
 
 .footer-links {
     display: flex;
     flex-wrap: wrap;
     justify-content: center;
     gap: 20px;
     margin-bottom: 20px;
 }
 
 .footer-links a {
     color: #fff; /* Light mode link color */
     font-size: 16px;
     text-decoration: none;
     font-weight: 500;
     transition: color 0.3s ease, transform 0.2s ease;
 }
 
 /* Dark Mode Footer Links */
 body.dark-mode .footer-links a {
     color: #ddd; /* Dark mode link color */
 }
 
 .footer-links a:hover {
     color: #00aced;
     transform: translateY(-3px);
 }
 
 /* Dark Mode Footer Links Hover */
 body.dark-mode .footer-links a:hover {
     color: #1e90ff; /* Change hover color in dark mode */
 }
 
 /* Social Media Icons */
 .footer-social {
     display: flex;
     justify-content: center;
     gap: 20px;
     margin: 10px 0;
 }
 
 .footer-social a {
     color: #fff; /* Light mode social icon color */
     font-size: 22px;
     text-decoration: none;
     transition: color 0.3s ease, transform 0.2s ease;
 }
 
 /* Dark Mode Footer Social Links */
 body.dark-mode .footer-social a {
     color: #ddd; /* Dark mode social icon color */
 }
 
 .footer-social a:hover {
     color: #00aced;
     transform: scale(1.1);
 }
 
 /* Footer Text */
 footer p {
     font-size: 14px;
     color: #bbb;
     margin-top: 20px;
     font-weight: 400;
 }
 
 /* Dark Mode Footer Text */
 body.dark-mode footer p {
     color: #888;
 }
 
 /* Responsive adjustments */
 @media (min-width: 600px) {
     .footer-container {
         flex-direction: row;
         justify-content: space-between;
         align-items: center;
     }
 }
 
 @media (max-width: 600px) {
     .footer-links a {
         font-size: 14px;
     }
 
     .footer-social a {
         font-size: 20px;
     }
 }
 </style>
 