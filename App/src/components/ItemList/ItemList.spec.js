import { mount } from '@vue/test-utils'
import ItemList from './ItemList.vue'
import Item from '../Item.vue'


describe('ItemList', () => {
    it('renders Itemlist empty :( when passed', () => {
        const msg = 'Itemlist empty :('
        const wrapper = mount(ItemList)

        wrapper.setData({ itemsArr: [] })

        const item = wrapper.findComponent(Item)
        expect(item.exists()).toBe(false)
    })
})