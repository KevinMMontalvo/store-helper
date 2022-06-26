<template>
	<v-data-table :headers="headers" :items="couponCategories" class="elevation-1 ma-3" :loading="couponCategories===undefined">
		<template v-slot:top>
			<v-toolbar flat>
				<v-toolbar-title>Categorías de cupón</v-toolbar-title>
				<v-divider class="mx-4" inset vertical></v-divider>
				<v-spacer></v-spacer>
				<v-dialog v-model="showFormDialog" width="90%">
					<template v-slot:activator="{ on, attrs }">
						<v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
							Nueva categoría
						</v-btn>
					</template>
					<CouponCategoryForm ref="form" :executing="executing" @onClose="closeFormDialog"
							   @onCreate="create($event)" @onUpdate="update($event)"/>
				</v-dialog>
				<v-dialog v-model="showDeleteDialog" max-width="500px">
					<v-card>
						<v-card-title class="headline">¿Estás seguro de borrar la categoría?</v-card-title>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="blue darken-1" text @click="closeDeleteDialog">Cancelar</v-btn>
							<v-btn color="blue darken-1" text @click="remove">OK</v-btn>
							<v-spacer></v-spacer>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-toolbar>
		</template>
		<template v-slot:item.actions="{ item }">
			<v-icon @click="openUpdateDialog(item)"> mdi-pencil</v-icon>
			<v-icon @click="openDeleteDialog(item)"> mdi-delete</v-icon>
		</template>
		<template v-slot:no-data>
			<v-btn color="primary" @click="getData">Recargar</v-btn>
		</template>
	</v-data-table>
</template>

<script>
import CouponCategoryForm from "@/components/CouponCategoryForm";
import {mapState} from "vuex";
import axios from "axios";
export default {
	name: "CouponCategories",
	components: {CouponCategoryForm},
	data: () => ({
		showFormDialog: false,
		showDeleteDialog: false,
		executing: false,
		headers: [
			{text: 'Nombre', value: 'name'},
			{text: 'Acciones', value: 'actions', sortable: false},
		],
		deleteItemId: 0,
	}),
	methods:{
		openUpdateDialog(item)
		{
			this.$store.commit('couponCategory/setCurrentCouponCategory', Object.assign({}, item));
			this.showFormDialog = true;
		},
		openDeleteDialog(item)
		{
			this.deleteItemId = item.id;
			this.showDeleteDialog = true;
		},
		closeFormDialog()
		{
			this.showFormDialog = false;
			this.$refs.form.clear();
		},
		closeDeleteDialog()
		{
			this.showDeleteDialog = false;
			this.deleteItemId = 0;
		},
		getData()
		{
			this.$store.dispatch('couponCategory/getCouponCategories');
		},
		create()
		{
			let data = this.$data;
			let store = this.$store;
			let refs = this.$refs;
			let currentCouponCategory = Object.assign({}, this.currentCouponCategory);

			data.executing = true;
			axios.post('couponCategories', currentCouponCategory).then(function ()
			{
				data.showFormDialog = false;
				store.dispatch("couponCategory/getCouponCategories");
				store.state.message = {
					visible: true,
					text: 'Categoría creada',
					color: 'success'
				};
				refs.form.clear();
			}).catch(function (error)
			{
				console.error(error);
				console.error(error.response);
				store.state.message = {
					visible: true,
					text: 'Hubo un error al crear la categoría',
					color: 'error'
				};
			}).then(function ()
			{
				data.executing = false;
			});
		},
		update()
		{
			let data = this.$data;
			let store = this.$store;
			let refs = this.$refs;
			let currentCouponCategory = Object.assign({}, this.currentCouponCategory);

			data.executing = true;

			axios.put(`couponCategories/${currentCouponCategory.id}`, currentCouponCategory).then(function ()
			{
				data.showFormDialog = false;
				store.dispatch("couponCategory/getCouponCategories");
				store.state.message = {
					visible: true,
					text: 'Categoría modificada',
					color: 'success'
				};
				refs.form.clear();
			}).catch(function (error)
			{
				console.error(error.response);
				store.state.message = {
					visible: true,
					text: 'Hubo un error al modificar la categoría',
					color: 'error'
				};
			}).then(function ()
			{
				data.executing = false;
			});
		},
		remove()
		{
			let data = this.$data;
			let store = this.$store;

			data.executing = true;
			axios.delete(`couponCategories/${data.deleteItemId}`).then(function (response)
			{
				data.showDeleteDialog = false;
				store.dispatch("couponCategory/getCouponCategories");
				store.state.message = {
					visible: true,
					text: 'Categoría eliminada',
					color: 'success'
				};
			}).catch(function (error)
			{
				console.error(error.response);
				store.state.message = {
					visible: true,
					text: 'Hubo un error al eliminar la categoría',
					color: 'error'
				};
			}).then(function ()
			{
				data.executing = false;
			});
		},
	},
	computed: {
		...mapState('couponCategory', ['couponCategories', 'currentCouponCategory']),
	},
	beforeMount()
	{
		this.$store.dispatch('couponCategory/getCouponCategories');
	}
};
</script>

<style scoped>

</style>