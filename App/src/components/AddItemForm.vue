<template>
  <b-row
    align-h="center"
    class="mt-3"
  >
    <b-col
      cols="5"
      class="pr-1"
    >
      <b-form-input
        v-model.trim="title"
        debounce="300"
      />
    </b-col>
    <b-col
      cols="3"
      class="pl-1 text-left"
    >
      <b-button @click="addItem">
        Add new item
      </b-button>
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