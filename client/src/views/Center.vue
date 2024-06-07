<template>
	<div class="wrap">
		<div class="head">
			<span
				><a
					style="text-decoration: none; color: black"
					href="/index/myteam"
					>团队</a
				></span
			>
			<span>个人中心</span>

			<el-button @click="handleChange">修改</el-button>
		</div>
		<div style="margin-top: 20px; width: 100%">
			<el-card class="box-card">
				<template #header>
					<div class="card-header">
						<div>
							<el-avatar
								:src="imgSrc ? imgSrc : DefalutAvatat"
								:size="100"
							/>
						</div>
						<div class="user-content">
							<div class="username"><span>用户名</span>{{ userInfo.username }}</div>
							<div class="longinId"><span>账号</span>{{ userInfo.loginId }}</div>
							<div class="gender"><span>性别</span>{{ genderTrans[userInfo.gender as keyof typeof genderTrans] }}</div>
						</div>
					</div>
				</template>

				<div class="introduction">
					<div class="introduction-head">简介</div>
					<div class="introduction-content">{{ userInfo.introduction ?? defaultIntroduction }}</div>
				</div>
				<template #footer>团队学习系统</template>
			</el-card>
		</div>
		<div class="tail"></div>
	</div>
</template>
<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import DefalutAvatat from '../assets/default-avatat.png';
import { useRouter } from 'vue-router';
const router = useRouter();
const userInfo = ref<any>('');
const defaultIntroduction = '个人简介为空';
const imgSrc = ref('');
const genderTrans = { unknown: '保密', male: '男', woman: '女' };
onMounted(async () => {
	const profile = (await axios.get('/api/user/profile')).data.data;
	const res = await axios.get(`/api/user/${profile.userId}`);
	console.log(res.data.data);
	userInfo.value = res.data.data;
	if (userInfo.value?.avatar) {
		imgSrc.value = 'http://localhost:3000/' + userInfo.value?.avatar;
	}
});
const handleChange = () => {
	router.push({
		path: '/user/update',
		query: {
			userId: userInfo.value.id,
		},
	});
};
</script>
<style lang="scss" scoped>
.wrap {
	display: flex;
	flex-direction: column;
	width: 100%;
	background-color: #0a3a51;
	min-height: 100vh;
	position: relative;
}
.head {
	display: flex;
	justify-content: space-around;
	background-color: #339999;
	padding: 20px 20px;
	font-size: 18px;
}
.box-card {
	margin: 0 auto;
	width: 60%;
}
.card-header {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
}
.user-content {
	span {
		display: inline-block;
		width: 50px;
		color: black;
		margin-right: 5px;
	}
}
.introduction {
	min-height: 30vh;
	width: 100%;
}
.introduction-head {
	font-size: 18px;
	padding: 10px 10px;
	background-color: #e7e7e8;
	width: 200px;
	color: black;
}
.introduction-content {
	white-space: pre-wrap;
	font-size: 14px;
}
.tail {
	position: absolute;
	bottom: 0;
	height: 10vh;
	width: 100%;
	background-color: #1e1e1e;
}
</style>
