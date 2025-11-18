import { startRouter } from '@/router/routerSPA';
import { routes } from '@/ts/router';
import '@/ts/webComponents';
import './index.css'

const el = document.querySelector('#app');
if (el) {
    el.innerHTML = /*html*/ `
		<page-modal></page-modal>
		<base-layout>
			<navigation-menu slot="nav" current="" data-router-current></navigation-menu>
			<router-root class="w-full"></router-root>
		</base-layout>
	`;
}
console.log('Starting router with routes:', routes);

startRouter(routes);
