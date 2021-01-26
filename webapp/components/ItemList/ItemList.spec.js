
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import ItemList from './ItemList.vue';
import Item from '../Item/Item.vue';
import EmptyItemList from '../EmptyItemList/EmptyItemList.vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

const localVue = createLocalVue();
const components = [
    '../Item/Item.vue',
    '../AddItemForm/AddItemForm.vue',
    '../ItemListHeader/ItemListHeader.vue',
    '../EmptyItemList/EmptyItemList.vue',
  ];
  components.forEach((path) => {
    const name = path.match(/(\w*)\.vue$/)[1];
    localVue.component(`${name}`, require(path).default);
  });

localVue.use(BootstrapVue);
localVue.use(IconsPlugin);
localVue.use(Vuex);


describe('ItemList', () => {
    it('     empty', () => {
        const itemList = shallowMount(ItemList, {
            data() {
                return {
                    posts: [],
                };
            },
            localVue
        });
        const item = itemList.findComponent(Item);
        const emptyItem = itemList.findComponent(EmptyItemList);
        expect(item.exists()).toBe(false);
        expect(emptyItem.exists()).toBe(true);
    });

    it('Does not contain EmptyListItem but Items when list is not empty', () => {
        const itemList = shallowMount(ItemList, {
            data() {
                return {
                    posts: [
                        { id: 1, title: "Al", votes: 3 },
                    ]
                };
            },
            localVue
        });
        const item = itemList.findComponent(Item);
        const emptyItem = itemList.findComponent(EmptyItemList);
        expect(item.exists()).toBe(true);
        expect(emptyItem.exists()).toBe(false);
    });

    it('Orders items in descending order if data property "desc" is true', () => {
        const itemList = shallowMount(ItemList, {
            data() {
                return {
                    posts: [
                        { id: 1, title: "El", votes: 3 },
                        { id: 2, title: "Al", votes: 5 },
                    ],
                    desc: true
                };
            },
            localVue
        });
        expect(itemList.vm.itemsArrOrdered).toEqual([
            { id: 2, title: "Al", votes: 5 },
            { id: 1, title: "El", votes: 3 },
        ]);
    });

    it('Orders items in ascending order if data property "desc" is false', () => {
        const itemList = shallowMount(ItemList, {
            data() {
                return {
                    posts: [
                        { id: 2, title: "Al", votes: 5 },
                        { id: 1, title: "El", votes: 3 },
                    ],
                    desc: false
                };
            },
            localVue
        });
        expect(itemList.vm.itemsArrOrdered).toEqual([
            { id: 1, title: "El", votes: 3 },
            { id: 2, title: "Al", votes: 5 },
        ]);
    });
});