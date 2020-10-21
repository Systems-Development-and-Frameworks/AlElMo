<template>
  <b-card
    class="h-100 border-none"
    header-class="card-header-footer border-none"
    footer-class="card-header-footer border-none"
    body-class="card-body-c scroll-y"
  >
    <template #header>
      <b-row>
        <b-col class="text-center news-list-header">News List</b-col>
      </b-row>
    </template>
    <!-- VueDraggable with Transitiongroup component to add nice animation/transition when upvoting or downvoting items -->
    <draggable :value="newsItemsOrdered" handle="-">
      <transition-group type="transition" name="smooth-list">
        <!-- The news items -->
        <news-item
          v-for="item in newsItemsOrdered"
          :key="item.id"
          :id="item.id"
          :title="item.title"
          :votes="item.votes"
          @update="updateNewsItem"
          @delete="deleteNewsItem"
        />
      </transition-group>
    </draggable>
    <!-- The component to add news items -->
    <template #footer>
      <add-news-item-form @create="createNewsItem" />
    </template>
  </b-card>
</template>

<script>
import Draggable from "vuedraggable";
import NewsItem from "./NewsItem.vue";
import AddNewsItemForm from "./AddNewsItemForm.vue";
export default {
  data() {
    return {
      newsItems: [],
      currentId: 0,
    };
  },
  props: {},
  methods: {
    /**
     * Creates a new news item
     * @param {Object} item The new news item
     */
    createNewsItem(item) {
      const { title } = item;
      const id = `news_item_${this.currentId}_${Date.now()}`;
      const votes = 0;
      this.newsItems.unshift({ id, title, votes });
      this.currentId += 1;
    },

    /**
     * Deletes a news item
     * @param {Object} item The news item
     */
    deleteNewsItem(item) {
      const { id } = item;
      this.newsItems = this.newsItems.filter((e) => e.id !== id);
    },

    /**
     * Updates a news item
     * @param {Object} item The news item
     */
    updateNewsItem(item) {
      const { id } = item;
      this.newsItems = this.newsItems.map((e) => (e.id === id && item) || e);
      /*
      Also possible:
      const index = this.newsItems.findIndex((e) => e.id === id);
      index !== -1 && this.$set(this.newsItems, index, item);
       */
    },
  },
  computed: {
    newsItemsOrdered() {
      return this.newsItems.slice().sort((e1, e2) => e2.votes - e1.votes);
    },
  },
  components: {
    draggable: Draggable,
    "news-item": NewsItem,
    "add-news-item-form": AddNewsItemForm,
  },
  mounted() {},
};
</script>

<style>
.smooth-list-move {
  transition: transform 0.5s;
}
.news-list-header {
  font-size: 2.5rem;
}
.card-body-c {
  background-color: #222222;
}
.card-header-footer {
  background-color: #333333 !important;
}
.border-none {
  border: none !important;
  border-radius: 0px !important;
}
.scroll-y {
  overflow-y: scroll;
}
</style>
