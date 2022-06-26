<template>
	<div>
		<v-data-table :headers="headers" :items="products" class="elevation-1 ma-3" :loading="products===undefined">
			<template v-slot:top>
				<v-toolbar flat>
					<v-toolbar-title>Productos</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
					<v-spacer></v-spacer>
					<v-dialog v-model="showFormDialog" width="90%">
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
								Nuevo producto
							</v-btn>
						</template>
						<ProductForm ref="form" :executing="executing" @onClose="closeFormDialog"
									 @onCreate="create" @onUpdate="update" @onBarcodeSearch="searchBarcode()"/>
					</v-dialog>
					<v-dialog v-model="showDeleteDialog" max-width="500px">
						<v-card>
							<v-card-title class="headline">¿Estás seguro de borrar el producto?</v-card-title>
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
				<v-icon @click="openStoresDialog(item)"> mdi-store-edit</v-icon>
				<v-icon @click="openDeleteDialog(item)"> mdi-delete</v-icon>
			</template>
			<template v-slot:no-data>
				<v-btn color="primary" @click="getData">Recargar</v-btn>
			</template>
		</v-data-table>
		<v-dialog v-model="showStoresDialog" persistent>
			<v-card>
				<v-card-title class="headline">Producto por tiendas</v-card-title>
				<v-card-text>
					<v-skeleton-loader v-if="stores===undefined" max-width="200" type="list-item@3"></v-skeleton-loader>
					<div v-for="(store, index) in productByStores">
						<v-checkbox v-model="productByStores[index].selected" :key="index"
									class="my-0" :label="store.code"/>
						<v-row v-if="productByStores[index].selected">
							<v-col cols="12" sm="4" md="4">
								<v-text-field v-model.trim="productByStores[index].place.section" label="Pasillo*"
											  type="text"
											  :rules="[rules.required]" counter="10" maxlength="10" dense/>
							</v-col>
							<v-col cols="12" sm="4" md="4">
								<v-text-field v-model.trim="productByStores[index].place.rack" label="Estante*"
											  type="text"
											  :rules="[rules.required]" counter="10" maxlength="10" dense/>
							</v-col>
							<v-col cols="12" sm="4" md="4">
								<v-text-field v-model.trim="productByStores[index].place.floor" label="Nivel*"
											  type="text"
											  :rules="[rules.required]" counter="10" maxlength="10" dense/>
							</v-col>
						</v-row>
					</div>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" @click="showStoresDialog = false" text>Cancelar</v-btn>
					<v-btn color="primary" :loading="executing" @click="saveProductByStores" dark>Guardar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import axios from "axios";
import {mapState} from "vuex";
import ProductForm from "@/components/ProductForm";

