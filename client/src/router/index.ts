import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Regiser from '../views/Register.vue';
import TrendShow from '../views/TrendShow.vue';
import ActivityShow from '../views/ActivityShow.vue';
import MemberManage from '../views/team/MemberManage.vue';

import SearchTeam from '../views/SearchTeam.vue';
import TeamShow from '../views/TeamShow.vue';
import Center from '../views/Center.vue';
import UserUpdate from '../views/UserUpdate.vue';
import { teamRoute, homeRoute } from './config';
const routes = [
	{
		path: '/login',
		component: Login,
		name: 'login',
	},
	{
		path: '/index',
		component: Home,
		name: 'home',
	},
	{
		path: '/register',
		component: Regiser,
		name: 'register',
	},
	{
		path: '/trend/show',
		name: 'trendshow',
		component: TrendShow,
	},
	{
		path: '/',
		redirect: '/index/myteam',
	},
	{
		name: 'search',
		path: '/search',
		component: SearchTeam,
	},
	{
		path: '/team',
		name: 'team',
		component: TeamShow,
	},
	{
		name: 'center',
		path: '/center',
		component: Center,
	},
	{
		name: 'userUpdate',
		path: '/user/update',
		component: UserUpdate,
	},
	{
		path: '/activity/show',
		component: ActivityShow,
	},
	{
		path: '/team/member/manage',
		component: MemberManage,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});
homeRoute.forEach((item) => {
	router.addRoute('home', item);
});
teamRoute.forEach((item) => {
	router.addRoute('team', item);
});
router.beforeEach((to, _from, next) => {
	if (to.fullPath == '/login') {
		next();
	} else if (to.fullPath == '/register') {
		next();
	} else {
		const token = localStorage.getItem('token');
		if (!token)
			next({
				path: '/login',
			});

		next();
	}
});
export default router;
