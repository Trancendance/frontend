export interface Player {
    player_id: number;
    alias: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface getPlayers {
    data: Player[];
}
