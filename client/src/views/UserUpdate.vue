<template>
	<div class="wrap">
		<div style="display: flex; width: 100%; background-color: #339999; margin-bottom: 20px">
			<div style="height: 7.5vh; display: flex; align-items: center; padding-left: 40px">
				<el-icon
					style="cursor: pointer"
					@click="handleBack"
					><Back
				/></el-icon>
			</div>
			<div class="head">更新个人信息</div>
		</div>
		<div class="form">
			<el-form
				:model="userForm"
				ref="userFormRef"
				status-icon
				label-width="120px"
				:rules="userRules"
			>
				<el-form-item
					label="用户名"
					:label-width="140"
					prop="username"
				>
					<el-input
						v-model="userForm.username"
						autocomplete="off"
					/>
				</el-form-item>

				<el-form-item
					label="性别"
					:label-width="140"
					prop="gender"
				>
					<el-select v-model="userForm.gender">
						<el-option
							label="保密"
							value="unknown"
						/>
						<el-option
							label="男"
							value="male"
						/>
						<el-option
							label="女"
							value="woman"
						/>
					</el-select>
				</el-form-item>
				<el-form-item
					label="头像"
					:label-width="140"
					prop="avator"
				>
					<el-upload
						class="avatar-uploader"
						:on-change="handleChange"
						:auto-upload="false"
						:show-file-list="false"
					>
						<img
							v-if="userForm.avatar?.length > 4"
							:src="userForm.avatar.includes('blob') ? userForm.avatar : 'http://localhost:3000/' + userForm.avatar"
							class="my-avatar"
						/>
						<img
							v-else
							class="avatar"
							:src="DefaultAvatar"
						/>
					</el-upload>
				</el-form-item>
				<el-form-item
					label="个人简介"
					:label-width="140"
					prop="introduction"
				>
					<el-input
						v-model="userForm.introduction"
						type="textarea"
						:autosize="{ minRows: 5 }"
						autocomplete="off"
					/>
				</el-form-item>
				<el-form-item>
					<el-button
						type="primary"
						@click="onSubmit"
						>更新</el-button
					>
				</el-form-item>
			</el-form>
		</div>
		<div class="footer">团队学习系统</div>
	</div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { Back } from '@element-plus/icons-vue';
import axios from 'axios';
import DefaultAvatar from '../assets/default-avatat.png';
import router from '../router';
const route = useRoute();
//const router = useRouter();
var userId: any;
let userForm = reactive({
	username: '',
	introduction: '',
	gender: 'unknown',
	avatar: '',
	file: <any>'',
});
const getUser = async () => {
	const res = await axios.get(`/api/user/${userId}`);

	Object.assign(userForm, res.data.data);
	if (userForm.avatar !== 'null') {
		console.log(userForm.avatar);
		userForm.avatar = userForm.avatar;
	}
};
onMounted(async () => {
	userId = route.query.userId;
	getUser();
});
const handleBack = () => {
	console.log('a');
	router.back();
};
const userFormRef = ref<FormInstance>();
const userRules = reactive<FormRules<typeof userForm>>({
	username: [{ required: true, trigger: 'blur', message: '不能为空' }],
	gender: [{ required: true, trigger: 'blur', message: '不能为空' }],
	introduction: [{ trigger: 'blur', required: true, message: '不能为空' }],
	avatar: [{ trigger: 'blur' }],
});

const onSubmit = () => {
	userFormRef.value?.validate(async (valid) => {
		if (valid) {
			let temp = new FormData();
			let key: keyof typeof userForm;
			for (key in userForm) {
				temp.append(key, userForm[key]);
			}

			try {
				await axios.patch(`/api/user/${userId}`, temp, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});

				ElMessage('更新成功');
				setTimeout(() => {
					router.back();
				}, 1000);
			} catch (e) {
				ElMessage('更新失败');
			}
		} else {
			ElMessage('请填写信息');
		}
	});
};

const handleChange = (uploadFile: any) => {
	userForm.file = uploadFile.raw;
	userForm.avatar = URL.createObjectURL(uploadFile.raw!);
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
	width: 100%;
	justify-content: space-around;
	background-color: #339999;
	padding: 20px 20px;
	font-size: 18px;
}
.form {
	margin: 0 auto;
	padding: 20px;
	width: 60%;
	min-height: 50vh;
	background-color: #f1f3f4;
}
.avatar-uploader {
	display: flex;
	width: 120px;
	height: 120px;
}
.my-avatar {
	height: 120px;
	width: 120px;
	border-radius: 50%;
}
.footer {
	margin: 0 auto;
	border-top: 1px solid black;
	background-color: #f1f3f4;
	width: 60%;
	height: 5vh;
	padding: 20px;
	font-size: 14px;
}
</style>
