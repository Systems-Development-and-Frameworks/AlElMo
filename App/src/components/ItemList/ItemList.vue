<template>
  <div>
    <template v-if="itemsArrOrdered.length">
      <div
        v-for="item in itemsArrOrdered"
        :key="item.id"
        style="margin-bottom: 1em"
      >
        <Item
          :item="item"
          v-on:changeVotes="updateVotes($event)"
          v-on:remove="removeItem($event)"
        />
      </div>
    </template>
    <div v-else>Itemlist empty :(</div>
    <AddItemForm v-on:addItem="addItem($event)" />
  </div>
</template>

<script>
import Item from "../Item.vue";
import AddItemForm from "../AddItemForm.vue";

export default {
  data() {
    return {
      itemsArr: [
        { id: 1, title: "Al", votes: 3 },
        { id: 2, title: "El", votes: 5 },
        { id: 3, title: "Mo", votes: 1 },
      ],
      id: 4,
    };
  },
  props: {},
  methods: {
    updateVotes: function (item) {
      this.itemsArr = this.itemsArr.map((e) => (item.id === e.id ? item : e));
    },
    removeItem: function (item) {
      this.itemsArr = this.itemsArr.filter((e) => e.id != item.id);
    },
    addItem: function (title) {
      this.itemsArr.push({ id: this.id, title: title, votes: 0 });
      this.id++;
    },
  },
  computed: {
    itemsArrOrdered() {
      return this.itemsArr.slice().sort((e1, e2) => e2.votes - e1.votes);
    },
  },
  components: {
    Item,
    AddItemForm,
  },
  mounted() {},
};
</script>

<style></style>