<template>
	<v-form v-model="valid" ref="form">
		<v-card>
			<v-card-title>{{ formTitle }}</v-card-title>
			<v-card-text>
				<v-container>
					<v-row>
						<v-col cols="12" sm="6" md="4">
							<v-text-field v-model.trim="currentProduct.barcode" label="Código de barras*" type="text"
										  prepend-icon="mdi-barcode" append-icon="mdi-magnify" :rules="[rules.required]"
										  counter="25" maxlength="25" @click:append="searchProduct"/>
						</v-col>
						<v-col cols="12" sm="6" md="4">
							<v-text-field v-model.trim="currentProduct.name" label="Nombre*" type="text"
										  prepend-icon="mdi-format-list-bulleted" :rules="[rules.required]" counter="200" maxlength="200"/>
						</v-col>
					</v-row>
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
	name: "ProductForm",
	props: ['executing'],
	data: () => ({
		valid: false,
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
		close()
		{
			this.clear();
			this.$emit("onClose");
		},
		save()
		{
			if (!!!this.currentProduct.id)
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
			this.currentProduct.id = undefined;
			this.currentProduct.barcode = "";
			this.currentProduct.name = "";
			this.$refs.form.resetValidation();
		}
	},
	computed: {
		...mapState('products', ['currentProduct']),

		formTitle()
		{
			return !!this.currentProduct.id ? 'Editar producto' : 'Nuevo producto';
		},
	},
	beforeCreate()
	{
	}
};
</script>

<style scoped>

</style>