import axios from 'axios';

axios.interceptors.request.use(
	function (config: any) {
		const token = localStorage.getItem('token');
		config.headers.Authorization = `Bearer ${token}`;
		config.headers['user'] = localStorage.getItem('role') ?? 'unknonw';
		config.user = {
			user: localStorage.getItem('role') ?? 'unknonw',
		};
		return config;
	},
	function (error) {
		return Promise.reject(error);
	},
);

axios.interceptors.response.use(
	function (response) {
		const { authorization } = response.headers;
		authorization && localStorage.setItem('token', authorization);
		return response;
	},
	function (error) {
		const { status } = error.response;
		if (status === 401) {
			localStorage.removeItem('token');
		}
		return Promise.reject(error);
	},
);
