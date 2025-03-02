<template>
    <div>
      <!-- Chatbot Button -->
      <div class="chatbot-button" @click="openChat">
        💬
      </div>
  
      <!-- Chat Overlay -->
      <transition name="slide-fade">
      <div v-if="isChatOpen" class="chat-overlay" ref="chatOverlay">
        <div class="resize-handle" @mousedown="startResize"></div>
        <!-- Chat Header -->
        <div class="chat-header">
        <h3>CHATBOT KHANHHAOSTORE</h3>
        <div class="header-buttons">
            <!-- New Clear Button (placed first) -->
            <button @click="clearChat" v-if="this.savedHistory.length > 1" class="clear-button">Clear</button>
            <!-- Close Button (placed second) -->
            <button @click="closeChat">X</button>
        </div>
        </div>

        
        <div class="chat-content"  ref="chatContent">
            <!-- Display chat history sorted by time -->
            <div v-for="(message, index) in sortedHistory" :key="index" class="chat-message">
                <div :class="{'user-message': message.sender === 'user', 'bot-message': message.sender === 'bot'}">
                <img :src="message.sender === 'user' ? userAvatar : botAvatar" class="avatar" alt="Avatar" />
                <div class="message-content">
                    <span class="chat-text" v-if="message.sender === 'bot'" @click="handleClick" v-html="message.text"></span>
                    <span class="chat-text" v-else v-html="message.text"></span>
                    <span class="chat-time">{{ message.time }}</span>
                </div>
                </div>
            </div>
    
            <!-- Typing indicator as a message bubble -->
                <div v-if="isBotTyping" class="chat-message">
                <div class="bot-message">
                    <img :src="botAvatar" class="avatar" alt="Bot Avatar" />
                    <div class="message-content">
                        <div class="typing-indicator">
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                        </div>
                        <span class="chat-time">{{ typingTime }}s</span>
                    </div>
                </div>
                </div>
        </div>
  
        <!-- Input to send new message -->
        <div class="chat-input">
          <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
          <button :disabled="this.isDisableSendMessage" @click="sendMessage">Send</button>
        </div>
      </div>
    </transition>
