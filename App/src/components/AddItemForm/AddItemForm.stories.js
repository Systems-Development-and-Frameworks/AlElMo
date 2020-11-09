import AddItemForm from './AddItemForm'

export default {
  title: 'AddItemForm',
  compontent: AddItemForm,
  argTypes: {
    addItem: { action: 'addItem', table: { disable: true } },
    placeholderForm: { control: 'text' }
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AddItemForm },
  template: '<AddItemForm @addItem="addItem" v-bind="$props"/>',
})

export const placeholderForm = Template.bind({})
placeholderForm.args = {
  placeholderForm: "this is a placeholder"
}

export const emptyForm = Template.bind({})
emptyForm.args = {
  placeholderForm: ""
}