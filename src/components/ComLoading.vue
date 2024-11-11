<template>
    <div>
      <!-- Loading Page -->
      <div class="loading-overlay">
        <div class="loading-content">
          <div class="spinner"></div>
          <span>Đang tải, vui lòng chờ xíu nhé...</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {

  };
  </script>
  
  <style scoped>
  /* Loading Overlay Style */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    opacity: 1;
    animation: fadeIn 0.5s ease-out;
  }
  
  /* Loading Content Style */
  .loading-content {
    color: black;
    background-color: #ffffff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-size: 20px;
    color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: scaleUp 0.4s ease-out;
  }

  body.dark-mode .loading-content {
    color:white;
    background-color: #333;
  }
  
  /* Spinner Animation */
  .spinner {
    width: 40px;
    height: 40px;
    border: 5px solid rgba(0, 0, 0, 0.2);
    border-top: 5px solid #4caf50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }
  
  /* Keyframes for Spinner */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Keyframes for Fade-in Effect */
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  /* Keyframes for Scale-up Effect */
  @keyframes scaleUp {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  </style>
  