<template>
	<div class="wrap-member">
		<div class="m-header">
			<span>成员管理</span>
			<span
				style="cursor: pointer; margin-left: 50px"
				@click="back"
				>返回</span
			>
		</div>
		<el-table
			:data="members"
			style="width: 60%; margin: 0 auto"
		>
			<el-table-column
				prop="user_username"
				label="用户名"
				width="180"
			/>
			<el-table-column
				prop="user_createTime"
				label="加入时间"
				width="180"
				:formatter="formalTime"
			/>

			<el-table-column
				width="180"
				prop="role"
				label="权限"
				:formatter="formalRole"
			/>
			<el-table-column
				fixed="right"
				label="Operations"
				width="300"
			>
				<template #default="scope">
					<el-button
						type="primary"
						size="small"
						@click="handleClick1(scope.row)"
						:disabled="scope.row.role === 'admin' || scope.row.role === 'creator'"
						>设为管理员</el-button
					>
					<el-button
						type="primary"
						size="small"
						@click="handleClick2(scope.row)"
						:disabled="scope.row.role === 'user' || scope.row.role === 'creator'"
						>设为普通用户</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		<div
			style="
				background-color: #3a3d3e;
				height: 5vh;
				width: 100%;
				line-height: 5vh;
				bottom: 0;
				text-align: center;
				position: absolute;
			"
		>
			团队学习系统
		</div>
	</div>
	<el-dialog
		v-model="dialogVisible"
		title="提示"
		width="30%"
	>
		<span>{{ f() }}</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button
					type="primary"
					@click="handleC"
				>
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { formalDate } from '../../utils/formalTime';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
var teamId: string;
var userId: any;
var role: string;
const content = {
	user: '您确定将其设置为普通成员吗?',
	admin: '您确定将其设置为管理员吗?',
};
const f = () => {
	if (role === 'user') return content.user;
	else return content.admin;
};
const router = useRouter();
const dialogVisible = ref(false);
const members = ref<any>('');
const getData = async () => {
	const res = await axios.get(`/api/team/user/${teamId}`);
	members.value = res.data.data;
};
onMounted(async () => {
	teamId = localStorage.getItem('teamId')!;
	getData();
});
const handleClick1 = async (row: any) => {
	dialogVisible.value = true;
	userId = row.user_id;
	role = 'admin';
};
const handleClick2 = async (row: any) => {
	dialogVisible.value = true;
	userId = row.user_id;
	role = 'user';
};
const handleC = async () => {
	dialogVisible.value = false;
	const info = {
		userId,
		teamId,
		role,
	};
	try {
		await axios.post('/api/team/change/role', info);
		ElMessage('设置成功');
		getData();
	} catch (e) {
		ElMessage('设置失败');
	}
};
const formalTime = (_row: any, _column: any, cellValue: any, _index: any) => {
	return formalDate(cellValue);
};
const formalRole = (_row: any, _column: any, cellValue: any, _index: any) => {
	if (cellValue === 'user') return '普通成员';
	else if (cellValue === 'creator') return '创建者';
	else if (cellValue === 'admin') return '管理员';
};
const back = () => {
	router.back();
};
</script>
<style scoped lang="scss">
.wrap-member {
	position: relative;
	min-height: 100vh;
}
.m-header {
	align-items: center;
	display: flex;
	background-color: #3ab68f;
	color: #ffffff;
	font-size: 20px;
	padding: 5px 20px;
}
</style>
