<template>
	<v-data-table :headers="headers" :items="coupons" class="elevation-1 ma-3" :loading="coupons===undefined">
		<template v-slot:top>
			<v-toolbar flat>
				<v-toolbar-title>Cupones</v-toolbar-title>
				<v-divider class="mx-4" inset vertical></v-divider>
				<v-spacer></v-spacer>
				<v-dialog v-model="showFormDialog" width="90%">
					<template v-slot:activator="{ on, attrs }">
						<v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
							Nuevo cupón
						</v-btn>
					</template>
					<CouponForm ref="form" :executing="executing" @onClose="closeFormDialog"
										@onCreate="create($event)" @onUpdate="update($event)"/>
				</v-dialog>
				<v-dialog v-model="showDeleteDialog" max-width="500px">
					<v-card>
						<v-card-title class="headline">¿Estás seguro de borrar el cupón?</v-card-title>
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
import axios from "axios";
import {mapState} from "vuex";
import CouponForm from "@/components/CouponForm";

export default {
	name: "Coupons",
	components: {CouponForm},
	data: () => ({
		showFormDialog: false,
		showDeleteDialog: false,
		executing: false,
		headers: [
			{text: 'Texto', value: 'text'},
			{text: 'Producto', value: 'product'},
			{text: 'Categoría', value: 'couponCategory'},
			{text: 'Acciones', value: 'actions', sortable: false},
		],
		deleteItemId: 0,
	}),
	methods:{
		openUpdateDialog(item)
		{
			this.$store.commit('coupons/setCurrentCoupon', Object.assign({}, item));
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
			this.$store.dispatch('coupons/getCoupons');
		},
		create()
		{
			let data = this.$data;
			let store = this.$store;
			let refs = this.$refs;
			let currentCoupon = Object.assign({}, this.currentCoupon);

			data.executing = true;
			axios.post('coupons', currentCoupon).then(function ()
			{
				data.showFormDialog = false;
				store.dispatch("coupons/getCoupons");
				store.state.message = {
					visible: true,
					text: 'Cupón creado',
					color: 'success'
				};
				refs.form.clear();
			}).catch(function (error)
			{
				console.error(error);
				console.error(error.response);
				store.state.message = {
					visible: true,
					text: 'Hubo un error al crear el cupón',
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
			let currentCoupon = Object.assign({}, this.currentCoupon);

			data.executing = true;

			axios.put(`coupons/${currentCoupon.id}`, currentCoupon).then(function ()
			{
				data.showFormDialog = false;
				store.dispatch("coupons/getCoupons");
				store.state.message = {
					visible: true,
					text: 'Cupón modificado',
					color: 'success'
				};
				refs.form.clear();
			}).catch(function (error)
			{
				console.error(error.response);
				store.state.message = {
					visible: true,
					text: 'Hubo un error al modificar el cupón',
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
			axios.delete(`coupons/${data.deleteItemId}`).then(function (response)
			{
				data.showDeleteDialog = false;
				store.dispatch("coupons/getCoupons");
				store.state.message = {
					visible: true,
					text: 'Cupón eliminado',
					color: 'success'
				};
			}).catch(function (error)
			{
				console.error(error.response);
				store.state.message = {
					visible: true,
					text: 'Hubo un error al eliminar el cupón-',
					color: 'error'
				};
			}).then(function ()
			{
				data.executing = false;
			});
		},
	},
	computed: {
		...mapState('coupons', ['coupons', 'currentCoupon']),
	},
	beforeMount()
	{
		this.$store.dispatch('coupons/getCoupons');
	}
};
</script>

<style scoped>

</style>