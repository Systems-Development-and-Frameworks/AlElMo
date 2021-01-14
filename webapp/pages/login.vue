<template>
  <div class="container">
    Email
    <b-form-input v-model="email" type="email" />
    <br />
    Password
    <b-form-input v-model="password" type="password" />
    <b-button @click="submit">Submit</b-button>
    <div>{{ result }}</div>
  </div>
</template>

<script>
import gql from "graphql-tag";
const loginMutation = (email, password) => {
  return {
    mutation: gql`
      mutation($email: String!, $password: String!) {
        login(email: $email, password: $password)
      }
    `,
    variables: { email, password },
  };
};
export default {
  data() {
    return {
      email: "",
      password: "",
      result: "",
    };
  },
  methods: {
    async submit() {
      // Call to the graphql mutation
      try {
        const result = await this.$apollo.mutate(
          loginMutation(this.email, this.password)
        );
        this.result = result;
      } catch (e) {
        this.result = e;
      }
    },
  },
  apollo: {
    // Vue-Apollo options here
  },
};
</script>

<style>
</style>
