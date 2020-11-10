import Item from './Item';

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
  template: '<item :item="item" @remove="remove" @changeVotes="changeVotes" v-bind="$props"/>',
});

export const ZeroItem = Template.bind({});
ZeroItem.args = {
  item: { id: '1', title: 'Zero', votes: 0 },
};

export const PositiveItem = Template.bind({});
PositiveItem.args = {
  item: { id: '1', title: 'Positive', votes: 99 },
};

export const NegativeItem = Template.bind({});
NegativeItem.args = {
  item: { id: '1', title: 'Negative', votes: -99 },
};