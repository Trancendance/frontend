import { CustomElementTemplate } from '../componentTemplate.js';
import { getPlayers } from '@/ts/types.js';

export class tableRow extends CustomElementTemplate {
    static get observedAttributes() {
        const base = (super.observedAttributes ?? []) as string[];
        return [...base, 'data', 'is-header'] as const;
    }

    protected _innerHTML = this.innerHTMLGetter();

    innerHTMLGetter() {
        const data = this.getAttribute('data') || '';
        const isHeader = this.hasAttribute('is-header');
        return isHeader
            ? /*html*/ `<th class="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell">${data}</th>`
            : /*html*/ `<td class="p-2 md:border md:border-gray-300 text-left block md:table-cell">${data}</td>`;
    }
}

customElements.define('table-row', tableRow);

export class PlayersTable extends CustomElementTemplate {
    protected _loaderData: getPlayers = { data: [] };

    set loaderData(value: getPlayers) {
        this._loaderData = value;
        this.render();
    }

    protected _innerHTML = /*html*/ `
        <p>Loading players...</p>
	`;

    render() {
        this._innerHTML = /*html*/ `
		<table class="min-w-full border-collapse block md:table">
			<thead class="block md:table-header-group">
				<tr class="border border-gray-300 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
                <th class="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell">Alias</th>
                <th class="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell">First Name</th>
                <th class="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell">Last Name</th>
                <th class="bg-gray-200 p-2 text-gray-600 font-bold md:border md:border-gray-300 text-left block md:table-cell">Email</th>
                </tr>
			</thead>
			<tbody class="block md:table-row-group">
				${
                    this._loaderData.data.length === 0
                        ? '<tr><td colspan="5" class="p-2 text-gray-600">No players found</td></tr>'
                        : this._loaderData.data
                              .map(
                                  ({
                                      player_id,
                                      alias,
                                      first_name,
                                      last_name,
                                      email,
                                  }) => /*html*/ `
                                        <tr data-row="${player_id}" class="bg-white border border-gray-300 md:border-none block md:table-row">
                                            <td> ${alias} </td>
                                            <td> ${first_name} </td>
                                            <td> ${last_name} </td>
                                            <td> ${email} </td>
                                        </tr>
		                            `
                              )
                              .join('')
                }
			</tbody>
		</table>
	`;
        super.render();
    }
}
