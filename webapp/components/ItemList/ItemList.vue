<template>
  <b-container class="text-center">
    <item-list-header
      :desc="desc"
      @toggleOrder="toggleOrdering"
    />
    <template v-if="itemsArr.length">
      <item
        v-for="item in itemsArrOrdered"
        :key="item.id"
        :item="item"
        @changeVotes="updateVotes"
        @remove="removeItem"
      />
    </template>
    <empty-item-list v-else />
    <add-item-form
      :initial-title="initialTitle"
      @addItem="addItem"
    />
  </b-container>
</template>

<script>
import Item from "../Item/Item.vue";
import AddItemForm from "../AddItemForm/AddItemForm.vue";
import EmptyItemList from "../EmptyItemList/EmptyItemList.vue";
import ItemListHeader from "../ItemListHeader/ItemListHeader.vue";

const getInitialArr = function () {
  return [
    { id: 1, title: "Al", votes: 3 },
    { id: 2, title: "El", votes: 5 },
    { id: 3, title: "Mo", votes: 1 },
  ];
};

export default {
  components: {
    Item,
    AddItemForm,
    EmptyItemList,
    ItemListHeader,
  },
  props: {
    initialTitle: {
      type: String,
      default: "",
    },
    descInitial: {
      type: Boolean,
      default: true,
    },
    initialItemsArr: {
      type: Boolean,
      default: getInitialArr,
    },
  },
  data() {
    return {
      itemsArr: this.initialItemsArr,
      desc: this.descInitial,
    };
  },
  computed: {
    itemsArrOrdered() {
      return this.sortItems(this.itemsArr);
    },
  },
  mounted() {},
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
};
</script>