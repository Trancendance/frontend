import { CustomElementTemplate } from '../componentTemplate.js';

export class PageModal extends CustomElementTemplate {
    static get observedAttributes() {
        const base = (super.observedAttributes ?? []) as string[];
        return [...base, 'open'] as const;
    }

    protected _innerHTML = /*html*/ `
		<div id="modal-backdrop" tabindex="-1" class="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
			<div id="modal-content" class="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6 relative">
				<button id="modal-close" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-300">
					&times;
				</button>
				<slot></slot>
			</div>
		</div>
	`;

    connectedCallback(): void {
        super.connectedCallback();
        const root = this.shadowRoot || null;
        if (!root) return;
        root.getElementById('modal-close')?.addEventListener('click', () =>
            this.hide()
        );
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        });
        this.hide();
    }

    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null
    ): void {
        if (oldValue === newValue) return;
        console.log(
            `${this._name} - Attribute ${name} has changed from ${oldValue} to ${newValue}`
        );
        if (name === 'open') {
            if (this.hasAttribute('open')) {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    show() {
        const backdrop = this.shadowRoot?.getElementById('modal-backdrop');
        if (backdrop) {
            backdrop.classList.remove('hidden');
        }
        const firstFocusable = this.shadowRoot
            ?.getElementById('modal-content')
            ?.querySelector<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
        firstFocusable?.focus();
        const siblings = this.parentElement?.children;
        if (siblings) {
            for (const sibling of siblings) {
                if (sibling !== this && sibling instanceof HTMLElement) {
                    sibling.setAttribute('aria-hidden', 'true');
                    sibling.inert = true;
                    sibling.style.pointerEvents = 'none';
                }
            }
        }
    }

    hide() {
        const backdrop = this.shadowRoot?.getElementById('modal-backdrop');
        if (backdrop) {
            backdrop.classList.add('hidden');
            this.removeAttribute('open');
            this.shadowRoot
                ?.querySelector('slot')
                ?.assignedNodes()
                .forEach((node) => {
                    if (node instanceof HTMLElement) {
                        this.removeChild(node);
                    }
                });
        }
        const siblings = this.parentElement?.children;
        if (siblings) {
            for (const sibling of siblings) {
                if (sibling !== this && sibling instanceof HTMLElement) {
                    sibling.removeAttribute('aria-hidden');
                    sibling.inert = false;
                    sibling.style.pointerEvents = 'auto';
                }
            }
        }
    }
}

export const ModalToggle = (mode: 'open' | 'close', content: HTMLElement) => {
    const modal = document.querySelector('page-modal') as PageModal | null;
    if (modal) {
        modal.setAttribute('open', mode === 'open' ? '' : 'false');
        modal.appendChild(content);
    }
};
