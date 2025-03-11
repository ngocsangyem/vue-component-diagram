<template>
  <div class="app">
    <h1>Vue Component Diagram Example</h1>
    <Header title="Component Diagram Demo" />
    <MainContent />
    <button @click="toggleFooter" class="toggle-btn">{{ showFooter ? 'Hide' : 'Show' }} Footer</button>
    <Footer v-if="showFooter" />
  </div>
</template>

<script>
import { ref } from 'vue';
import Header from './components/Header.vue';
import MainContent from './components/MainContent.vue';
import Footer from './components/Footer.vue';
import { useWindowSize } from './composables/useWindowSize';

export default {
  name: 'App',
  components: {
    Header,
    MainContent,
    Footer
  },
  setup() {
    const { width, height } = useWindowSize();
    const showFooter = ref(true);
    
    const toggleFooter = () => {
      showFooter.value = !showFooter.value;
    };
    
    console.log('App component loaded with children: Header, MainContent, Footer');
    return { width, height, showFooter, toggleFooter };
  }
};
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>