<template>
    <div class="chat-container">
        <!-- Chat Header -->
        <div class="chat-header bg-primary text-white p-3 rounded-top d-flex align-items-center">
            <div class="flex-grow-1">
                <h5 class="mb-0 fw-semibold">
                    <i class="bi bi-person-fill me-2"></i>
                    Chat with {{ recipientName }}
                </h5>
            </div>
            <div class="badge bg-light text-primary rounded-pill">Online</div>
        </div>

        <!-- Chat Messages -->
        <div ref="chatBody" class="chat-messages p-3">
            <div
                v-for="(msg, index) in messages"
                :key="index"
                :class="['message-wrapper', msg.sender_id === currentUserId ? 'sent' : 'received']"
            >
                <div class="message">
                    <div class="message-meta small text-muted mb-1">
                        {{ msg.sender_id === currentUserId ? 'You' : recipientName }}
                        <span class="ms-2">{{ formatTime(msg.timestamp) }}</span>
                    </div>
                    <div class="message-bubble">
                        {{ msg.message }}
                    </div>
                </div>
            </div>

            <div v-if="messages.length === 0" class="empty-state text-center py-4">
                <i class="bi bi-chat-square-text fs-1 text-muted mb-2"></i>
                <p class="text-muted">No messages yet. Start the conversation!</p>
            </div>
        </div>

        <!-- Message Input -->
        <div class="chat-input p-3 bg-light border-top">
            <form @submit.prevent="sendMessage" class="d-flex gap-2">
                <input
                    v-model="message"
                    type="text"
                    class="form-control form-control-lg"
                    placeholder="Type your message..."
                    @keyup.enter="sendMessage"
                />
                <button class="btn btn-primary px-3" type="submit" :disabled="!message.trim()">
                    <i class="bi bi-send-fill"></i>
                </button>
            </form>
            <div class="d-flex justify-content-between mt-2">
                <small class="text-muted">Press Enter to send</small>
                <small class="text-muted" v-if="typingIndicator">{{ typingIndicator }}</small>
            </div>
        </div>
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
            typingIndicator: '',
            lastTypingTime: 0,
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
                if (data.type === 'typing') {
                    this.handleTypingIndicator(data);
                } else {
                    data.timestamp = new Date();
                    this.messages.push(data);
                    this.$nextTick(() => this.scrollToBottom());
                }
            };

            this.socket.onclose = () => {
                console.warn('Chat socket closed');
            };
        },
        sendMessage() {
            if (!this.message.trim()) return;

            const msgData = {
                type: 'message',
                sender_id: this.currentUserId,
                sender_name: this.currentUserName,
                message: this.message,
                timestamp: new Date(),
            };

            this.socket.send(JSON.stringify(msgData));
            this.messages.push(msgData);
            this.message = '';
            this.$nextTick(() => this.scrollToBottom());
        },
        handleTypingIndicator(data) {
            this.typingIndicator = `${data.sender_name} is typing...`;
            clearTimeout(this.typingTimeout);
            this.typingTimeout = setTimeout(() => {
                this.typingIndicator = '';
            }, 2000);
        },
        scrollToBottom() {
            const el = this.$refs.chatBody;
            if (el) {
                el.scrollTo({
                    top: el.scrollHeight,
                    behavior: 'smooth',
                });
            }
        },
        formatTime(date) {
            if (!date) return '';
            return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        },
        onTyping() {
            const now = Date.now();
            if (now - this.lastTypingTime > 1000) {
                this.socket.send(
                    JSON.stringify({
                        type: 'typing',
                        sender_id: this.currentUserId,
                        sender_name: this.currentUserName,
                    }),
                );
                this.lastTypingTime = now;
            }
        },
    },
    mounted() {
        this.connectWebSocket();
    },
    watch: {
        message(newVal) {
            if (newVal.trim()) {
                this.onTyping();
            }
        },
    },
};
</script>

<style scoped>
.chat-container {
    max-width: 600px;
    margin: 0 auto;
    border-radius: 0.5rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
    overflow: hidden;
    height: 70vh;
    display: flex;
    flex-direction: column;
}

.chat-header {
    flex-shrink: 0;
}

.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    background-color: #f8f9fa;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.message-wrapper {
    display: flex;
    max-width: 80%;
}

.message-wrapper.sent {
    align-self: flex-end;
}

.message-wrapper.received {
    align-self: flex-start;
}

.message-bubble {
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    line-height: 1.4;
    word-break: break-word;
}

.sent .message-bubble {
    background-color: #0d6efd;
    color: white;
    border-bottom-right-radius: 0.25rem;
}

.received .message-bubble {
    background-color: white;
    color: #212529;
    border-bottom-left-radius: 0.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-state {
    opacity: 0.6;
}

.chat-input {
    flex-shrink: 0;
}

/* Custom scrollbar */
.chat-messages::-webkit-scrollbar {
    width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>
