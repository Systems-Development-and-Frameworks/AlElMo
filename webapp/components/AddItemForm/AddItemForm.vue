<template>
  <b-row align-h="center" class="mt-3">
    <b-col cols="5" class="pr-1">
      <b-form-input
        id="add_new_item"
        v-model.trim="title"
        placeholder="Add a title..."
        debounce="300"
      />
    </b-col>
    <b-col cols="3" class="pl-1 text-left">
      <label for="add_new_item">
        <b-button :disabled="disabled" @click="addItem">
          Add new item
        </b-button>
      </label>
    </b-col>
  </b-row>
</template>

<script>
import gql from "graphql-tag";
const writeMutation = (title) => {
  return {
    mutation: gql`
      mutation($title: String!) {
        write(post: { title: $title }) {
          id
          title
          votes
          author {
            id
          }
        }
      }
    `,
    variables: { title },
  };
};
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
    async addItem() {
      if (this.title.length) {
        try {
          const result = await this.$apollo.mutate(writeMutation(this.title));
          const item = result.data.write;
          this.$emit("addItem", item);
          this.title = "";
        } catch (e) {
          console.log(e);
        }
      }
    },
  },
};
</script>
