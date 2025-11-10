export const Game = () => {
    const el = document.createElement('div');
    el.innerHTML = /*html*/ `	
		<h1>Game View</h1>
		<game-view></game-view>
		<br/>
		<a data-link href="/" class="text-blue-600 hover:underline">Go Home</a>
		<a data-link href="/players" class="text-blue-600 hover:underline">Go to Player Management</a>
	`;
    return el;
};
