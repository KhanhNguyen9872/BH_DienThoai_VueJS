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
    background-color: #333;
    color: #fff;
    padding: 20px 0;
    text-align: center;
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
    color: #fff;
    margin: 0 15px;
    text-decoration: none;
    font-size: 14px;
}

.footer-links a:hover {
    color: #00aced;
}

.footer-social {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 10px 0;
}

.footer-social a {
    color: #fff;
    font-size: 20px;
    text-decoration: none;
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