import { BaseLayout } from '../layouts/BaseLayout';
import { ExampleElement } from '../componentTemplate';
import { startRouter } from '@/router/routerSPA';
import { routes } from './router';
import { NavigationMenu } from '../components/NavigationMenu.js';
import { PageModal, ModalToggle } from '../layouts/PageModal.js';

customElements.define('base-layout', BaseLayout);
customElements.define('example-element', ExampleElement);
customElements.define('navigation-menu', NavigationMenu);
customElements.define('page-modal', PageModal);

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
// startRouter(routes);
