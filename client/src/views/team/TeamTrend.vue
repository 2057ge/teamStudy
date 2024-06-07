<template>
	<div class="wrap-trend">
		<div class="trend-header">
			<el-button
				@click="handleAdd"
				v-if="role === 'admin' || role === 'creator'"
			>
				添加动态</el-button
			>
		</div>
		<div
			class="contain"
			v-if="trends.length"
		>
			<div
				class="one-trend"
				v-for="trend in trends"
				:key="trend.name"
			>
				<div style="margin-bottom: 10px; display: flex">
					<a
						style="
							font-size: 18px;
							font-weight: bold;
							white-space: pre-wrap;
							width: 100%;
							cursor: pointer;
							word-wrap: break-word;
						"
						link
						@click="viewTrend(trend)"
					>
						{{ trend?.title }}
					</a>
				</div>
				<div class="bottom">
					<div>上传者:{{ trend.creator?.username }} |&nbsp;</div>
					<div>发布时间:{{ formalDate(trend?.publishTime) }} &nbsp;|&nbsp;</div>
					<div>浏览量:{{ trend?.views }}</div>
				</div>
			</div>
			<div style="height: 6vh"></div>
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
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { formalDate } from '../../utils/formalTime.ts';

var teamId: string;

const total = ref(0);
const curSize = ref(1);
const router = useRouter();
const trendsData = ref<any>([]);
const trends = ref<any>([]);
const role = ref('');
const getTrends = async () => {
	if (teamId) {
		const res = await axios.get(`/api/trend/team/${teamId}`);

		trendsData.value = res.data.data;
		console.log(trendsData.value);
		total.value = trendsData.value.length;
		let size: any = localStorage.getItem('curSize') ? localStorage.getItem('curSize') : '1';
		curSize.value = size;
		handleChangePage(+size);
	}
};
onMounted(async () => {
	//userId = (await axios.get('/api/user/profile')).data.data.userId;
	teamId = localStorage.getItem('teamId') ?? '';
	getTrends();
	role.value = localStorage.getItem('role') ?? 'unknown';
});

const handleChangePage = (current: number) => {
	curSize.value = current;
	localStorage.setItem('curSize', current.toString());
	let st = (current - 1) * 6;
	let ed = current * 6 > total.value ? total.value : current * 6;
	trends.value = trendsData.value.slice(st, ed);
};
onBeforeUnmount(() => {
	localStorage.removeItem('curSize');
});
const handleAdd = () => {
	router.push({
		path: '/team/trend/add',
	});
};
const viewTrend = async (trend: any) => {
	const { href } = router.resolve({
		path: '/trend/show',
		query: {
			trendId: trend.id,
		},
	});
	await axios.patch(`/api/trend/${trend.id}`, trend);
	window.open(href, '_target');
};
</script>
<style lang="scss" scoped>
.wrap-trend {
	bottom: 2px solid black;
	min-height: 60vh;
	padding-bottom: 20px;
	position: relative;
}

.trend-header {
	margin-top: 20px;
	padding-right: 20px;
	display: flex;
	flex-direction: row-reverse;
}
.contain {
	margin-left: 40px;

	display: flex;
	flex-direction: column;
}
.one-trend {
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
	margin-top: 40px;
	display: flex;
	width: 60%;
	justify-content: center;
}
</style>
