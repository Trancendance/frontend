import { BaseLayout } from '../layouts/BaseLayout';
import { ExampleElement } from '../componentTemplate';
import { startRouter } from '@/router/routerSPA';
import { routes } from './router';
import { NavigationMenu } from '../components/NavigationMenu.js';

customElements.define('base-layout', BaseLayout);
customElements.define('example-element', ExampleElement);
customElements.define('navigation-menu', NavigationMenu);

const el = document.querySelector('#app');
if (el) {
    el.innerHTML = /*html*/ `<base-layout>
			<navigation-menu slot="nav"></navigation-menu>
			<router-root class="w-full"></router-root>
		</base-layout>`;
}
startRouter(routes);
// startRouter(routes);
