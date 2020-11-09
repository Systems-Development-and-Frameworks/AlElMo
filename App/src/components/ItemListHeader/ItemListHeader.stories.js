import ItemListHeader from './ItemListHeader'
import BootstrapVue from 'bootstrap-vue';

export default {
  title: 'ItemListHeader',
  compontent: ItemListHeader,
};

const Template = (args, { argTypes }) => ({
  components: { ItemListHeader, BootstrapVue },
  template: '<ItemListHeader/>',
})

export const Primary = Template.bind({})  