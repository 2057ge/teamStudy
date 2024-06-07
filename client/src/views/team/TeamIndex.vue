<template>
	<div class="team-index">
		<div
			style="width: 100%; text-align: center; margin-bottom: 10px"
			class="demonstration"
		>
			最近新闻
		</div>
		<el-carousel
			style="min-height: 300px; padding-bottom: 100px; box-sizing: border-box"
			v-if="trends[0]?.length"
		>
			<el-carousel-item
				v-for="item in pageSize"
				:key="item"
			>
				<div class="wrap-trend">
					<div
						v-for="trend in trends[item - 1]"
						:key="trend.id"
						class="one-trend"
					>
						<div
							style="
								font-family: 'Georgia', Georgia, 'Times New Roman', Times, 'Microsoft YaHei', SimSun, SimHei, serif;
								font-size: 14px;
								padding-left: 5px;
								margin-bottom: 10px;
							"
						>
							{{ formalDate(trend.publishTime) }}
						</div>
						<div style="font-size: 14px; color: #5d5e5d">
							<a
								style="cursor: pointer; word-wrap: break-word"
								@click="handleClick(trend)"
								>{{ trend.title }}</a
							>
						</div>
					</div>
				</div>
			</el-carousel-item>
		</el-carousel>
		<div v-else>
			<el-empty :image-size="200" />
		</div>
	</div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { formalDate } from '../../utils/formalTime';
import { useRouter } from 'vue-router';
const trends = ref<any>([]);
const pageSize = ref(0);
const router = useRouter();
onMounted(async () => {
	const teamId = localStorage.getItem('teamId');
	const res = await axios.get(`/api/trend/top/${teamId}`);
	console.log(res.data);
	if (res.data.data.length > 6) pageSize.value = 2;
	else if (res.data.data?.length == 0) pageSize.value = 0;
	else pageSize.value = 1;
	trends.value = [<any>[], <any>[]];
	for (let i = 0; i < res.data.data.length; i++) {
		let j = Math.floor(i / 6);
		trends.value[j].push(res.data.data[i]);
	}
	console.log(trends.value);
});
const handleClick = async (trend: any) => {
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
<style scoped lang="scss">
.demonstration {
	color: var(--el-text-color-secondary);
}
.team-index {
	width: 100%;
	padding: 40px;
	box-sizing: border-box;
	min-height: 50vh;
}
.el-carousel__item h3 {
	color: #475669;
	opacity: 0.75;
	line-height: 150px;
	margin: 0;
	text-align: center;
}
:deep().el-carousel__item {
	height: 400px;
}
.el-carousel__item:nth-child(2n) {
	background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
	background-color: #d3dce6;
}
.wrap-trend {
	padding: 20px;
	display: flex;
	flex-wrap: wrap;
}
.one-trend {
	width: 45%;
	padding: 20px;
	box-sizing: border-box;
	margin-left: 40px;
	margin-bottom: 20px;
	background-color: #f7f9f8;
}
</style>
