<template>
  <div>
    <input v-model.trim="title" />
    <button v-on:click="addItem">Add new item</button>
  </div>
</template>

<script>
export default {
  data() {
    return { title: "" };
  },
  props: {},
  methods: {
    addItem: function () {
      this.$emit("addItem", this.title);
    },
  },
  computed: {},
  components: {},
  mounted() {},
};
</script>

<style></style>