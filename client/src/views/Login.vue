<template>
	<div class="wrap">
		<div class="header">团队学习系统</div>
		<div class="wrap-middle">
			<img :src="Image" />
			<el-form
				ref="loginFormRef"
				:model="loginForm"
				:rules="rules"
				label-width="70px"
				class="demo-ruleForm"
			>
				<el-form-item
					label="账号"
					prop="loginId"
				>
					<el-input
						v-model="loginForm.loginId"
						autocomplete="off"
					/>
				</el-form-item>
				<el-form-item
					label="密码"
					prop="password"
				>
					<el-input
						v-model="loginForm.password"
						type="password"
						autocomplete="off"
					/>
				</el-form-item>
				<el-form-item>
					<el-button
						type="primary"
						style="width: 100%"
						:disabled="loginForm.loginId && loginForm.password ? false : true"
						@click="submit"
						>登录</el-button
					>
				</el-form-item>
				<el-form-item style="font-size: small; color: red"
					><el-button @click="handleRegiser">注册</el-button></el-form-item
				>
			</el-form>
		</div>
	</div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import Image from '../assets/R-C.jpg';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import router from '../router';
import axios from 'axios';
const loginForm = reactive({
	loginId: '',
	password: '',
});
const rules = reactive<FormRules<typeof loginForm>>({
	password: [{ trigger: 'blur' }],
	loginId: [{ trigger: 'blur' }],
});
const loginFormRef = ref<FormInstance>();
const submit = () => {
	loginFormRef.value?.validate(async (valid) => {
		if (valid) {
			try {
				const res = await axios.post('/api/auth/login', loginForm);
				localStorage.setItem('token', res.data.data);
				router.push('/index/myteam');
			} catch (e) {
				ElMessage('账号或密码错误！');
			}
		}
	});
};
const handleRegiser = () => {
	router.push('/register');
};
</script>
<style lang="scss" scoped>
* {
	margin: 0;
	padding: 0;
}
.wrap {
	height: 100vh;
	background-color: #3a3d3c;
	position: relative;
}
.header {
	height: 10vh;
	line-height: 10vh;
	padding-left: 20%;
	font-size: 24px;
	background-color: #dddddd;
}
.wrap-middle {
	position: absolute;
	top: 10%;
	width: 100%;
	background-color: #339999;
	display: flex;
	justify-content: center;
	align-items: center;
}
:deep().demo-ruleForm {
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 25%;
	font-size: 25px;
	background-color: aliceblue;
	height: 40vh;
	.el-form-item {
		width: 75%;
	}
}
</style>
