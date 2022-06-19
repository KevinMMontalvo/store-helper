<template>
	<div>
		<v-btn v-if="videoInputs.length > 1" color="primary" @click="nextDevice">Cambio de camara</v-btn>
		<div id="reader"></div>
		{{ result }}
	</div>
</template>

<script>
import {Html5Qrcode, Html5QrcodeScanner} from "html5-qrcode";

export default {
	name: "Barcode",
	data: () => ({
		codeReader: null,
		videoInputs: [],
		videoInput: null,
		videoInputIndex: 0,
		html5QrcodeScanner: {},
		cameraId: '',
		result: {}
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
				this.result = result;
				console.log(result);
				//document.getElementById('result').textContent = result.text
			}).catch((err) =>
			{
				console.error(err);
				//document.getElementById('result').textContent = err
			});
		},
		onScanSuccess(decodedText, decodedResult)
		{

			// Handle on success condition with the decoded text or result.
			this.result = `Scan result: ${decodedText}`;
			console.log(`Scan result: ${decodedText}`, decodedResult);
			this.html5QrcodeScanner.clear();
		},
		onScanError(errorMessage)
		{
			// handle on error condition, with error message
		}
	},

	async created()
	{
		/*this.codeReader = new ZXing.BrowserMultiFormatReader();*/
		const constraints = {
			audio: false,
			video: true
		};
		await navigator.mediaDevices.getUserMedia(constraints);

		/*navigator.mediaDevices.enumerateDevices().then(devices =>
		{
			for (let i = 0; i < devices.length; i++)
			{
				if (devices[i].kind === "videoinput")
				{
					this.videoInputs.push({label: devices[i].label, deviceId: devices[i].deviceId});
				}
			}
			this.nextDevice();
		});*/

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
				this.cameraId = devices[0].id;
				// .. use this to start scanning.
			}
		}).catch(err =>
		{
			// handle err
		}).then(() =>
		{
			this.html5QrcodeScanner = new Html5Qrcode(/* element id */ "reader");
			this.html5QrcodeScanner.start(
				this.cameraId,
				{
					fps: 10,    // Optional, frame per seconds for qr code scanning
					qrbox: {width: 250, height: 250}  // Optional, if you want bounded box UI
				}, this.onScanSuccess,
				this.onScanError)
				.catch((err) =>
				{
					// Start failed, handle it.
				});
		});
		// this.html5QrcodeScanner = new Html5QrcodeScanner("reader", {fps: 10, qrbox: 250}, false);
		// this.html5QrcodeScanner.render(this.onScanSuccess, this.onScanError);
	}
};
</script>

<style scoped>
#reader
{
	width: 50%;
}

@media only screen and (max-width: 768px)
{
	#reader
	{
		width: 100%;
	}
}
</style>