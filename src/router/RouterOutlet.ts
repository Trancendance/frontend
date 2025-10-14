export class RouterOutlet extends HTMLElement {
    static observedAttributes = [] as const;

    constructor() {
        super();
        this.innerHTML = /*html*/ `
			<div id="router-outlet"></div>
		`;
    }
}
