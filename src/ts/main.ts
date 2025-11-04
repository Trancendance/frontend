import { startRouter } from '@/router/routerSPA';
import { routes } from './router';
import './webComponents';

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

startRouter(routes);
