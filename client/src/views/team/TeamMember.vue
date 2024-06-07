<template>
	<div class="member">
		<div class="header-admin">管理员</div>
		<div class="wrap-admin">
			<div
				class="admin"
				v-for="item in admin"
				:key="item.id"
			>
				<img
					v-if="item.user_avatar"
					:src="'http://localhost:3000/' + item.user_avatar"
					style="width: 60px; height: 60px"
				/>
				<img
					v-else
					:src="Avartar"
					style="width: 60px; height: 60px"
				/>
				<div style="width: 60px; display: flex; align-items: center; justify-content: center; word-break: break-all">
					{{ item.user_username }}
				</div>
			</div>
		</div>

		<div class="header-user">普通成员</div>

		<div class="wrap-admin">
			<div
				v-if="user.length == 0"
				style="width: 100%"
			>
				<el-empty :image-size="50" />
			</div>
			<div
				v-else
				class="admin"
				v-for="item in user"
				:key="item.id"
			>
				<img
					v-if="item.user_avatar"
					:src="'http://localhost:3000/' + item.user_avatar"
					style="width: 60px; height: 60px"
				/>

				<img
					v-else
					:src="Avartar"
					style="width: 60px; height: 60px"
				/>
				<div
					style="
						width: 60px;
						height: auto;
						display: flex;
						align-items: center;
						justify-content: center;
						word-break: break-all;
					"
				>
					{{ item.user_username }}
				</div>
			</div>
		</div>
		<div style="height: 6vh"></div>
	</div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import Avartar from '../../assets/default-avatat.png';
var teamId: any;
const user = ref(<any>[]);
const admin = ref<any>([]);
const member = ref(<any>[]);
onMounted(async () => {
	teamId = localStorage.getItem('teamId');
	const res = await axios.get(`/api/team/user/${teamId}`);
	member.value = res.data.data;
	for (let item of member.value) {
		if (item.role === 'user') user.value.push(item);
		else admin.value.push(item);
	}
	console.log(user.value);
	console.log(admin.value);
});
</script>
<style lang="scss" scoped>
.member {
	width: 100%;
	padding: 0 10px;
	box-sizing: border-box;
	min-height: 40vh;
}

.header-admin {
	padding: 0 10px;
	background-color: #339999;
	height: 30px;
	line-height: 30px;
	color: aliceblue;
}
.header-user {
	padding: 0 10px;
	background-color: #339999;
	height: 30px;
	line-height: 30px;
	color: aliceblue;
	margin-top: 10px;
}
.wrap-user {
	padding: 10px 10px;
	display: flex;
	flex-wrap: wrap;
	border: 1px solid #ccc;
	min-height: 20vh;
}
.wrap-admin {
	padding: 10px 10px;
	display: flex;
	flex-wrap: wrap;
	border: 1px solid #ccc;
	min-height: 18vh;
}
.admin {
	display: flex;
	flex-direction: column;
	margin-right: 10px;
}
</style>
