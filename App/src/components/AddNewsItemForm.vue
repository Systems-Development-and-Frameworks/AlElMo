<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="4" class="px-0">
        <b-form-input debounce="300" v-model.trim="title" />
      </b-col>
      <b-col cols="2" class="px-1 text-left">
        <b-button @click="createNewsItem" variant="success">New</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      title: "",
    };
  },
  props: {},
  methods: {
    /**
     * Creates a new news title item and emits it for the parent component
     */
    createNewsItem() {
      if (this.title.match(/\S+/)) {
        this.$emit("create", { title: this.title });
        this.title = "";
      }
    },
  },
  computed: {},
  components: {},
  mounted() {},
};
</script>