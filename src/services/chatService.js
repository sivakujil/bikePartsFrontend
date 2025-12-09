import { io } from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  // Initialize socket connection
  connect(token) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    // Replace with your backend socket URL
    this.socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Join admin room
  joinAdminRoom() {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_admin_room');
    }
  }

  // Join customer chat room
  joinCustomerRoom(customerId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_customer_room', { customerId });
    }
  }

  // Leave customer chat room
  leaveCustomerRoom(customerId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_customer_room', { customerId });
    }
  }

  // Send message
  sendMessage(messageData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', messageData);
    }
  }

  // Mark message as read
  markAsRead(messageId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('mark_as_read', { messageId });
    }
  }

  // Typing indicators
  startTyping(customerId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_start', { customerId });
    }
  }

  stopTyping(customerId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_stop', { customerId });
    }
  }

  // Event listeners
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onMessageRead(callback) {
    if (this.socket) {
      this.socket.on('message_read', callback);
    }
  }

  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on('user_online', callback);
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on('user_offline', callback);
    }
  }

  onTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onUserList(callback) {
    if (this.socket) {
      this.socket.on('user_list', callback);
    }
  }

  // Remove event listeners
  offNewMessage(callback) {
    if (this.socket) {
      this.socket.off('new_message', callback);
    }
  }

  offMessageRead(callback) {
    if (this.socket) {
      this.socket.off('message_read', callback);
    }
  }

  offUserOnline(callback) {
    if (this.socket) {
      this.socket.off('user_online', callback);
    }
  }

  offUserOffline(callback) {
    if (this.socket) {
      this.socket.off('user_offline', callback);
    }
  }

  offTyping(callback) {
    if (this.socket) {
      this.socket.off('user_typing', callback);
    }
  }

  offUserList(callback) {
    if (this.socket) {
      this.socket.off('user_list', callback);
    }
  }

  // Get connection status
  isSocketConnected() {
    return this.isConnected;
  }
}

// Create singleton instance
const chatService = new ChatService();

export default chatService;
