<template>
  <main class="main-content">
    <h2>Main Content</h2>
    <div class="content-controls">
      <button @click="toggleSidebar" class="toggle-btn">{{ showSidebar ? 'Hide' : 'Show' }} Sidebar</button>
    </div>
    <div class="content-wrapper">
      <Sidebar v-if="showSidebar" />
      <ContentArea />
    </div>
  </main>
</template>

<script>
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import ContentArea from './ContentArea.vue';
import { useTheme } from '../composables/useTheme';

export default {
  name: 'MainContent',
  components: {
    Sidebar,
    ContentArea
  },
  props: {
    isContentAreaVisible: false,
  },
  setup(props) {
    const { theme, toggleTheme } = useTheme();
    const showSidebar = ref(true);
    
    const toggleSidebar = () => {
      showSidebar.value = !showSidebar.value;
    };
    
    return { theme, toggleTheme, showSidebar, toggleSidebar };
  }
};
</script>

<style scoped>
.main-content {
  margin: 2rem 0;
}

.content-wrapper {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}
</style>