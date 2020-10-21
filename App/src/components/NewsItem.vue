<template>
  <b-container class="news-item cursor-pointer">
    <b-row class="mb-2 p-2" align-v="center">
      <b-col cols="1">
        <b-row align-v="center">
          <b-col class="pr-1">
            <b-row>
              <b-icon-triangle-fill @click="upvote" class="green-hover" />
            </b-row>
            <b-row>
              <b-icon-triangle-fill
                rotate="180"
                @click="downvote"
                class="red-hover"
              />
            </b-row>
          </b-col>
          <b-col class="pl-0 text-left">
            {{ votes }}
          </b-col>
        </b-row>
      </b-col>
      <b-col class="news-title">
        {{ title | capitalize }}
      </b-col>
      <b-col cols="1" class="text-right pr-1">
        <b-icon-trash class="red-hover" @click="del" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    id: String,
    title: String,
    votes: Number,
  },
  methods: {
    /**
     * Increases the vote counter
     */
    upvote() {
      this.update({
        id: this.id,
        title: this.title,
        votes: this.votes + 1,
      });
    },
    /**
     * Decreases the vote counter
     */
    downvote() {
      this.update({
        id: this.id,
        title: this.title,
        votes: this.votes - 1,
      });
    },
    /**
     * Deletes this news item
     * @param {Object} item The new news item
     */
    del() {
      this.$emit("delete", {
        id: this.id,
        title: this.title,
        votes: this.votes,
      });
    },
    /**
     * Updates this news item
     * @param {Object} item The news item
     */
    update(item) {
      this.$emit("update", item);
    },
  },
  computed: {},
  components: {},
  mounted() {},
};
</script>

<style lang="scss">
.red-hover {
  transition: color 0.25s;
  &:hover {
    color: rgb(200, 100, 100);
  }
}
.green-hover {
  transition: color 0.25s;
  &:hover {
    color: rgb(100, 200, 100);
  }
}
.news-title {
  font-size: 2rem;
}
.news-item {
  cursor: pointer;
  user-select: none;
  font-size: 1.5rem;
  border-radius: 0.5rem;
  background-color: #282828;
  &:hover {
    background-color: #2a2a2a;
  }
}
</style>
