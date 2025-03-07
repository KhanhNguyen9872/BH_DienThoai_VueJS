<template>
    <div class="logout-container">
        <p class="fade-out">Đang đăng xuất...</p>
    </div>
</template>

<script>
import db from '@/api/db';
export default {
    async created() {
        if (localStorage.getItem('accessToken')) {
            document.title = "Đăng xuất | KhanhStore";
            db.logout();
            localStorage.removeItem('accessToken');
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        window.location.href = '/';
    }
}
</script>

<style scoped>
.logout-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height:50vh;
    background-color: #f8f9fa;
}

body.dark-mode .logout-container {
    background-color: #3b3b3b;
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

body.dark-mode .logout-container p {
    background-color: #3b3b3b;
    color: #d9d9d9;
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
