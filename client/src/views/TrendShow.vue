<template>
	<div class="wrap-trend">
		<div class="trend-head">团队动态</div>
		<div class="trend-container">
			<div class="trend-title">{{ trend.title }}</div>
			<div class="trend-attr">
				<div style="margin-left: 20px; display: flex; align-items: center">
					<el-icon title="发布时间"><Timer /></el-icon
					><span style="margin-left: 10px">{{ formalTime(trend.publishTime) }}</span>
				</div>
				<div style="margin-left: 20px; display: flex; align-items: center">
					<el-icon title="观浏览次数"><View /></el-icon><span style="margin-left: 10px">{{ trend.views }}</span>
				</div>
			</div>
			<div
				class="trend-content"
				v-html="trend.content"
			></div>
		</div>
		<div
			class="files"
			v-if="files.length"
		>
			<div>附件</div>
			<div
				v-for="file in files"
				style="margin-top: 10px"
			>
				<span
					style="cursor: pointer"
					@click="handleDownload(file)"
				>
					{{ getFileName(file) }}</span
				>
			</div>
		</div>
		<div style="height: 6vh"></div>
	</div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { View, Timer } from '@element-plus/icons-vue';
import { formalTime } from '../utils/formalTime';
const route = useRoute();
const files = ref<any>('');
const trend = ref<any>('');
const getFileName = (filePath: string) => {
	const st = filePath.lastIndexOf('\\');
	return filePath.substring(st + 1, filePath.length);
};
onMounted(async () => {
	console.log(route.query);
	const trendId = route.query.trendId;
	const res = await axios.get(`/api/trend/${trendId}`);
	trend.value = res.data.data;
	files.value = trend.value.files.split('<breakpoint>');
	console.log(files.value);
});
const handleDownload = async (filePath: string) => {
	const res = await axios.get('/api/trend/export', {
		params: { filePath },
		responseType: 'blob',
		responseEncoding: 'utf-8',
	});
	const alink = document.createElement('a');
	alink.download = getFileName(filePath);

	var href = URL.createObjectURL(res.data);
	alink.href = href;
	document.body.appendChild(alink);
	alink.click();

	document.body.removeChild(alink);
	window.URL.revokeObjectURL(href);
};
</script>
<style lang="scss" scoped>
.wrap-trend {
	min-height: 100vh;
	width: 100vw;
	//background-image: url(../assets/trendbackground.jpg);
	background-color: #e6efef;
}
.trend-head {
	height: 5vh;
	background-color: #ffffff;
	line-height: 5vh;
	padding-left: 30px;
}
.trend-container {
	width: 70%;
	margin: 0 auto;
	margin-top: 4vh;
	background-color: #ffffff;
}
.trend-title {
	width: 100%;
	height: 15vh;
	background-image: url(../assets/trendbackground.jpg);
	text-align: center;
	line-height: 15vh;
	font-size: 24px;
	color: black;
}
.trend-content {
	box-sizing: border-box;
	padding: 20px 20px;
	min-height: 50vh;
	width: 100%;
}
.trend-attr {
	margin-top: 5px;
	margin-bottom: 20px;
	padding-right: 20px;
	display: flex;
	flex-direction: row-reverse;
}
.files {
	display: flex;
	flex-direction: column;
	width: 70%;
	margin: 0 auto;
	padding-left: 20px;
	box-sizing: border-box;
	font-size: 18px;
	background-color: #339999;
	padding-bottom: 10px;
	padding-top: 10px;
}
</style>
