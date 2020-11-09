<template>
  <div>
    <input v-model.trim="title" />
    <button v-on:click="addItem">Add new item</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
    };
  },
  methods: {
    addItem() {
      this.$emit("addItem", { title: this.title });
    },
  },
};
</script>
