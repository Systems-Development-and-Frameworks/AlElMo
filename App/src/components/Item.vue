<template>
  <div>
    <div>
      <h1>{{ item.title }} ({{ item.votes }})</h1>
    </div>
    <div>
      <button v-on:click="changeVotes(item.votes++)">Upvote</button>
      <button v-on:click="changeVotes(item.votes--)">Downvote</button>
      <button v-on:click="remove(item)">Remove</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    changeVotes: function () {
      this.$emit("changeVotes", this.item);
    },
    remove: function () {
      this.$emit("remove", this.item);
    },
  },
  computed: {},
  components: {},
  mounted() {},
};
</script>

<style></style>