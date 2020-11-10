import EmptyItemList from './EmptyItemList'

export default {
    title: 'EmptyItemList',
    compontent: EmptyItemList,
    argTypes: {
        /*
        todo - fix message: text not rendering from story or control
        message: { control: 'text' }
        */
    },
};

const Template = (args, { argTypes }) => ({
    components: { EmptyItemList },
    template: '<EmptyItemList v-bind="$props"/>',
})

export const EmptyList = Template.bind({})
EmptyList.args = {
    // message: "empty list message",
}