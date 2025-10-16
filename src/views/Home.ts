export const HomeView = () => {
    const el = document.createElement('div');
    el.innerHTML = /*html*/ `
		<h1>Home</h1>
        <a data-link href="/players" class="text-blue-600 hover:underline">Go to Player Management</a>
        <a data-link href="/players/add" class="text-blue-600 hover:underline">Go to Add Player</a>
	`;
    return el;
};

export const ModuleView = () => {
    const el = document.createElement('div');
    el.innerHTML = /*html*/ `
                <div class="grow">
                    <h1>Route Module</h1>
                    <a data-link href="/" class="text-blue-600 hover:underline">Go Home</a>
                    <a data-link href="/players" class="text-blue-600 hover:underline">Go to Player Management</a>
                    <a data-link href="/players/add" class="text-blue-600 hover:underline">Go to Add Player</a>
                    </div>
                <router-outlet></router-outlet>
            `;
    el.classList.add('flex', 'gap-4');
    return el;
};

export const SubRouteView = () => {
    const el = document.createElement('div');
    el.innerHTML = /*html*/ `
		<h1>SubRoute</h1>
		<a data-link href="/" class="text-blue-600 hover:underline">Go Home</a>
		<a data-link href="/module" class="text-blue-600 hover:underline">Go to Module</a>
	`;
    return el;
};
