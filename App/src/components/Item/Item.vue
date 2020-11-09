<template>
  <b-row class="mb-3">
    <b-col cols="12">
      <h1>{{ title }} ({{ votes }})</h1>
    </b-col>
    <b-col>
      <b-button class="m-1" @click="changeVotes(1)"> Upvote </b-button>
      <b-button class="m-1" @click="changeVotes(-1)"> Downvote </b-button>
      <b-button class="m-1" @click="remove"> Remove </b-button>
    </b-col>
  </b-row>
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