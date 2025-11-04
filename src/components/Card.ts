import { CustomElementTemplate } from '../componentTemplate';

export class AppCard extends CustomElementTemplate {
    protected _innerHTML = /*html*/ `
        <div class="bg-white rounded-lg shadow-lg p-6">
			<slot></slot>
		</div>
    `;
}
