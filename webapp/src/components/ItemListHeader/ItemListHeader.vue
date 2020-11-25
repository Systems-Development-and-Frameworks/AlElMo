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
        :variant="variant"
        class="mb-5"
        @click="$emit('toggleOrder')"
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
      default: true,
    },
  },
  computed: {
    variant() {
      return this.desc ? "danger" : "dark";
    },
  },
};
</script>