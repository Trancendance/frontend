// src/ts/router.ts
import { Route } from '../router/routerSPA';
import { RouterOutlet } from '../router/RouterOutlet';
import { HomeView } from '../views/Home';
import { AddPlayerView, PlayersView } from '../views/Players';
import { playersMockData } from '../API_MOCKS/Players';

async function getPlayerData(): Promise<typeof playersMockData> {
    console.log('Loading player data (mock)...');
    // Simulate network delay
    const fetchMock = await new Promise((resolve) =>
        setTimeout(resolve, 500)
    ).then(() => {
        return playersMockData;
    });
    console.log('Player data loaded (mock):', fetchMock);
    return Promise.resolve(fetchMock);
}

customElements.define('router-outlet', RouterOutlet);
export const routes: Route[] = [
    {
        path: '/',
        id: 'home',
        view: HomeView,
    },
    {
        path: 'players',
        id: 'players',
        view: PlayersView,
        loader: getPlayerData,
        children: [
            {
                path: 'add',
                id: 'add',
                view: AddPlayerView,
            },
        ],
    },
];

export const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/players', label: 'Player Management' },
    { href: '/players/add', label: 'Add Player' },
];
