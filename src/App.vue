<template>
  <GoToTopButton />
 <Header/>

 
 <Footer/>
</template>

<script>
// b1: import vào

import Header from './components/ComHeader.vue'
import GoToTopButton from './components/ComGoToUp.vue';
import Footer from './components/ComFooter.vue'
export default {
  name: 'App',
  components: {
    GoToTopButton,
    Header,
    Footer,
 
  }
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
</style>
