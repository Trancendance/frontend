import { CustomElementTemplate } from '@/componentTemplate';

const mockServerGameDataResponse = {
    players: [
        { id: 1, score: 0, position: { y: 250 } },
        { id: 2, score: 0, position: { y: 350 } },
    ],
    ball: { x: 400, y: 300, vx: 5, vy: 5 },
};

const fakeMovementData = [
    { playerId: 1, newY: 240 },
    { playerId: 2, newY: 360 },
];

const updateGameStateFromServer = () => {
    // This function would normally fetch data from the server.
    // Here we just return the mock data.
    return mockServerGameDataResponse;
};

export class Game extends CustomElementTemplate {
    protected _innerHTML = /*html*/ `	
		<canvas id="gameCanvas" width="800" height="600" class="border border-gray-300"></canvas>
	`;
    protected _canvas: HTMLCanvasElement | null = null;

    connectedCallback() {
        super.connectedCallback();
        this.initializeElements();
        this.initializeGame();
    }

    initializeElements() {
        this._canvas = this.shadowRoot?.getElementById(
            'gameCanvas'
        ) as HTMLCanvasElement;
    }

    getNewContext(): CanvasRenderingContext2D | null {
        if (!this._canvas) {
            this.renderError('Canvas not found');
            return null;
        }
        const context = this._canvas.getContext('2d');
        if (!context) {
            this.renderError('Failed to get canvas context');
            return null;
        }
        return context;
    }

    initializeGame() {
        if (!this._canvas) {
            this.renderError('Canvas not found');
            return;
        }

        const ctx = this.getNewContext();
        if (!ctx) return;

        const canvas = this._canvas;

        const gameDefinitions = {
            width: canvas.width,
            height: canvas.height,
            playerSize: {
                x: 10,
                y: 300,
            },
            playerColor: 'blue',
            ballColor: 'red',
            ballSize: 20,
            speed: 5,
        };

        const gameState = {
            player1: {
                score: 0,
                position: {
                    x: 0,
                    y: canvas.height / 2 - gameDefinitions.playerSize.y / 2,
                },
            },
            player2: {
                score: 0,
                position: {
                    x: canvas.width - gameDefinitions.playerSize.x,
                    y: canvas.height / 2 - gameDefinitions.playerSize.y / 2,
                },
            },
            ball: {
                position: {
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                },
                velocity: {
                    x: 3,
                    y: 3,
                },
            },
        };

        const drawPlayer = (player: 'player1' | 'player2') => {
            ctx.fillStyle = gameDefinitions.playerColor;
            ctx.fillRect(
                gameState[player].position.x,
                gameState[player].position.y,
                gameDefinitions.playerSize.x,
                gameDefinitions.playerSize.y
            );
        };

        const drawBall = () => {
            ctx.beginPath();
            ctx.arc(
                gameState.ball.position.x,
                gameState.ball.position.y,
                gameDefinitions.ballSize,
                0,
                Math.PI * 2,
                true
            );
            ctx.closePath();
            ctx.fillStyle = gameDefinitions.ballColor;
            ctx.fill();
        };

        const updateGame = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            gameState.ball.position.x += gameState.ball.velocity.x;
            gameState.ball.position.y += gameState.ball.velocity.y;

            // Ball collision with top and bottom walls
            if (
                gameState.ball.position.y + gameDefinitions.ballSize >
                    canvas.height ||
                gameState.ball.position.y - gameDefinitions.ballSize < 0
            ) {
                gameState.ball.velocity.y = -gameState.ball.velocity.y;
            }

            // Ball goes out of bounds (left or right)
            if (
                gameState.ball.position.x + gameDefinitions.ballSize >
                    canvas.width ||
                gameState.ball.position.x - gameDefinitions.ballSize < 0
            ) {
                // Reset ball position to center
                gameState.ball.position.x = canvas.width / 2;
                gameState.ball.position.y = canvas.height / 2;
                // Reset ball velocity
                gameState.ball.velocity.x = 3 * (Math.random() > 0.5 ? 1 : -1);
                gameState.ball.velocity.y = 3 * (Math.random() > 0.5 ? 1 : -1);
            }

            // Draw players and ball
            drawPlayer('player1');
            drawPlayer('player2');
            drawBall();

            requestAnimationFrame(updateGame);
        };

        // Start the game loop
        updateGame();
    }

    renderError(message: string) {
        this._innerHTML = /*html*/ `
			<div class="text-red-600 font-bold">
				Error: ${message}
			</div>
		`;
    }
}
