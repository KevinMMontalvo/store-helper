<template>
	<div>
		<v-navigation-drawer v-model="menuVisible" app temporary width="300px">
			<v-list dense>
				<v-list-item @click="swapModule('Stores')">
					<v-list-item-action>
						<v-icon>mdi-store</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Tiendas</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item @click="swapModule('Products')">
					<v-list-item-action>
						<v-icon>mdi-format-list-bulleted</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Productos</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item @click="swapModule('Coupons')">
					<v-list-item-action>
						<v-icon>mdi-ticket-percent</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Cupones</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-app-bar app color="primary" dark>
			<v-app-bar-nav-icon @click.stop="menuVisible = !menuVisible"></v-app-bar-nav-icon>
			<v-toolbar-title>Panel de administración</v-toolbar-title>
			<v-spacer/>
		</v-app-bar>
		<v-main>
			<component v-bind:is="currentContent"/>
		</v-main>
	</div>
</template>

<script>

import Stores from "@/components/Stores";
import Products from "@/components/Products";

export default {
	name: 'Home',
	components: {Stores, Products},
	data: () => ({
		menuVisible: false,
		currentContent: '',
	}),
	methods: {
		swapModule(module)
		{
			this.currentContent = module;
			this.menuVisible = false;
		}
	}
};
</script>
