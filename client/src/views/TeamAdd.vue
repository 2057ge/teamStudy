<template>
	<el-form
		class="myform"
		:model="teamForm"
		ref="teamFormRef"
		status-icon
		label-width="120px"
		:rules="teamRules"
	>
		<el-form-item
			label="团队名"
			:label-width="140"
			prop="teamname"
		>
			<el-input
				v-model="teamForm.teamname"
				autocomplete="off"
			/>
		</el-form-item>

		<el-form-item
			label="团队加入密码"
			:label-width="140"
			prop="password"
		>
			<el-input
				placeholder="默认没有密码"
				v-model="teamForm.password"
				autocomplete="off"
			/>
		</el-form-item>

		<el-form-item
			label="封面"
			:label-width="140"
			prop="cover"
		>
			<el-upload
				class="avatar-uploader"
				:on-change="handleChange"
				:auto-upload="false"
				:show-file-list="false"
			>
				<img
					v-if="teamForm.cover"
					:src="teamForm.cover"
					class="avatar"
				/>
				<el-icon
					v-else
					class="avatar-uploader-icon"
					><Plus
				/></el-icon>
			</el-upload>
		</el-form-item>
		<el-form-item
			label="团队简介"
			:label-width="140"
			prop="introduction"
		>
			<el-input
				v-model="teamForm.introduction"
				type="textarea"
				:autosize="{ minRows: 5 }"
				autocomplete="off"
			/>
		</el-form-item>
		<el-form-item>
			<el-button
				type="primary"
				@click="onSubmit"
				>添加</el-button
			>
		</el-form-item>
	</el-form>
</template>
<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
let userInfo: any;
onMounted(async () => {
	const res = await axios.get('/api/user/profile');
	userInfo = res.data.data;
});
const teamFormRef = ref<FormInstance>();
const teamRules = reactive<FormRules<typeof teamForm>>({
	teamname: [{ required: true, trigger: 'blur', message: '不能为空' }],
	userId: [{ required: true, trigger: 'blur', message: '不能为空' }],
	introduction: [{ trigger: 'blur', required: true, message: '不能为空' }],
	password: { trigger: 'blur' },
	cover: [{ trigger: 'blur' }],
});
let teamForm = reactive({
	userId: '',
	teamname: '',
	password: '',
	introduction: '',
	cover: '',
	file: <any>'',
});
const router = useRouter();
const onSubmit = () => {
	teamFormRef.value?.validate(async (valid) => {
		if (valid) {
			teamForm.userId = userInfo.userId;
			let temp = new FormData();
			let key: keyof typeof teamForm;
			for (key in teamForm) {
				temp.append(key, teamForm[key]);
			}
			try {
				const res = await axios.post('/api/team', temp, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});
				if (res.data.statusCode === 200) {
					ElMessage('创建成功');
					setTimeout(() => {
						router.push('/index/myteam');
					}, 1500);
				}
			} catch (e) {
				ElMessage('创建失败');
			}
		}
	});
};

const handleChange = (uploadFile: any) => {
	teamForm.file = uploadFile.raw;
	teamForm.cover = URL.createObjectURL(uploadFile.raw!);
};
</script>
<style lang="scss" scoped>
.myform {
	width: 80%;
}
:deep().avatar-uploader .avatar {
	width: 178px;
	height: 178px;
	display: block;
}
:deep().el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
:deep().avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}
:deep().avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}
</style>
