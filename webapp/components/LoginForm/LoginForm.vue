<template>
  <b-container>
    <b-row>
      <b-col>
        <b-form-group label="Email" label-for="email">
          <b-form-input id="email" v-model="email" type="email" />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Password" label-for="password">
          <b-form-input id="password" v-model="password" type="password" />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row align-h="end">
      <b-button type="submit" @click="submit" id="submit"> Submit </b-button>
    </b-row>
  </b-container>
</template>

<script>
import gql from "graphql-tag";
import { mapGetters, mapMutations } from "vuex";
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
    ...mapGetters("tokenstore", ["isAuthenticated"]),
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
        this.$router.push("/");
      } catch (e) {
        this.result = e;
      }
    },
    ...mapMutations("tokenstore", ["setToken"]),
  },
  apollo: {},
};
</script>
