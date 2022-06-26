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
										  prepend-icon="mdi-format-list-bulleted" :rules="[rules.required]"
										  counter="200" maxlength="200"/>
						</v-col>
					</v-row>
					<div id="reader"></div>
				</v-container>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="primary" text @click="">
					<v-icon right dark>mdi-camera-flip</v-icon>
				</v-btn>
				<v-btn color="primary" text @click="startScan">Escaner</v-btn>
				<v-btn color="primary" text @click="close">Cancelar</v-btn>
				<v-btn color="primary" :loading="executing" @click="save" :disabled="!valid">Guardar</v-btn>
			</v-card-actions>
		</v-card>
	</v-form>
</template>

<script>
import {mapState} from "vuex";
import {Html5Qrcode} from "html5-qrcode";

export default {
	name: "ProductForm",
	props: ['executing'],
	data: () => ({
		valid: false,
		cameraId: '',
		html5QrcodeScanner: {},
		showScanner: true,
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
			try
			{
				this.html5QrcodeScanner.stop().then((re) =>
				{
					console.log(re);
					this.showScanner = false;
				}).catch((err) =>
				{
					console.log(err);
				});
			}
			catch (e)
			{
			}
		},
		startScan()
		{
			this.showScanner = true;
			this.html5QrcodeScanner = new Html5Qrcode("reader");
			this.html5QrcodeScanner.start(this.cameraId,
				{
					fps: 10,    // Optional, frame per seconds for qr code scanning
					//qrbox: {width: 250, height: 250}  // Optional, if you want bounded box UI
				}, this.onScanSuccess, () =>
				{
				});
		},
		onScanSuccess(decodedText, decodedResult)
		{
			let store = this.$store;
			store.commit("products/setCurrentProduct", {barcode: decodedText});
			console.log(`Scan result: ${decodedText}`, decodedResult);
			this.html5QrcodeScanner.stop().then(() =>
			{
			}).catch((err) =>
			{
				console.log(err);
			});

		},
		onScanError(errorMessage)
		{
			console.error(errorMessage);
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
	},
	mounted()
	{
		Html5Qrcode.getCameras().then(devices =>
		{
			/**
			 * devices would be an array of objects of type:
			 * { id: "id", label: "label" }
			 */
			if (devices && devices.length)
			{
				console.log(devices);
				this.cameraId = devices[devices.length-1].id;
				// .. use this to start scanning.
			}
		}).catch(err =>
		{
			// handle err
		});
	}
};
</script>

<style scoped>

</style>