<template>
  <div>
    <b-form-input debounce="300" v-model.trim="title" />
    <b-button v-on:click="addItem">Add new item</b-button>
  </div>
</template>

<script>
export default {
  data() {
    return {title:"",};
  },
  props: {
  },
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