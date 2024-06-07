<template>
	<div class="wrap-source">
		<div class="search">
			<div style="height: 40px; width: 80%; display: flex">
				<input
					class="source-input"
					v-model="keyword"
				/>
				<button
					style="cursor: pointer; outline: none; border: none; padding: 0"
					@click="searchSource"
				>
					<img
						style="width: 40px; height: 100%; background-color: #7ba7ab"
						:src="Search"
						alt=""
					/>
				</button>
			</div>
			<div>
				<el-upload
					:show-file-list="false"
					ref="upload"
					class="upload-demo"
					action=""
					:limit="1"
					:on-change="handleChange"
					:auto-upload="false"
				>
					<el-button
						style="border: 1px solid #7ba7ab"
						v-if="role === 'user' || role === 'admin' || role === 'creator'"
					>
						添加资源</el-button
					>
				</el-upload>
			</div>
		</div>
		<div
			v-if="role == 'unknown'"
			style="margin: 40px"
		>
			资源不对外开发
		</div>
		<div
			class="contain"
			v-else-if="sources.length"
		>
			<div
				class="one-source"
				v-for="source in sources"
				:key="source.name"
			>
				<div style="font-size: 18px; font-weight: bold; margin-bottom: 10px">{{ source?.filename }}</div>

				<div class="bottom">
					<div>上传者:{{ source.creator?.username }} |&nbsp;</div>
					<div>发布时间:{{ formalDate(source?.publishTime) }} |&nbsp;</div>
					<div>下载次数:{{ source?.downloads }} |&nbsp;</div>
					<el-button
						link
						@click="handleDownload(source)"
						>下载 &nbsp;|&nbsp;
					</el-button>
					<el-button
						link
						@click="handleClick(source)"
						>删除
					</el-button>
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
		align-center
	>
		<span>你确定要删除吗?</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button
					type="primary"
					@click="handleDelete"
				>
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import Search from '../../assets/search.png';
import { ElMessage, UploadInstance } from 'element-plus';
import { uploadedFile } from '../../utils/upload';
import axios from 'axios';
import { formalDate } from '../../utils/formalTime.ts';
const keyword = ref('');
const dialogVisible = ref(false);
const sourceForm = reactive({
	userId: '',
	teamId: '',
	filename: '',
	size: <number>0,
	file: <any>'',
	type: '',
});
const total = ref(0);
const curSize = ref(1);
const deleteSource = ref<any>();
const sources = ref<any>([]);
const sourcesData = ref<any>([]);
const role = ref('');
const getSources = async () => {
	try {
		const res = await axios.get(`/api/source/team/${sourceForm.teamId}`, {
			params: {
				keyword: keyword.value,
			},
		});
		sourcesData.value = res.data.data;
		total.value = sourcesData.value.length;
		let size: any = localStorage.getItem('curSize') ? localStorage.getItem('curSize') : '1';
		curSize.value = size;
		handleChangePage(+size);
	} catch (e) {
		console.log(e);
	}
};
onMounted(async () => {
	sourceForm.userId = (await axios.get('/api/user/profile')).data.data.userId;
	sourceForm.teamId = localStorage.getItem('teamId') ?? '';
	role.value = localStorage.getItem('role')!;
	getSources();
});
const upload = ref<UploadInstance>();
const handleChange = (file: any) => {
	sourceForm.filename = file.name;
	sourceForm.size = file.size;
	sourceForm.file = file.raw;
	sourceForm.type = file.raw.type;

	upload?.value?.clearFiles();

	submit();
};

const submit = async () => {
	try {
		await uploadedFile('/api/source/', sourceForm);
		getSources();
	} catch (e) {
		ElMessage('添加失败');
	}
};

const handleDownload = async (source: any) => {
	const res = await axios.get('/api/source/export', {
		params: { id: source.id },
		responseType: 'blob',
		responseEncoding: 'utf-8',
	});
	const alink = document.createElement('a');
	alink.download = source.filename;

	var href = URL.createObjectURL(res.data);
	alink.href = href;
	document.body.appendChild(alink);
	alink.click();

	document.body.removeChild(alink);
	window.URL.revokeObjectURL(href);
	source.downloads++;
	await axios.patch(`/api/source/${source.id}`, source);
};
const handleClick = (source: any) => {
	dialogVisible.value = true;
	deleteSource.value = source;
};

const handleDelete = async () => {
	const res = await axios.delete(`/api/source/${deleteSource.value.id}`);
	if (res.data.statusCode != 200) {
		ElMessage('删除失败!');
	} else {
		getSources();
	}
	dialogVisible.value = false;
};
const handleChangePage = (current: number) => {
	curSize.value = current;
	localStorage.setItem('curSize', current.toString());
	let st = (current - 1) * 6;
	let ed = current * 6 > total.value ? total.value : current * 6;
	if (st == ed) {
		if (sourcesData.value.length > 0) {
			handleChangePage(current - 1);
			return;
		}
	}
	sources.value = sourcesData.value.slice(st, ed);
};
onBeforeUnmount(() => {
	localStorage.removeItem('curSize');
});
const searchSource = () => {
	curSize.value = 1;
	localStorage.setItem('curSize', '1');
	getSources();
};
</script>
<style lang="scss" scoped>
.wrap-source {
	position: relative;
	bottom: 2px solid black;
	width: 60vw;
	height: 70vh;
	padding-bottom: 20px;
}
.search {
	display: flex;
	align-items: center;
	height: 40px;
	margin-top: 40px;
	margin-left: 40px;
	.source-input {
		box-sizing: border-box;
		width: 70%;
		height: 100%;
		border: 2px solid #7ba7ab;
		outline: none;
	}
}
.contain {
	margin-left: 40px;

	display: flex;
	flex-direction: column;
}
.one-source {
	padding: 0 10px;
	margin-top: 15px;
	border-bottom: 1px dotted #555;
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
.el-pagination {
	position: absolute;
	bottom: 20px;
	margin-left: 40px;
	margin-top: 20px;
	display: flex;
	width: 60%;
	justify-content: center;
}
</style>
