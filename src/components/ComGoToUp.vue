<template>
    <div>
      <!-- The button to go to the top -->
      <button 
        v-if="isVisible" 
        @click="scrollToTop" 
        class="go-to-top-button"
      >UP
        <!-- Icon for the button (upward arrow) -->
        <i class="fas fa-arrow-up"></i>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isVisible: false, // Show the button when user scrolls down
      };
    },
    methods: {
      // Function to scroll to the top
      scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      // Function to monitor the scroll position
      handleScroll() {
        if (window.scrollY > 300) { // Show button when user scrolls down 300px
          this.isVisible = true;
        } else {
          this.isVisible = false;
        }
      },
    },
    mounted() {
      // Listen to scroll event
      window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
      // Clean up the scroll event listener when the component is destroyed
      window.removeEventListener('scroll', this.handleScroll);
    },
  };
  </script>
  
  <style scoped>
  /* Button styling */
  .go-to-top-button {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 50%;
    padding: 15px;
    font-size: 20px;
    cursor: pointer;
    transition: opacity 0.3s ease-in-out, transform 0.3s ease;
    opacity: 0.7;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  /* Hover effect: increase opacity and transform */
  .go-to-top-button:hover {
    opacity: 1;
    transform: scale(1.1); /* Slightly enlarge on hover */
  }
  
  /* Active (clicked) effect */
  .go-to-top-button:active {
    transform: scale(0.95); /* Slightly shrink on click */
  }
  
  /* Make the icon larger and more centered */
  .go-to-top-button i {
    font-size: 24px;
  }
  
  /* Style for the button when hidden */
  .go-to-top-button:focus {
    outline: none;
  }
  </style>
  
  