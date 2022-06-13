<template>
	<v-app>
		<v-main>
			<router-view/>
			<v-snackbar v-model="message.visible" :color="message.color">{{ message.text }}</v-snackbar>
		</v-main>
	</v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
	name: 'App',

	data: () => ({
		//
	}),
	computed: {
		...mapState(['message'])
	}
};
</script>


<style>
@import url("https://fonts.googleapis.com/css?family=Material+Icons");
</style>
