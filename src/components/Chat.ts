import { CustomElementTemplate } from '../componentTemplate';
import { AppForm } from '@/components/Form';

interface chatStats {
    clients: number;
}

const stats: chatStats = { clients: 10 };

interface ChatMessage {
    type: string;
    alias: string;
    text: string;
    timestamp: string;
}

interface HistoryMessages {
    messages: ChatMessage[];
}

export class Message extends CustomElementTemplate {
    static get observedAttributes() {
        return [
            ...super.observedAttributes,
            'alias',
            'text',
            'timestamp',
        ] as const;
    }

    protected _innerHTML = /*html*/ `
		<div class="message">
			<slot name="timestamp"></slot>
			<slot name="alias"></slot>: 
			<slot name="text"></slot>
		</div>
	`;
}

customElements.define('chat-message', Message);

export class APPWebSocket {
    private _ws: WebSocket | null = null;
    private _endpoint: string;

    constructor(
        endpoint: string,
        onOpenCallback: (data: any) => void,
        onMessageCallback: (data: any) => void
    ) {
        this._endpoint = endpoint;
        this._ws = new WebSocket(endpoint);
        this.ws!.onopen = (data: any) => {
            console.log('✅ Connected websocket');
            onOpenCallback(data);
        };
        this.ws!.onmessage = (event: MessageEvent) => {
            const data: HistoryMessages = JSON.parse(event.data);
            console.log('📩 Message from server:', data);
            onMessageCallback(data);
        };
        this.ws!.onclose = this.onclose;
        this.ws!.onerror = this.onerror;
    }

    get ws(): WebSocket | null {
        return this._ws;
    }

    set ws(value: WebSocket | null) {
        this._ws = value;
    }

    private initializeWebSocket = () => {
        this._ws = new WebSocket(this._endpoint);
        if (!this._ws) this.reconnectAttempt('WebSocket initialization failed');
    };

    private reconnectAttempt = (message: String) => {
        console.log(message);
        for (let i = 0; i < 5; i++)
            setTimeout(() => this.initializeWebSocket(), 3000);

        if (!this._ws) {
            this._ws = null;
            console.log('Reconnection attempts finished.');
        }
    };

    private onclose = () =>
        this.reconnectAttempt(
            '⚠️ Disconnected from chat, attempting to reconnect...'
        );
    private onerror = (error: Event) =>
        console.error('WebSocket error:', error);
}

export class StreamChat extends CustomElementTemplate {
    protected _innerHTML = /*html*/ `
	<style>
            .stats { 
                background: #e8f5e8; 
                padding: 15px; 
                border-radius: 5px; 
                margin: 20px 0;
            }
            
            #messages { 
                height: 300px; 
                overflow-y: auto; 
                border: 1px solid #ccc; 
                padding: 10px; 
                margin-bottom: 10px;
                background: #f9f9f9;
            }
           
            button:hover { background: #005a87; }
            .message { margin: 5px 0; }
            .alias { font-weight: bold; color: #007cba; }
            .timestamp { font-size: 0.8em; color: #666; }
        </style>

   
        <app-card>
            <h1>WebSocket Chat Server</h1>
            
            <div class="stats">
                <p><strong>Port:</strong> 8082</p>
                <p><strong>Service Status:</strong> ✅ Running</p>
                <p><strong>Connected Clients:</strong> ${stats.clients}</p>
            </div>

            <div class="m-1">
                <h3>Live Chat Test</h3>
                <div id="messages"></div>
                <app-form id="form-wrapper"></app-form>
                
            </div>
        </app-card>
		`;

    private _aliasname: string = 'alias' + Math.floor(Math.random() * 1000);
    private _ws: WebSocket | null = null;
    private _messagesHTML: HTMLElement | null | undefined = null;

    private onOpenCallback = (data : any) => {
        console.log(data);
        console.log('✅ Connected to chat server as ' + this._aliasname);
    };

    private onMessageCallback = (data: HistoryMessages) => {
        if (!this._messagesHTML) return;
        data?.messages.forEach(msg => {
            this.addMessage(msg.alias, msg.text, 'message', msg.timestamp);
        });
    };

    connectedCallback(): void {
        super.connectedCallback();

        this._messagesHTML = this.shadowRoot?.getElementById('messages');
        if (!this._messagesHTML) return;

        this._ws = new APPWebSocket(
            'wss://localhost:8082/chat',
            this.onOpenCallback,
            this.onMessageCallback
        ).ws;

        const appForm = this.shadowRoot?.querySelector('app-form') as AppForm;

        if (appForm) appForm.definitions = this._MessageForm;
    }

    addMessage(
        alias: string,
        text: string,
        timestamp: string,
        typeMessage: string = 'message'
    ): void {
        if (!this._messagesHTML) return;
        const messageBuble = document.createElement('chat-message');
        if (typeMessage === 'system') {
            messageBuble.style.color = '#666';
        }
        messageBuble.innerHTML = `
			<span slot="timestamp">[${timestamp}]</span>
			<span slot="alias" class="alias">${alias}</span>
			<span slot="text">${text}</span>
		`;
        this._messagesHTML.appendChild(messageBuble);
        this._messagesHTML.scrollTop = this._messagesHTML.scrollHeight;
    }

    sendMessage(text: string): void {
        if (text && this._ws && this._ws.readyState === WebSocket.OPEN) {
            this._ws.send(
                JSON.stringify({
                    type: 'message',
                    text: text,
                })
            );
        }
    }

    disconnectedCallback(): void {
        this._ws?.close();
        this._ws = null;
        super.disconnectedCallback();
    }

    _MessageForm = {
        fields: [
            {
                label: 'Message',
                for: 'message',
                required: 'true',
            },
        ],
        buttonLabel: 'Send',
        onSubmit: (data: Record<string, FormDataEntryValue>) => {
            this.sendMessage(data.message as string);
        },
    };
}

// AHORA
const dataHistory = {
    type: 'history',
    messages: [
        {
            alias: 'Alice',
            text: 'Hello everyone!',
            timestamp: '10:00 AM',
        },
        {
            alias: 'Bob',
            text: 'Hi Alice!',
            timestamp: '10:01 AM',
        },
    ],
};

const dataJoined = {
    type: 'alias_joined',
    alias: 'Charlie',
};

const dataMessage = {
    type: 'message',
    alias: 'Charlie',
    text: 'Good morning!',
    timestamp: '10:02 AM',
};

const dataLeft = {
    type: 'alias_left',
    alias: 'Bob',
};

// Unified
const data = [
    {
        type: 'muted',
        alias: 'Bob',
        text: 'Bob joined the chat',
        timestamp: '10:03 AM',
    },
    {
        type: 'chat_message',
        alias: 'Bob',
        text: 'How is everyone?',
        timestamp: '10:04 AM',
    },
    {
        type: 'muted',
        alias: 'Bob',
        text: 'Bob left the chat',
        timestamp: '10:05 AM',
    },
];
