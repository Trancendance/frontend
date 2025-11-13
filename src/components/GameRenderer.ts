import { CustomElementTemplate } from '@/componentTemplate';
import {
    staticDefs,
} from './ServerMock';
import { APPWebSocket } from './Chat';


interface ClientResponse {
    playerId: number;
    positionY: number;
}

interface ServerResponse {
    players: { id: number; score: number; position: { y: number } }[];
    ball: { x: number; y: number };
}



const listenerFunction = (e: KeyboardEvent) => {
    console.log('Listener function called');
    const playerId = 1;
    const player = e.key === 'ArrowUp' ? -5 : e.key === 'ArrowDown' ? 5 : 0;
    if (player === 0) return;
    fakeWebSocket.setGameState({
        playerId: playerId,
        positionY: player,
    });
};

const listenerFunctionPlayer2 = (e: KeyboardEvent) => {
    console.log('Listener function for Player 2 called');
    const playerId = 2;
    const player = e.key === 'w' ? -5 : e.key === 's' ? 5 : 0;
    if (player === 0) return;
    fakeWebSocket.setGameState({
        playerId: playerId,
        positionY: player,
    });
};

export class Game extends CustomElementTemplate {
    protected _innerHTML = /*html*/ `	
		<canvas id="gameCanvas" width="${staticDefs.width}" height="${staticDefs.height}" class="border border-gray-300"></canvas>
	`;
    protected _canvas: HTMLCanvasElement | null = null;
    private _ws: WebSocket | null = null;


    private onOpenCallback = () => {
        console.log('✅ Connected to fGame server' );
    };

    private onMessageCallBack = (data : ServerResponse) => {
        this.drawGame(data)
    }

    connectedCallback() {
        super.connectedCallback();
        this.initializeElements();
        window.addEventListener('keydown', listenerFunction);
        window.addEventListener('keydown', listenerFunctionPlayer2);
        // this._ws = new APPWebSocket(
        //     'wss://localhost:8082/chat',
        //     this.onOpenCallback,
        //     this.onMessageCallback
        // ).ws;
        // this.();

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

    drawGame(data:ServerResponse) {
        if (!this._canvas) {
            this.renderError('Canvas not found');
            return;
        }

        const ctx = this.getNewContext();
        if (!ctx) return;

        const canvas = this._canvas;

        const drawPlayer = (x: number, y: number) => {
            ctx.fillStyle = staticDefs.playerColor;
            ctx.fillRect(
                x,
                y,
                staticDefs.playerSize.x,
                staticDefs.playerSize.y
            );
        };

        const drawBall = (x: number, y: number) => {
            ctx.beginPath();
            ctx.arc(x, y, staticDefs.ballSize, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fillStyle = staticDefs.ballColor;
            ctx.fill();
        };

        const player1X = 0;
        const player2X = canvas.width - staticDefs.playerSize.x;

        // const updateGame = async () => {
        //     const serverGameState = await updateGameStateFromServer();

        //     if (!serverGameState) {
        //         this.renderError('Failed to fetch game state from server');
        //         return;
        //     }
        //     ctx.clearRect(0, 0, canvas.width, canvas.height);
        //     drawPlayer(player1X, serverGameState.players[0].position.y);
        //     drawPlayer(player2X, serverGameState.players[1].position.y);
        //     drawBall(serverGameState.ball.x, serverGameState.ball.y);

        //     requestAnimationFrame(updateGame);
        // };

        // updateGame();
    }

    renderError(message: string) {
        this._innerHTML = /*html*/ `
			<div class="text-red-600 font-bold">
				Error: ${message}
			</div>
		`;
    }
}
