import { CustomElementTemplate } from '../componentTemplate.js';

type NavLink = { href: string; label: string };

export class NavigationLink extends CustomElementTemplate {
    static get observedAttributes(): readonly string[] {
        return [...super.observedAttributes, 'href', 'label'] as const;
    }
    protected _name = 'navigation-link';
    protected _innerHTML = this.innerHtmlGetter();

    protected isActive() {
        const href = this.getAttribute('href') || '#';
        return href === window.location.pathname;
    }

    protected classGetter() {
        return this.isActive() ? 'font-bold' : '';
    }

    innerHtmlGetter() {
        const href = this.getAttribute('href') || '#';
        const label = this.getAttribute('label') || 'Link';
        return /*html*/ `
		<a data-link href="${href}" class="text-blue-600 hover:underline ${this.classGetter()}">
			${label}
		</a>
	`;
    }
}

customElements.define('navigation-link', NavigationLink);

export class NavigationMenu extends CustomElementTemplate {
    static get observedAttributes(): readonly string[] {
        return [...super.observedAttributes] as const;
    }

    navigationLinks = [
        { href: '/', label: 'Home' },
        { href: '/module', label: 'Module' },
        { href: '/module/subroute', label: 'SubRoute' },
    ];

    linkElements = this.navigationLinks.map((link) => {
        const navLink = document.createElement(
            'navigation-link'
        ) as NavigationLink;
        navLink.setAttribute('href', link.href);
        navLink.setAttribute('label', link.label);
        return navLink;
    });

    protected _name = 'navigation-menu';
    protected _innerHTML = /*html*/ `
		<nav>
			<ul class="flex gap-4">
				${this.linkElements.map((el) => `<li>${el.outerHTML}</li>`).join('')}
			</ul>
		</nav>
	`;
}
