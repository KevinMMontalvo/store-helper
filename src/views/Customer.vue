<template>
	<div class="d-flex align-center justify-center blue-grey fill-height">
		<div class="d-flex flex-column mx-5">
			<div class="d-flex text-h5 text-center mb-5 white--text">Ingrese el nombre del producto a buscar</div>
			<v-text-field class="d-flex text-h4" color="primary" background-color="white" v-model.trim="name" type="text"
						  :rules="[]" outlined dark/>
			<a class="d-flex text-center mb-5 white--text">O buscar codigo de barras</a>
		</div>
	</div>
</template>

<script>


export default {
	name: "Customer",
	data: () => ({
		name: ''
	})
};
</script>

<style scoped>

</style>