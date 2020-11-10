import ItemList from './ItemList';
import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

export default {
  title: 'ItemList',
  compontent: ItemList,
  argTypes: {
    descInitial: { table: { disable: true } },
    initialItemsArr: { table: { disable: true } },
    initialTitle: { control: 'text' }
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ItemList },
  template: '<item-list v-bind="$props"/>',
});

export const Descending = Template.bind({});
Descending.args = {
  ...Descending.args,
  descInitial: true,
};

export const Ascending = Template.bind({});
Ascending.args = {
  ...Ascending.args,
  descInitial: false,
};

export const EmptyList = Template.bind({});
EmptyList.args = {
  ...EmptyList.args,
  initialItemsArr: [],
  descInitial: true,
};

export const NonemptyTitle = Template.bind({});
NonemptyTitle.args = {
  ...NonemptyTitle.args,
  descInitial: true,
  initialTitle: "Ro"
};