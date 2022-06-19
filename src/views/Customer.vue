<template>
	<div class="d-flex align-center justify-center blue-grey fill-height">
		<v-app-bar app color="primary" dark>
			<!--			<v-app-bar-nav-icon @click.stop="menuVisible = !menuVisible"></v-app-bar-nav-icon>-->
			<v-toolbar-title>Titulo</v-toolbar-title>
			<v-spacer/>
			<span class="mr-1">Tienda: </span>
			<v-select v-model="currentStore" class="store-select pt-6" :items="stores" item-value="id" item-text="code"></v-select>
		</v-app-bar>
		<div class="d-flex flex-column mx-5">
			<div class="d-flex text-h5 text-center mb-5 white--text">Ingrese el nombre del producto a buscar</div>
			<v-text-field class="d-flex text-h4" color="primary" background-color="white" v-model.trim="name"
						  type="text"
						  :rules="[]" outlined dark/>
			<a class="d-flex text-center mb-5 white--text">O buscar codigo de barras</a>
		</div>
	</div>
</template>

<script>


import {mapState} from "vuex";

export default {
	name: "Customer",
	data: () => ({
		name: '',
		currentStore: 0
	}),
	computed: {
		...mapState('stores', ['stores']),
	},
	beforeMount()
	{
		this.$store.dispatch('stores/getStores');
	}
};
</script>

<style scoped>
.store-select
{
	/*max-width: 22;*/
	max-width: calc(5vw + 12vh);
}
</style>