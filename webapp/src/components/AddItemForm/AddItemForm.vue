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
        id="add_new_item"
        v-model.trim="title"
        placeholder="Add a title..."
        debounce="300"
      />
    </b-col>
    <b-col
      cols="3"
      class="pl-1 text-left"
    >
      <label for="add_new_item">
        <b-button
          :disabled="disabled"
          @click="addItem"
        >
          Add new item
        </b-button>
      </label>
    </b-col>
  </b-row>
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
