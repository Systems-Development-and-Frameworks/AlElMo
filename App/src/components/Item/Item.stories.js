import Item from './Item'

export default {
    title: 'Item',
    compontent: Item,
};

const Template = (args, { argTypes }) => ({
  components: { Item },
  template: '<Item v-bind="$props" />',
})

export const Primary = Template.bind({});

Primary.args = {
  item: {id: 1, title: 'test', votes: 0},
}