<template>
  <div class="content-area">
    <h3>Content Area</h3>
    <div class="card">
      <h4>Component Hierarchy Example</h4>
      <p>This example demonstrates how components are structured in a Vue application.</p>
      <p>The diagram will show arrows pointing from parent components to their children.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentArea'
};
</script>

<style scoped>
.content-area {
  flex: 1;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.card {
  background-color: white;
  border-radius: 4px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}
</style>