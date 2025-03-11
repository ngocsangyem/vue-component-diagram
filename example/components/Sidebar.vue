<template>
  <aside class="sidebar">
    <h3>Sidebar</h3>
    <ul class="menu">
      <li><a href="#">Dashboard</a></li>
      <li><a href="#">Profile</a></li>
      <li><a href="#">Settings</a></li>
      <li><a href="#">Help</a></li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar'
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
}

.menu {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.menu li {
  margin-bottom: 0.5rem;
}

.menu a {
  text-decoration: none;
  color: #333;
  display: block;
  padding: 0.5rem;
  border-radius: 4px;
}

.menu a:hover {
  background-color: #e0e0e0;
}
</style>