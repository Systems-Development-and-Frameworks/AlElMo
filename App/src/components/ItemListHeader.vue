<template>
  <b-row>
    <b-col
      cols="12"
      class="font-weight-bold"
    >
      <h1>Item List</h1>
    </b-col>
    <b-col>
      <b-button
        class="mb-5"
        @click="click"
      >
        Ordering: {{ desc ? "Desc" : "Asc" }}
      </b-button>
    </b-col>
  </b-row>
</template>

<script>
export default {
  props: {
    desc: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    click() {
      this.$emit("click");
    },
  },
};
</script>