import AddItemForm from './AddItemForm';

export default {
  title: 'AddItemForm',
  compontent: AddItemForm,
  argTypes: {
    addItem: { action: 'addItem', table: { disable: true } },
    initialTitle: { control: 'text' }
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AddItemForm },
  template: '<add-item-form @addItem="addItem" v-bind="$props"/>',
});

export const EmptyTitle = Template.bind({});

export const NonemptyTitle = Template.bind({});
NonemptyTitle.args = {
  initialTitle: "Ro"
};