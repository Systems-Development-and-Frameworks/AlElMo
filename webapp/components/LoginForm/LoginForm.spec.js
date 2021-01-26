import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import LoginForm from './LoginForm.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('LoginForm.vue', () => {
    let actions
    let getters
    let store

    const setupWrapper = () => {
        store = new Vuex.Store({
            modules: {
                tokenstore: {
                    namespaced: true,
                    state: () => ({
                        userId: null,
                        jwtToken: null,
                    }),
                    actions,
                    getters,
                },
            },
        })
        return shallowMount(LoginForm, { store, localVue })
    }

    beforeEach(() => {
        getters = {
            isAuthenticated: () => false,
        }
    })

    describe('form submit', () => {
        const login = async (wrapper) => {
            wrapper.find('input#email').setValue('Test@cool.de')
            wrapper.find('input#password').setValue('12345678')
            await wrapper.find('#submit').trigger('submit')
        }

        it('shows no error', async () => {
            const wrapper = setupWrapper()
            await login(wrapper)
            expect(wrapper.find('.isAuth').exists()).toBe(true)
            expect(wrapper.find('.isAuth#true').exists()).toBe(true)
        })

        describe('when credentials are wrong', () => {
            const login = async (wrapper) => {
                wrapper.find('input#email').setValue('Test@cool.de')
                wrapper.find('input#password').setValue('12345678')
                await wrapper.find('#submit').trigger('submit')
            }

            it('shows wrong credentials error', async () => {
                const wrapper = setupWrapper()
                await login(wrapper)
                await localVue.nextTick()
                expect(wrapper.find('.isAuth').exists()).toBe(true)
                expect(wrapper.find('.isAuth#true').exists()).toBe(false)

            })
        })
    })
})