<template>
	<v-form v-model="valid" ref="form">
		<v-card>
			<v-card-title>{{ formTitle }}</v-card-title>
			<v-card-text>
				<v-container>
					<v-row>
						<v-col cols="12" sm="6" md="4">
							<v-text-field v-model.trim="currentCouponCategory.name" label="Nombre*" type="text"
										  prepend-icon="mdi-store" :rules="[rules.required]" counter="10" maxlength="10"/>
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
	name: "CouponCategoryForm",
	props: ['executing'],
	data: () => ({
		valid: false,
		rules: {
			required(value)
			{
				return !!value || 'Este campo es obligatorio';
			},
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
			if (!!!this.currentCouponCategory.id)
			{
				this.$emit('onCreate');
			}
			else
			{
				this.$emit('onUpdate');
			}
		},
		clear()
		{
			this.currentCouponCategory.id = undefined;
			this.currentCouponCategory.name = '';
			this.$refs.form.resetValidation();
		}
	},
	computed: {
		...mapState('couponCategory', ['currentCouponCategory']),

		formTitle()
		{
			return !!this.currentCouponCategory.id ? 'Editar categoría de cupón' : 'Nueva categoría de cupón';
		},
	},
	beforeCreate()
	{
	}
};
</script>

<style scoped>

</style>