<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <b-form-input v-model="x" />
    <ItemList />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import ItemList from "./components/ItemList.vue";

export default {
  data() {
    return {
      x: "Moin Meister",
    };
  },
  name: "App",
  components: {
    HelloWorld,
    ItemList,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
