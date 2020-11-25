<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: "List is empty :(",
    },
  },
};
</script>
