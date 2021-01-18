<template>
  <div class="container">
    Email
    <b-form-input v-model="email" type="email" />
    <br />
    Password
    <b-form-input v-model="password" type="password" />
    <b-button @click="submit">Submit</b-button>
    <div>Is auth? {{ isAuthenticated }}</div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import { mapState, mapGetters, mapMutations } from "vuex";
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
    };
  },
  computed: {
    ...mapGetters("tokenStore", ["isAuthenticated"]),
  },
  methods: {
    async submit() {
      try {
        const result = await this.$apollo.mutate(
          loginMutation(this.email, this.password)
        );
        if (!result.data || !result.data.login) {
          throw new Error("Invalid data returned by the endpoint");
        }
        const token = result.data.login;
        this.setToken(token);
      } catch (e) {
        this.result = e;
      }
    },
    ...mapMutations("tokenStore", ["setToken"]),
  },
  apollo: {},
};
</script>
