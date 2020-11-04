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
    <div v-else id="itemlist-emptyxxx">Itemlist empty :(</div>
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
      desc: true,
    };
  },
  methods: {
    updateVotes(item) {
      this.itemsArr = this.itemsArr.map((e) => (item.id === e.id ? item : e));
    },
    removeItem(item) {
      this.itemsArr = this.itemsArr.filter((e) => e.id != item.id);
    },
    addItem(item) {
      const { title } = item;
      this.itemsArr.push({ id: this.createId(), title, votes: 0 });
    },
    createId(length = 15) {
      let text = `item_${Date.now()}_`;
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?=)(/&%$§\"!,.-;:_+*#'";
      for (let i = 0; i < length; i += 1) {
        text += possible.charAt(Math.random() * possible.length);
      }
      return text;
    },
    cloneArray(arr) {
      return (Array.isArray(arr) && arr.slice()) || [];
    },
    sortItems(arr) {
      const multiplier = this.desc ? 1 : -1;
      return this.cloneArray(arr).sort(
        (e1, e2) => multiplier * (e2.votes - e1.votes)
      );
    },
    toggleOrdering() {
      this.desc = !this.desc;
    },
  },
  computed: {
    itemsArrOrdered() {
      return this.sortItems(this.itemsArr);
    },
  },
  components: {
    Item,
    AddItemForm,
    EmptyItemList,
    ItemListHeader,
  },
  mounted() {},
};
</script>