import { shallowMount } from '@vue/test-utils'
import Message from '@/components/AddItemForm/AddItemForm.vue'

describe('Message', () => {
    it('renders Itemlist empty :( when passed', () => {
        const msg = 'Itemlist empty :('
        const wrapper = shallowMount(Message, {
            context: { props: { msg } }
        })
        expect(wrapper.text()).toBe(msg)
    })
})