<template>
	<div class="wrap">
		<Header />
		<div class="middle">
			<div class="team-top">
				<div class="left">
					<div>{{ team.teamname }}</div>
					<el-button
						v-if="curRole === 'unknown'"
						link
						style="color: aliceblue; padding: 5px 10px; outline: 1px solid aliceblue; margin-top: 10px"
						@click="dialogVisible = true"
						>加入</el-button
					>
					<el-button
						v-if="curRole === 'creator'"
						link
						style="color: aliceblue; padding: 5px 10px; outline: 1px solid aliceblue; margin-top: 10px"
						@click="handleAdmin"
						>管理</el-button
					>
					<el-button
						link
						style="color: aliceblue; padding: 5px 10px; outline: 1px solid aliceblue; margin-top: 10px"
						>分享</el-button
					>
				</div>
				<div class="right">
					<img
						v-if="team?.cover"
						style="width: 132px; height: 132px; border-radius: 50%"
						:src="'http://localhost:3000/' + team?.cover"
						alt="团队封面"
					/>
				</div>
			</div>
			<div class="content">
				<el-menu
					:default-active="defalutMenu"
					mode="horizontal"
					text-color="#fff"
					active-text-color="#ffd04b"
					:router="true"
					:ellipsis="false"
				>
					<el-menu-item index="/team/index">首页</el-menu-item>
					<el-menu-item index="/team/introduction">简介</el-menu-item>
					<el-menu-item index="/team/member">成员</el-menu-item>
					<el-menu-item index="/team/trend">公告</el-menu-item>
					<el-menu-item index="/team/source">资源</el-menu-item>
					<el-menu-item index="/team/activity">活动</el-menu-item>
				</el-menu>
				<div><router-view></router-view></div>
			</div>
		</div>
		<div style="height: 8vh"></div>
		<div class="end">团队学习系统</div>
	</div>
	<el-dialog
		v-model="dialogVisible"
		title="问卷"
		width="30%"
		center
	>
		<span> 请输入密码 :<el-input v-model="teamPassword" /></span>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button
					type="primary"
					@click="handleJoin"
				>
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<script setup lang="ts">
import axios from 'axios';
import Header from '../components/Header.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
const route = useRoute();
const router = useRouter();
const team = ref<any>('');
const curRole = ref('');
const dialogVisible = ref(false);
const teamPassword = ref('');
var teamId: any;
var userId: any;
const defalutMenu = computed(() => {
	return route.fullPath;
});
const getLocal = () => {
	teamId = localStorage.getItem('teamId');
};
onMounted(async () => {
	userId = (await axios.get('/api/user/profile')).data.data.userId;
	getLocal();
	if (teamId) {
		const res = await axios.get(`/api/team/${teamId}`);
		team.value = res.data.data;
		const res2 = await axios.get('/api/team/role', {
			params: {
				teamId: teamId,
				userId: userId,
			},
		});
		if (!res2.data.data) curRole.value = 'unknown';
		else curRole.value = res2.data.data.role;
		localStorage.setItem('role', curRole.value);
	}
});
const handleJoin = async () => {
	const joinInfo = {
		teamId: +teamId,
		userId: userId,
	};
	try {
		const res = await axios.get('/api/team/pass', {
			params: {
				teamId: +teamId,
				password: teamPassword.value,
			},
		});
		if (res.data.data) {
			await axios.post('/api/team/jointeam', joinInfo);
			ElMessage('加入成功!');
			curRole.value = 'user';
			localStorage.setItem('role', 'user');
			dialogVisible.value = false;
		} else {
			ElMessage('密码错误');
		}
	} catch (e) {
		ElMessage('加入失败!');
	}
};
const handleAdmin = () => {
	router.push({
		path: '/team/member/manage',
		params: {
			teamId,
		},
	});
};
</script>
<style lang="scss" scoped>
.wrap {
	min-height: 100vh;
	background-color: #1e1e1e;
	position: relative;
}
.middle {
	width: 60%;
	background-color: #ffffff;
	min-height: 50vh;
	margin: 10px auto;
}

.team-top {
	display: flex;
	align-items: center;
	padding: 0 20px;
	height: 20vh;
	background-image: url('../assets/team-header-background.jpg');
	background-size: no-repeat;
	.left {
		font-size: 18px;
		color: aliceblue;
		width: 80%;
	}
	.right {
		width: 20%;
	}
}
.content {
	width: 100%;
	min-height: 62vh;
	.el-menu {
		width: 100%;
		display: flex;
		overflow-wrap: break-word;
	}
	:deep().el-menu-item {
		display: flex;
		align-items: center;
		color: #02a198;
		border-right: 1px solid #f1f3f4;
		font-size: 18px;
		width: 20%;
	}
}
.end {
	background-color: #3a3d3e;
	height: 4vh;
	bottom: 0;
	position: absolute;
	width: 100%;
	text-align: center;
	line-height: 4vh;
}
</style>
