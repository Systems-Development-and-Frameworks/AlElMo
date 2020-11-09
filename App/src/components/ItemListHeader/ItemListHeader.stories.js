import ItemListHeader from './ItemListHeader'
import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

export default {
    title: 'ItemListHeader',
    compontent: ItemListHeader,
    argTypes: {
      click: {action: 'click'},
    }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ItemListHeader },
  template: '<ItemListHeader @click="click" v-bind="$props"/>',
})

export const Descending = Template.bind({})  
Descending.args = {
  desc: false,
}

export const Ascending = Template.bind({})  
Ascending.args = {
  desc: true,
}