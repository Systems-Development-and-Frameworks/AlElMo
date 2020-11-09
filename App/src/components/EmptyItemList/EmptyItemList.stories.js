import EmptyItemList from './EmptyItemList'

export default {
    title: 'EmptyItemList',
    compontent: EmptyItemList,
};

const Template = (args, { argTypes }) => ({
  components: { EmptyItemList },
  template: '<EmptyItemList/>',
})

export const Primary = Template.bind({})