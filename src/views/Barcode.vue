<template>
	<div>
		<v-btn v-if="videoInputs.length > 1" color="primary" @click="nextDevice">Cambio de camara</v-btn>
		<v-select v-model="videoInput" class="d-none" :items="videoInputs" item-text="label" item-value="deviceId"
				  @input="startScan"></v-select>
		<div>
			<video id="video" width="600" height="400" style="border: 1px solid gray"></video>
		</div>
	</div>
</template>

<script>
export default {
	name: "Barcode",
	data: () => ({
		codeReader: null,
		videoInputs: [],
		videoInput: null,
		videoInputIndex: 0
	}),
	methods: {
		onDecode(result)
		{
			console.log(result);
		},
		onLoaded(result)
		{
			console.log(result);
		},
		startScan()
		{
			this.codeReader.decodeOnceFromVideoDevice(this.videoInput.deviceId, 'video').then((result) =>
			{
				console.log(result);
				//document.getElementById('result').textContent = result.text
			}).catch((err) =>
			{
				console.error(err);
				//document.getElementById('result').textContent = err
			});
			console.log(`Started continous decode from camera with id ${this.videoInput.deviceId}`);
		},
		nextDevice()
		{
			this.videoInputIndex++;
			if (this.videoInputIndex === this.videoInputs.length)
			{
				this.videoInputIndex = 0;
			}
			this.codeReader.reset();
			console.log(this.videoInputs[this.videoInputIndex]);
			this.codeReader.decodeOnceFromVideoDevice(this.videoInputs[this.videoInputIndex].deviceId, 'video').then((result) =>
			{
				console.log(result);
				//document.getElementById('result').textContent = result.text
			}).catch((err) =>
			{
				console.error(err);
				//document.getElementById('result').textContent = err
			});
		}
	},
	async created()
	{
		this.codeReader = new ZXing.BrowserBarcodeReader();
		const constraints = {
			audio: false,
			video: true
		};
		await navigator.mediaDevices.getUserMedia(constraints);

		navigator.mediaDevices.enumerateDevices().then(devices =>
		{
			for (let i = 0; i < devices.length; i++)
			{
				if (devices[i].kind === "videoinput")
				{
					this.videoInputs.push({label: devices[i].label, deviceId: devices[i].deviceId});
				}
			}
			this.nextDevice();
		});

	}
};
</script>

<style scoped>

</style>