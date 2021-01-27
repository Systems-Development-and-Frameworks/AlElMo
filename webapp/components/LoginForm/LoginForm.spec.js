import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import LoginForm from './LoginForm.vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(IconsPlugin);
localVue.use(Vuex);

describe('LoginForm.vue', () => {
    let actions;
    let getters;
    let store;

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
        });
        return mount(LoginForm, { store, localVue });
    };

    beforeEach(() => {
        getters = {
            isAuthenticated: () => false,
        };
    });

    describe('form submit', () => {
        const login = async (wrapper) => {
            wrapper.find('#email').setValue('Test@cool.de');
            wrapper.find('#password').setValue('12345678');
            await wrapper.find('#submit').trigger('submit');
        };

        it('shows no error', async () => {
            const wrapper = setupWrapper();
            await login(wrapper);
            await localVue.nextTick();
            expect(wrapper.find('.log-in-link').exists()).toBe(false);
            expect(wrapper.find('.log-out-link').exists()).toBe(false);
        });

        describe('when credentials are wrong', () => {
            const login = async (wrapper) => {
                wrapper.find('#email').setValue('Test@cool.de');
                wrapper.find('#password').setValue('12345678');
                await wrapper.find('#submit').trigger('submit');
            };

            it('shows wrong credentials error', async () => {
                const wrapper = setupWrapper();
                await login(wrapper);
                await localVue.nextTick();
                expect(wrapper.find('.log-in-link').exists()).toBe(false);
                expect(wrapper.find('.log-out-link').exists()).toBe(false);

            });
        });
    });
});