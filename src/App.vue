<template>
  <div>
    <!-- Show maintenance page if under maintenance -->
    <ComMaintenance v-if="maintenance" />

    <!-- Normal content if not under maintenance -->
    <div v-else>
      <ComChatbotButton v-if="chatbot_enabled" />
      <GoToTopButton />
      <Header />
      <Footer />
    </div>
  </div>
</template>
<script>
// Import components
import ComMaintenance from './components/ComMaintenance.vue';
import Header from './components/ComHeader.vue'
import GoToTopButton from './components/ComGoToUp.vue'
import Footer from './components/ComFooter.vue'
import ComChatbotButton from './components/ComChatbotButton.vue';
import db from './api/db';

export default {
  name: 'App',
  components: {
    ComMaintenance,
    ComChatbotButton, 
    GoToTopButton,
    Header,
    Footer,
  },
  data() {
    return {
      isDarkMode: false, // Default is light mode
      maintenance: false, // Flag for maintenance mode
      chatbot_enabled: false,
    };
  },
  mounted() {
    this.loadTheme();

    // Listen to the storage event for theme changes in other tabs/windows
    window.addEventListener('storage', this.handleStorageChange);

    // Call the API to check for maintenance
    this.checkMaintenanceStatus();
  },
  beforeUnmount() {
    // Remove the event listener when the component is destroyed
    window.removeEventListener('storage', this.handleStorageChange);
  },
  methods: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.updateTheme();
    },
    updateTheme() {
      if (this.isDarkMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    },
    loadTheme() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDarkMode = savedTheme === 'dark';
        this.updateTheme();
      }
    },
    handleStorageChange(event) {
      // If the theme is changed in localStorage, update the theme
      if (event.key === 'theme') {
        this.isDarkMode = event.newValue === 'dark';
        this.updateTheme();
      }
    },
    async checkMaintenanceStatus() {
      try {
        const data = await db.getStatus();

        // Assuming the API response has a 'status' field that can be 'MAINTENANCE'
        if (data.status == 'MAINTENANCE') {
          this.maintenance = true;
        } else if (data.status == 'ALIVE') {
          this.maintenance = false;
        }

        if (data.chatbot == "0") {
          this.chatbot_enabled = false;
        } else {
          this.chatbot_enabled = true;
        }
      } catch (error) {
        console.error("Error fetching maintenance status:", error);
        this.maintenance = true; // Show maintenance page on error
        this.chatbot_enabled = false;
      }
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/* Global styles for Light and Dark mode */
body {
  margin: 0;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Default (Light Mode) Styles */
body {
  color: #333;
}

/* Dark Mode Styles */
body.dark-mode {
  background-color: #121212;
  color: #fff;
}

/* Specific component styles */
.header {
  transition: background-color 0.3s ease;
}

/* Dark mode specific styles for header */
body.dark-mode .header {
  background-color: #333;
}

/* Dark mode specific styles for buttons */
body.dark-mode .button {
  background-color: #444;
  color: white;
}

body.dark-mode .button:hover {
  background-color: #666;
}

/* Dark mode styles for the search box */
body.dark-mode .search-box {
  background-color: #555;
  color: white;
  border: 1px solid #888;
}

body.dark-mode .search-box:focus {
  border-color: #aaa;
}
</style>
