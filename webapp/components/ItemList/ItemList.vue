<template>
  <b-container class="text-center">
    <item-list-header :desc="desc" @toggleOrder="toggleOrdering" />
    <template v-if="posts.length">
      <b-row>
        <b-col v-for="item in itemsArrOrdered" cols="3">
          <item
            :key="item.id"
            :item="item"
            @changeVotes="updateVotes"
            @remove="removeItem"
          /> </b-col
      ></b-row>
    </template>
    <empty-item-list v-else />
    <add-item-form :initial-title="initialTitle" @addItem="addItem" />
  </b-container>
</template>

<script>
import Item from "../Item/Item.vue";
import AddItemForm from "../AddItemForm/AddItemForm.vue";
import EmptyItemList from "../EmptyItemList/EmptyItemList.vue";
import ItemListHeader from "../ItemListHeader/ItemListHeader.vue";
import gql from "graphql-tag";

const getInitialArr = function () {
  return [];
};
const getPostsQuery = gql`
  query {
    posts {
      id
      author {
        id
      }
      title
      votes
    }
  }
`;

export default {
  data() {
    return {
      posts: [],
      desc: this.descInitial,
    };
  },
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
  computed: {
    itemsArrOrdered() {
      return this.sortItems(this.posts);
    },
  },
  apollo: {
    posts: getPostsQuery,
  },
  methods: {
    updateVotes(item) {
      this.posts = this.posts.map((e) => (item.id === e.id ? item : e));
    },
    removeItem(item) {
      this.posts = this.posts.filter((e) => e.id != item.id);
    },
    addItem(item) {
      this.posts.push(item);
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