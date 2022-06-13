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
		const codeReader = new ZXing.BrowserBarcodeReader();


		codeReader.getVideoInputDevices()
			.then((videoInputDevices) =>
			{
				console.log(videoInputDevices);
				const sourceSelect = document.getElementById('sourceSelect');
				//selectedDeviceId = videoInputDevices[0].deviceId;
				if (videoInputDevices.length > 1)
				{
					videoInputDevices.forEach((element) =>
					{
						console.log(element);
						/*const sourceOption = document.createElement('option');
						sourceOption.text = element.label;
						sourceOption.value = element.deviceId;
						sourceSelect.appendChild(sourceOption);*/
					});

					sourceSelect.onchange = () =>
					{
						//selectedDeviceId = sourceSelect.value;
					};

					const sourceSelectPanel = document.getElementById('sourceSelectPanel');
					sourceSelectPanel.style.display = 'block';
				}

			});
	}
};
</script>

<style scoped>

</style>