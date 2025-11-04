import { CustomElementTemplate } from '../componentTemplate.js';
import { replaceNode } from '../Utils/DOMUtils.js';
import { AppButton } from '../components/Button.js';

export class PageModal extends CustomElementTemplate {
    static get observedAttributes() {
        return [...super.observedAttributes, 'open'] as const;
    }

    protected _lastFocused: HTMLElement | null = null;
    protected _backdrop: HTMLElement | null = null;
    protected _closeButton: HTMLElement | null = null;
    protected _root: ShadowRoot | null = null;

    protected _innerHTML = /*html*/ `
		<div id="modal-backdrop" tabindex="-1" class="fixed inset-0 bg-black/30 items-center justify-center z-50 transition-all transition-discrete duration-500 ease-in-out opacity-0 hidden">
			<app-card id='modal-content' class="relative w-11/12 max-w-lg">
                <app-button id="modal-close" btn-type="icon" >
                    &times;
                </app-button>
                <div class="min-h-[330px]">
				    <slot></slot>
                </div>
			</app-card>  
		</div>
	`;

    connectedCallback(): void {
        if (!this.isUnique) {
            console.warn('Only one instance of <page-modal> is allowed.');
            return;
        }
        super.connectedCallback();
        this._setElements();
        this._addEvents();
        this.hide();
    }

    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null
    ): void {
        if (oldValue === newValue) return;
        if (name === 'open') newValue !== null ? this.show() : this.hide();
    }

    hide() {
        this._manageFocus('close');
        this._manageBackdrop('close');
        this.removeAttribute('open');
    }

    show() {
        this._manageBackdrop('open');
        this._manageFocus('open');
    }

    _setElements() {
        this._root = this.shadowRoot || null;
        this._backdrop = this._root?.getElementById('modal-backdrop') || null;
        this._closeButton = this._root?.getElementById('modal-close') || null;
    }

    _addEvents() {
        if (!this._root) return;
        this._closeButton?.addEventListener('click', () => this.hide());
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.hasAttribute('open')) this.hide();
        });
    }

    _manageBackdrop(type: 'open' | 'close' = 'open') {
        this._backdrop?.classList.toggle('hidden', type === 'close');
        this._backdrop?.classList.toggle('flex', type === 'open');
        this._backdrop?.classList.toggle('opacity-100', type === 'open');
        this._backdrop?.classList.toggle('opacity-0', type === 'close');
    }

    _manageFocus(type: 'open' | 'close' = 'open') {
        const siblings = this.parentElement?.children || [];
        const activeElement = document.activeElement as HTMLElement;

        for (const sibling of siblings) {
            if (sibling === this || !(sibling instanceof HTMLElement)) continue;
            sibling.setAttribute('aria-hidden', `${type === 'open'}`);
            sibling.inert = type === 'open';
            sibling.style.pointerEvents = type === 'open' ? 'none' : 'auto';
        }

        if (!this.contains(activeElement)) this._lastFocused = activeElement;

        type === 'open'
            ? this._closeButton?.focus()
            : this._lastFocused?.focus();
    }
}

const ModalToggle = (mode: 'open' | 'close', content: HTMLElement) => {
    const modal = document.querySelector('page-modal') as PageModal | null;
    if (modal) {
        modal.setAttribute('open', mode === 'open' ? '' : 'false');
        replaceNode(mode === 'open' ? content : null, modal);
    }
};

export class ModalButton extends AppButton {
    _modalContent: () => HTMLElement | HTMLElement | null = () => null;

    set ModalContent(value: () => HTMLElement | HTMLElement | null) {
        this._modalContent = value;
    }

    get ModalContent() {
        return this._modalContent ? this._modalContent : () => null;
    }

    connectedCallback(): void {
        super.connectedCallback();
        const root = this.shadowRoot || null;
        if (!root) return;
        root.querySelector('button')?.addEventListener('click', () => {
            const content = this.ModalContent();
            if (!content) return;
            ModalToggle('open', content);
        });
    }
}

customElements.define('modal-button', ModalButton);
