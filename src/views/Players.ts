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

export const AddPlayerView = () => {
    const el = document.createElement('div');
    el.innerHTML = /*html*/ `
		<p class="text-lg font-bold">Add a new player</p>
		<form id="add-player-form" class="flex flex-col gap-4">
			${getInput('Alias', 'alias', 'text')}
			${getInput('Nombre de usuario', 'first_name', 'text')}
			${getInput('Apellido', 'last_name', 'text')}
			${getInput('Correo electrónico', 'email', 'email')}
			<button type="submit" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Player</button>
		</form>
		<a data-link href="/players" class="text-blue-600 hover:underline">Go back to player management</a>
	`;

    el.querySelector('#add-player-form')?.addEventListener(
        'submit',
        (event) => {
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            const formData = new FormData(form);
            const playerData = Object.fromEntries(formData.entries());
            console.log('Player Data:', playerData);
            if (form.checkValidity()) {
                APIRequest('https://localhost:3000/api', 'POST', playerData)
                    .then((response) => {
                        console.log('Player added:', response);
                        form.reset();
                    })
                    .catch((error) => {
                        console.error('Error adding player:', error);
                    });
            } else {
                alert('Please fill in all required fields.');
            }
        }
    );

    return el;
};
