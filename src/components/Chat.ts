import { CustomElementTemplate } from '../componentTemplate';

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

class ChatWebSocket {
    private _ws: WebSocket | null = null;

    constructor(
        endpoint: string,
        onOpenCallback: () => void,
        onMessageCallback: (data: any) => void
    ) {
        this._ws = new WebSocket(endpoint);
        this.ws!.onopen = () => {
            console.log('✅ Connected websocket');
            onOpenCallback();
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
        const _streamId = 95;
        this._ws = new WebSocket(`wss://localhost:8082/chat/${_streamId}`);
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

export class Chat extends CustomElementTemplate {
    protected _innerHTML = /*html*/ `
	<style>
            body { 
                font-family: Arial, sans-serif; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px; 
                background-color: #f5f5f5;
            }
            .container { 
                background: white; 
                padding: 30px; 
                border-radius: 10px; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .stats { 
                background: #e8f5e8; 
                padding: 15px; 
                border-radius: 5px; 
                margin: 20px 0;
            }
            .chat-container {
                margin-top: 30px;
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 15px;
            }
            #messages { 
                height: 300px; 
                overflow-y: auto; 
                border: 1px solid #ccc; 
                padding: 10px; 
                margin-bottom: 10px;
                background: #f9f9f9;
            }
            #messageInput { 
                width: 70%; 
                padding: 8px; 
                margin-right: 10px;
            }
            button { 
                padding: 8px 15px; 
                background: #007cba; 
                color: white; 
                border: none; 
                border-radius: 4px; 
                cursor: pointer;
            }
            button:hover { background: #005a87; }
            .message { margin: 5px 0; }
            .alias { font-weight: bold; color: #007cba; }
            .timestamp { font-size: 0.8em; color: #666; }
        </style>

   
        <div class="container">
            <h1>WebSocket Chat Server</h1>
            
            <div class="stats">
                <p><strong>Port:</strong> 8082</p>
                <p><strong>Service Status:</strong> ✅ Running</p>
                <p><strong>Connected Clients:</strong> ${stats.clients}</p>
            </div>

            <div class="chat-container">
                <h3>Live Chat Test</h3>
                <div id="messages"></div>
                <div>
                    <input type="text" id="messageInput" placeholder="Type your message...">
                    <button id="sendButton">Send</button>
                    <button id="deleteButton">Delete</button>
                </div>
            </div>
        </div>
		`;

    private _aliasname: string = 'alias' + Math.floor(Math.random() * 1000);
    private _ws: WebSocket | null = null;
    private _messagesHTML: HTMLElement | null | undefined = null;

    private onOpenCallback = () => {
        console.log('✅ Connected to chat server as ' + this._aliasname);
    };

    private onMessageCallback = (data: HistoryMessages) => {
        console.log('📩 Message from server:', data);
        if (!this._messagesHTML) return;
        data?.messages.forEach(msg => {
            this.addMessage(msg.alias, msg.text, 'message', msg.timestamp);
        });
    };

    connectedCallback(): void {
        super.connectedCallback();

        this._messagesHTML = this.shadowRoot?.getElementById('messages');
        if (!this._messagesHTML) return;

        this._ws = new ChatWebSocket(
            'wss://localhost:8082/chat',
            this.onOpenCallback,
            this.onMessageCallback
        ).ws;
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

    sendMessage(): void {
        const input = this.shadowRoot?.getElementById(
            'messageInput'
        ) as HTMLInputElement;
        const text = input.value.trim();

        if (text && this._ws && this._ws.readyState === WebSocket.OPEN) {
            this._ws.send(
                JSON.stringify({
                    type: 'message',
                    text: text,
                })
            );
            input.value = '';
        }
    }

    disconnectedCallback(): void {
        this._ws?.close();
        this._ws = null;
        super.disconnectedCallback();
    }
}

customElements.define('chat-component', Chat);

const prev = /*html*/ `
        

        <script>
            let ws;
            let currentalias = 'alias' + Math.floor(Math.random() * 1000);
            
            function connectWebSocket() {
                /*ws = new WebSocket('wss://localhost:8082/chat');
                
                ws.onopen = function() {
                    console.log('✅ Connected to chat server');
                    addMessage('System', 'Connected to chat as ' + currentalias, 'system');
                }; -->
                */


				
                ws.onmessage = function(event) {
                    const data = JSON.parse(event.data);
                    
                    if (data.type === 'history') {
                        document.getElementById('messages').innerHTML = '';
                        data.messages.forEach(msg => {
                            addMessage(msg.alias_alias, msg.message_text, 'message', msg.timestamp);
                        });
                    } else if (data.type === 'message') {
                        addMessage(data.alias, data.text, 'message', data.timestamp);
                    } else if (data.type === 'alias_joined') {
                        addMessage('System', data.alias + ' joined the chat', 'system');
                    } else if (data.type === 'alias_left') {
                        addMessage('System', data.alias + ' left the chat', 'system');
                    }
                };
                
                ws.onclose = function() {
                    addMessage('System', 'Disconnected from chat', 'system');
                    // Try to reconnect after 3 seconds
                    setTimeout(connectWebSocket, 3000);
                };
                
                ws.onerror = function(error) {
                    console.error('WebSocket error:', error);
                };
            }
            
        
            
    
         
            
            // Initialize when page loads
            document.addEventListener('DOMContentLoaded', function() {
                document.getElementById('sendButton').addEventListener('click', sendMessage);
                
                document.getElementById('messageInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                });
                
                connectWebSocket();
            });
        </script>

  `;

// AHORA
// dataHistory = {
// 	type: 'history',
// 	messages: [
// 		{
// 			alias: 'Alice',
// 			text: 'Hello everyone!',
// 			timestamp: '10:00 AM'
// 		},
// 		{
// 			alias: 'Bob',
// 			text: 'Hi Alice!',
// 			timestamp: '10:01 AM'
// 		}
// 	]
// };

// dataJoined = {
// 	type: 'alias_joined',
// 	alias: 'Charlie'
// };

// dataMessage = {
// 	type: 'message',
// 	alias: 'Charlie',
// 	text: 'Good morning!',
// 	timestamp: '10:02 AM'
// };

// dataLeft = {
// 	type: 'alias_left',
// 	alias: 'Bob'
// };

// // Unified
// data = [
// 	{
// 		type: 'muted',
// 		alias: 'Bob',
// 		text: 'Bob joined the chat',
// 		timestamp: '10:03 AM'
// 	},
// 	{
// 		type: 'chat_message',
// 		alias: 'Bob',
// 		text: 'How is everyone?',
// 		timestamp: '10:04 AM'
// 	},
// 	{
// 		type: 'muted',
// 		alias: 'Bob',
// 		text: 'Bob left the chat',
// 		timestamp: '10:05 AM'
// 	},
// ];
