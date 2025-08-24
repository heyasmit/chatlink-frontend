// ChatLink Frontend Application
// API Configuration
const API_BASE_URL = 'https://web-production-ee9d.up.railway.app/api';
const SOCKET_URL = 'https://web-production-ee9d.up.railway.app';

class ChatApp {
    constructor() {
        this.currentUser = null;
        this.currentRoom = null;
        this.socket = null;
        this.isTyping = false;
        this.typingTimeout = null;
        this.messageContainer = null;
        this.isAuthenticated = false;

        this.init();
    }

    init() {
        this.showLoading();
        this.bindEvents();

        // Check for existing session
        const token = localStorage.getItem('chatlink_token');
        if (token) {
            this.verifyToken(token);
        } else {
            this.showWelcomeScreen();
        }

        // Check for invite code in URL
        this.checkInviteCodeInURL();
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
    }

    bindEvents() {
        // Welcome screen events
        document.getElementById('login-btn').addEventListener('click', () => this.showAuthModal('login'));
        document.getElementById('register-btn').addEventListener('click', () => this.showAuthModal('register'));
        document.getElementById('join-invite-btn').addEventListener('click', () => this.joinWithInviteCode());

        // Auth modal events
        document.getElementById('close-auth').addEventListener('click', () => this.hideAuthModal());
        document.getElementById('auth-switch-btn').addEventListener('click', () => this.switchAuthMode());
        document.getElementById('auth-form').addEventListener('submit', (e) => this.handleAuth(e));

        // Chat events
        document.getElementById('send-btn').addEventListener('click', () => this.sendMessage());
        document.getElementById('message-input').addEventListener('keypress', (e) => this.handleKeyPress(e));
        document.getElementById('message-input').addEventListener('input', () => this.handleTyping());
        document.getElementById('attach-btn').addEventListener('click', () => this.openFileDialog());
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileUpload(e));
        document.getElementById('leave-room-btn').addEventListener('click', () => this.leaveRoom());
        document.getElementById('share-room-btn').addEventListener('click', () => this.showShareModal());

        // Room selection events
        document.getElementById('create-room-btn').addEventListener('click', () => this.createRoom());
        document.getElementById('join-room-btn').addEventListener('click', () => this.joinRoom());

        // Share modal events
        document.getElementById('close-share').addEventListener('click', () => this.hideShareModal());
        document.getElementById('copy-code-btn').addEventListener('click', () => this.copyToClipboard('share-code'));
        document.getElementById('copy-url-btn').addEventListener('click', () => this.copyToClipboard('share-url'));

