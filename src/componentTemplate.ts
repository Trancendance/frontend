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
        this.#root.innerHTML = '';

        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = '/tailwind.css';
    
        this.#root.appendChild(style);
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this._innerHTML;
        this.#root.appendChild(wrapper);
    }

    connectedCallback() {
        this.render();
        // console.log(`${this._name} - Added to page`);
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
