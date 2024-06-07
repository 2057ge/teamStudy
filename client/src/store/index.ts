// store.ts
import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';

export interface State {
	userInfo: {
		id: string;
		loginId: string;
		username: string;
	};
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
	state: {
		userInfo: {
			id: '',
			loginId: '',
			username: '',
		},
	},
	actions: {},
	mutations: {
		saveUserInfo(state: State, value: any) {
			state.userInfo = {
				...state.userInfo,
				...value,
			};
		},
	},
	modules: {},
});

// 定义自己的 `useStore` 组合式函数
export function useStore() {
	return baseUseStore(key);
}
