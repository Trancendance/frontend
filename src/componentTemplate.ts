export type AttributeCallback<T extends string> = (
    name: T,
    oldValue: string | null,
    newValue: string | null
) => void;

export class CustomElementTemplate extends HTMLElement {
    static get observedAttributes(): readonly string[] {
        return [] as const;
    }

    protected _name = this.constructor.name;
    protected _innerHTML = '';

    #root: ShadowRoot;

    constructor() {
        super();
        this.#root = this.attachShadow({ mode: 'open' });
        this.shadowRoot!.addEventListener('click', (e) => {
            const a = (e.target as Element)?.closest('a[data-link]');
            if (!a) return;
            e.preventDefault();
            this.dispatchEvent(
                new CustomEvent('link-click', {
                    detail: { href: (a as HTMLAnchorElement).href },
                    bubbles: true,
                    composed: true,
                })
            );
        });
    }

    protected render() {
        this.#root.innerHTML = /*html*/ `
      		<link rel="stylesheet" href="/assets/styles.css">
      		${this._innerHTML}
    `;
    }

    connectedCallback() {
        this.render();
        console.log(`${this._name} - Added to page`);
    }

    disconnectedCallback() {
        console.log(`${this._name} - Removed from page`);
    }

    adoptedCallback() {
        console.log(`${this._name} - Moved to new page`);
    }

    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null
    ) {
        if (oldValue === newValue) return;
        console.log(
            `${this._name} - Attribute ${name} has changed from ${oldValue} to ${newValue}`
        );
    }

    isUnique(): boolean {
        const existingElement = document.querySelector(
            this.tagName.toLowerCase()
        );
        if (existingElement && existingElement !== this) {
            console.warn(
                'Only one instance of',
                this.tagName.toLowerCase(),
                'is allowed.'
            );
            return false;
        }
        return true;
    }
}

// ---- Subclass example ----

export class ExampleElement extends CustomElementTemplate {
    // 3) Make it static and merge with base
    static get observedAttributes(): readonly string[] {
        return [...super.observedAttributes, 'example-attribute'] as const;
    }

    protected _name = 'example-element';
    protected _innerHTML = /*html*/ `
		<p>This is an example element with slots.</p>
		<div class="border p-2 bg-white">
		<p>It has an example-attribute:
		 	<strong>
				<slot name="example-attribute">default value</slot>
			</strong></p>
		</div>
		<div class="border p-2 bg-yellow-200">
		<p>And a default slot: 
			<strong>
				<slot>This is default slot content</slot>
			</strong>
		</p>
		</div>
	`;

    attributeChangedCallback: AttributeCallback<string> = (
        name,
        oldValue,
        newValue
    ) => {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'example-attribute') {
            console.log(`New value: ${newValue}`);
        }
    };
}
