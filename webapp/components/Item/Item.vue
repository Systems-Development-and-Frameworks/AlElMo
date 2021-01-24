<template>
  <b-row class="mb-3">
    <b-col cols="12" :style="textColor">
      <h1>{{ title }} ({{ votes }})</h1>
    </b-col>
    <b-col>
      <b-button class="m-1" v-if="isAuthenticated" @click="changeVotes(1)">
        Upvote
      </b-button>
      <b-button class="m-1" v-if="isAuthenticated" @click="changeVotes(-1)">
        Downvote
      </b-button>
      <b-button class="m-1" v-if="isUserOwner" @click="remove">
        Remove
      </b-button>
      <b-button class="m-1" v-if="isUserOwner"> Edit </b-button>
    </b-col>
  </b-row>
</template>

<script>
import gql from "graphql-tag";
import { mapState, mapGetters, mapMutations } from "vuex";
const upvoteMutation = (id) => {
  return {
    mutation: gql`
      mutation($id: ID!) {
        upvote(id: $id) {
          id
          votes
        }
      }
    `,
    variables: { id },
  };
};
const downvoteMutation = (id) => {
  return {
    mutation: gql`
      mutation($id: ID!) {
        downvote(id: $id) {
          id
          votes
        }
      }
    `,
    variables: { id },
  };
};
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
    ...mapGetters("tokenStore", ["currentUserid", "isAuthenticated"]),
    isUserOwner() {
      return this.author.id === this.currentUserid;
    },
    id() {
      return this.item.id;
    },
    title() {
      return this.item.title;
    },
    author() {
      return this.item.author;
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
    async changeVotes(vote) {
      try {
        let result = false;
        const downvoted = vote < 0;
        if (downvoted) {
          result = await this.$apollo.mutate(downvoteMutation(this.id));
        } else {
          result = await this.$apollo.mutate(upvoteMutation(this.id));
        }

        console.log(result.data);
        const legitDownvoted = downvoted && result.data.downvote;
        const legitUpvoted = !downvoted && result.data.upvote;
        const allGood = result.data && (legitDownvoted || legitUpvoted);

        if (!allGood) {
          throw new Error("Invalid data returned by the endpoint");
        }
        let obj = {};
        if (downvoted) {
          obj = result.data.downvote;
        } else {
          obj = result.data.upvote;
        }
        console.log(obj);
        this.item.votes = obj.votes;
        this.$emit("changeVotes", this.item);
      } catch (e) {
        console.log(e);
      }
    },
    remove() {
      if (true) {
        this.$emit("remove", this.item);
      }
    },
  },
};
</script>