import axios from '@/libs/axios';
import { createStore } from 'vuex';

export default createStore({
	state: {
		isAuthenticated: false,
		userId: null,
		userRole: null,
		userName: '',
	},
	mutations: {
		setAuth(state, payload) {
			state.isAuthenticated = payload.isAuthenticated;
			state.userId = payload.userId;
			state.userRole = payload.userRole;
			state.userName = payload.userName;
		},
		logout(state) {
			state.isAuthenticated = false;
			state.userId = null;
			state.userRole = null;
			state.userName = '';
		},
	},
	actions: {
		async login({ commit }, user) {
			commit('setAuth', {
				isAuthenticated: true,
				userId: user.id,
				userRole: user.peran_id,
				userName: user.nama,
			});
		},
		async logout({ commit }) {
			try {
				await axios.post('api/logout');
				commit('logout');
			} catch (error) {
				console.error('Error during logout:', error);
			}
		},
	},
	getters: {
		isAuthenticated: (state) => state.isAuthenticated,
		userId: (state) => state.userId,
		userRole: (state) => state.userRole,
		userName: (state) => state.userName,
	},
});
