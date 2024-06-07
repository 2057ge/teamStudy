<template>
	<div class="contain">
		<div class="team-name">{{ team.teamname }}</div>
		<div class="team-introduction">{{ team.introduction }}</div>
	</div>
</template>
<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
const team = ref<any>('');
onMounted(async () => {
	const teamId = localStorage.getItem('teamId');
	const res = await axios.get(`/api/team/${teamId}`);
	team.value = res.data.data;
});
</script>
<style lang="scss" scoped>
.contain {
	padding: 0 30px;
	margin-top: 40px;
}
.team-name {
	text-align: center;
	font-size: 24px;
	margin-bottom: 20px;
}
.team-introduction {
	white-space: pre-wrap;
}
</style>
