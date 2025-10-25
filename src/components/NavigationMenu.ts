import { ModalToggle } from '@/layouts/PageModal.js';
import { CustomElementTemplate } from '../componentTemplate.js';
import { navigationLinks } from '@/ts/router.js';
import { LoginView } from '@/views/Login.js';

export class NavigationLink extends CustomElementTemplate {
    static get observedAttributes() {
        const base = (super.observedAttributes ?? []) as string[];
        return [...base, 'href', 'label', 'active'] as const;
    }

    protected _innerHTML = this.innerHtmlGetter();

    classGetter() {
        return this.hasAttribute('active') ? 'font-bold' : '';
    }

    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null
    ) {
        // if (oldValue === newValue) return;
        console.log('not executed');
        if (name === 'href' || name === 'label') this.render();
        if (name === 'active') {
            const root = this.shadowRoot ?? this;
            const a = root.querySelector('a');
            if (!a) return;
            a && this.hasAttribute('active')
                ? a.classList.add('font-bold')
                : a.classList.remove('font-bold');
        }
    }

    innerHtmlGetter() {
        const href = this.getAttribute('href') || '#';
        const label = this.getAttribute('label') || 'Link';
        return /*html*/ `
		<a data-link href="${href}" class="text-gray-800 hover:underline ${this.classGetter()}">
			${label}
		</a>
	`;
    }
}

customElements.define('navigation-link', NavigationLink);

export class LoginButton extends CustomElementTemplate {
    protected _innerHTML = /*html*/ `
        <button id="login-button" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Login
        </button>
    `;

    connectedCallback(): void {
        super.connectedCallback();
        const root = this.shadowRoot || null;
        if (!root) return;
        root.getElementById('login-button')?.addEventListener('click', () => {
            ModalToggle('open', LoginView());
        });
    }
}

customElements.define('login-button', LoginButton);

export class NavigationMenu extends CustomElementTemplate {
    static get observedAttributes() {
        const base = (super.observedAttributes ?? []) as string[];
        return [...base, 'current'] as const;
    }

    protected _innerHTML = /*html*/ `<nav>
                <ul class="flex gap-4 justify-center items-center">
                    ${navigationLinks
                        .map(
                            (el) => /*html*/ `
                        <li class="flex gap-4 justify-center items-center">
                            <navigation-link href="${el.href}" label="${el.label}" ${el.href === this.getAttribute('current') ? 'active' : ''}></navigation-link>
                        </li>`
                        )
                        .join('')}
                    <li>
                        <login-button></login-button>
                    </li>
                </ul>
            </nav>`;

    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null
    ) {
        if (oldValue === newValue) return;
        if (name === 'current') {
            this.updateLinks();
        }
    }

    updateLinks() {
        const current = this.getAttribute('current');
        const root = this.shadowRoot ?? this;
        root.querySelectorAll<NavigationLink>('navigation-link').forEach(
            (link) => {
                if (link.getAttribute('href') === current)
                    link.setAttribute('active', 'true');
                else if (link.hasAttribute('active'))
                    link.removeAttribute('active');
            }
        );
    }
}
