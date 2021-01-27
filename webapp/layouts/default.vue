<template>
  <b-card
    footer-class="text-center"
    header-class="d-none d-lg-block"
    class="min-h-100"
  >
    <template #header>
      <b-row align-h="end" class="mx-0">
        <b-col class="text-center" cols="3" lg="2" xl="1">
          <div class="register-link">
            <nuxt-link to="/"> Home </nuxt-link>
          </div>
        </b-col>
        <b-col
          v-if="!isAuthenticated"
          class="text-center"
          cols="3"
          lg="2"
          xl="1"
        >
          <div class="register-link">
            <nuxt-link to="/login"> Register </nuxt-link>
          </div>
        </b-col>
        <b-col class="text-center" cols="3" lg="2" xl="1">
          <div
            v-if="!isAuthenticated"
            id="login"
            class="log-in-link"
            @click="login"
          >
            Login
          </div>

          <div v-else id="logout" class="log-out-link" @click="logout">
            Logout
          </div>
        </b-col>
      </b-row>
    </template>
    <div
      v-b-toggle.sidebar
      class="d-lg-none burger-menu-icon cursor-pointer px-3"
    >
      <b-icon-list />
    </div>
    <b-sidebar id="sidebar" title="Menu" class="d-lg-none" right shadow>
      <b-row align-h="end" class="mx-0">
        <b-col class="text-center mb-1" cols="12">
          <div class="register-link">
            <nuxt-link to="/"> Home </nuxt-link>
          </div>
        </b-col>
        <b-col v-if="!isAuthenticated" class="text-center mb-1" cols="12">
          <div class="register-link">
            <nuxt-link to="/login"> Register </nuxt-link>
          </div>
        </b-col>
        <b-col class="text-center mb-1" cols="12">
          <div
            v-if="!isAuthenticated"
            id="login"
            class="log-in-link"
            @click="login"
          >
            Login
          </div>

          <div v-else id="logout" class="log-out-link mb-1" @click="logout">
            Logout
          </div>
        </b-col>
      </b-row>
    </b-sidebar>

    <Nuxt />
    <template #footer>© AlElMo</template>
  </b-card>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("tokenstore", ["isAuthenticated"]),
  },
  mounted() {
    if (localStorage.token !== undefined) {
      this.setToken(localStorage.token);
    }
  },
  methods: {
    login() {
      this.$router.push("/login");
    },
    async logout() {
      await this.$apolloHelpers.onLogout();
      this.deleteToken();
      this.$router.push("/");
    },
    ...mapMutations("tokenstore", ["setToken", "deleteToken"]),
  },
};
</script>

<style lang="scss">
#__nuxt,
#__layout {
  height: 100vh;
}
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.burger-menu-icon {
  color: white;
  border-radius: 0 0 0 4px;
  font-size: 2rem;
  position: fixed;
  right: 0;
  top: 0;
  background-color: gray;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.min-h-100 {
  min-height: 100% !important;
}

.button--grey:hover {
  color: #fff;
  background-color: #01a009;
}

@mixin custom-link {
  border-radius: 10px;
  a {
    width: 100%;
    height: 100%;
    font-weight: bold;
    color: white;
    cursor: pointer;
    text-decoration: none;
    &:hover {
      color: white;
      text-decoration: none;
    }
  }
  width: 100%;
  height: 100%;
  font-weight: bold;
  color: white;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    color: white;
    text-decoration: none;
  }
}

.log-in-link {
  @include custom-link;
  background-color: #00b344;
}
.log-out-link {
  @include custom-link;
  background-color: #690808;
}
.register-link {
  @include custom-link;
  background-color: #888888;
}
</style>
