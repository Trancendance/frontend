import { AppButton } from '@/components/Button';
import { AppCard } from '@/components/Card';
import { AppForm } from '@/components/Form';
import { BaseLayout } from '@/layouts/BaseLayout';
import { NavigationMenu } from '@/components/NavigationMenu.js';
import { PageModal } from '@/layouts/PageModal.js';
import { Game } from '@/components/GameRenderer.js';
import { StreamChat } from '@/components/Chat.js';

// From ../components
customElements.define('app-button', AppButton);
customElements.define('app-card', AppCard);
customElements.define('app-form', AppForm);

customElements.define('base-layout', BaseLayout);
customElements.define('navigation-menu', NavigationMenu);
customElements.define('page-modal', PageModal);
customElements.define('game-view', Game);
customElements.define('stream-chat', StreamChat);
