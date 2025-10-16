import { CustomElementTemplate } from '../componentTemplate.js';

export class BaseLayout extends CustomElementTemplate {
    static get observedAttributes(): readonly string[] {
        return [...super.observedAttributes] as const;
    }
    protected _name = 'base-layout';
    protected _innerHTML = /*html*/ `
		<div id="main-wrapper" class="min-h-screen bg-gray-50">
			<header class="border-b bg-white p-4 shadow-sm flex justify-between items-center">
				<a data-link href="/" class="text-lg font-bold">MyAppShadow</a>
			 	<slot name="nav"></slot>
			</header>
			<main id="main-content" class="mx-auto flex gap-4 lg:flex-row flex-col p-4">
				<slot class="grow"></slot>
			</main>
		</div>
	`;
}

// customElements.define('base-layout', BaseLayout);
