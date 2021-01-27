<template>
  <b-row class="mb-3">
    <b-col order-lg="1" cols="4" lg="12" class="border-small-right">
      {{ title }}
    </b-col>
    <b-col order-lg="3" cols="4" lg="3">
      <b-icon-triangle-fill
        class="cursor-pointer"
        v-if="isAuthenticated"
        @click="changeVotes(1)"
      />
    </b-col>
    <b-col order-lg="5" cols="4" lg="3" style="color: gray">
      <b-icon-gear-fill class="cursor-pointer" v-if="isUserOwner" />
    </b-col>
    <b-col
      order-lg="2"
      cols="4"
      lg="12"
      :style="textColor"
      class="border-small-right"
    >
      {{ votes }}
    </b-col>
    <b-col order-lg="4" cols="4" lg="3">
      <b-icon-triangle-fill
        flip-v
        class="cursor-pointer"
        v-if="isAuthenticated"
        @click="changeVotes(-1)"
      />
    </b-col>
    <b-col order-lg="6" cols="4" lg="3" style="color: red">
      <b-icon-trash-fill
        class="cursor-pointer"
        v-if="isUserOwner"
        @click="remove"
      />
    </b-col>
  </b-row>
</template>

<script>
import gql from "graphql-tag";
import { mapGetters } from "vuex";
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
const deleteMutation = (id) => {
  return {
    mutation: gql`
      mutation($id: ID!) {
        delete(id: $id) {
          id
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
    ...mapGetters("tokenstore", ["currentUserid", "isAuthenticated"]),
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
        this.item.votes = obj.votes;
        this.$emit("changeVotes", this.item);
      } catch (e) {
        console.log(e);
      }
    },
    async remove() {
      try {
        await this.$apollo.mutate(deleteMutation(this.id));
        this.$emit("remove", this.item);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss">
.cursor-pointer {
  cursor: pointer;
}
</style>