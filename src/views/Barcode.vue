<template>
	<div>
		<v-select :items="videoInputs" label="label" value="deviceId"></v-select>
	</div>
</template>

<script>
import {MultiFormatReader, BarcodeFormat, BrowserBarcodeReader} from '@zxing/library';

export default {
	name: "Barcode",
	data: () => ({
		codeReader: null,
		videoInputs: []
	}),
	methods: {
		onDecode(result)
		{
			console.log(result);
		},
		onLoaded(result)
		{
			console.log(result);
		}
	},
	created()
	{
		navigator.mediaDevices.enumerateDevices().then(devices =>
		{
			for (let i = 0; i < devices.length; i++)
			{
				if (devices[i].kind === 'videoinput')
				{
					console.log(devices[i]);
					this.$data.videoInputs.push({label: devices[i].label, value: devices[i].deviceId});
				}
			}
		});
	}
};
</script>

<style scoped>

</style>