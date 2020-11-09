
import ItemList from './ItemList'
import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

export default {
  title: 'ItemList',
  compontent: ItemList,
};

const Template = (args, { argTypes }) => ({
  data: function () {
    return {
      itemsArr: [
        { id: 1, title: "Al", votes: 3 },
        { id: 2, title: "El", votes: 5 },
        { id: 3, title: "Mo", votes: 1 },
      ],
      desc: false,
    }
  },


  props: Object.keys(argTypes),
  components: { ItemList },
  template: '<ItemList/>',
})

export const Descending = Template.bind({});
Descending.data = {
  itemsArr: [
    { id: 1, title: "Al", votes: 3 },
    { id: 2, title: "El", votes: 5 },
    { id: 3, title: "Mo", votes: 1 },
  ],
  desc: true,
};

export const Ascending = Template.bind({});
Ascending.data = {
  itemsArr: [
    { id: 1, title: "Al", votes: 3 },
    { id: 2, title: "El", votes: 5 },
    { id: 3, title: "Mo", votes: 1 },
  ],
  desc: false,
};