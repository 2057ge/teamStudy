<template>
	<div class="wrap">
		<div class="searchHome">
			<div class="search-heads">团队学习系统</div>

			<div class="search-content">
				<el-input
					v-model="keyword"
					size="large"
					:suffix-icon="Search"
					:prefix-icon="UserFilled"
					@keyup.enter.native="handleEnter"
					@input="setValue"
				/>
			</div>
		</div>
		<div style="height: 21vh"></div>
		<div class="content">
			<div class="head">团队</div>
			<div class="team-number">共找到{{ total }}条结果</div>
			<div class="team-list">
				<div
					v-for="team in teamData"
					:key="team.id"
				>
					<div class="single-team">
						<a
							@click="handleClick(team)"
							style="cursor: pointer"
						>
							<img
								class="team-img"
								:src="'http://localhost:3000/' + team?.cover"
								alt="团队封面"
							/>
						</a>
						<div class="team-content">
							<div class="teamname">{{ team.teamname }}</div>
							<div class="introduction">{{ team.introduction }}</div>
							<div><span style="color: #8a8a99">创建时间: </span>{{ team.createTime }}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="page">
				<el-pagination
					background
					layout="prev, pager, next"
					:page-size="pageSize"
					:total="total"
					@current-change="handleChangePage"
				/>
			</div>
		</div>
	</div>
	<div style="background-color: #3a3d3e; height: 9vh"></div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search, UserFilled } from '@element-plus/icons-vue';
import axios from 'axios';
const teamData = ref<any>([]);
const route = useRoute();
const keyword = ref<any>('');
const pageSize = 10;
const currentSize = ref(1);
const total = ref(0);
const router = useRouter();
const getKeyword = () => {
	var value = localStorage.getItem('keyword');
	if (value) keyword.value = value;
	else keyword.value = route.query?.keyword;
};
const getData = async () => {
	const res = await axios.get(`/api/team`, {
		params: {
			keyword: keyword.value,
			pageSize,
			currentSize: currentSize.value,
		},
	});

	teamData.value = res.data.data.teams;
	total.value = res.data.data.total;
};

const setValue = () => {
	localStorage.setItem('keyword', keyword.value);
};

onMounted(async () => {
	getKeyword();
	if (keyword.value?.length > 0) getData();
});
onBeforeUnmount(() => {
	localStorage.removeItem('keyword');
});
const handleEnter = () => {
	if (keyword.value.length > 0) {
		getData();
	}
};
const handleChangePage = (current: number) => {
	currentSize.value = current;
	getData();
};
const handleClick = (team: any) => {
	localStorage.setItem('teamId', team.id);
	router.push({
		path: '/team/index',
	});
};
</script>
<style lang="scss" scoped>
.searchHome {
	width: 100%;
	background-color: rgba(66, 161, 215);
	position: fixed;
	z-index: 999;
}
.search-heads {
	background-color: rgba(0, 0, 0, 0.5);

	height: 8vh;
	width: 100%;
	line-height: 8vh;
	font-size: 16px;
	padding-left: 50px;
}
.search-content {
	height: 13vh;
	display: flex;
	align-items: center;
	justify-content: center;
	.el-input {
		outline: none;
		width: 40%;
		height: 50%;
	}
	:deep().el-input__inner {
		height: 100%;
		font-size: 18px;
		font-weight: bold;
	}
}
.content {
	min-height: 70vh;
	background-color: #f1f4f9;
	.head {
		display: flex;
		padding: 10px 0;
		justify-content: center;
		width: 100%;
		font-size: 30px;
		color: black;
		background-color: white;
		margin-bottom: 10px;
	}
	.team-number {
		background-color: white;
		margin: 0 20vw;
		height: 50px;
		line-height: 50px;
		padding-left: 20px;
		color: #9c9c9c;
		font-size: 14px;
	}
	.team-list {
		display: flex;
		flex-direction: column;
		background-color: white;
		position: relative;
		margin: 0 20vw;
		margin-top: 10px;
		min-height: 45vh;
		:hover {
			background-color: #fafafa;
		}
	}
}
.page {
	display: flex;
	margin: 0 20vw;
	margin-top: 10px;
	background-color: white;
	padding: 10px 30px;
	align-items: center;
	justify-content: center;
}
.single-team {
	display: flex;
	padding: 20px;
	width: 100%;
	box-sizing: border-box;
	border: 1px solid #f6f6f6;
}
.team-img {
	width: 100px;
	height: 100px;
}
.team-content {
	width: 100%;
	margin-left: 20px;
	display: flex;
	flex-direction: column;
	.teamname {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 8px;
	}
	.introduction {
		height: 60px;
		overflow-y: hidden;
		white-space: pre-wrap;
		margin-bottom: 4px;
		color: #8a8a99;
	}
}
</style>
