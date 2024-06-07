<template>
	<div class="wrap">
		<Header />

		<div class="team">
			<el-row style="margin-bottom: 1vh">
				<el-col :span="22">
					<el-menu
						:default-active="curPath == '/index' ? '/index/myteam' : curPath"
						class="el-menu-demo"
						mode="horizontal"
						:router="true"
					>
						<el-menu-item
							class="main-item"
							index="/index/myteam"
							>我的团队</el-menu-item
						>
						<el-menu-item index="/index/managedteam">管理的团队</el-menu-item>
						<el-menu-item index="/index/joinedTeam">加入的团队</el-menu-item>
					</el-menu>
				</el-col>
				<el-col :span="2">
					<el-button
						style="
							display: flex;
							height: 100%;
							width: 100%;
							justify-content: end;
							align-items: center;
							border-bottom: solid 1px #dcdfe6;
						"
						link
						title="创建团队"
						@click="handleCreate"
					>
						<img :src="Create" /></el-button
				></el-col>
			</el-row>
			<router-view></router-view>
		</div>
	</div>
</template>
<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref, onBeforeUnmount, computed } from 'vue';
import Create from '../assets/create.png';
import Header from '../components/Header.vue';
import { useRoute, useRouter } from 'vue-router';
const data = ref([
	{ id: 1, name: 'Google' },
	{ id: 2, name: 'Runoob' },
	{ id: 3, name: 'Taobao' },
]);
var cnt: number = 0;
const route = useRoute();
const router = useRouter();
const curPath = computed(() => {
	return route.fullPath;
});
const user = ref<any>('');
onMounted(async () => {
	for (var i = 0; i < 100; i++) {
		data.value = data.value.concat([{ id: 4, name: 'Taobao' }]);
	}
	const res = (await axios.get('/api/user/profile')).data.data;
	user.value = (await axios.get(`/api/user/${res.userId}`)).data.data;
});
const orderScroll = (_e: any) => {
	let num = document.documentElement.scrollTop;
	let num2 = document.documentElement.clientHeight;
	let num3 = document.documentElement.scrollHeight;
	if (Math.abs(num3 - num2 - num) <= 0.5) {
		if (cnt < 5) {
			for (var i = 0; i < 100; i++) {
				data.value = data.value.concat([{ id: 4, name: 'Taobao' }]);
			}
			cnt++;
		}
	}
};

window.addEventListener('scroll', orderScroll);
const beforeDestroy = () => {
	window.removeEventListener('scroll', orderScroll);
};
onBeforeUnmount(() => {
	beforeDestroy();
});
const handleCreate = () => {
	router.push('/index/teamadd');
};
</script>
<style lang="scss" scoped>
.wrap {
	background-color: #1e1e1e;
	min-height: 100vh;
}

.team {
	//top: 5vh;
	//position: relative;
	width: 100;
	background-color: #ffffff;
	min-height: 82vh;
	margin: 0 20vw;
	margin-top: 3vh;
	//top: 5vh;
	.el-menu-item {
		color: #3d9f9f;
		font-size: large;
	}
}
</style>