        // Close modals on background click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.add('hidden');
            }
        });
    }

    checkInviteCodeInURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const inviteCode = urlParams.get('invite');
        if (inviteCode) {
            document.getElementById('invite-code-input').value = inviteCode;
        }
    }

    async verifyToken(token) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.user;
                this.isAuthenticated = true;
                this.hideLoading();
                this.showRoomSelection();
            } else {
                localStorage.removeItem('chatlink_token');
                this.showWelcomeScreen();
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('chatlink_token');
            this.showWelcomeScreen();
        }
    }

    showWelcomeScreen() {
        this.hideLoading();
        document.getElementById('welcome-screen').classList.remove('hidden');
        document.getElementById('chat-screen').classList.add('hidden');
        document.getElementById('room-selection').classList.add('hidden');
    }

    showAuthModal(mode) {
        const modal = document.getElementById('auth-modal');
        const title = document.getElementById('auth-title');
        const submitBtn = document.getElementById('auth-submit');
        const switchText = document.getElementById('auth-switch-text');
        const switchBtn = document.getElementById('auth-switch-btn');
        const usernameGroup = document.getElementById('username-group');

        if (mode === 'login') {
            title.textContent = 'Login';
            submitBtn.textContent = 'Login';
            switchText.textContent = "Don't have an account?";
            switchBtn.textContent = 'Register';
            usernameGroup.style.display = 'none';
        } else {
            title.textContent = 'Register';
            submitBtn.textContent = 'Register';
            switchText.textContent = 'Already have an account?';
            switchBtn.textContent = 'Login';
            usernameGroup.style.display = 'block';
        }

        modal.dataset.mode = mode;
        modal.classList.remove('hidden');
        document.getElementById('email').focus();
    }

    hideAuthModal() {
        document.getElementById('auth-modal').classList.add('hidden');
        document.getElementById('auth-form').reset();
    }

    switchAuthMode() {
        const modal = document.getElementById('auth-modal');
        const currentMode = modal.dataset.mode;
        const newMode = currentMode === 'login' ? 'register' : 'login';
        this.hideAuthModal();
        this.showAuthModal(newMode);
    }

    async handleAuth(e) {
        e.preventDefault();
        const modal = document.getElementById('auth-modal');
        const mode = modal.dataset.mode;
        const submitBtn = document.getElementById('auth-submit');

        submitBtn.disabled = true;
        submitBtn.textContent = mode === 'login' ? 'Logging in...' : 'Creating account...';

        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        if (mode === 'register') {
            formData.username = document.getElementById('username').value;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/${mode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('chatlink_token', data.token);
                this.currentUser = data.user;
                this.isAuthenticated = true;
                this.hideAuthModal();
                this.showRoomSelection();
                this.showToast(`Welcome ${data.user.username}!`, 'success');
            } else {
                this.showToast(data.message || 'Authentication failed', 'error');
            }
        } catch (error) {
            console.error('Auth error:', error);
            this.showToast('Network error. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = mode === 'login' ? 'Login' : 'Register';
        }
    }

    async joinWithInviteCode() {
        const inviteCode = document.getElementById('invite-code-input').value.trim();
        if (!inviteCode) {
            this.showToast('Please enter an invite code', 'warning');
            return;
        }

        try {
            // Join as guest
            const response = await fetch(`${API_BASE_URL}/rooms/join-guest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inviteCode })
            });

            const data = await response.json();

            if (response.ok) {
                this.currentUser = data.guestUser;
                this.currentRoom = data.room;
                localStorage.setItem('chatlink_guest_token', data.token);
                this.connectSocket(data.token);
                this.showChatScreen();
                this.showToast(`Joined ${data.room.name} as guest!`, 'success');
            } else {
                this.showToast(data.message || 'Failed to join room', 'error');
            }
        } catch (error) {
            console.error('Join error:', error);
            this.showToast('Failed to join room. Please try again.', 'error');
        }
    }

    showRoomSelection() {
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('chat-screen').classList.add('hidden');
        document.getElementById('room-selection').classList.remove('hidden');
    }

    async createRoom() {
        if (!this.isAuthenticated) {
            this.showToast('Please login to create rooms', 'warning');
            return;
        }

        const roomName = prompt('Enter room name:') || 'New Room';

        try {
            const token = localStorage.getItem('chatlink_token');
            const response = await fetch(`${API_BASE_URL}/rooms/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: roomName })
            });

            const data = await response.json();

            if (response.ok) {
                this.currentRoom = data.room;
                this.connectSocket(token);
                this.showChatScreen();
                this.showToast(`Room "${roomName}" created!`, 'success');
            } else {
                this.showToast(data.message || 'Failed to create room', 'error');
            }
        } catch (error) {
            console.error('Create room error:', error);
            this.showToast('Failed to create room', 'error');
        }
    }

    async joinRoom() {
        const inviteCode = document.getElementById('room-code-input').value.trim();
        if (!inviteCode) {
            this.showToast('Please enter a room code', 'warning');
            return;
        }

        if (!this.isAuthenticated) {
            this.joinWithInviteCodeAuth(inviteCode);
            return;
        }

        try {
            const token = localStorage.getItem('chatlink_token');
            const response = await fetch(`${API_BASE_URL}/rooms/join`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inviteCode })
            });

            const data = await response.json();

            if (response.ok) {
                this.currentRoom = data.room;
                this.connectSocket(token);
                this.showChatScreen();
                this.showToast(`Joined ${data.room.name}!`, 'success');
            } else {
                this.showToast(data.message || 'Failed to join room', 'error');
            }
        } catch (error) {
            console.error('Join room error:', error);
            this.showToast('Failed to join room', 'error');
        }
    }

    async joinWithInviteCodeAuth(inviteCode) {
        try {
            const response = await fetch(`${API_BASE_URL}/rooms/join-guest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inviteCode })
            });

            const data = await response.json();

            if (response.ok) {
                this.currentUser = data.guestUser;
                this.currentRoom = data.room;
                localStorage.setItem('chatlink_guest_token', data.token);
                this.connectSocket(data.token);
                this.showChatScreen();
                this.showToast(`Joined ${data.room.name} as guest!`, 'success');
            } else {
                this.showToast(data.message || 'Failed to join room', 'error');
            }
        } catch (error) {
            console.error('Join error:', error);
            this.showToast('Failed to join room', 'error');
        }
    }

    connectSocket(token) {
        if (this.socket) {
            this.socket.disconnect();
        }

        this.socket = io(SOCKET_URL, {
            auth: {
                token: token
            }
        });

        this.socket.on('connect', () => {
            console.log('Connected to server');
            if (this.currentRoom) {
                this.socket.emit('join-room', this.currentRoom.inviteCode);
            }
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        this.socket.on('message', (message) => {
            this.displayMessage(message);
        });

        this.socket.on('user-joined', (data) => {
            this.showToast(`${data.username} joined the room`, 'success');
            this.updateUserCount(data.userCount);
        });

        this.socket.on('user-left', (data) => {
            this.showToast(`${data.username} left the room`, 'warning');
            this.updateUserCount(data.userCount);
        });

        this.socket.on('typing-start', (data) => {
            this.showTypingIndicator(data.username);
        });

        this.socket.on('typing-stop', () => {
            this.hideTypingIndicator();
        });

        this.socket.on('room-users', (users) => {
            this.updateUserCount(users.length);
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
            this.showToast('Connection error', 'error');
        });
    }

    showChatScreen() {
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('room-selection').classList.add('hidden');
        document.getElementById('chat-screen').classList.remove('hidden');

        document.getElementById('room-name').textContent = this.currentRoom.name;
        this.messageContainer = document.getElementById('messages-container');
        this.loadMessages();
        this.focusMessageInput();
    }

    async loadMessages() {
        try {
            const token = localStorage.getItem('chatlink_token') || localStorage.getItem('chatlink_guest_token');
            const response = await fetch(`${API_BASE_URL}/rooms/${this.currentRoom._id}/messages`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.messageContainer.innerHTML = '';
                data.messages.forEach(message => {
                    this.displayMessage(message);
                });
                this.scrollToBottom();
            }
        } catch (error) {
            console.error('Load messages error:', error);
        }
    }

    displayMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.author.username === this.currentUser.username ? 'own' : ''}`;

        const isOwn = message.author.username === this.currentUser.username;
        const avatarLetter = message.author.username.charAt(0).toUpperCase();

        messageEl.innerHTML = `
            <div class="message-avatar">${avatarLetter}</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${message.author.username}</span>
                    <span class="message-time">${this.formatTime(message.timestamp)}</span>
                </div>
                <div class="message-text">${this.escapeHtml(message.content)}</div>
                ${message.fileUrl ? this.renderFileAttachment(message.fileUrl, message.fileName) : ''}
            </div>
        `;

        // Remove welcome message if exists
        const welcomeMessage = this.messageContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        this.messageContainer.appendChild(messageEl);
        this.scrollToBottom();
    }

    renderFileAttachment(fileUrl, fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        if (imageExts.includes(extension)) {
            return `
                <div class="message-file">
                    <div class="file-preview">
                        <img src="${fileUrl}" alt="${fileName}" onclick="window.open('${fileUrl}', '_blank')">
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="message-file">
                    <div class="file-info">
                        <div class="file-icon">📄</div>
                        <div class="file-details">
                            <div class="file-name">${fileName}</div>
                            <a href="${fileUrl}" target="_blank" class="btn btn-link btn-sm">Download</a>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }

    handleTyping() {
        if (!this.isTyping && this.socket) {
            this.isTyping = true;
            this.socket.emit('typing-start', {
                roomId: this.currentRoom._id,
                username: this.currentUser.username
            });
        }

        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            this.isTyping = false;
            if (this.socket) {
                this.socket.emit('typing-stop', {
                    roomId: this.currentRoom._id
                });
            }
        }, 1000);
    }

    async sendMessage() {
        const input = document.getElementById('message-input');
        const content = input.value.trim();

        if (!content) return;

        const sendBtn = document.getElementById('send-btn');
        sendBtn.disabled = true;

        try {
            const token = localStorage.getItem('chatlink_token') || localStorage.getItem('chatlink_guest_token');
            const response = await fetch(`${API_BASE_URL}/rooms/${this.currentRoom._id}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                input.value = '';
                input.focus();
            } else {
                this.showToast('Failed to send message', 'error');
            }
        } catch (error) {
            console.error('Send message error:', error);
            this.showToast('Failed to send message', 'error');
        } finally {
            sendBtn.disabled = false;
        }
    }

    openFileDialog() {
        document.getElementById('file-input').click();
    }

    async handleFileUpload(e) {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'];

        for (const file of files) {
            if (file.size > maxSize) {
                this.showToast(`File ${file.name} is too large (max 10MB)`, 'warning');
                continue;
            }

            if (!allowedTypes.includes(file.type)) {
                this.showToast(`File type ${file.type} not supported`, 'warning');
                continue;
            }

            await this.uploadFile(file);
        }

        e.target.value = '';
    }

    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('roomId', this.currentRoom._id);

        try {
            const token = localStorage.getItem('chatlink_token') || localStorage.getItem('chatlink_guest_token');
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                this.showToast(`${file.name} uploaded successfully`, 'success');
            } else {
                this.showToast(data.message || 'Upload failed', 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            this.showToast('Upload failed', 'error');
        }
    }

    showTypingIndicator(username) {
        const indicator = document.getElementById('typing-indicator');
        const text = document.getElementById('typing-text');
        text.textContent = `${username} is typing...`;
        indicator.classList.remove('hidden');
    }

    hideTypingIndicator() {
        document.getElementById('typing-indicator').classList.add('hidden');
    }

    updateUserCount(count) {
        document.getElementById('user-count').textContent = `${count} user${count !== 1 ? 's' : ''} online`;
    }

    leaveRoom() {
        if (confirm('Are you sure you want to leave this room?')) {
            if (this.socket) {
                this.socket.disconnect();
            }
            this.currentRoom = null;

            if (this.isAuthenticated) {
                this.showRoomSelection();
            } else {
                localStorage.removeItem('chatlink_guest_token');
                this.showWelcomeScreen();
            }
        }
    }

    showShareModal() {
        const modal = document.getElementById('share-modal');
        const codeInput = document.getElementById('share-code');
        const urlInput = document.getElementById('share-url');

        codeInput.value = this.currentRoom.inviteCode;
        urlInput.value = `${window.location.origin}/?invite=${this.currentRoom.inviteCode}`;

        modal.classList.remove('hidden');
    }

    hideShareModal() {
        document.getElementById('share-modal').classList.add('hidden');
    }

    async copyToClipboard(elementId) {
        try {
            const element = document.getElementById(elementId);
            await navigator.clipboard.writeText(element.value);
            this.showToast('Copied to clipboard!', 'success');
        } catch (error) {
            console.error('Copy failed:', error);
            this.showToast('Failed to copy', 'error');
        }
    }

    focusMessageInput() {
        setTimeout(() => {
            document.getElementById('message-input').focus();
        }, 100);
    }

    scrollToBottom() {
        setTimeout(() => {
            const container = this.messageContainer;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, 50);
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'now';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;

        return date.toLocaleDateString();
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/\n/g, '<br>');
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});

// Handle online/offline status
window.addEventListener('online', () => {
    document.querySelector('.chat-app')?.showToast('Connection restored', 'success');
});

window.addEventListener('offline', () => {
    document.querySelector('.chat-app')?.showToast('Connection lost', 'warning');
});
