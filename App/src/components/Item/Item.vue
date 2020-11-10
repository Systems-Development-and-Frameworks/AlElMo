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
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    id() {
      return this.item.id;
    },
    title() {
      return this.item.title;
    },
    votes() {
      return this.item.votes;
    },
    textColor() {
      let color = "black";
      if (this.item.votes > 0) {
        color = "green";
      }
      if (this.item.votes < 0) {
        color = "red";
      }
      return `color: ${color};`;
    },
  },
  methods: {
    changeVotes(vote) {
      const item = {
        id: this.id,
        title: this.title,
        votes: this.votes + vote,
      };
      this.$emit("changeVotes", item);
    },
    remove() {
      this.$emit("remove", this.item);
    },
  },
};
</script>