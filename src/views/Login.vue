<template>
	<div class="background-image d-flex justify-end">
		<div class="form">
			<form class="mt-5 pt-5">
				<v-text-field v-model="username" label="Nombre de usuario"/>
				<v-text-field v-model="password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
							  :type="showPassword ? 'text' : 'password'" label="Contraseña" class="input-group--focused"
							  @click:append="showPassword = !showPassword" autocomplete/>
				<div class="d-flex justify-space-between mb-4" id="login-options">
					<v-checkbox v-model="rememberMe" label="Recuérdame"/>
				</div>
				<div class="d-block">
					<v-btn color="primary" :loading="executing" @click="checkCredentials" block>Ingresar</v-btn>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import axios from "axios";

export default {
	name: "Login",
	data: () => ({
		executing: false,
		username: "",
		password: "",
		showPassword: false,
		rememberMe: false,
	}),
	methods: {
		checkCredentials()
		{
			let cookies = this.$cookies;
			let router = this.$router;
			let store = this.$store;
			let data = this.$data;

			data.executing = true;

			let body = {
				username: this.username,
				password: this.password
			};

			axios.post('authentication', body).then(function (response)
			{
				console.log(response);

				if (data.rememberMe)
				{
					let now = new Date();
					now.setFullYear(3000);
					cookies.set('profile', body.username, now.toUTCString());
				}
				else
				{
					cookies.set('profile', body.username,0);
				}

				router.push('main');
			}).catch(function (error)
			{
				console.error(error);
				if (!!error.response && error.response.status === 401)
				{
					store.state.message = {
						visible: true,
						text: 'nombre de usuario o contraseña inválido',
						color: 'error'
					};
				}
				else
				{
					store.state.message = {
						visible: true,
						text: 'Error al intentar ingresar, contáctese con el administrador',
						color: 'error'
					};
				}
			}).then(function ()
			{
				data.executing = false;
			});
		}
	},
	beforeCreate()
	{
		if (!!this.$cookies.get('profile'))
		{
			this.$router.push('main');
		}
	}
};
</script>

<style scoped>
.background-image
{
	width: 100%;
	height: 100%;
	background-image: url("../assets/login background.jpg");
	background-repeat: no-repeat;
	background-size: cover;
}

.form
{
	width: 500px;
	background-color: white;
	padding: 40px 40px 0 40px;
}

@media only screen and (max-width: 768px)
{
	.form
	{
		width: 100%;
	}
}
</style>