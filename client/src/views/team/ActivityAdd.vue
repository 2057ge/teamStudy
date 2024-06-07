<template>
	<el-form
		:model="activityForm"
		ref="activityFormRef"
		status-icon
		label-width="120px"
		:rules="activityRules"
		style="margin-right: 40px; margin-top: 40px"
	>
		<el-form-item
			label="主题"
			:label-width="140"
			prop="title"
		>
			<el-input
				v-model="activityForm.title"
				autocomplete="off"
			/>
		</el-form-item>

		<el-form-item
			label="活动内容"
			:label-width="140"
			prop="content"
		>
			<Editor @getHtmlVal="getHtml" />
		</el-form-item>
		<el-form-item
			label="活动开始时间"
			:label-width="140"
		>
			<div class="dateWrap">
				<label>年</label>
				<el-select v-model="sy">
					<el-option
						v-for="item in Array.from({ length: 27 }, (_v, _val) => _val + 2023)"
						:key="item"
						:label="item"
						:value="item"
					/>
				</el-select>
				<label>月</label>
				<el-select v-model="sm">
					<el-option
						v-for="item in Array.from({ length: 12 }, (_v, _val) => _val + 1)"
						:key="item"
						:label="item"
						:value="item"
					/>
				</el-select>
				<label>日</label>
				<el-select v-model="sd">
					<el-option
						v-for="item in Array.from({ length: dayCnt1 }, (_v, _val) => _val + 1)"
						:key="item"
						:label="item"
						:value="item"
					/>
				</el-select>
				<div style="text-wrap: nowrap">时间</div>
				<el-time-select
					v-model="startTime"
					start="00:00"
					step="00:05"
					end="24:00"
					format="HH:mm"
				/>
			</div>
		</el-form-item>
		<el-form-item
			label="活动结束时间"
			:label-width="140"
		>
			<div class="dateWrap">
				<label>年</label>
				<el-select v-model="ey">
					<el-option
						v-for="item in Array.from({ length: 27 }, (_v, _val) => _val + +sy)"
						:key="item"
						:label="item"
						:value="item"
					/>
				</el-select>
				<label>月</label>
				<el-select v-model="em">
					<el-option
						v-for="item in Array.from({ length: 12 }, (_v, _val) => _val + 1)"
						:key="item"
						:label="item"
						:value="item"
					/>
				</el-select>
				<label>日</label>
				<el-select v-model="ed">
					<el-option
						v-for="item in Array.from({ length: dayCnt2 }, (_v, _val) => _val + 1)"
						:key="item"
						:label="item"
						:value="item"
					/>
				</el-select>
				<div style="text-wrap: nowrap">时间</div>
				<el-time-select
					v-model="endTime"
					start="00:00"
					step="00:05"
					end="24:00"
					format="HH:mm"
				/>
			</div>
		</el-form-item>
		<el-form-item>
			<el-button
				:disabled="isable"
				type="primary"
				@click="onSubmit"
				>添加</el-button
			>
		</el-form-item>
	</el-form>
	<div style="height: 6vh"></div>
</template>
<script setup lang="ts">
import { computed, ref, reactive, onMounted } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
import axios from 'axios';
import moment from 'moment';
import Editor from '../../components/Editor.vue';
const sy = ref('');
const sm = ref('');
const sd = ref('');
const ey = ref('');
const em = ref('');
const ed = ref('');
const startTime = ref('');
const endTime = ref('');
const dayCnt1 = computed(() => {
	return moment(sy.value + '-' + sm.value, 'YYYY-MM').daysInMonth();
});
const dayCnt2 = computed(() => {
	return moment(ey.value + '-' + em.value, 'YYYY-MM').daysInMonth();
});
const isable = computed(() => {
	if (sy.value && sm.value && sd.value && ey.value && em.value && ed.value && startTime.value && endTime.value) {
		if (activityForm.content.length < 13) return true;
		activityForm.startTime = moment(
			sy.value + '-' + sm.value + '-' + sd.value + ' ' + startTime.value,
			'YYYY-MM-DD HH:mm',
		).toDate();
		activityForm.endTime = moment(
			ey.value + '-' + em.value + '-' + ed.value + ' ' + endTime.value,
			'YYYY-MM-DD HH:mm',
		).toDate();
		if (moment(activityForm.endTime).isAfter(activityForm.startTime)) {
			return false;
		} else return true;
	} else return true;
});

let activityForm = reactive({
	title: '',
	content: '',
	startTime: <any>'',
	endTime: <any>'',
	teamId: '',
	userId: '',
});
onMounted(async () => {
	activityForm.userId = (await axios.get('/api/user/profile')).data.data.userId;
	activityForm.teamId = localStorage.getItem('teamId')!;
});

const activityFormRef = ref<FormInstance>();

const activityRules = reactive<FormRules<typeof activityForm>>({
	title: [{ required: true, message: '不能为空' }],
});

const router = useRouter();
const onSubmit = async () => {
	try {
		const res = await axios.post('/api/activity', activityForm);
		if (res.data.statusCode === 200) {
			ElMessage('创建成功');
			setTimeout(() => {
				router.push('/team/activity');
			}, 1500);
		}
	} catch (e: any) {
		if (e!.response!.status == 403) {
			ElMessage('您的权限不够');
		} else ElMessage('添加失败');
	}
};

const getHtml = (content: any) => {
	activityForm.content = content;
};
</script>
<style lang="scss" scoped>
.dateWrap,
.demo-time-range {
	display: flex;
	justify-content: left;
	align-items: center;
	.el-select {
		margin: 0 20px 0 5px;
	}
}
.dateWrap {
	margin-bottom: 20px;
}
</style>
