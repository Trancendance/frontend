import { CustomElementTemplate } from '../componentTemplate';
import { createAndAppendElement, createElement } from '@/Utils/DOMUtils';

// ######################################################
// FORM COMPONENT DEFINITIONS
// ######################################################

// - Render the form descripted by FormDefinition type object
// - Handle the FE field validation and UI feedback
// - Call the onSubmitCallbackFn on Submit
// - Optional: clear the form on submit success

// ######################################################
// Implementation decisions
// ######################################################
// - To avoid the parse of the definitions they will be
// - passed a class property by the setter. 
// 




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


// export class AppForm extends HTMLElement {
//     static formAssociated = false;
//     form!: HTMLFormElement;
//     fields = [];
//     definition : FormDefinition | null = null;

//     connectedCallback() {
//         this.innerHTML = `<form><slot></slot></form>`;
//         this.form = this.querySelector("form")!;

//         this.form.addEventListener("submit", e => {
//             e.preventDefault();
//             this.handleSubmit();
//         });
//         this.addEventListener("field-change", () => this.clearGlobalErrors());
//         this.addEventListener("field-invalid", () => this.showGlobalError());
//     }

//     set definitions(def: FormDefinition) {
//         this.definition = def;
//         this.renderFields();
//     }

//     renderFields() {
//         if (!this.definition) return
//         const { fields, buttonLabel } = this.definition;

//         this.form.innerHTML = "";

//         fields.forEach(f => {
//             const el = document.createElement("form-field");
//             el.setAttribute("label", f.label);
//             el.setAttribute("name", f.for);
//             if (f.required) el.setAttribute("required", "");
//             if (f.type) el.setAttribute("type", f.type);
//             this.form.appendChild(el);
//         });

//         const btn = document.createElement("button");
//         btn.type = "submit";
//         btn.textContent = buttonLabel;
//         this.form.appendChild(btn);
//     }

//     handleSubmit() {
//         if (!this.form.checkValidity()) {
//             this.form.querySelector("form-field[invalid]")?.focus();
//             return;
//         }

//         const data = {};
//         this.form.querySelectorAll("form-field").forEach(f => {
//             data[f.name] = f.value;
//         });

//         this.definition.onSubmit(data);
//     }

//     clearGlobalErrors() {}
//     showGlobalError() {}
// }

// customElements.define("app-form", AppForm);




export class AppForm extends CustomElementTemplate {
    protected _uniqueId = `form-${Math.random().toString(36).slice(2, 9)}`;
    protected _definitions: FormDefinition | null = null;
    protected _form: HTMLFormElement | null = null;

    set definitions(value: FormDefinition) {
        this._definitions = value;

        if (this._form) {
            this._form.innerHTML = '';
            this.template();
        }
    }

    // set submitHandler(value: submissionEvent) {
    //     this._definitions!.onSubmit = value;
    // }

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
        const { fields, buttonLabel } = this._definitions;
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
        console.log("Form validity:",  this._form?.checkValidity())
        if (!this._form || this._form.checkValidity() === false) return;
        e.preventDefault();
        const formData = new FormData(this._form!);
        const data = Object.fromEntries(formData.entries());
        console.log('Form submitted with data:', data);
        this._definitions!.onSubmit(data);
       
    }
}
export class FormGroup extends CustomElementTemplate {
    static formAssociated = true;

    static get observedAttributes() {
        const base = (super.observedAttributes ?? []) as string[];
        return [...base, "label", "for", "type", "required", "name"] as const;
    }

    private _internals: ElementInternals;
    private _inputElement: HTMLInputElement | null = null;

    constructor() {
        super();
        this._internals = this.attachInternals();
        this._innerHTML = this.template();
    }

    connectedCallback() {
        super.connectedCallback();
        this._inputElement = this.shadowRoot?.querySelector("input") ?? null;

        if (!this._inputElement) return;

        this._upgradeInputAttributes();
        this._attachInputListeners();
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (oldValue === newValue) return;

        if (!this._inputElement) return;

        switch (name) {
            case "type":
                this._inputElement.type = newValue ?? "text";
                break;
            case "label":
            case "for":
            case "required":
            case "name":
                this._innerHTML = this.template();
                break;
        }
    }

    private _attachInputListeners() {
        this._inputElement!.addEventListener("input", () => {
            const value = this._inputElement!.value;
            this._internals.setFormValue(value);

            if (this._inputElement!.validity.valid) {
                this._internals.setValidity({});
            } else {
                this._internals.setValidity(
                    { customError: true },
                    this._inputElement!.validationMessage,
                    this._inputElement
                );
            }
        });
    }

    private _upgradeInputAttributes() {
        const required = this.getAttribute("required") !== null;
        const name = this.getAttribute("name") ?? this.getAttribute("for");
        const type = this.getAttribute("type") ?? "text";

        this._inputElement!.type = type;
        this._inputElement!.required = required;
        if (name) this._inputElement!.name = name;
    }

    template() {
        const label = this.getAttribute("label") ?? "";
        const forAttr = this.getAttribute("for") ?? "input-field";
        const type = this.getAttribute("type") ?? "text";
        const required = this.getAttribute("required") ? "required" : "";

        return /*html*/ `
            <div data-form-group="${forAttr}" class="mb-4">
                <label class="block mb-1 font-s" for="${forAttr}">
                    ${label} ${required ? "*" : ""}
                </label>

                <input
                    id="${forAttr}"
                    name="${forAttr}"
                    type="${type}"
                    ${required}
                    class="w-full border border-gray-300 rounded px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <slot name="error-message"></slot>
            </div>
        `;
    }
}

customElements.define('form-group', FormGroup);
