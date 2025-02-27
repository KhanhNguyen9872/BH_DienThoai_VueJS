<template>
    <!-- Show maintenance page if 'maintenance' is true -->
    <div class="maintenance-container">
        <div class="maintenance-content">
            <h1 class="maintenance-title">We Are Currently Under Maintenance</h1>
            <p class="maintenance-message">
                Our website is undergoing scheduled maintenance. We'll be back online soon!
            </p>
            <p class="maintenance-note">Please check back in a few moments.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "About KhanhHaoStore",
    mounted() {
        document.title = "Maintenance | KhanhHaoStore";
    },
};
</script>

<style scoped>
/* Styling for the maintenance page */
.maintenance-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6e7f87, #c9d6d5);
  color: #fff;
  font-family: 'Arial', sans-serif;
}

.maintenance-content {
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 30px 50px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.maintenance-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
}

.maintenance-message {
  font-size: 18px;
  margin-bottom: 20px;
}

.maintenance-note {
  font-size: 14px;
  color: #f0e6e6;
  margin-top: 10px;
}

</style>