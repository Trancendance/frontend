interface ServerResponse {
    players: { id: number; score: number; position: { y: number } }[];
    ball: { x: number; y: number };
}

interface ClientResponse {
    playerId: number;
    positionY: number;
}

const staticDefs = {
    width: 800,
    height: 600,
    playerSize: {
        x: 10,
        y: 300,
    },
    playerColor: 'blue',
    ballColor: 'red',
    ballSize: 20,
};

const gameState = {
    players: [
        {
            id: 1,
            score: 0,
            position: { x: 50, y: staticDefs.height / 2 - 150 },
        },
        {
            id: 2,
            score: 0,
            position: {
                x: staticDefs.width - 60,
                y: staticDefs.height / 2 - 150,
            },
        },
    ],
    ball: {
        position: {
            x: staticDefs.width / 2,
            y: staticDefs.height / 2,
        },
        velocity: {
            x: 3,
            y: 3,
        },
    },
};

const updateState = (): ServerResponse => {
    const newBallPosition = {
        x: gameState.ball.position.x + gameState.ball.velocity.x,
        y: gameState.ball.position.y + gameState.ball.velocity.y,
    };

    if (
        newBallPosition.y - staticDefs.ballSize < 0 ||
        newBallPosition.y + staticDefs.ballSize > staticDefs.height
    )
        gameState.ball.velocity.y = -gameState.ball.velocity.y;

    if (
        newBallPosition.x - staticDefs.ballSize < 0 ||
        newBallPosition.x + staticDefs.ballSize > staticDefs.width
    ) {
        newBallPosition.x = staticDefs.width / 2;
        newBallPosition.y = staticDefs.height / 2;
        gameState.ball.velocity.x = 3 * (Math.random() > 0.5 ? 1 : -1);
        gameState.ball.velocity.y = 3 * (Math.random() > 0.5 ? 1 : -1);
    }

    gameState.ball.position = newBallPosition;

    return {
        players: gameState.players.map(player => ({
            id: player.id,
            score: player.score,
            position: { y: player.position.y },
        })),
        ball: { x: gameState.ball.position.x, y: gameState.ball.position.y },
    };
};

const listenPlayerMoves = (playerId: number, newY: number) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (player) {
        player.position.y += newY;
        // Ensure the player doesn't go out of bounds
        if (player.position.y < 0) player.position.y = 0;
        if (player.position.y + staticDefs.playerSize.y > staticDefs.height)
            player.position.y = staticDefs.height - staticDefs.playerSize.y;
    }
};

const fakeWebSocket = {
    getGameState: (): Promise<ServerResponse> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const state = updateState();
                resolve(state);
            }, 1);
        });
    },
    setGameState: (newState: ClientResponse): Promise<void> => {
        return new Promise(resolve => {
            setTimeout(() => {
                if (newState.playerId && newState.positionY !== undefined) {
                    listenPlayerMoves(newState.playerId, newState.positionY);
                }
                resolve();
            }, 1);
        });
    },
};

const updateGameStateFromServer = async (): Promise<ServerResponse | null> => {
    try {
        const gameState = await fakeWebSocket.getGameState();
        return gameState;
    } catch (error) {
        console.error('Failed to fetch game state from server:', error);
        return null;
    }
};

const updatePlayerPositionFunction = async (
    playerId: number,
    positionY: number
) => {
    await fakeWebSocket.setGameState({ playerId, positionY });
};

export {
    staticDefs,
    updateGameStateFromServer,
    fakeWebSocket,
    updatePlayerPositionFunction,
};
