<template>
	<div class="wrap">
		<div class="header">
			<span style="font-size: x-large; font-weight: bold; margin-right: 50px">团队学习系统</span>
			<label style="font-size: xx-large; font-weight: bold">用户注册</label>
		</div>
		<div class="content">
			<el-form
				ref="registerFormRef"
				:model="registerForm"
				:rules="rules"
				label-width="70px"
				class="demo-ruleForm"
			>
				<el-form-item
					label="用户名"
					prop="username"
				>
					<el-input
						v-model="registerForm.username"
						autocomplete="off"
					/>
				</el-form-item>
				<el-form-item
					label="账号"
					prop="loginId"
				>
					<el-input
						v-model="registerForm.loginId"
						autocomplete="off"
					/>
				</el-form-item>
				<el-form-item
					label="密码"
					prop="password"
				>
					<el-input
						v-model="registerForm.password"
						type="password"
						autocomplete="off"
					/>
				</el-form-item>
				<el-form-item
					label="验证码"
					prop="verify"
				>
					<div style="display: flex; justify-content: right; width: 100%; height: 30px">
						<el-input
							v-model="registerForm.verify"
							autocomplete="off"
						/>
						<img
							@click="resetCode"
							alt=""
							:src="codeUrl"
						/>
					</div>
				</el-form-item>
				<el-form-item style="font-size: small; color: red"
					><el-button @click="handleRegiser">注册</el-button></el-form-item
				>
			</el-form>
			<div class="right">
				已有账号?<el-button
					@Click="handleLogin"
					link
					style="font-size: large; display: inline; margin-left; 10px"
					><u>马上登录</u></el-button
				>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import router from '../router';
import axios from 'axios';

const registerForm = reactive({
	username: '',
	loginId: '',
	password: '',
	verify: '',
});
const checkUserName = (_rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请输入用户名'));
	} else {
		callback();
	}
};
const checkPasswork = (_rule: any, value: string, callback: any) => {
	if (value === '') {
		callback(new Error('请输入密码'));
	} else {
		if (value?.length < 6) {
			callback(new Error('密码长度小于6位'));
		}
		callback();
	}
};
const checkLoginId = (_rule: any, value: string, callback: any) => {
	if (value === '') {
		callback(new Error('请输入账号'));
	} else {
		if (value?.length < 6) {
			callback(new Error('账号长度小于6位'));
		}
		callback();
	}
};
const checkVerify = (_rule: any, value: string, callback: any) => {
	if (value.length < 4) {
		callback(new Error('请输入验证码'));
	} else if (value.length == 4) {
		axios.post('api/user/verify', { text: value }).then((res) => {
			if (res.data.data == 200) {
				callback();
			} else {
				resetCode();
				callback(new Error('验证码不正确'));
			}
		});
	}
};
const codeUrl = ref<string>('/api/user/code');
const resetCode = () => (codeUrl.value = codeUrl.value + '?' + Math.random());
const rules = reactive<FormRules<typeof registerForm>>({
	username: [{ trigger: 'blur', validator: checkUserName }],
	password: [{ trigger: 'blur', validator: checkPasswork }],
	loginId: [{ trigger: 'blur', validator: checkLoginId }],
	verify: [{ trigger: 'blur', validator: checkVerify }],
});
const registerFormRef = ref<FormInstance>();
const handleRegiser = () => {
	registerFormRef.value?.validate(async (valid) => {
		if (valid) {
			try {
				const res = await axios.post('api/user', registerForm);
				if (res.data.statusCode == 200) {
					ElMessage('注册成功');
					setTimeout(() => {
						router.push({
							path: '/login',
						});
					}, 1000);
				}
			} catch (e) {
				ElMessage('该账号已注册');
			}
		}
	});
};
//const submit = () => {};
const handleLogin = () => {
	router.push('/login');
};
</script>
<style lang="scss" scoped>
.wrap {
	background-color: #3a3d3c;
	height: 95vh;
}
.content {
	background-color: #ffffff;
	padding-left: 8vw;
	height: 65vh;
	display: flex;
	.demo-ruleForm {
		padding-top: 2%;
		width: 40%;
	}
	.right {
		margin-left: 50px;
		padding-top: 3%;
	}
}
.header {
	background-color: #e0e2e2;
	height: 15vh;
	padding-left: 8vw;
	display: flex;
	//justify-content: center;
	align-items: center;
}
</style>
