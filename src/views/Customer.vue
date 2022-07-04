<template>
	<div class="d-flex align-center justify-center blue-grey fill-height">
		<v-app-bar app color="primary" dark>
			<!--			<v-app-bar-nav-icon @click.stop="menuVisible = !menuVisible"></v-app-bar-nav-icon>-->
			<v-toolbar-title>Titulo</v-toolbar-title>
			<v-spacer/>
			<span class="mr-1">Tienda: </span>
			<v-select v-model="currentStore" class="store-select pt-6" :items="stores" item-value="id"
					  item-text="code"></v-select>
		</v-app-bar>
		<div class="d-flex flex-column mx-5">
			<div class="d-flex text-h5 text-center mb-5 white--text">Ingrese el nombre del producto a buscar</div>
			<!--			<v-text-field class="d-flex text-h4" v-model.trim="searchText" color="primary" background-color="white"-->
			<!--						  type="text" :rules="[]" @click:append-outer="searchProduct" @keydown.enter="searchProduct"-->
			<!--						  outlined>-->
			<!--				<template v-slot:append-outer>-->
			<!--					<v-icon color="white" x-large>search</v-icon>-->
			<!--				</template>-->
			<!--			</v-text-field>-->

			<v-autocomplete v-model="selectedProductId" :items="items" :loading="executing"
							:search-input.sync="searchText" chips clearable hide-details hide-selected item-text="name"
							item-value="id" label="Ingrese el nombre o código de barras" solo>
				<template v-slot:no-data>
					<v-list-item>
						<v-list-item-title>
							No hay resultados
						</v-list-item-title>
					</v-list-item>
				</template>
				<template v-slot:selection="{ attr, on, item, selected }">
					<v-chip v-bind="attr" :input-value="selected" color="blue-grey" class="white--text" v-on="on">
						<!--						<v-icon left>-->
						<!--							mdi-bitcoin-->
						<!--						</v-icon>-->
						<span v-text="item.name"></span>
					</v-chip>
				</template>
				<template v-slot:item="{ item }">
					<v-list-item-avatar color="indigo" class="text-h5 font-weight-light white--text">
						{{ item.name.trim().charAt(0) }}
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title v-text="item.name"></v-list-item-title>
						<v-list-item-subtitle v-text="item.barcode"></v-list-item-subtitle>
					</v-list-item-content>
					<!--					<v-list-item-action>-->
					<!--						<v-icon>mdi-bitcoin</v-icon>-->
					<!--					</v-list-item-action>-->
				</template>
			</v-autocomplete>
			<!--			<a class="d-flex text-center mb-5 white&#45;&#45;text">O buscar codigo de barras</a>-->
		</div>
		<v-dialog v-model="showCouponsDialog">
			<v-card>
				<v-card-title>
					{{ !!selectedProductId ?items.find(i => i.id === selectedProductId).name:'' }}
				</v-card-title>
				<v-card-subtitle class="mt-2">Cupones disponibles:</v-card-subtitle>
				<v-card-text>
					<v-list>
						<template v-for="coupon in coupons">
							<v-list-item>
							<v-list-item-content>
								<v-list-item-title>Single-line item</v-list-item-title>
							</v-list-item-content>
							</v-list-item>
						</template>
					</v-list>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="green darken-1" text @click="showCouponsDialog = false">Cerrar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>


import {mapState} from "vuex";
import axios from "axios";

export default {
	name: "Customer",
	data: () => ({
		executing: false,
		searchText: '',
		currentStore: 0,
		items: [],
		selectedProductId: null,
		showCouponsDialog: false
	}),
	methods: {
		searchProduct()
		{
			let data = this.$data;
			let store = this.$store;

			let params = {
				search: this.searchText,
				storeId: this.currentStore
			};

			data.executing = true;

			axios.get('products/searchProducts', {params}).then(function (result)
			{
				data.items = result.data;
			}).catch(function (error)
			{
				console.error(error);
				console.error(error.response);
				store.state.message = {
					visible: true,
					text: 'Hubo un error al realizar la búsqueda',
					color: 'error'
				};
			}).then(function ()
			{
				data.executing = false;
			});
		},
		showCuponsDialog()
		{
			let params = {
				productId: this.selectedProductId,
				storeId: this.currentStore
			};

			this.$store.dispatch('coupons/getCouponsByProductIdAndStoreId', params);
			this.showCouponsDialog = true;
		},
		showSavedCuponsDialog()
		{

		}
	},
	computed: {
		...mapState('stores', ['stores']),
		...mapState('coupons', ['coupons'])
	},
	watch: {
		searchText(value)
		{
			if (!!!value || value === '')
			{
				this.items = [];
				return;
			}
			this.executing = true;
			this.searchProduct();
		},
		selectedProductId(value)
		{
			if (!!value)
			{
				this.showCuponsDialog();
			}
		}
	},
	beforeMount()
	{
		//console.log(this.$route.params.id);
		this.currentStore = parseInt(this.$route.params.id);
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