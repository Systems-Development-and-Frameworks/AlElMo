import ItemListHeader from './ItemListHeader'

export default {
    title: 'ItemListHeader',
    compontent: ItemListHeader,
};

const Template = (args, { argTypes }) => ({
  components: { ItemListHeader },
  template: '<ItemListHeader/>',
})

export const Primary = Template.bind({})  