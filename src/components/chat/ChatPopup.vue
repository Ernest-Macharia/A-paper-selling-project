<template>
    <div class="chat-popup" v-if="isOpen">
        <div
            class="chat-header d-flex justify-content-between align-items-center p-2 bg-primary text-white"
        >
            <span>Live Chat</span>
            <button class="btn-close btn-close-white" @click="toggleChat"></button>
        </div>

        <div ref="chatBody" class="chat-body p-2 overflow-auto">
            <div
                v-for="(msg, index) in messages"
                :key="index"
                :class="[
                    'chat-message',
                    msg.sender === currentUser ? 'own-message' : 'other-message',
                ]"
            >
                <div class="sender small fw-bold">
                    {{ msg.sender === currentUser ? 'You' : msg.sender }}
                </div>
                <div class="message-content">
                    {{ msg.message }}
                </div>
            </div>
        </div>

        <form @submit.prevent="sendMessage" class="chat-footer d-flex p-2 border-top">
            <input
                type="text"
                v-model="message"
                class="form-control me-2"
                placeholder="Type a message..."
                :disabled="!socketOpen"
            />
            <button
                type="submit"
                class="btn btn-primary"
                :disabled="!socketOpen || !message.trim()"
            >
                Send
            </button>
        </form>
    </div>

    <button class="chat-toggle-button btn btn-primary rounded-circle" @click="toggleChat">
        💬
    </button>
</template>

<script>
export default {
    data() {
        return {
            isOpen: false,
            message: '',
            messages: [],
            socket: null,
            socketOpen: false,
            roomName: 'global', // or dynamic room/user id
            currentUser: 'You', // Replace with actual username from auth
        };
    },
    methods: {
        toggleChat() {
            this.isOpen = !this.isOpen;
            this.$nextTick(() => this.scrollToBottom());
        },
        connectWebSocket() {
            const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
            const socketUrl = `${protocol}://${window.location.host}/ws/chat/${this.roomName}/`;
            this.socket = new WebSocket(socketUrl);

            this.socket.onopen = () => {
                this.socketOpen = true;
            };

            this.socket.onmessage = (e) => {
                const data = JSON.parse(e.data);
                this.messages.push({ sender: data.sender, message: data.message });
                this.$nextTick(() => this.scrollToBottom());
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            this.socket.onclose = (e) => {
                console.warn('Chat socket closed:', e.reason);
                this.socketOpen = false;
            };
        },
        sendMessage() {
            if (!this.message.trim()) return;
            this.socket.send(
                JSON.stringify({
                    message: this.message,
                    sender: this.currentUser, // Replace with real user ID or name
                }),
            );
            this.message = '';
        },
        scrollToBottom() {
            const chatBody = this.$refs.chatBody;
            if (chatBody) {
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        },
    },
    mounted() {
        this.connectWebSocket();
    },
};
</script>

<style scoped>
.chat-popup {
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 320px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 12px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
}

.chat-body {
    flex-grow: 1;
    height: 300px;
    overflow-y: auto;
    background-color: #f8f9fa;
    padding: 10px;
}

.chat-message {
    max-width: 80%;
    padding: 6px 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    word-break: break-word;
}

.own-message {
    align-self: flex-end;
    background-color: #d1e7dd;
    color: #0f5132;
}

.other-message {
    align-self: flex-start;
    background-color: #e2e3e5;
    color: #41464b;
}

.sender {
    font-size: 0.75rem;
    margin-bottom: 2px;
}

.message-content {
    font-size: 0.875rem;
}

.chat-toggle-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 55px;
    height: 55px;
    font-size: 20px;
    z-index: 1001;
}
</style>
