<template>
  <div class="container">
    Email
    <input v-model="email" type="email" id="email" />
    <br />
    Password
    <input v-model="password" type="password" id="password" />
    <button type="submit" @click="submit" id="submit">Submit</button>
    <div class="isAuth" v-bind:id="isAuthenticated">
      Is auth? {{ isAuthenticated }}
    </div>
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
        await this.$apolloHelpers.onLogin(token);
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
