<template>
  <b-row align-h="center" class="mt-3">
    <b-col cols="3" class="pl-1 text-left">
      <label for="add_new_item"> A11Y RULEZ XD</label>
    </b-col>
    <b-col cols="5" class="pr-1">
      <b-form-input
        id="add_new_item"
        placeholder="new item"
        v-model.trim="title"
        debounce="300"
      >
      </b-form-input>
    </b-col>
    <b-col cols="3" class="pl-1 text-left">
      <b-button @click="addItem"> Add new item </b-button>
    </b-col>
  </b-row>
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
