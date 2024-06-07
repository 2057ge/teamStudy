<template>
	<div style="border: 1px solid #ccc; maxwidth: 600px">
		<!-- 工具栏 -->
		<Toolbar
			style="border-bottom: 1px solid #ccc"
			:editor="editorRef"
			:defaultConfig="toolbarConfig"
			:mode="'default'"
		/>
		<!-- 内容部分 -->
		<Editor
			style="height: 450px; overflow-y: hidden"
			:defaultConfig="editorConfig"
			:mode="'default'"
			@onCreated="handleCreated"
			@onChange="handleChange"
		/>
	</div>
</template>
<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import { onBeforeUnmount, shallowRef } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import type { IEditorConfig, IToolbarConfig } from '@wangeditor/core';
const emits = defineEmits(['getHtmlVal']);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
	// 用于去掉不需要的工具栏配置
	excludeKeys: [
		'insertVideo', // 去掉插入视频功能
		'fullScreen', // 去掉全屏功能
		'group-video',
	],
};
// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
	// 最长输入2000字
	maxLength: 2000,
	// 进入页面不自动聚焦
	autoFocus: true,
	MENU_CONF: {},
};
// 上传图片
editorConfig.MENU_CONF!['uploadImage'] = {
	async customUpload(file: any, insertFn: any) {
		upLoadImg(file, insertFn);
	},
};

// 封装 - 上传图片、视频
const upLoadImg = (file: any, insertFn: any) => {
	if (file.size / 1024 / 1024 > 50) {
		ElMessage.error(`文件大小不能超过50MB!`);
		return false;
	} else {
		// 这里根据自己的需求进行处理 --- S
		let formData = new FormData();
		formData.append('file', file);
		const url: string = '/api/trend/uploadFile';
		//  这里根据自己的需求进行处理 --- E

		axios
			.post(url, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			.then((res: any) => {
				console.log(res.data);
				if (res.data.statusCode == 200) {
					// 上传成功后拿到的路径插入到富文本编辑器中
					insertFn('http://localhost:3000/trendimg/' + res.data.data.filename);
				} else {
					ElMessage.warning(`上传失败`);
				}
			})
			.catch(() => {
				ElMessage.warning(`上传失败`);
			});
	}
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
	const editor = editorRef.value;
	if (editor == null) return;
	editor.destroy();
});

const handleCreated = (editor: any) => {
	editorRef.value = editor; // 记录 editor 实例，重要！
	// 查看所有工具栏key
	// console.log(editor.getAllMenuKeys());
};

// 获得输入的内容
const handleChange = (editor: any) => {
	emits('getHtmlVal', editor.getHtml());
};
</script>

<style lang="scss" scoped>
:deep() .w-e-textarea-video-container {
	video,
	img {
		max-width: 787px;
	}
}
</style>
