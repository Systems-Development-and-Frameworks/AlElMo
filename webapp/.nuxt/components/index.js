export { default as Logo } from '../..\\components\\Logo.vue'
export { default as AddItemForm } from '../..\\components\\AddItemForm\\AddItemForm.vue'
export { default as EmptyItemList } from '../..\\components\\EmptyItemList\\EmptyItemList.vue'
export { default as Item } from '../..\\components\\Item\\Item.vue'
export { default as ItemList } from '../..\\components\\ItemList\\ItemList.vue'
export { default as ItemListHeader } from '../..\\components\\ItemListHeader\\ItemListHeader.vue'
export { default as LoginForm } from '../..\\components\\LoginForm\\LoginForm.vue'

export const LazyLogo = import('../..\\components\\Logo.vue' /* webpackChunkName: "components/logo" */).then(c => c.default || c)
export const LazyAddItemForm = import('../..\\components\\AddItemForm\\AddItemForm.vue' /* webpackChunkName: "components/add-item-form" */).then(c => c.default || c)
export const LazyEmptyItemList = import('../..\\components\\EmptyItemList\\EmptyItemList.vue' /* webpackChunkName: "components/empty-item-list" */).then(c => c.default || c)
export const LazyItem = import('../..\\components\\Item\\Item.vue' /* webpackChunkName: "components/item" */).then(c => c.default || c)
export const LazyItemList = import('../..\\components\\ItemList\\ItemList.vue' /* webpackChunkName: "components/item-list" */).then(c => c.default || c)
export const LazyItemListHeader = import('../..\\components\\ItemListHeader\\ItemListHeader.vue' /* webpackChunkName: "components/item-list-header" */).then(c => c.default || c)
export const LazyLoginForm = import('../..\\components\\LoginForm\\LoginForm.vue' /* webpackChunkName: "components/login-form" */).then(c => c.default || c)
