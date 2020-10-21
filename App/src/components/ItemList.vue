<template>
  <div>
    <div v-for="item in itemsArr" :key="item.title">
      <Item
        :title="item.title"
        :votes="item.votes"
        v-on:changeVotes="updateVotes($event)"
      />
    </div>
  </div>
</template>

<script>
import Item from "./Item.vue";

export default {
  data() {
    return {
      itemsArr: [
        { title: "Al", votes: 3 },
        { title: "El", votes: 5 },
        { title: "Mo", votes: 1 },
      ],
    };
  },
  props: {},
  methods: {
    updateVotes: function (item) {
      this.itemsArr.find(item.title).votes = item.votes;
    },
  },
  computed: {},
  components: {
    Item,
  },
  mounted() {},
};
</script>

<style></style>