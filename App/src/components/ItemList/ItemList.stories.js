import ItemList from './ItemList'
import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

export default {
  title: 'ItemList',
  compontent: ItemList,
  argTypes: {
  }
};

const Template = (args, { argTypes }) => ({
  components: { ItemList },
  template: '<ItemList/>',
})

export const Primary = Template.bind({})