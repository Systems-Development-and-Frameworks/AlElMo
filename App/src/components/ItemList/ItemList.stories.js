import ItemList from './ItemList'

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