<template>
	<v-form v-model="valid" ref="form">
		<v-card>
			<v-card-title>{{ formTitle }}</v-card-title>
			<v-card-text>
				<v-container>
					<v-row>
						<v-col cols="12" sm="6" md="4">
							<v-select v-model.trim="currentCoupon.storeId" label="Tienda*" :items="stores"
									  item-text="code" item-value="id" prepend-icon="mdi-store" @change="getProducts"
									  :rules="[rules.required]"/>
						</v-col>
						<v-col cols="12" sm="6" md="8">
							<v-text-field v-model.trim="currentCoupon.text" label="Texto*" type="text"
										  prepend-icon="mdi-format-list-bulleted" :rules="[rules.required]"
										  counter="50" maxlength="50"/>
						</v-col>
						<v-col cols="12" sm="12" md="12">
							<v-textarea v-model.trim="currentCoupon.conditions" label="Condiciones*"
										prepend-icon="mdi-script-text-outline" :rules="[rules.required]"
										rows=3 auto-grow/>
						</v-col>
						<v-col cols="12" sm="6" md="6">
							<v-select v-model.trim="currentCoupon.productId" label="Producto*" :items="productByStores"
									  item-text="name" item-value="productId"
									  prepend-icon="mdi-format-list-bulleted" :rules="[rules.required]"/>
						</v-col>
						<v-col cols="12" sm="6" md="6">
							<v-select v-model.trim="currentCoupon.couponCategoryId" label="Categoría*" :items="couponCategories"
									  item-text="name" item-value="id"
									  prepend-icon="mdi-format-list-bulleted" :rules="[rules.required]"/>
						</v-col>
					</v-row>
					<div id="reader"></div>
				</v-container>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="primary" text @click="close">Cancelar</v-btn>
				<v-btn color="primary" :loading="executing" @click="save" :disabled="!valid">Guardar</v-btn>
			</v-card-actions>
		</v-card>
	</v-form>
</template>

<script>
import {mapState} from "vuex";

export default {
	name: "CouponForm",
	props: ['executing'],
	data: () => ({
		valid: false,
		rules: {
			required(value)
			{
				return !!value || 'Este campo es obligatorio';
			}
		}
	}),
	methods: {
		close()
		{
			this.clear();
			this.$emit("onClose");
		},
		save()
		{
			if (!!!this.currentCoupon.id)
			{
				this.$emit('onCreate');
			}
			else
			{
				this.$emit('onUpdate');
			}
		},
		searchProduct()
		{
			this.$emit('onBarcodeSearch');
		},
		clear()
		{
			this.currentCoupon.id = undefined;
			this.currentCoupon.storeId = 0;
			this.currentCoupon.text = '';
			this.currentCoupon.conditions = '';
			this.currentCoupon.productId = 0;
			this.currentCoupon.couponCategoryId = 0;
			this.$refs.form.resetValidation();
		},
		getProducts()
		{
			this.$store.dispatch('productByStores/getProductsByStore', this.currentCoupon.storeId);
		}
	},
	computed: {
		...mapState('coupons', ['currentCoupon']),
		...mapState('productByStores', ['productByStores']),
		...mapState('stores', ["stores"]),
		...mapState('couponCategory', ["couponCategories"]),
		formTitle()
		{
			return !!this.currentCoupon.id ? 'Editar cupón' : 'Nuevo cupón';
		},
	},
	beforeCreate()
	{
		this.$store.dispatch('stores/getStores');
		this.$store.dispatch('couponCategory/getCouponCategories');
	}
};
</script>

<style scoped>

</style>