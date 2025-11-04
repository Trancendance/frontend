import { APIRequest } from '../router/API';
import { PlayersTable } from '../components/PlayersTable';

customElements.define('players-table', PlayersTable);

export const PlayersView = () => {
    const el = document.createElement('div');
    el.innerHTML = /*html*/ `
		<div class="grow">
			<h1>Gestión de Jugadores</h1>
            <players-table data-loader></players-table>
			<a data-link href="/" class="text-blue-600 hover:underline">Go back home</a>
			<a data-link href="/players/add" class="text-blue-600 hover:underline">Add player</a>
		</div>
		<router-outlet></router-outlet>
		`;
    el.classList.add('flex', 'gap-4');
    return el;
};

export const getInput = (
    labelText: string,
    inputId: string,
    inputType: string,
    required: boolean = true
) => {
    return /*html*/ `
		<label for="${inputId}">${labelText}</label>
		<input type="${inputType}" id="${inputId}" name="${inputId}" ${required ? 'required' : ''} class="border p-2 rounded" />
	`;
};

const addPlayerForm = {
    fields: [
        { label: 'Alias', for: 'alias' },
        { label: 'Nombre de usuario', for: 'first_name' },
        { label: 'Apellido', for: 'last_name' },
        { label: 'Correo electrónico', for: 'email' },
        { label: 'Imagen', for: 'image_path', required: false },
    ],
    buttonLabel: 'Add Player',
    onSubmit: (data: Record<string, FormDataEntryValue>) => {
        APIRequest('https://localhost:3000/user/register', 'POST', data)
            .then(response => {
                console.log('Player added:', response);
            })
            .catch(error => {
                console.error('Error adding player:', error);
            });
    },
};

export const AddPlayerView = () => {
    const el = document.createElement('div');
    const formComponent = document.createElement('app-form') as any;
    formComponent.definitions = addPlayerForm;

    el.innerHTML = /*html*/ `
        <p class="text-lg font-bold">Add a new player</p>
    `;
    el.appendChild(formComponent);
    return el;
};
