// Chat Application JavaScript
class ChatApp {
    constructor() {
        this.currentUser = null;
        this.currentRoom = null;
        this.isTyping = false;
        this.typingTimeout = null;
        this.messageContainer = null;
        
        // Initialize with provided data
        this.data = {
            "users": [
                {
                    "id": "user1",
                    "username": "John Doe",
                    "email": "john@example.com",
                    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                    "status": "online",
                    "lastSeen": "2024-01-15T10:30:00Z",
                    "isGuest": false
                },
                {
                    "id": "user2",
                    "username": "Jane Smith", 
                    "email": "jane@example.com",
                    "avatar": "https://images.unsplash.com/photo-1494790108755-2616b69ae7e1?w=100&h=100&fit=crop&crop=face",
                    "status": "online",
                    "lastSeen": "2024-01-15T10:25:00Z",
                    "isGuest": false
                },
                {
                    "id": "guest1",
                    "username": "Guest User",
                    "email": "",
                    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
                    "status": "online", 
                    "lastSeen": "2024-01-15T10:35:00Z",
                    "isGuest": true
                }
            ],
            "chatRooms": [
                {
                    "id": "room-demo123",
                    "inviteCode": "demo123",
                    "name": "Welcome Chat Room",
                    "participants": ["user1", "user2", "guest1"],
                    "createdBy": "user1",
                    "createdAt": "2024-01-15T10:00:00Z",
                    "lastActivity": "2024-01-15T10:35:00Z",
                    "isPublic": true
                },
                {
                    "id": "room-friends456", 
                    "inviteCode": "friends456",
                    "name": "Friends Group",
                    "participants": ["user1", "user2"],
                    "createdBy": "user1",
                    "createdAt": "2024-01-15T09:30:00Z",
                    "lastActivity": "2024-01-15T10:20:00Z",
                    "isPublic": false
                }
            ],
            "messages": [
                {
                    "id": "msg1",
                    "roomId": "room-demo123",
                    "senderId": "user1", 
                    "content": "Welcome to our advanced chat room! 🎉 You can share invite links to let others join this conversation.",
                    "type": "text",
                    "timestamp": "2024-01-15T10:30:00Z",
                    "status": "read",
                    "reactions": ["👍", "❤️"]
                },
                {
                    "id": "msg2",
                    "roomId": "room-demo123",
                    "senderId": "user2",
                    "content": "This is amazing! Check out this video: https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    "type": "text", 
                    "timestamp": "2024-01-15T10:32:00Z",
                    "linkPreview": {
                        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "title": "Rick Astley - Never Gonna Give You Up (Official Video)",
                        "description": "The official video for Rick Astley's 1987 hit Never Gonna Give You Up",
                        "image": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
                        "provider": "YouTube"
                    }
                },
                {
                    "id": "msg3",
                    "roomId": "room-demo123",
                    "senderId": "guest1",
                    "content": "Nice! I joined as a guest through the invite link. Here's a cool image:",
                    "type": "text",
                    "timestamp": "2024-01-15T10:34:00Z"
                },
                {
                    "id": "msg4",
                    "roomId": "room-demo123", 
                    "senderId": "guest1",
                    "content": "beautiful-landscape.jpg",
                    "type": "image",
                    "timestamp": "2024-01-15T10:35:00Z",
                    "fileUrl": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
                    "fileName": "beautiful-landscape.jpg",
                    "fileSize": "2.1 MB"
                },
                {
                    "id": "msg5",
                    "roomId": "room-friends456",
                    "senderId": "user1",
                    "content": "Hey Jane! This is our private chat room. Want to share the link with Mike?",
                    "type": "text",
                    "timestamp": "2024-01-15T10:20:00Z",
                    "status": "read"
                },
                {
                    "id": "msg6", 
                    "roomId": "room-friends456",
                    "senderId": "user2",
                    "content": "Sure! I'll send him the invite link. Also check this Instagram post: https://www.instagram.com/p/example123/",
                    "type": "text",
                    "timestamp": "2024-01-15T10:22:00Z", 
                    "linkPreview": {
                        "url": "https://www.instagram.com/p/example123/",
                        "title": "Amazing sunset photo",
                        "description": "Beautiful sunset captured yesterday evening",
                        "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
                        "provider": "Instagram"
                    }
                }
            ],
            "inviteLinks": [
                {
                    "code": "demo123",
                    "roomId": "room-demo123",
                    "createdBy": "user1",
                    "createdAt": "2024-01-15T10:00:00Z",
                    "expiresAt": null,
                    "usageCount": 3,
                    "maxUses": null
                },
                {
                    "code": "friends456", 
                    "roomId": "room-friends456",
                    "createdBy": "user1", 
                    "createdAt": "2024-01-15T09:30:00Z",
                    "expiresAt": "2024-01-22T09:30:00Z",
                    "usageCount": 1,
                    "maxUses": 5
                }
            ],
            "currentUser": {
                "id": "user1",
                "username": "ASMIT SRIVASTAVA",
                "email": "asmit@example.com",
                "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
                "status": "online",
                "isGuest": false
            }
        };
    }

