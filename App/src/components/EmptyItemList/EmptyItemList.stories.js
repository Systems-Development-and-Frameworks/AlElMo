import EmptyItemList from './EmptyItemList';

export default {
    title: 'EmptyItemList',
    compontent: EmptyItemList,
    argTypes: {
        message: { control: 'text' }
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { EmptyItemList },
    template: '<EmptyItemList v-bind="$props"/>',
});

export const EmptyList = Template.bind({});
EmptyList.args = {
    message: "List is empty :(",
};