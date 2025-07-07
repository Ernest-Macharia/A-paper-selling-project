<!-- components/chat/UserChatBox.vue -->
<template>
    <div class="chat-box border rounded-3 p-2 mt-4">
        <div class="chat-header bg-primary text-white p-2 rounded-top">
            Chat with {{ recipientName }}
        </div>
        <div ref="chatBody" class="chat-messages p-2 overflow-auto">
            <div
                v-for="(msg, index) in messages"
                :key="index"
                :class="['message', msg.sender_id === currentUserId ? 'sent' : 'received']"
            >
                <div class="sender small fw-bold">
                    {{ msg.sender_id === currentUserId ? 'You' : recipientName }}
                </div>
                <div class="bubble">{{ msg.message }}</div>
            </div>
        </div>
        <form @submit.prevent="sendMessage" class="d-flex mt-2">
            <input
                v-model="message"
                type="text"
                class="form-control me-2"
                placeholder="Type a message..."
            />
            <button class="btn btn-primary" type="submit" :disabled="!message.trim()">Send</button>
        </form>
    </div>
</template>

<script>
export default {
    props: {
        currentUserId: Number,
        currentUserName: String,
        recipientId: Number,
        recipientName: String,
    },
    data() {
        return {
            socket: null,
            message: '',
            messages: [],
        };
    },
    computed: {
        roomName() {
            const ids = [this.currentUserId, this.recipientId].sort((a, b) => a - b);
            return `room_${ids[0]}_${ids[1]}`;
        },
    },
    methods: {
        connectWebSocket() {
            const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
            const url = `${protocol}://${window.location.host}/ws/chat/${this.roomName}/`;
            this.socket = new WebSocket(url);

            this.socket.onopen = () => {
                console.log('Connected to private chat room');
            };

            this.socket.onmessage = (e) => {
                const data = JSON.parse(e.data);
                this.messages.push(data);
                this.$nextTick(() => this.scrollToBottom());
            };

            this.socket.onclose = () => {
                console.warn('Chat socket closed');
            };
        },
        sendMessage() {
            if (!this.message.trim()) return;
            const msgData = {
                sender_id: this.currentUserId,
                sender_name: this.currentUserName,
                message: this.message,
            };
            this.socket.send(JSON.stringify(msgData));
            this.messages.push(msgData);
            this.message = '';
            this.$nextTick(() => this.scrollToBottom());
        },
        scrollToBottom() {
            const el = this.$refs.chatBody;
            if (el) el.scrollTop = el.scrollHeight;
        },
    },
    mounted() {
        this.connectWebSocket();
    },
};
</script>

<style scoped>
.chat-box {
    max-width: 500px;
    margin: auto;
    background: #fff;
    box-shadow: 0 0 10px #ccc;
}

.chat-messages {
    max-height: 200px;
    overflow-y: auto;
    background: #f8f9fa;
}

.message {
    margin-bottom: 10px;
}

.sent {
    text-align: right;
}

.received {
    text-align: left;
}

.bubble {
    display: inline-block;
    padding: 8px 12px;
    border-radius: 12px;
    background: #e2e3e5;
    max-width: 70%;
}

.sent .bubble {
    background: #d1e7dd;
}
</style>