</div>
  </template>
  
  <script>
  import db from '@/api/db';
  export default {
    name: "ChatbotButton",
    data() {
      return {
        isDisableSendMessage: false,
        isLoggedIn: false, // To check if user is logged in
        isChatOpen: false, // To control if the chat overlay is open
        newMessage: "", // To hold the current message input by the user
        originalHistory: [
            { sender: "bot", text: "Chào bạn! Tôi có thể giúp gì cho bạn?", time: '' }
        ],
        savedHistory: [],
        typingTime: 0.0, // Time taken for bot to type a message
        lastTypingTime: 0.0, // Time when bot last started typing
        isBotTyping: false, // To control if the bot is typing
        userAvatar: require('@/assets/userAvatar.png'), // Default avatar for user (red background)
        botAvatar: require('@/assets/botAvatar.png'), // Default avatar for bot (blue background)
        userId: null,
      };
    },
    async mounted() {
        this.originalHistory.forEach(m => {
            this.savedHistory.push(m);
        });
        
        this.$nextTick(() => {
            this.chatOverlay = this.$refs.chatOverlay; // Get the chat overlay ref after the component is mounted
        });

        // check is logged in or not
        let user = null;
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken != null) {
            user = await db.getUser(accessToken);
        }

        if (user == null) {
            localStorage.removeItem('accessToken');
            this.isLoggedIn = false;
            return;
        }

        this.userId = user.id;

        if (this.userId != null) {
            this.isLoggedIn = true;

            const historyChatbot = await db.getHistoryChatBot();
            if (historyChatbot != null) {
                historyChatbot.forEach(m => {
                    let isBot = 'bot';
                    if (m.isBot == '0') {
                        isBot = 'user';
                    }
                    this.savedHistory.push({
                        sender: isBot,
                        text: m.message.trim().replace(/```html\n/g, '').replace('\n```', '').replace(/\n\n/g, '<br>').replace(/\n/g, ''),
                        time: this.formatDateTime(m.time) 
                    });
                });
            }
        }

      // Scroll to the bottom of the chat content when the component is mounted
      this.scrollToBottom();

      const imgData = await db.getImg();
      if (imgData) {
        this.userAvatar = db.getAPI_URL() + imgData.userAvatar;
        this.botAvatar = db.getAPI_URL() + imgData.botAvatar; 
      }

      this.isChatOpen = sessionStorage.getItem('chatbot_open') == 'true' ? true : false;
    },
    computed: {
      // Sort messages by time in ascending order
      sortedHistory() {
        return [...this.savedHistory].sort((a, b) => new Date(a.time) - new Date(b.time));
      }
    },
    methods: {
      openChat() {
        this.isChatOpen = !this.isChatOpen; // Open chat overlay when button is clicked
        if (this.isChatOpen == true) {
            if (!this.isLoggedIn) {
                this.showLoginModal = true;
            } else {
                this.showLoginModal = false;
            }
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        }
        sessionStorage.setItem('chatbot_open', this.isChatOpen);
      },
      closeChat() {
        this.isChatOpen = false; // Close the chat overlay
      },
      startResize(event) {
    event.preventDefault();
    // Ensure the ref is properly accessed
    if (this.$refs.chatOverlay) {
      this.startY = event.clientY;
      this.startHeight = this.$refs.chatOverlay.clientHeight;

      // Add event listeners for resizing
      document.addEventListener('mousemove', this.resizeChat);
      document.addEventListener('mouseup', this.stopResize);
    }
  },
  resizeChat(event) {
    if (this.$refs.chatOverlay) {
      const newHeight = this.startHeight - (event.clientY - this.startY); // Subtract instead of add
      if (newHeight > 200 && newHeight < 900) { // Optional: Set a minimum height limit
        this.$refs.chatOverlay.style.height = `${newHeight}px`;
      }
    }
  },
  handleClick(event) {
    const name = event.target?.name;
      // Ensure that the click event is on the button
      if (name && name.toLowerCase() == 'redirect') {
        const path = event.target?.value;
        if (path) {
            this.redirect(path);
        }
      }
    },
  stopResize() {
    // Remove event listeners when the user stops resizing
    document.removeEventListener('mousemove', this.resizeChat);
    document.removeEventListener('mouseup', this.stopResize);
  },
  async clearChat() {
  // Show confirmation dialog
  const userConfirmed = window.confirm("Bạn có muốn xóa lịch sử đoạn chat?");
  
  if (userConfirmed) {
    // Clear the chat history if confirmed
    const result = await db.clearHistoryChatBot();  // Assuming this clears history from the database
    if (result) {
      this.savedHistory = [];  // Clear the chat history in the component
    
    // Restore original history if necessary
    this.originalHistory.forEach(m => {
      this.savedHistory.push(m);
    });
    } else {
      alert("Đã xảy ra lỗi khi xóa lịch sử đoạn chat");
    }
    
  } else {
    // If the user clicked "No", do nothing
    console.log("Chat history not cleared.");
  }
},

      sendMessage() {
        if (this.isDisableSendMessage) {
            return;
        }
        if (this.newMessage.trim() != "") {
            this.isDisableSendMessage = true;
          // Add the user's message to the chat history with timestamp
          const userMessage = {
            sender: "user",
            text: this.newMessage,
            time: this.getCurrentDateTime()
          };
          this.savedHistory.push(userMessage);
          const userMess = this.newMessage;
          this.newMessage = ""; // Clear the input after sending

          this.$nextTick(() => {
                this.scrollToBottom();
            });

          setTimeout(() => {
            if (!this.isLoggedIn) {
            const botMessage = {
                sender: "bot",
                text: "<p>Vui lòng đăng nhập để tiếp tục chat.<p/> <button class=\"material-button\" value=\"/login\" name=\"redirect\">Đăng nhập ngay</button>",
                time: this.getCurrentDateTime()
                };
                this.savedHistory.push(botMessage);
            this.isDisableSendMessage = false;
            return;
        }
            // Simulate a bot response with typing animation
            this.isBotTyping = true; // Start bot typing animation
            this.$nextTick(() => {
                this.scrollToBottom();
            });
            this.typingTime = 0; // Reset typing time
            this.startTyping(); // Start the typing animation
            setTimeout(async() => {
                // send message to chatbot api
                let message = await db.sendMessageToChatBot(userMess, "Prompt: Hiện tại khách hàng đang ở URL: " + this.$route.path);
                if (message == null) {
                    message = "Sorry, I'm not sure how to respond to that.";
                }

                this.isBotTyping = false; // Stop typing animation
                this.isDisableSendMessage = false;
                const botMessage = {
                    sender: "bot",
                    text: message.trim().trim().replace(/```html\n/g, '').replace('\n```', '').replace(/\n\n/g, '<br>').replace(/\n/g, ''),
                    time: this.getCurrentDateTime() + ` (Last typing: ${this.typingTime}s)`
                };
                this.savedHistory.push(botMessage);
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
            }, 100); 
          }, 1000);
        } else {
            this.newMessage = "";
            this.isDisableSendMessage = false;
        }
      },
      redirect(path) {
        this.$router.push('/a');
        setTimeout(() => {
            this.$router.push(path);
        }, 10);
      },
      scrollToBottom() {
        const container = this.$refs.chatContent;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
        },
    getCurrentTime() {
        // Get current time formatted as HH:MM AM/PM
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;
        return `${hours12}:${minutesFormatted} ${ampm}`;
      },

      getCurrentDateTime() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes} ${day}/${month} `;
    },
     formatDateTime(datetime) {
    const now = new Date(datetime);
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    // Format: HH:mm dd/MM/yyyy
    return `${hours}:${minutes} ${day}/${month} `;
},

      startTyping() {
        const typingInterval = setInterval(() => {
          if (this.isBotTyping) {
            this.typingTime = Math.round((this.typingTime + 0.1) * 10) / 10; // Round to 1 decimal place
          } else {
            this.lastTypingTime = this.typingTime; // Save the last typing time
            clearInterval(typingInterval);
          }
        }, 100); // Increment time every 100ms
      },
    }
  };
  </script>
  
  <style scoped>
 .chatbot-button {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background-color: #4dabf7;
    color: white;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    transition: background-color 0.3s ease;}
.chatbot-button:hover {
    background-color: #3b8fd9;}
.chat-overlay {
    position: fixed;
    bottom: 80px;
    left: 20px;
    width: 550px; /* Increased width */
    max-width: 90%;
    height: 550px; /* Increased height */
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    display: flex;
    flex-direction: column;}
.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: #4dabf7;
    color: white;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;}
.chat-header h3 {
    margin: 0;
    font-size: 18px;}
.chat-header button {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    transition: opacity 0.3s ease;}
.chat-header button:hover {
    opacity: 0.8;}
.chat-content {
    padding: 15px;
    overflow-y: auto;
    scroll-behavior: smooth;
    flex-grow: 1;
    background-color: #f9f9f9;}
.chat-message {
    margin-bottom: 15px;
    display: flex;
    align-items: flex-start;}
.user-message {
    justify-content: flex-end;}
.bot-message {
    justify-content: flex-start;}
.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;}
.message-content {
    max-width: 90%;
    padding: 10px;
    border-radius: 10px;
    position: relative;}
.user-message .message-content {
    background-color: #4dabf7;
    color: white;
    border-top-right-radius: 0;}
.bot-message .message-content {
    background-color: #e0e0e0;
    color: #333;
    border-top-left-radius: 0;}
.chat-text {
    display: block;
    font-size: 14px;
    text-align: left;
    word-wrap: break-word;
}
.chat-time {
    font-size: 0.8em;
    color: #888;
    margin-top: 5px;
    display: block;
    text-align: right;}
.chat-input {
    display: flex;
    padding: 15px;
    border-top: 1px solid #e0e0e0;
    background-color: #fff;}
.chat-input input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    outline: none;}
.chat-input button {
    background-color: #4dabf7;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-left: 10px;
    font-size: 14px;
    transition: background-color 0.3s ease;}
.chat-input button:hover {
    background-color: #3b8fd9;}
/* Typing indicator styles */
  .typing-indicator {
    font-size: 1.2em;
    color: #4dabf7;
    text-align: center;
    margin-top: 10px;
    font-weight: bold;
    animation: typing 1.5s infinite steps(5);}
/* Updated CSS for user/bot alignment */
.chat-message {
  margin-bottom: 15px;}
/* User message (right-aligned) */
.user-message {
  display: flex;
  justify-content: flex-end; /* Push to right */
  align-items: flex-start;
  margin-left: auto; /* Ensure it stays right */}
.user-message .avatar {
  order: 2; /* Avatar after message */
  margin-left: 10px; /* Space between message and avatar */
  margin-right: 0;}
.user-message .message-content {
  background-color: #4dabf7 !important;
  color: white;
  border-top-right-radius: 0 !important;
  order: 1; /* Message before avatar */}
/* Bot message (left-aligned) */
.bot-message {
  display: flex;
  justify-content: flex-start; /* Keep on left */
  align-items: flex-start;}
.bot-message .avatar {
  margin-right: 10px; /* Space between avatar and message */}
.bot-message .message-content {
  background-color: #e0e0e0 !important;
  color: #333;
  border-top-left-radius: 0 !important;}
/* Message content styling */
.message-content {
  max-width: 80%;
  padding: 12px;
  border-radius: 12px;
  position: relative;}
/* Time alignment */
.user-message .chat-time {
  text-align: right;}
.bot-message .chat-time {
  text-align: left;}
/* Add these animations */
.chat-scale-enter-active,
.chat-scale-leave-active {
  transition: all 0.3s ease;
  transform-origin: bottom left;}
.chat-scale-enter-from,
.chat-scale-leave-to {
  transform: scale(0.5) translateY(20px);
  opacity: 0;}
.chat-scale-enter-to,
.chat-scale-leave-from {
  transform: scale(1) translateY(0);
  opacity: 1;}
/* Add button click animation */
.chatbot-button:active {
  transform: scale(0.95);}
.chatbot-button {
  /* Add transition to existing button styles */
  transition: transform 0.2s ease;}
/* Enhanced message animations */
.chat-message {
  opacity: 0;
  transform: translateY(10px);
  animation: messageAppear 0.3s ease forwards;}
/* Add these animation styles */
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);}
.slide-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.55, 0.085, 0.68, 0.53);}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px) scale(0.95);
  opacity: 0;}
/* Chat overlay base styles with transform origin */
.chat-overlay {
  /* Existing styles */
  transform-origin: bottom left;}
/* Enhanced button animation */
.chatbot-button {
  /* Existing styles */
  transition: all 0.3s ease;}
.chatbot-button:hover {
  transform: scale(1.05) rotate(5deg);}
/* Message entry animation */
.chat-message {
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.3s ease;}
.chat-message.user-message {
  transform: translateX(20px);}
.chat-message-enter-active,
.chat-message-leave-active {
  transition: all 0.3s ease;}
.chat-message-enter-to {
  opacity: 1;
  transform: translateX(0);}
/* Add/modify these styles */
.typing-indicator {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;}
.dot {
  width: 6px;
  height: 6px;
  margin: 0 2px;
  background-color: #666;
  border-radius: 50%;
  animation: typing-dots 1.4s infinite ease-in-out;}
.dot:nth-child(2) {
  animation-delay: 0.2s;}
.dot:nth-child(3) {
  animation-delay: 0.4s;}
/* Ensure typing indicator matches bot message style */
.bot-message .message-content {
  background-color: #f1f1f1 !important;}
/* Add login modal styles */
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;}
.login-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;}
.login-form input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;}
.login-form button {
  margin: 5px;
  padding: 8px 15px;}
.login-prompt {
  text-align: center;
  padding: 20px;}
.logout-button {
  position: absolute;
  right: 60px;
  background: #ff4444;}

  @keyframes typing {
    0% {
      content: "....";
    }
    25% {
      content: "...";
    }
    50% {
      content: "..";
    }
    75% {
      content: ".";
    }
    100% {
      content: "....";
    }
  }
  
  /* Responsive Design */
  @media (max-width: 600px) {
    .chat-overlay {
      width: 90%;
      height: 400px;
    }
    .chatbot-button {
      width: 50px;
      height: 50px;
      font-size: 24px;
    }
  }

 

@keyframes messageAppear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}



@keyframes typing-dots {
  0%, 80%, 100% { 
    transform: translateY(0);
    opacity: 0.6;
  }
  40% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.message-content {
  /* Add these properties */
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.chat-text {
  /* Ensure text wraps properly */
  display: inline-block;
  max-width: 100%;
  word-break: break-word;
  white-space: normal;
}

/* Specifically for user messages */
.user-message .message-content {
  /* Add max-width to prevent overflow */
  max-width: 80%;
}

/* For bot messages */
.bot-message .message-content {
  /* Add max-width to prevent overflow */
  max-width: 80%;
}

.typing-time {
    font-size: 1.2em;
    color: #888;
    margin-left: 10px;
}

.header-buttons {
  display: flex;
  align-items: center;
}

.clear-button {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px; /* Space between Clear and Close button */
  padding: 8px;
  transition: opacity 0.3s ease;
}

.clear-button:hover {
  opacity: 0.8;
}

.chat-header button {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.chat-header button:hover {
  opacity: 0.8;
}

.chat-overlay {
  position: fixed;
  bottom: 80px;
  left: 20px;
  width: 550px; /* Increased width */
  max-width: 90%;
  height: 600px; /* Initial height */
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevents content from overflowing */
  resize: vertical; /* Allow vertical resizing */
  min-height: 400px; /* Optional: Set minimum height */
}

/* Move the resize handle to the top */
.resize-handle {
  height: 20px;
  background-color: #4dabf7;
  cursor: ns-resize;
  border-radius: 48px 48px 0 0; /* Round top corners */
  margin-bottom: auto; /* Push to the top */
}

body.dark-mode .resize-handle {
    height: 20px;
    background-color: #333;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #4dabf7;
  color: white;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.chat-content {
  padding: 15px;
  overflow-y: auto;
  scroll-behavior: smooth;
  flex-grow: 1;
  background-color: #f9f9f9;
}

body.dark-mode .chatbot-button {
    background-color: #2a2a2a;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}
body.dark-mode .chatbot-button:hover {
    background-color: #1f1f1f;
}

body.dark-mode .chat-overlay {
    background-color: #1e1e1e;
    border: 1px solid #444;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
}

body.dark-mode .chat-header {
    background-color: #333;
    color: #f1f1f1;
}
body.dark-mode .chat-header button {
    color: #f1f1f1;
}

body.dark-mode .chat-content {
    background-color: #2a2a2a;
    color: #e0e0e0;
}

body.dark-mode .user-message .message-content {
    background-color: #3a3a3a !important;
    color: #fff;
}
body.dark-mode .bot-message .message-content {
    background-color: #444 !important;
    color: #e0e0e0;
}

body.dark-mode .chat-input {
    background-color: #1e1e1e;
    border-top: 1px solid #444;
}
body.dark-mode .chat-input input {
    background-color: #333;
    border: 1px solid #444;
    color: #e0e0e0;
}
body.dark-mode .chat-input button {
    background-color: #333;
    color: #fff;
}
body.dark-mode .chat-input button:hover {
    background-color: #555;
}

body.dark-mode .login-modal {
    background: rgba(0, 0, 0, 0.7);
}
body.dark-mode .login-content {
    background: #2a2a2a;
    color: #e0e0e0;
}
body.dark-mode .login-form input {
    background: #333;
    border: 1px solid #444;
    color: #e0e0e0;
}
body.dark-mode .login-form button {
    background-color: #333;
    color: #fff;
}

body.dark-mode .clear-button {
    color: #f1f1f1;
}

  </style>