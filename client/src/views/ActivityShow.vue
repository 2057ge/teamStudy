<template>
	<div style="min-height: 100vh; background-color: #f1f3f4">
		<div class="activity-header">活动信息</div>
		<div style="width: 60%; margin: 0 auto; background-color: #ffffff; text-align: right">
			<el-button
				v-if="role === 'unknown'"
				disabled
				>无权限</el-button
			>
			<el-button
				disabled
				v-else-if="activity.exist"
				>已报名</el-button
			>
			<el-button
				v-else
				@click="handleClick"
				>报名</el-button
			>
		</div>
		<div>
			<el-card
				class="box-card"
				shadow="hover"
			>
				<template #header>
					<div class="card-header">
						<span style="font-size: 24px; font-weight: bold"> {{ activity.title }}</span>
					</div>
				</template>
				<div
					class="activity-content"
					v-html="activity.content"
				></div>
				<template #footer>
					<span>发布者:{{ activity.creator?.username }}</span>
					<span style="margin-left: 40px">报名人数:{{ activity.enrollment }}</span>
				</template>
			</el-card>
		</div>
	</div>
	<el-dialog
		v-model="dialogVisible"
		title="提示"
		width="30%"
	>
		<span>您是否确定要报名?</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button
					type="primary"
					@click="handleSignUp"
				>
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<script setup lang="ts">
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const dialogVisible = ref(false);
var activityId: any;
var userId: any;
const activity = ref<any>('');
var role: any;
onMounted(async () => {
	role = localStorage.getItem('role') ?? 'unknown';
	activityId = route.query.activityId;
	userId = (await axios.get('/api/user/profile')).data.data.userId;
	console.log(activityId, userId);
	const res = await axios.get(`/api/activity/${activityId}`, {
		params: {
			userId,
		},
	});
	activity.value = res.data.data;
});
const handleClick = () => {
	dialogVisible.value = true;
};
const handleSignUp = async () => {
	dialogVisible.value = false;
	const signUpInfo = {
		activityId: activity.value.id,
		userId: userId,
	};
	console.log(signUpInfo);
	try {
		await axios.post('/api/activity/signup', signUpInfo);
		ElMessage('报名成功');
		activity.value.exist = true;
	} catch (e) {
		ElMessage('报名失败 ');
	}
};
</script>
<style lang="scss" scoped>
.activity-header {
	background-color: #409eff;
	height: 5vh;
	line-height: 5vh;
	padding-left: 40px;
	font-size: 18px;
}
.box-card {
	width: 60%;
	margin: 0 auto;
}
.activity-content {
	min-height: 40vh;
}
</style>
