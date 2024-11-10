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
    padding: 20px 0;
    text-align: center;
}

/* Dark Mode Footer */
body.dark-mode footer {
    background-color: #222; /* Dark mode background */
    color: #ddd; /* Dark mode text color */
}

.footer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 1200px;
    margin: auto;
    padding: 0 20px;
}

.footer-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 10px;
}

.footer-links a {
    color: #fff; /* Light mode link color */
    margin: 0 15px;
    text-decoration: none;
    font-size: 14px;
}

/* Dark Mode Footer Links */
body.dark-mode .footer-links a {
    color: #ddd; /* Dark mode link color */
}

.footer-links a:hover {
    color: #00aced;
}

/* Dark Mode Footer Links Hover */
body.dark-mode .footer-links a:hover {
    color: #1e90ff; /* Change hover color in dark mode */
}

.footer-social {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 10px 0;
}

.footer-social a {
    color: #fff; /* Light mode social icon color */
    font-size: 20px;
    text-decoration: none;
}

/* Dark Mode Footer Social Links */
body.dark-mode .footer-social a {
    color: #ddd; /* Dark mode social icon color */
}

/* Responsive adjustments */
@media (min-width: 600px) {
    .footer-container {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
}

</style>