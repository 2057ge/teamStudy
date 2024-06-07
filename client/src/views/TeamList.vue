<template>
	<div style="margin: 5px 5px; position: relative; background-color: #33aa99">
		<el-card shadow="hover">
			<a
				@click="handleClick"
				style="cursor: pointer"
			>
				<img
					class="myimg"
					:src="'http://localhost:3000/' + props.team?.cover"
					alt="团队封面"
				/>
			</a>
			<div>
				<a
					@click="handleClick"
					class="teamname"
					style="text-decoration: none"
				>
					{{ props.team?.teamname }}
				</a>
			</div>
		</el-card>
	</div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
	team: <any>{},
});
const emit = defineEmits(['click']);
const handleClick = () => {
	emit('click', props.team);
};
</script>
<style scoped lang="scss">
:deep().el-card__body {
	padding: 0;
}
.el-card {
	border-radius: 0;
}
.myimg {
	width: 100%;
	height: 20vh;
}
:deep().teamname {
	cursor: pointer;
	position: absolute;
	bottom: 0;
	padding: 0.8;
	color: aliceblue !important;
	padding: 10px 5px;
	font-size: 15px;
}
</style>
