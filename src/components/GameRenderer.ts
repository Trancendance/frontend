import { CustomElementTemplate } from '@/componentTemplate';
import { staticDefs } from './ServerMock';
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
    console.log('Listener player 1 function called');
    const playerId = 1;
    const player = e.key === 'ArrowUp' ? -5 : e.key === 'ArrowDown' ? 5 : 0;
    if (player === 0) return;
    return { playerId, positionY: player };
};

const listenerFunctionPlayer2 = (e: KeyboardEvent): ClientResponse | void => {
    console.log('Listener player 2 function called');
    const playerId = 2;
    const player = e.key === 'w' ? -5 : e.key === 's' ? 5 : 0;
    if (player === 0) return;
    return { playerId, positionY: player };
};

export class Game extends CustomElementTemplate {
    protected _innerHTML = /*html*/ `	
		<canvas id="gameCanvas" width="${staticDefs.width}" height="${staticDefs.height}" class="border border-gray-300"></canvas>
	`;

    protected _ctx: CanvasRenderingContext2D | null = null;
    private _ws: WebSocket | null = null;

    private onOpenCallback = (data: ServerResponse) => {
        this.drawGame(data);
    };

    private onMessageCallBack = (data: ServerResponse) => {
        this.drawGame(data);
    };

    connectedCallback() {
        super.connectedCallback();
        this.initializeElements();
        window.addEventListener('keydown', listenerFunction);
        window.addEventListener('keydown', listenerFunctionPlayer2);
        this._ws = new APPWebSocket(
            'wss://localhost:8082/chat',
            this.onOpenCallback,
            this.onMessageCallBack
        ).ws;
    }

    initializeElements() {
        const canvas = this.shadowRoot?.getElementById(
            'gameCanvas'
        ) as HTMLCanvasElement;
        if (!canvas) this.renderError('Canvas not found');
        else this._ctx = canvas.getContext('2d');
    }

    drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.fillStyle = staticDefs.playerColor;
        ctx.fillRect(x, y, staticDefs.playerSize.x, staticDefs.playerSize.y);
    }

    drawBall(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.beginPath();
        ctx.arc(x, y, staticDefs.ballSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = staticDefs.ballColor;
        ctx.fill();
    }

    drawGame(data: ServerResponse) {
        if (!this._ctx) return;

        this._ctx.clearRect(0, 0, staticDefs.width, staticDefs.height);
        this.drawPlayer(
            this._ctx,
            staticDefs.playerX.player1,
            data.players[0].position.y
        );
        this.drawPlayer(
            this._ctx,
            staticDefs.playerX.player2,
            data.players[1].position.y
        );
        this.drawBall(this._ctx, data.ball.x, data.ball.y);
    }

    renderError(message: string) {
        this._innerHTML = /*html*/ `
			<div class="text-red-600 font-bold">
				Error: ${message}
			</div>
		`;
    }
}
