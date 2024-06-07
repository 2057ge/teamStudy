<template>
	<div class="search">
		<div class="left-content">
			<a
				href="/index/myteam"
				style="outline: none; text-decoration: none; color: azure"
				>团队</a
			><input
				class="input"
				placeholder="请输入搜素的团队"
				v-model="keyword"
			/><el-button
				class="button"
				@click="handleSearch"
				>搜索</el-button
			>
		</div>

		<div class="right-content">
			<el-button
				title="退出登录状态 "
				@click="handleLogout"
				>退出</el-button
			>
			<el-button
				title="进入我的个人空间"
				@click="handleCenter"
				>个人空间</el-button
			>
			<span style="color: aliceblue; margin-right: 5px; font-size: 16px">{{
				user?.username ? user.username : 'username'
			}}</span>
		</div>
	</div>
	<div style="height: 5vh"></div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const user = ref<any>('');
const keyword = ref('');
onMounted(async () => {
	const res = (await axios.get('/api/user/profile')).data.data;
	user.value = (await axios.get(`/api/user/${res.userId}`)).data.data;
});
const handleSearch = () => {
	if (keyword.value?.length < 1) return;
	router.push({
		path: '/search',
		query: {
			keyword: keyword.value,
		},
	});
};
const handleCenter = () => {
	router.push({
		path: '/center',
	});
};
const handleLogout = () => {
	localStorage.removeItem('token');
	router.push({
		path: '/login',
	});
};
</script>
<style lang="scss" scoped>
.search {
	width: 100vw;
	z-index: 999;
	display: flex;
	position: fixed;
	box-sizing: border-box;
	background-color: #339999;
	padding: 0 20vw;
	height: 5vh;
	align-items: first baseline;
	font-size: 22px;
	.left-content {
		display: flex;
		align-items: center;
		height: 100%;
		width: 60%;
		color: aliceblue;

		.button {
			height: 3vh;
			background-color: #4662d9;
			color: aliceblue;
			border: none;
			width: 15%;
			border-top-right-radius: 20%;
			border-bottom-right-radius: 20%;
		}
	}
	.right-content {
		display: flex;
		flex-direction: row-reverse;
		width: 40%;
		align-items: center;
		.el-button {
			background-color: #339999;
			border: none;
			color: aliceblue;
		}
	}
}
.input {
	margin-left: 20px;
	border-top-left-radius: 12%;
	border-bottom-left-radius: 12%;
	height: 2.5vh;
	width: 40%;
	outline: none;
	border: none;
}
</style>
