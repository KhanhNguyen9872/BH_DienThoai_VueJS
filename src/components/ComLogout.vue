<template>
    <div class="logout-container">
        <p class="fade-out">Đang đăng xuất...</p>
    </div>
</template>

<script>
export default {
    async created() {
        document.title = "Đăng xuất | KhanhStore";
        localStorage.removeItem('user');
        await new Promise(resolve => setTimeout(resolve, 1750));
        window.location.href = '/';
    }
}
</script>

<style scoped>
.logout-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f8f9fa;
}

.logout-container p {
    font-size: 1.5rem;
    color: #555;
    background-color: #ffffff;
    padding: 20px 40px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    font-weight: 600;
    font-family: Arial, sans-serif;
    text-align: center;
    opacity: 1;
    animation: fadeOut 1s ease forwards 1s; /* Delay the fade-out animation */
}

.logout-container p::after {
    content: '...';
    animation: dots 1s steps(3, end) infinite;
}

@keyframes dots {
    0% {
        content: '';
    }
    20% {
        content: '.';
    }
    40% {
        content: '..';
    }
    60% {
        content: '...';
    }
    80% {
        content: '....';
    }
    100% {
        content: '.....';
    }
}

@keyframes fadeOut {
    to {
        opacity: 0;
        transform: translateY(-10px); 
    }
}
</style>
