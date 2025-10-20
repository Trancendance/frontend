import { CustomElementTemplate } from '../componentTemplate.js';

interface Player {
    player_id: number;
    alias: string;
    first_name: string;
    last_name: string;
    email: string;
}

export class tableRow extends CustomElementTemplate {
    static get observedAttributes() {
        const base = (super.observedAttributes ?? []) as string[];
        return [...base, 'data', 'is-header'] as const;
    }
    protected _name = 'table-row';
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

function getPlayersRows(players: Player[]): string {
    return players
        .map(
            ({ player_id, alias, first_name, last_name, email }) => /*html*/ `
				<tr class="bg-white border border-gray-300 md:border-none block md:table-row">
					<table-row data="${player_id}"></table-row>
					<table-row data="${alias}"></table-row>
					<table-row data="${first_name}"></table-row>
					<table-row data="${last_name}"></table-row>
					<table-row data="${email}"></table-row>
				</tr>
		`
        )
        .join('');
}

export class PlayersTable extends CustomElementTemplate {
    static get observedAttributes() {
        const base = (super.observedAttributes ?? []) as string[];
        return [...base] as const;
    }
    protected _players: Player[] = [];
    set players(value: Player[]) {
        this._players = value;
        this.render();
    }
    get players() {
        return this._players;
    }
    protected _name = 'players-table';
    protected _innerHTML = /*html*/ `
		<table class="min-w-full border-collapse block md:table">
			<thead class="block md:table-header-group">
				<tr class="border border-gray-300 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
					<table-row data="Alias" is-header></table-row>
					<table-row data="First Name" is-header></table-row>
					<table-row data="Last Name" is-header></table-row>
					<table-row data="Email" is-header></table-row>
				</tr>
			</thead>
			<tbody class="block md:table-row-group">
				${
                    this.players.length === 0
                        ? '<tr><td colspan="5" class="p-2 text-gray-600">No players found</td></tr>'
                        : getPlayersRows(this.players)
                }
			</tbody>
		</table>
	`;

    render() {
        this._innerHTML = /*html*/ `
		<table class="min-w-full border-collapse block md:table">
			<thead class="block md:table-header-group">
				<tr class="border border-gray-300 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
					<table-row data="Alias" is-header></table-row>
					<table-row data="First Name" is-header></table-row>
					<table-row data="Last Name" is-header></table-row>
					<table-row data="Email" is-header></table-row>
				</tr>
			</thead>
			<tbody class="block md:table-row-group">
				${
                    this.players.length === 0
                        ? '<tr><td colspan="5" class="p-2 text-gray-600">No players found</td></tr>'
                        : getPlayersRows(this.players)
                }
			</tbody>
		</table>
	`;
        super.render();
    }
}
