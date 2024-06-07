<template>
	<div class="wrap-activity">
		<div class="activity-header">
			<div style="flex: 11; margin-left: 40px; padding-left: 10px">活动列表</div>
			<div style="flex: 4">
				<el-button
					@click="handleAdd"
					v-if="role === 'admin' || role === 'creator'"
				>
					添加活动</el-button
				>
			</div>
		</div>
		<div
			class="contain"
			v-if="activities.length"
		>
			<div
				style="display: flex; width: 100%; border-bottom: 1px dotted #555"
				v-for="activity in activities"
				:key="activity.id"
			>
				<div class="one-activity">
					<div style="margin-bottom: 10px">
						<el-button
							style="font-size: 18px; font-weight: bold"
							link
							@click="viewActivity(activity)"
							>{{ activity?.title }}</el-button
						>
					</div>

					<div class="bottom">
						<div>发布者:{{ activity.creator?.username }}&nbsp;|</div>
						<div style="margin-left: 10px">发布时间:{{ formalTime(activity.publishTime) }} &nbsp;|&nbsp;</div>
						<div>报名人数:{{ activity.enrollment }}</div>
						<div style="margin-top: 10px">
							<span style="margin-right: 10px">开始时间:{{ formalTime(activity.startTime) }}&nbsp;|</span>
							<span>结束时间:{{ formalTime(activity.endTime) }}</span>
						</div>
					</div>
				</div>
				<div
					v-if="getState(activity) == 2"
					class="sign-up"
					style="color: #ffd262"
				>
					已结束
				</div>
				<div
					v-else-if="getState(activity) == 0"
					class="sign-up"
				>
					未开始
				</div>
				<div
					v-if="getState(activity) == 1"
					class="sign-up"
					style="color: #409eff"
				>
					<div>进行中</div>

					<el-button
						style="margin-left: 20px"
						v-if="role === 'unknown'"
						disabled
						>无权限</el-button
					>
					<el-button
						style="margin-left: 20px"
						v-else-if="activity.exist"
						disabled
						>已报名</el-button
					>
					<el-button
						v-else
						style="margin-left: 20px"
						@click="handleC(activity)"
						>报名</el-button
					>
				</div>
			</div>

			<el-pagination
				small
				background
				:pageSize="6"
				layout="prev, pager, next"
				:total="total"
				:current-page="curSize"
				class="mt-4"
				@current-change="handleChangePage"
			/>
		</div>
		<el-empty
			:image-size="200"
			v-else
		/>
	</div>
	<el-dialog
		v-model="dialogVisible"
		title="提示"
		width="30%"
	>
		<span>您是否确定要报名?</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleSignUp">取消</el-button>
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
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { formalTime } from '../../utils/formalTime.ts';
import moment from 'moment';
import { ElMessage } from 'element-plus';
var teamId: string;
const getState = (a: any) => {
	if (moment().isBefore(a.startTime)) return 0;
	else if (moment().isAfter(a.endTime)) return 2;
	else return 1;
};
const total = ref(0);
const curSize = ref(1);
const router = useRouter();
const activitiesData = ref<any>([]);
const activities = ref<any>([]);
const dialogVisible = ref(false);
const curA = ref<any>();
const role = ref('');
var userId: string;
const getActivities = async () => {
	if (teamId) {
		const res = await axios.get(`/api/activity/team/${+teamId}`, {
			params: {
				userId: userId,
			},
		});
		activitiesData.value = res.data.data;
		console.log(activitiesData.value);
		total.value = activitiesData.value.length;
		let size: any = localStorage.getItem('curSize') ? localStorage.getItem('curSize') : '1';
		curSize.value = size;
		handleChangePage(+size);
	}
};
onMounted(async () => {
	userId = (await axios.get('/api/user/profile')).data.data.userId;
	teamId = localStorage.getItem('teamId') ?? '';
	getActivities();
	role.value = localStorage.getItem('role') ?? 'unknown';
});

const handleChangePage = (current: number) => {
	curSize.value = current;
	localStorage.setItem('curSize', current.toString());
	let st = (current - 1) * 6;
	let ed = current * 6 > total.value ? total.value : current * 6;
	activities.value = activitiesData.value.slice(st, ed);
};
onBeforeUnmount(() => {
	localStorage.removeItem('curSize');
});
const handleAdd = () => {
	router.push({
		path: '/team/activity/add',
	});
};
const viewActivity = async (activity: any) => {
	const { href } = router.resolve({
		path: '/activity/show',
		query: {
			activityId: activity.id,
		},
	});
	window.open(href, '_target');
};
const handleC = (a: any) => {
	dialogVisible.value = true;
	curA.value = a;
};
const handleSignUp = async () => {
	dialogVisible.value = false;
	const signUpInfo = {
		activityId: curA.value.id,
		userId: userId,
	};
	try {
		await axios.post('/api/activity/signup', signUpInfo);
		ElMessage('报名成功');

		curA.value.exist = true;
	} catch (e) {
		ElMessage('报名失败 ');
	}
};
</script>
<style lang="scss" scoped>
.wrap-activity {
	bottom: 2px solid black;
	height: 60vh;
	padding-bottom: 20px;
	position: relative;
}

.activity-header {
	margin-top: 20px;
	padding-right: 20px;
	display: flex;
	align-items: center;
}
.contain {
	margin-left: 40px;
	margin-right: 40px;
	display: flex;
	flex-direction: column;
}
.one-activity {
	padding: 0 10px;
	margin-top: 15px;

	box-sizing: border-box;
	width: 60%;
	.bottom {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 15px;
		color: #666;
		font-size: 14px;
	}
}
.sign-up {
	width: 40%;
	display: flex;
	justify-content: center;
	align-items: center;

	color: #666666;
}
.el-pagination {
	position: absolute;
	bottom: 20px;
	margin-left: 40px;
	margin-top: 20px;
	display: flex;
	width: 80%;
	justify-content: center;
}
</style>
