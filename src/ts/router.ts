// src/ts/router.ts
import { Route } from '../router/routerSPA';
import { RouterOutlet } from '../router/RouterOutlet';
import { HomeView } from '../views/Home';
import { AddPlayerView, PlayersView } from '../views/Players';
import { APIRequest } from '@/router/API';

const BASE_URL = 'https://localhost:3000/api';

async function getPlayerData() {
    try {
        const response = await fetch(BASE_URL, {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Player data loaded:', data);
        return data;
    } catch (error) {
        console.error('Error fetching player data:', error);
        throw error;
    }
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
