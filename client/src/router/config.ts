import TeamIndex from '../views/team/TeamIndex.vue';
import TeamActivity from '../views/team/TeamActivity.vue';
import TeamIntroduction from '../views/team/TeamIntroduction.vue';
import TeamTrend from '../views/team/TeamTrend.vue';
import TeamMember from '../views/team/TeamMember.vue';
import TeamSource from '../views/team/TeamSource.vue';
import TrendAdd from '../views/team/TrendAdd.vue';
import ActivityAdd from '../views/team/ActivityAdd.vue';
//import TeamList from '../views/TeamList.vue';
import JoinedTeam from '../views/home/JoinedTeam.vue';
import ManagedTeam from '../views/home/ManagedTeam.vue';
import MyTeam from '../views/home/MyTeam.vue';
import TeamAdd from '../views/TeamAdd.vue';

const teamRoute = [
	{
		path: '/team/index',
		component: TeamIndex,
	},
	{
		path: '/team/introduction',
		component: TeamIntroduction,
	},
	{
		path: '/team/member',
		component: TeamMember,
	},
	{
		path: '/team/source',
		component: TeamSource,
	},
	{
		path: '/team/trend',
		component: TeamTrend,
	},
	{
		path: '/team/trend/add',
		component: TrendAdd,
	},
	{
		path: '/team/activity',
		component: TeamActivity,
	},
	{
		path: '/team/activity/add',
		component: ActivityAdd,
	},
];
const homeRoute = [
	{
		path: '/index/joinedteam',
		component: JoinedTeam,
	},
	{
		path: '/index/managedteam',
		component: ManagedTeam,
	},
	{
		path: '/index/myteam',
		component: MyTeam,
	},
	{
		path: '/index/teamadd',
		component: TeamAdd,
	},
];
export { teamRoute, homeRoute };
