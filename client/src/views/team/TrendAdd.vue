<template>
	<div class="add-trend">
		<div class="wrap-title">
			<div style="font-size: 18px; font-weight: bold; padding-left: 5px; margin-bottom: 10px">标题</div>
			<el-input
				type="text"
				class="trend-input"
				v-model="trendForm.title"
				style="word-wrap: break-word"
			/>
		</div>
		<div class="wrap-content">
			<div style="font-size: 18px; font-weight: bold; padding-left: 5px; margin-top;: 10px">动态内容</div>

			<Editor @getHtmlVal="getHtml" />
			<el-upload
				ref="upload"
				v-model:file-list="fileList"
				multiple
				:limit="3"
				:auto-upload="false"
				:on-change="handleChange"
				:on-remove="handleRemove"
				style="width: 50%"
			>
				<el-button
					type="primary"
					style="margin-top: 20px"
					:disabled="trendForm.files?.length === 3"
					>上传附件</el-button
				>
				<div style="font-size: 10px; margin-top: 50px; cursor: auto">(最多上传3个文件)</div>
			</el-upload>

			<div style="margin-top: 10px">
				<el-button
					:disabled="isable"
					@click="handleSubmit"
					>添加</el-button
				>
				<el-button @click="handleCancel">取消</el-button>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import Editor from '../../components/Editor.vue';
import axios from 'axios';
import { ElMessage, UploadFile, UploadFiles, UploadInstance } from 'element-plus';
import { useRouter } from 'vue-router';
import { uploadedFile } from '../../utils/upload';
const trendForm = reactive({
	userId: '',
	teamId: 0,
	title: '',
	content: '',
	files: <any>[],
});
const router = useRouter();
const fileList = ref<any>([]);
const upload = ref<UploadInstance>();
onMounted(async () => {
	const res1 = await axios.get('/api/user/profile');
	trendForm.userId = res1.data.data.userId;
	trendForm.teamId = +localStorage.getItem('teamId')!;
});
const getHtml = (content: any) => {
	trendForm.content = content;
};
const isable = computed(() => {
	if (trendForm.title.length > 0 && trendForm.content.length > 13) {
		return false;
	} else return true;
});
const handleSubmit = async () => {
	try {
		//const res = await axios.post('/api/trend', trendForm);
		await uploadedFile('/api/trend/', trendForm);
		ElMessage('添加成功');
		setTimeout(() => {
			router.push('/team/trend');
		}, 1500);
	} catch (e: any) {
		if (e!.response!.status == 403) {
			ElMessage('您的权限不够');
		} else ElMessage('添加失败');
	}
};
const handleCancel = () => {
	router.back();
};
const handleChange = (uploadFile: UploadFile, _uploadFiles: UploadFiles) => {
	console.log(uploadFile.name);
	trendForm.files.push(uploadFile.raw);
};
const handleRemove = (uploadFile: UploadFile, _uploadFiles: UploadFiles) => {
	console.log('a');
	let i = 0;
	for (let item of trendForm.files) {
		if (item.uid === uploadFile.raw!.uid) {
			console.log(item, i);
			trendForm.files = trendForm.files.filter((_item: any, index: number) => index !== i);

			break;
		}
		i++;
	}
};
// const handleExceed: UploadProps['onExceed'] = (files: any) => {
// 	upload.value!.clearFiles();
// 	const file = files[0] as UploadRawFile;
// 	file.uid = genFileId();
// 	upload.value!.handleStart(file);
// };
</script>
<style lang="scss" scoped>
.add-trend {
	padding: 10px 10px;
}
.trend-input {
	border: none;
	outline: none;
	font-size: 16px;
}
.wrap-content {
	margin-top: 20px;
}
</style>
