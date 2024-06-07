<template>
	<div
		v-if="teamData.length"
		style="display: flex; flex-wrap: wrap; align-items: center"
	>
		<div
			style="width: 25%; margin: 0 10px"
			v-for="item in teamData"
			:key="item?.id"
		>
			<TeamList
				:team="item"
				@click="handleClick"
			/>
		</div>
	</div>
	<el-empty
		:image-size="200"
		v-else
	/>
</template>
<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import TeamList from '../TeamList.vue';
var userInfo: any;
const router = useRouter();
const teamData = ref(<any>[]);
onMounted(async () => {
	userInfo = (await axios.get('/api/user/profile')).data.data;
	const res = await axios.get(`/api/team/user/managed/${userInfo.userId}`);
	teamData.value = res.data.data;
	console.log(teamData.value);
});
const handleClick = (team: any) => {
	localStorage.setItem('teamId', team.id);
	router.push({
		path: '/team/index',
	});
};
</script>