export default {
	name: "Products",
	components: {ProductForm},
	data: () => ({
		showFormDialog: false,
		showDeleteDialog: false,
		showStoresDialog: false,
		executing: false,
		headers: [
			{text: 'Código', value: 'barcode'},
			{text: 'Nombre', value: 'name'},
			{text: 'Tiendas', value: 'stores'},
			{text: 'Acciones', value: 'actions', sortable: false},
		],
		deleteItemId: 0,
		rules: {
			required(value)
			{
				return !!value || 'Este campo es obligatorio';
			},
			positiveNumber(value)
			{
				return value > 0 || 'El numero debe ser positivo';
			}
		}
	}),
	methods: {
		openUpdateDialog(item)
		{
			this.$store.commit('products/setCurrentProduct', Object.assign({}, item));
			this.showFormDialog = true;
		},
		openDeleteDialog(item)
		{
			this.deleteItemId = item.id;
			this.showDeleteDialog = true;
		},
		openStoresDialog(item)
		{
			this.$store.dispatch("stores/getStores");
			this.$store.dispatch("productByStores/getProductByStores", item.id);
			this.$store.commit('products/setCurrentProduct', Object.assign({}, item));
			this.showStoresDialog = true;
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
			this.$store.dispatch('products/getProducts');
		},
		create()
		{
			let data = this.$data;
			let store = this.$store;
			let refs = this.$refs;
			let currentStore = Object.assign({}, this.currentProduct);

			data.executing = true;
			axios.post('products', currentStore).then(function ()
			{
				data.showFormDialog = false;
				store.dispatch("products/getProducts");
				store.state.message = {
					visible: true,
					text: 'Producto creado',
					color: 'success'
				};
				refs.form.clear();
			}).catch(function (error)
			{
				if (error.response.status === 400)
				{
					store.state.message = {
						visible: true,
						text: error.response.data,
						color: 'error'
					};
				}
				else
				{
					store.state.message = {
						visible: true,
						text: 'Hubo un error al crear el producto',
						color: 'error'
					};
				}
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
			let currentStore = Object.assign({}, this.currentProduct);

			data.executing = true;

			axios.put(`products/${currentStore.id}`, currentStore).then(function ()
			{
				data.showFormDialog = false;
				store.dispatch("products/getProducts");
				store.state.message = {
					visible: true,
					text: 'Producto modificado',
					color: 'success'
				};
				refs.form.clear();
			}).catch(function (error)
			{
				console.error(error.response);

				if (error.response.status === 400)
				{
					store.state.message = {
						visible: true,
						text: error.response.data,
						color: 'error'
					};
				}
				else
				{
					store.state.message = {
						visible: true,
						text: 'Hubo un error al modificar el producto',
						color: 'error'
					};
				}
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
			axios.delete(`products/${data.deleteItemId}`).then(function (response)
			{
				data.showDeleteDialog = false;
				store.dispatch("products/getProducts");
				store.state.message = {
					visible: true,
					text: 'Producto eliminado',
					color: 'success'
				};
			}).catch(function (error)
			{
				console.error(error.response);
				store.state.message = {
					visible: true,
					text: 'Hubo un error al eliminar el producto',
					color: 'error'
				};
			}).then(function ()
			{
				data.executing = false;
			});
		},
		searchBarcode()
		{
			let data = this.$data;
			let store = this.$store;
			let current = this.currentProduct;

			axios.get(`products/productInfo?barcode=${this.currentProduct.barcode}`).then(function (response)
			{
				let currentProduct = Object.assign({}, store.state.products.currentProduct);
				currentProduct.name = response.data.product.name;
				store.commit('products/setCurrentProduct', currentProduct)
			}).catch(function (error)
			{
				console.error(error);
				if (error.response.status === 404)
				{
					store.state.message = {
						visible: true,
						text: 'Codigo de barras no encontrado',
						color: 'warning'
					};
				}
				else
				{
					store.state.message = {
						visible: true,
						text: 'Error al consultar el código de barras',
						color: 'error'
					};
				}
			});
		},
		saveProductByStores()
		{
			let data = this.$data;
			let store = this.$store;

			data.executing = true;
			console.log(JSON.stringify(this.productByStores));
			axios.post('productByStores/createMultiple', this.productByStores).then(function (response)
			{
				data.showStoresDialog = false;
				store.commit('products/setCurrentProduct', {});
				store.commit('productByStores/setProductByStores', []);
				store.state.message = {
					visible: true,
					text: 'Registro en tiendas guardado',
					color: 'success'
				};
			}).catch(function (error)
			{
				console.error(error);
				store.state.message = {
					visible: true,
					text: 'Error al guardar el registro en tiendas',
					color: 'error'
				};
			}).then(function ()
			{
				data.executing = false;
			});
		}
	},
	computed: {
		...mapState('products', ['products', 'currentProduct']),
		...mapState('stores', ["stores"]),
		...mapState('productByStores', ['productByStores'])
	},
	beforeMount()
	{
		this.$store.dispatch('products/getProducts');
	}
};
</script>

<style scoped>

</style>