    init() {
        this.setupTheme();
        this.simulateLoading();
    }

    simulateLoading() {
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('app').classList.remove('hidden');
            
            // Setup event listeners after DOM is loaded
            this.setupEventListeners();
            
            // Check if user is logged in
            const savedUser = localStorage.getItem('chatapp_user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
                this.showDashboard();
            } else {
                this.showWelcomeScreen();
            }
            
            this.checkForInviteCode();
        }, 1500);
    }

    setupEventListeners() {
        try {
            // Welcome screen
            const loginBtn = document.getElementById('login-btn');
            const registerBtn = document.getElementById('register-btn');
            const joinInviteBtn = document.getElementById('join-invite-btn');

            if (loginBtn) loginBtn.addEventListener('click', () => this.showAuthModal('login'));
            if (registerBtn) registerBtn.addEventListener('click', () => this.showAuthModal('register'));
            if (joinInviteBtn) joinInviteBtn.addEventListener('click', () => this.joinViaInvite());

            // Auth modal
            const closeAuth = document.getElementById('close-auth');
            const switchToRegister = document.getElementById('switch-to-register');
            const switchToLogin = document.getElementById('switch-to-login');

            if (closeAuth) closeAuth.addEventListener('click', () => this.hideAuthModal());
            if (switchToRegister) {
                switchToRegister.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchAuthForm('register');
                });
            }
            if (switchToLogin) {
                switchToLogin.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchAuthForm('login');
                });
            }

            // Auth forms
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');

            if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            if (registerForm) registerForm.addEventListener('submit', (e) => this.handleRegister(e));

            // Dashboard
            const logoutBtn = document.getElementById('logout-btn');
            const createRoomBtn = document.getElementById('create-room-btn');
            const backToDashboard = document.getElementById('back-to-dashboard');

            if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
            if (createRoomBtn) createRoomBtn.addEventListener('click', () => this.createRoom());
            if (backToDashboard) backToDashboard.addEventListener('click', () => this.showDashboard());

            // Chat room
            const sendBtn = document.getElementById('send-btn');
            const messageInput = document.getElementById('message-input');
            const attachBtn = document.getElementById('attach-btn');
            const fileInput = document.getElementById('file-input');
            const emojiBtn = document.getElementById('emoji-btn');
            const shareInviteBtn = document.getElementById('share-invite-btn');

            if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
            if (messageInput) {
                messageInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.sendMessage();
                    this.handleTyping();
                });
            }
            if (attachBtn) attachBtn.addEventListener('click', () => this.triggerFileUpload());
            if (fileInput) fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
            if (emojiBtn) emojiBtn.addEventListener('click', () => this.toggleEmojiPicker());
            if (shareInviteBtn) shareInviteBtn.addEventListener('click', () => this.showInviteModal());

            // Invite modal
            const closeInvite = document.getElementById('close-invite');
            const copyInviteBtn = document.getElementById('copy-invite-btn');

            if (closeInvite) closeInvite.addEventListener('click', () => this.hideInviteModal());
            if (copyInviteBtn) copyInviteBtn.addEventListener('click', () => this.copyInviteLink());

            // Theme toggle
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) themeToggle.addEventListener('click', () => this.toggleTheme());

            // Media viewer
            const mediaViewer = document.getElementById('media-viewer');
            if (mediaViewer) {
                mediaViewer.addEventListener('click', (e) => {
                    if (e.target.classList.contains('media-viewer-backdrop') || e.target.classList.contains('media-viewer-close')) {
                        this.hideMediaViewer();
                    }
                });
            }

            // Emoji picker
            document.querySelectorAll('.emoji-option').forEach(emoji => {
                emoji.addEventListener('click', () => this.insertEmoji(emoji.textContent));
            });

            // File drag & drop
            this.setupFileDragAndDrop();

            // Click outside to close
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.emoji-picker') && !e.target.closest('#emoji-btn')) {
                    this.hideEmojiPicker();
                }
            });

            // Modal backdrop clicks
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-backdrop')) {
                    if (e.target.closest('#auth-modal')) {
                        this.hideAuthModal();
                    }
                    if (e.target.closest('#invite-modal')) {
                        this.hideInviteModal();
                    }
                }
            });

        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    setupFileDragAndDrop() {
        const chatRoom = document.getElementById('chat-room');
        const fileUploadArea = document.getElementById('file-upload-area');

        if (chatRoom && fileUploadArea) {
            chatRoom.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileUploadArea.classList.add('active');
            });

            chatRoom.addEventListener('dragleave', (e) => {
                if (!chatRoom.contains(e.relatedTarget)) {
                    fileUploadArea.classList.remove('active');
                }
            });

            chatRoom.addEventListener('drop', (e) => {
                e.preventDefault();
                fileUploadArea.classList.remove('active');
                this.handleFileDrop(e.dataTransfer.files);
            });
        }
    }

    checkForInviteCode() {
        const urlParams = new URLSearchParams(window.location.search);
        const inviteCode = urlParams.get('invite');
        if (inviteCode) {
            const inviteInput = document.getElementById('invite-code-input');
            if (inviteInput) {
                inviteInput.value = inviteCode;
            }
        }
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('chatapp_theme') || 'light';
        document.documentElement.setAttribute('data-color-scheme', savedTheme);
        setTimeout(() => this.updateThemeButton(savedTheme), 100);
    }

    showWelcomeScreen() {
        this.hideAllScreens();
        document.getElementById('welcome-screen').classList.remove('hidden');
    }

    showDashboard() {
        this.hideAllScreens();
        document.getElementById('dashboard').classList.remove('hidden');
        this.updateUserInfo();
        this.loadUserRooms();
    }

    showChatRoom(roomId) {
        this.hideAllScreens();
        document.getElementById('chat-room').classList.remove('hidden');
        this.currentRoom = this.data.chatRooms.find(room => room.id === roomId);
        this.updateChatRoomInfo();
        this.loadMessages();
        this.messageContainer = document.getElementById('chat-messages');
        setTimeout(() => this.scrollToBottom(), 100);
    }

    hideAllScreens() {
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('chat-room').classList.add('hidden');
    }

    showAuthModal(type) {
        document.getElementById('auth-modal').classList.remove('hidden');
        document.getElementById('auth-title').textContent = type === 'login' ? 'Login' : 'Register';
        this.switchAuthForm(type);
    }

    hideAuthModal() {
        document.getElementById('auth-modal').classList.add('hidden');
    }

    switchAuthForm(type) {
        if (type === 'login') {
            document.getElementById('login-form').classList.remove('hidden');
            document.getElementById('register-form').classList.add('hidden');
        } else {
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('register-form').classList.remove('hidden');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Simulate authentication
        const user = this.data.users.find(u => u.email === email && !u.isGuest);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('chatapp_user', JSON.stringify(user));
            this.hideAuthModal();
            this.showDashboard();
            this.showNotification('Login successful!', 'success');
        } else {
            this.showNotification('Invalid credentials', 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        // Check if user already exists
        if (this.data.users.find(u => u.email === email)) {
            this.showNotification('User already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: 'user' + Date.now(),
            username,
            email,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
            status: 'online',
            lastSeen: new Date().toISOString(),
            isGuest: false
        };

        this.data.users.push(newUser);
        this.currentUser = newUser;
        localStorage.setItem('chatapp_user', JSON.stringify(newUser));
        this.hideAuthModal();
        this.showDashboard();
        this.showNotification('Registration successful!', 'success');
    }

    logout() {
        localStorage.removeItem('chatapp_user');
        this.currentUser = null;
        this.currentRoom = null;
        this.showWelcomeScreen();
        this.showNotification('Logged out successfully', 'success');
    }

    updateUserInfo() {
        if (this.currentUser) {
            const avatar = document.getElementById('user-avatar');
            const name = document.getElementById('user-name');
            if (avatar) avatar.src = this.currentUser.avatar;
            if (name) name.textContent = this.currentUser.username;
        }
    }

    loadUserRooms() {
        const roomList = document.getElementById('room-list');
        if (!roomList) return;

        const userRooms = this.data.chatRooms.filter(room => 
            room.participants.includes(this.currentUser.id)
        );

        roomList.innerHTML = '';
        userRooms.forEach(room => {
            const roomElement = this.createRoomElement(room);
            roomList.appendChild(roomElement);
        });
    }

    createRoomElement(room) {
        const div = document.createElement('div');
        div.className = 'room-item';
        div.addEventListener('click', () => this.showChatRoom(room.id));

        const lastMessage = this.getLastMessage(room.id);
        const participantCount = room.participants.length;

        div.innerHTML = `
            <div class="room-info">
                <h5>${room.name}</h5>
                <div class="room-meta">
                    ${participantCount} participants • ${lastMessage ? this.formatTime(lastMessage.timestamp) : 'No messages'}
                </div>
            </div>
            <div class="room-status">
                <span class="status status--success">Active</span>
            </div>
        `;

        return div;
    }

    getLastMessage(roomId) {
        const roomMessages = this.data.messages.filter(msg => msg.roomId === roomId);
        return roomMessages.length > 0 ? roomMessages[roomMessages.length - 1] : null;
    }

    createRoom() {
        const roomNameInput = document.getElementById('room-name');
        const roomName = roomNameInput ? roomNameInput.value || 'New Chat Room' : 'New Chat Room';
        const inviteCode = this.generateInviteCode();
        
        const newRoom = {
            id: 'room-' + Date.now(),
            inviteCode,
            name: roomName,
            participants: [this.currentUser.id],
            createdBy: this.currentUser.id,
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            isPublic: false
        };

        const newInvite = {
            code: inviteCode,
            roomId: newRoom.id,
            createdBy: this.currentUser.id,
            createdAt: new Date().toISOString(),
            expiresAt: null,
            usageCount: 0,
            maxUses: null
        };

        this.data.chatRooms.push(newRoom);
        this.data.inviteLinks.push(newInvite);
        
        if (roomNameInput) roomNameInput.value = '';
        this.loadUserRooms();
        this.showNotification('Room created successfully!', 'success');
        this.showChatRoom(newRoom.id);
    }

    generateInviteCode() {
        return Math.random().toString(36).substring(2, 12);
    }

    joinViaInvite() {
        const inviteInput = document.getElementById('invite-code-input');
        const inviteCode = inviteInput ? inviteInput.value.trim() : '';
        
        if (!inviteCode) {
            this.showNotification('Please enter an invite code', 'error');
            return;
        }

        const invite = this.data.inviteLinks.find(inv => inv.code === inviteCode);
        if (!invite) {
            this.showNotification('Invalid invite code', 'error');
            return;
        }

        const room = this.data.chatRooms.find(r => r.id === invite.roomId);
        if (!room) {
            this.showNotification('Room not found', 'error');
            return;
        }

        if (!this.currentUser) {
            // Create guest user
            this.currentUser = {
                id: 'guest' + Date.now(),
                username: 'Guest User',
                email: '',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
                status: 'online',
                lastSeen: new Date().toISOString(),
                isGuest: true
            };
            this.data.users.push(this.currentUser);
        }

        // Add user to room if not already a participant
        if (!room.participants.includes(this.currentUser.id)) {
            room.participants.push(this.currentUser.id);
            invite.usageCount++;
        }

        this.showChatRoom(room.id);
        this.showNotification('Joined room successfully!', 'success');
    }

    updateChatRoomInfo() {
        if (this.currentRoom) {
            const roomName = document.getElementById('chat-room-name');
            const participantCount = document.getElementById('participant-count');
            
            if (roomName) roomName.textContent = this.currentRoom.name;
            if (participantCount) {
                participantCount.textContent = `${this.currentRoom.participants.length} participants`;
            }
            this.updateOnlineUsers();
        }
    }

    updateOnlineUsers() {
        const onlineUsersContainer = document.getElementById('online-users');
        if (!onlineUsersContainer) return;

        const participants = this.currentRoom.participants
            .map(id => this.data.users.find(u => u.id === id))
            .filter(u => u && u.status === 'online');

        onlineUsersContainer.innerHTML = '';
        participants.slice(0, 5).forEach(user => {
            const img = document.createElement('img');
            img.src = user.avatar;
            img.alt = user.username;
            img.className = 'online-user';
            img.title = user.username;
            onlineUsersContainer.appendChild(img);
        });
    }

    loadMessages() {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const roomMessages = this.data.messages.filter(msg => msg.roomId === this.currentRoom.id);
        
        messagesContainer.innerHTML = '';
        roomMessages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        });
    }

    createMessageElement(message) {
        const sender = this.data.users.find(u => u.id === message.senderId);
        const isOwnMessage = message.senderId === this.currentUser.id;
        
        const div = document.createElement('div');
        div.className = `message ${isOwnMessage ? 'own' : ''}`;

        let messageContent = '';
        
        if (message.type === 'text') {
            messageContent = `<div class="message-text">${this.formatMessageContent(message.content)}</div>`;
            
            if (message.linkPreview) {
                messageContent += this.createLinkPreview(message.linkPreview);
            }
        } else if (message.type === 'image') {
            messageContent = `
                <div class="message-text">
                    <img src="${message.fileUrl}" alt="${message.fileName}" class="message-image" onclick="window.app.showMediaViewer('${message.fileUrl}', '${message.fileName}')">
                </div>
            `;
        }

        if (message.reactions && message.reactions.length > 0) {
            messageContent += `
                <div class="message-reactions">
                    ${message.reactions.map(reaction => `<span class="reaction">${reaction}</span>`).join('')}
                </div>
            `;
        }

        div.innerHTML = `
            ${!isOwnMessage ? `<img src="${sender.avatar}" alt="${sender.username}" class="message-avatar">` : ''}
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${sender.username}</span>
                    <span class="message-time">${this.formatTime(message.timestamp)}</span>
                </div>
                ${messageContent}
            </div>
            ${isOwnMessage ? `<img src="${sender.avatar}" alt="${sender.username}" class="message-avatar">` : ''}
        `;

        return div;
    }

    formatMessageContent(content) {
        // Simple URL detection and linking
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return content.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
    }

    createLinkPreview(preview) {
        return `
            <div class="link-preview">
                ${preview.image ? `<img src="${preview.image}" alt="${preview.title}" class="link-preview-image">` : ''}
                <div class="link-preview-content">
                    <div class="link-preview-title">${preview.title}</div>
                    <div class="link-preview-description">${preview.description}</div>
                    <div class="link-preview-provider">${preview.provider}</div>
                </div>
            </div>
        `;
    }

    sendMessage() {
        const input = document.getElementById('message-input');
        if (!input) return;

        const content = input.value.trim();
        if (!content) return;

        const message = {
            id: 'msg' + Date.now(),
            roomId: this.currentRoom.id,
            senderId: this.currentUser.id,
            content,
            type: 'text',
            timestamp: new Date().toISOString(),
            status: 'sent'
        };

        // Check for link preview
        const urlMatch = content.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
            message.linkPreview = this.generateLinkPreview(urlMatch[0]);
        }

        this.data.messages.push(message);
        this.currentRoom.lastActivity = message.timestamp;
        
        const messageElement = this.createMessageElement(message);
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.appendChild(messageElement);
        }
        
        input.value = '';
        this.scrollToBottom();
        this.simulateTypingIndicator();
        
        // Simulate receiving a response
        setTimeout(() => this.simulateResponse(), 2000);
    }

    generateLinkPreview(url) {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return {
                url,
                title: "Sample YouTube Video",
                description: "This is a sample video description for demonstration purposes.",
                image: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
                provider: "YouTube"
            };
        } else if (url.includes('instagram.com')) {
            return {
                url,
                title: "Instagram Post",
                description: "A beautiful photo shared on Instagram.",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
                provider: "Instagram"
            };
        } else {
            return {
                url,
                title: "Web Page",
                description: "A link to an interesting web page.",
                image: null,
                provider: "Web"
            };
        }
    }

    simulateResponse() {
        const responses = [
            "That's interesting! 👍",
            "Thanks for sharing!",
            "Great point! 🎉",
            "I agree with that.",
            "Cool! 😎"
        ];

        const otherParticipants = this.currentRoom.participants.filter(id => id !== this.currentUser.id);
        if (otherParticipants.length === 0) return;

        const randomParticipant = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        const responseMessage = {
            id: 'msg' + Date.now(),
            roomId: this.currentRoom.id,
            senderId: randomParticipant,
            content: randomResponse,
            type: 'text',
            timestamp: new Date().toISOString(),
            status: 'sent'
        };

        this.data.messages.push(responseMessage);
        
        const messageElement = this.createMessageElement(responseMessage);
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.appendChild(messageElement);
            this.scrollToBottom();
        }
    }

    handleTyping() {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }

        if (!this.isTyping) {
            this.isTyping = true;
            this.showTypingIndicator();
        }

        this.typingTimeout = setTimeout(() => {
            this.isTyping = false;
            this.hideTypingIndicator();
        }, 2000);
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.classList.remove('hidden');
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.classList.add('hidden');
    }

    simulateTypingIndicator() {
        setTimeout(() => {
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
            }, 1500);
        }, 500);
    }

    triggerFileUpload() {
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.click();
    }

    handleFileUpload(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }

    handleFileDrop(files) {
        this.processFiles(Array.from(files));
    }

    processFiles(files) {
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                this.uploadImage(file);
            } else {
                this.uploadFile(file);
            }
        });
    }

    uploadImage(file) {
        // Simulate image upload
        const message = {
            id: 'msg' + Date.now(),
            roomId: this.currentRoom.id,
            senderId: this.currentUser.id,
            content: file.name,
            type: 'image',
            timestamp: new Date().toISOString(),
            fileUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
            fileName: file.name,
            fileSize: this.formatFileSize(file.size)
        };

        this.data.messages.push(message);
        const messageElement = this.createMessageElement(message);
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.appendChild(messageElement);
            this.scrollToBottom();
        }
        
        this.showNotification(`Image "${file.name}" uploaded successfully!`, 'success');
    }

    uploadFile(file) {
        // Simulate file upload
        this.showNotification(`File "${file.name}" uploaded successfully!`, 'success');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    toggleEmojiPicker() {
        const picker = document.getElementById('emoji-picker');
        if (picker) picker.classList.toggle('hidden');
    }

    hideEmojiPicker() {
        const picker = document.getElementById('emoji-picker');
        if (picker) picker.classList.add('hidden');
    }

    insertEmoji(emoji) {
        const input = document.getElementById('message-input');
        if (input) {
            input.value += emoji;
            input.focus();
        }
        this.hideEmojiPicker();
    }

    showInviteModal() {
        const invite = this.data.inviteLinks.find(inv => inv.roomId === this.currentRoom.id);
        if (invite) {
            const inviteLink = document.getElementById('invite-link');
            const inviteCode = document.getElementById('invite-code');
            const inviteUsage = document.getElementById('invite-usage');
            const modal = document.getElementById('invite-modal');

            if (inviteLink) inviteLink.value = `${window.location.origin}?invite=${invite.code}`;
            if (inviteCode) inviteCode.textContent = invite.code;
            if (inviteUsage) {
                inviteUsage.textContent = `${invite.usageCount}${invite.maxUses ? `/${invite.maxUses}` : ''} uses`;
            }
            if (modal) modal.classList.remove('hidden');
        }
    }

    hideInviteModal() {
        const modal = document.getElementById('invite-modal');
        if (modal) modal.classList.add('hidden');
    }

    copyInviteLink() {
        const inviteLink = document.getElementById('invite-link');
        if (inviteLink) {
            inviteLink.select();
            inviteLink.setSelectionRange(0, 99999); // For mobile devices
            
            try {
                document.execCommand('copy');
                this.showNotification('Invite link copied to clipboard!', 'success');
            } catch (err) {
                // Fallback for modern browsers
                navigator.clipboard.writeText(inviteLink.value).then(() => {
                    this.showNotification('Invite link copied to clipboard!', 'success');
                }).catch(() => {
                    this.showNotification('Could not copy link', 'error');
                });
            }
        }
    }

    showMediaViewer(imageUrl, fileName) {
        const image = document.getElementById('media-viewer-image');
        const filename = document.getElementById('media-viewer-filename');
        const viewer = document.getElementById('media-viewer');

        if (image) image.src = imageUrl;
        if (filename) filename.textContent = fileName;
        if (viewer) viewer.classList.remove('hidden');
    }

    hideMediaViewer() {
        const viewer = document.getElementById('media-viewer');
        if (viewer) viewer.classList.add('hidden');
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('chatapp_theme', newTheme);
        this.updateThemeButton(newTheme);
    }

    updateThemeButton(theme) {
        const button = document.getElementById('theme-toggle');
        if (button) {
            button.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    scrollToBottom() {
        if (this.messageContainer) {
            this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
        }
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    showNotification(message, type = 'info') {
        const notifications = document.getElementById('notifications');
        if (!notifications) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notifications.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ChatApp();
    app.init();
    
    // Make app globally available for onclick handlers
    window.app = app;
});