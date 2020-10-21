<template>
  <div id="app" class="h-100">
    <news-list />
  </div>
</template>

<script>
import NewsList from "./components/NewsList.vue";

export default {
  data() {
    return {};
  },
  name: "App",
  components: {
    "news-list": NewsList,
  },
};
</script>

<style>
html,
body {
  height: 100vh;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ccc;
}
::-webkit-scrollbar {
  width: 0.5rem;
}
::-webkit-scrollbar-thumb {
  background: #444444;
  position: absolute;
  right: 0;
  transition: color 0.25s;
  border-radius: 1rem;
}
::-webkit-scrollbar-track {
  background: none;
  border: none;
}
</style>
