import AddItemForm from './AddItemForm'

export default {
    title: 'AddItemForm',
    compontent: AddItemForm,
};

const Template = (args, { argTypes }) => ({
  components: { AddItemForm },
  template: '<AddItemForm/>',
})

export const Primary = Template.bind({})