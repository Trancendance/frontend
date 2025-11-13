import { CustomElementTemplate } from '../componentTemplate';
import { createAndAppendElement, createElement } from '@/Utils/DOMUtils';

// Form component definitions

// Given a form field definition the form will generate
// the appropriate input fields
// The form will handle validation and submission
// of the data to a callback function

interface FormField {
    label: string;
    for: string;
    type?: string;
    required?: boolean;
}

interface submissionEvent {
    (jsonData: Record<string, FormDataEntryValue>): void;
}

interface FormDefinition {
    fields: Array<FormField>;
    onSubmit: submissionEvent;
    buttonLabel: string;
}

export class AppForm extends CustomElementTemplate {
    protected _uniqueId = `form-${Math.random().toString(36).substr(2, 9)}`;
    protected _definitions: FormDefinition | null = null;
    protected _form: HTMLFormElement | null = null;

    set definitions(value: FormDefinition) {
        this._definitions = value;

        if (this._form) {
            this._form.innerHTML = '';
            this.template();
        }
    }

    set submitHandler(value: submissionEvent) {
        this._definitions!.onSubmit = value;
    }

    protected _innerHTML = /*html*/ `<form id="${this._uniqueId}"><slot></slot></form>`;

    connectedCallback(): void {
        super.connectedCallback();
        this._form = this.shadowRoot?.getElementById(
            this._uniqueId
        ) as HTMLFormElement;
        if (!this._form) return;
        this._form.addEventListener('submit', this.submitForm.bind(this));
        if (this._form) {
            this._form.innerHTML = '';
            this.template();
        }
    }

    template() {
        if (!this._form || !this._definitions) return;
        const { fields, buttonLabel, onSubmit } = this._definitions;
        fields.map(field =>
            createAndAppendElement<FormGroup>(
                'form-group',
                this._form!,
                {
                    label: field.label,
                    for: field.for,
                    type: field.type || 'text',
                    required: field.required ? 'required' : '',
                    name: field.for
                },
                buttonLabel
            )
        );
        const appButton = createElement('app-button', {
            type: 'submit',
            class: 'self-end',
            for: this._uniqueId,
            label: buttonLabel,
            as: 'input',
        }) as any;

        this._form!.appendChild(appButton);
        appButton.clickHandler = this.buttonClickHandler.bind(this);
    }

    buttonClickHandler(e: Event) {
        e.preventDefault();
        if (this._form) this._form.requestSubmit();
    }

    submitForm(e: Event) {
        if (!this._form || this._form.checkValidity() === false) return;
        e.preventDefault();
        const formData = new FormData(this._form!);
        const data = Object.fromEntries(formData.entries());
        console.log('Form submitted with data:', data);
        this._definitions!.onSubmit(data);
       
    }
}

export class FormGroup extends CustomElementTemplate {
    _innerHTML: string = this.template();

    static get observedAttributes() {
        const base = (super.observedAttributes ?? []) as string[];
        return [
            ...base,
            'label',
            'for',
            'type',
            'required',
            'isValid',
            'name'
        ] as const;
    }

    protected _inputElement: HTMLInputElement | null = null;
    protected _errorSlot: HTMLSlotElement | null = null;
    protected _internals: ElementInternals | null = null;

    static formAssociated = true;

    constructor()
    {
        super();
        this._internals = this.attachInternals();
        
    }

    connectedCallback(): void {
        this._innerHTML = this.template();
        super.connectedCallback();
        this._inputElement = this.shadowRoot?.querySelector('input') || null;
        this._errorSlot = this.shadowRoot?.querySelector(
            'slot[name="error-message"]'
        ) as HTMLSlotElement | null;
       

        if (!this._inputElement ) return;

        this._inputElement.addEventListener("input", () => {
            if(!this._internals) return;
            this._internals.setFormValue(this._inputElement!.value); // ← REQUIRED
        });
        
    }

    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null
    ): void {
        if (oldValue === newValue) return;
        if (name === 'isValid' && this._errorSlot) {
            this._errorSlot.innerHTML =
                newValue === 'true' ? '' : 'Invalid input';
        }
    }

    template() {
        const label = this.getAttribute('label') || '';
        const forAttr = this.getAttribute('for') || 'input-field';
        const type = this.getAttribute('type') || 'text';
        const required = this.getAttribute('required') ? 'required' : '';

        const template = /*html*/ `
        <div data-form-group=${forAttr}  class="mb-4">
            <label class="block mb-1 font-s" for="${forAttr}">${label} ${required ? '*' : ''}</label>
            <input type="${type}" name='${forAttr}' ${required} id="${forAttr}" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <slot name="error-message"></slot>
        </div>
		`;
        return template;
    }
}

customElements.define('form-group', FormGroup);
