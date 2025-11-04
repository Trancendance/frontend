import { CustomElementTemplate } from '../componentTemplate.js';

export class AppButton extends CustomElementTemplate {
    static get observedAttributes() {
        const base = (super.observedAttributes ?? []) as string[];
        return [
            ...base,
            'as',
            'label',
            'type',
            'btn-type',
            'status',
            'for',
        ] as const;
    }

    protected _innerHTML = this.innerHtmlGetter();
    protected _internalElement: HTMLElement | null = null;
    internals: ElementInternals | null = null;

    set clickHandler(value: (e: Event) => void) {
        if (this._internalElement) {
            this._internalElement.addEventListener('click', value);
        }
    }

    innerHtmlGetter() {
        const as = this.getAttribute('as') || 'button';
        const label = this.getAttribute('label') || 'Button';
        if (as === 'input') {
            return /*html*/ `
			<input as="${as}" type="${this.getAttribute('type') || 'button'}" for="${this.getAttribute('for') || ''}" class="p-2 ${this.classGetter()}" value="${label}" />
		`;
        }
        return /*html*/ `
			<button as="${as}" type="${this.getAttribute('type') || 'button'}" for="${this.getAttribute('for') || ''}" class="p-2 ${this.classGetter()}">
				<slot>${label}</slot>
			</button>
	`;
    }

    connectedCallback(): void {
        this._innerHTML = this.innerHtmlGetter();
        super.connectedCallback();
        this.statusSetter();
        this._internalElement = this.shadowRoot?.querySelector(
            this.getAttribute('as') === 'input' ? 'input' : 'button'
        ) as HTMLElement;
    }

    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null
    ): void {
        if (oldValue === newValue) return;
        if (name === 'status') this.statusSetter();
        if (name === 'label' && this._internalElement) {
            if (this.getAttribute('as') === 'input') {
                const inputEl = this._internalElement as HTMLInputElement;
                if (inputEl) inputEl.value = newValue || 'Button';
            } else {
                this._internalElement.textContent = newValue || 'Button';
            }
        }
    }

    classGetter() {
        const btnType = this.getAttribute('btn-type') || 'primary';
        const baseClasses =
            'rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ';
        switch (btnType) {
            case 'primary-wide':
                return `${baseClasses} bg-blue-500 text-white hover:bg-blue-600 w-full py-2 px-4 text-center font-medium`;
            case 'primary':
                return `${baseClasses} bg-blue-500 text-white hover:bg-blue-600`;
            case 'secondary':
                return `${baseClasses} bg-gray-500 text-white hover:bg-gray-600`;
            case 'danger':
                return `${baseClasses} bg-red-500 text-white hover:bg-red-600`;
            case 'link':
                return `${baseClasses} text-blue-500 hover:underline bg-transparent p-0 cursor-pointer`;
            case 'icon':
                return `${baseClasses} absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-300`;
            default:
                return `${baseClasses} bg-blue-500 text-white hover:bg-blue-600`;
        }
    }

    statusSetter() {
        const status = this.getAttribute('status') || 'default';
        if (status === 'loading') {
            this.shadowRoot
                ?.querySelector('button')
                ?.setAttribute('disabled', 'true');
        } else {
            this.shadowRoot
                ?.querySelector('button')
                ?.removeAttribute('disabled');
        }
    }
}
