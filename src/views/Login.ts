import { AppForm } from '@/components/Form';
import { CustomElementTemplate } from '@/componentTemplate';
import { ModalButton } from '@/layouts/PageModal.js';

export class LoginButton extends ModalButton {
    constructor() {
        super();
        this.ModalContent = () => document.createElement('login-view');
    }
}

export class RegisterButton extends ModalButton {
    constructor() {
        super();
        this.ModalContent = () => document.createElement('register-view');
    }
}

interface ViewOptions {
    header?: string;
    footer?: string;
    redirect?: string;
    href?: string;
    submit?: string;
    html?: string;
}

const Register = {
    header: 'Register for an account',
    footer: 'Already have an account?',
    redirect: 'Log in',
    href: '#',
    html: 'login-button',
};

const Login = {
    header: 'Sign in to your account',
    footer: "Don't have an account?",
    redirect: 'Sign up',
    href: '#',
    html: 'register-button',
};

customElements.define('register-button', RegisterButton);

const LoginForm = {
    fields: [
        {
            label: 'Email',
            for: 'email',
            type: 'email',
            required: true,
        },
    ],
    buttonLabel: 'Login',
    onSubmit: (data: Record<string, FormDataEntryValue>) => {
        console.log('Login form submitted with data:', data);
    },
};

const RegisterForm = {
    fields: [
        {
            label: 'Email',
            for: 'email',
            type: 'email',
            required: true,
        },
    ],
    buttonLabel: 'Register',
};

const getView = (view: ViewOptions) => {
    return /*html*/ `
        <div>
        <h2 class="mt-10 text-2xl/9 font-bold tracking-tight mb-6">${view.header}</h2>
        <app-form></app-form>
        <div class="mt-6 flex items-baseline justify-center">
            <p class="mt-10 text-center text-sm/6 text-gray-400">${view.footer}</p>
            <${view.html} btn-type="link" label="${view.redirect}"></${view.html}>
        </div>
    `;
};

export class LoginViewElement extends CustomElementTemplate {
    protected _innerHTML = getView(Login);

    connectedCallback() {
        super.connectedCallback();
        const appForm = this.shadowRoot?.querySelector('app-form') as AppForm;
        console.log(appForm);
        if (appForm) appForm.definitions = LoginForm;
    }

    constructor() {
        super();
    }
}

customElements.define('login-view', LoginViewElement);

export const LoginView = () => `<login-view></login-view>`;
export const RegisterView = () => `<register-view></register-view>`;
