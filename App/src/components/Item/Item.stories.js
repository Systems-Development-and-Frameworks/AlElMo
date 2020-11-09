import Item from './Item'

export default {
  title: 'Item',
  compontent: Item,
  argTypes: {
    remove: { action: 'remove', table: { disable: true } },
    changeVotes: { action: 'changeVotes', table: { disable: true } }
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Item },
  template: '<Item :item="item" @remove="remove" @changeVotes="changeVotes" v-bind="$props"/>',
})

export const SingleItem = Template.bind({});

SingleItem.args = {
  item: { id: '1', title: 'test', votes: 0 },
}