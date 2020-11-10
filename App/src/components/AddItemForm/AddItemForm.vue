<template>
  <div>
    <input v-model.trim="title" />
    <button v-on:click="addItem">Add new item</button>
  </div>
</template>

<script>
export default {
  props: {
    initialTitle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      title: this.initialTitle,
    };
  },
  computed: {
    disabled() {
      return this.title.length === 0;
    },
  },
  methods: {
    addItem() {
      if (this.title.length) {
        this.$emit("addItem", { title: this.title });
        this.title = "";
      }
    },
  },
};
</script>
