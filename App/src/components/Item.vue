<template>
  <div>
    <div>
      <h1>{{ title }} ({{ votes }})</h1>
    </div>
    <div>
      <b-button v-on:click="changeVotes(votes++)"> Upvote</b-button>
      <b-button v-on:click="changeVotes(votes--)"> Downvote</b-button>
      <b-button variant="Remove"> Remove</b-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    changeVotes: function () {
      this.$emit("changeVotes", this);
    },
  },
  computed: {},
  components: {},
  mounted() {},
};
</script>

<style></style>