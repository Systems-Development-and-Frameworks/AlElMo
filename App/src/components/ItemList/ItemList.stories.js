import ItemList from './ItemList'
import { Descending, Ascending } from '../ItemListHeader/ItemListHeader.stories'
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
  props: Object.keys(argTypes),
  components: { ItemList },
  template: '<ItemList v-bind="$props"/>',
})

export const DescendingList = Template.bind({});
DescendingList.args = {
  ...Descending.args,
  descInitial: true,
};

export const AscendingList = Template.bind({});
AscendingList.args = {
  ...Ascending.args,
  descInitial: false,
  //Todo: change value of ItemList.desc
};

export const EmptyList = Template.bind({});
  //Todo: remove all items in itemsArr
