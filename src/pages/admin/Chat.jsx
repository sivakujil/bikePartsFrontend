import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  InputAdornment,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Fab,
  Drawer,
} from '@mui/material';
import {
  Search,
  Send,
  AttachFile,
  Phone,
  Email,
  ShoppingBasket,
  Circle,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import chatService from '../../services/chatService';

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    lastMessage: 'When will my order arrive?',
    timestamp: '2 min ago',
    unread: 2,
    online: true,
    phone: '+1 234-567-8900',
    email: 'john.doe@email.com',
    orderId: 'ORD-2024-001',
    avatar: 'JD'
  },
  {
    id: 2,
    name: 'Sarah Smith',
    lastMessage: 'Thank you for quick delivery!',
    timestamp: '15 min ago',
    unread: 0,
    online: true,
    phone: '+1 234-567-8901',
    email: 'sarah.smith@email.com',
    orderId: 'ORD-2024-002',
    avatar: 'SS'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    lastMessage: 'Is the brake pad compatible with my model?',
    timestamp: '1 hour ago',
    unread: 1,
    online: false,
    phone: '+1 234-567-8902',
    email: 'mike.j@email.com',
    orderId: 'ORD-2024-003',
    avatar: 'MJ'
  },
  {
    id: 4,
    name: 'Emma Wilson',
    lastMessage: 'Can I return this item?',
    timestamp: '2 hours ago',
    unread: 0,
    online: false,
    phone: '+1 234-567-8903',
    email: 'emma.w@email.com',
    orderId: 'ORD-2024-004',
    avatar: 'EW'
  },
];

const mockMessages = [
  {
    id: 1,
    text: 'Hi, I need help with my order',
    sender: 'customer',
    timestamp: '10:30 AM',
    status: 'read'
  },
  {
    id: 2,
    text: 'Hello! I\'d be happy to help you. What seems to be the issue?',
    sender: 'admin',
    timestamp: '10:32 AM',
    status: 'read'
  },
  {
    id: 3,
    text: 'When will my order arrive?',
    sender: 'customer',
    timestamp: '10:33 AM',
    status: 'read'
  },
  {
    id: 4,
    text: 'Let me check your order status. Your order ORD-2024-001 is scheduled for delivery tomorrow.',
    sender: 'admin',
    timestamp: '10:35 AM',
    status: 'read'
  },
  {
    id: 5,
    text: 'Great! Thank you for the quick response',
    sender: 'customer',
    timestamp: '10:36 AM',
    status: 'delivered'
  },
];

export default function AdminChat() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, token } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (token && user?.role === 'admin') {
      const socket = chatService.connect(token);
      
      socket.on('connect', () => {
        setIsConnected(true);
        chatService.joinAdminRoom();
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      // Listen for new messages
      chatService.onNewMessage((message) => {
        if (selectedUser && message.customerId === selectedUser.id) {
          setMessages(prev => [...prev, message]);
        }
        
        // Update user list with last message
        setUsers(prev => prev.map(u => 
          u.id === message.customerId 
            ? { ...u, lastMessage: message.text, timestamp: 'Just now', unread: u.id === selectedUser?.id ? 0 : (u.unread || 0) + 1 }
            : u
        ));
      });

      // Listen for user list updates
      chatService.onUserList((userList) => {
        setUsers(userList.map(u => ({
          id: u.userId,
          name: u.name,
          lastMessage: u.lastMessage || 'No messages yet',
          timestamp: u.lastMessageTime ? 'Recently' : 'Never',
          unread: 0,
          online: u.online,
          phone: u.phone || '+1 234-567-8900',
          email: u.email,
          orderId: u.orderId || 'ORD-2024-000',
          avatar: u.avatar || u.name.substring(0, 2).toUpperCase()
        })));
      });

      // Listen for user online/offline status
      chatService.onUserOnline(({ userId }) => {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, online: true } : u
        ));
      });

      chatService.onUserOffline(({ userId }) => {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, online: false } : u
        ));
      });

      // Listen for typing indicators
      chatService.onTyping(({ userId, isTyping }) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (isTyping) {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });
      });

      return () => {
        chatService.disconnect();
      };
    }
  }, [token, user, selectedUser]);

  // Join customer room when user is selected
  useEffect(() => {
    if (selectedUser && isConnected) {
      chatService.joinCustomerRoom(selectedUser.id);
      return () => {
        chatService.leaveCustomerRoom(selectedUser.id);
      };
    }
  }, [selectedUser, isConnected]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load initial mock data if no real users
  useEffect(() => {
    if (users.length === 0 && !isConnected) {
      setUsers(mockUsers);
      setSelectedUser(mockUsers[0]);
      setMessages(mockMessages);
    }
  }, [users.length, isConnected]);

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedUser) return;

    const messageData = {
      text: inputMessage,
      customerId: selectedUser.id,
      senderRole: 'admin'
    };

    if (isConnected) {
      chatService.sendMessage(messageData);
    } else {
      // Fallback to local state for demo
      const newMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: 'admin',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      };

      setMessages(prev => [...prev, newMessage]);
      setUsers(prev => prev.map(user =>
        user.id === selectedUser.id
          ? { ...user, lastMessage: inputMessage, timestamp: 'Just now' }
          : user
      ));
    }

    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    // Handle typing indicators
    if (selectedUser && isConnected) {
      chatService.startTyping(selectedUser.id);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        chatService.stopTyping(selectedUser.id);
      }, 1000);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
    // Clear unread count
    setUsers(users.map(u =>
      u.id === user.id ? { ...u, unread: 0 } : u
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return '#9CA3AF';
      case 'delivered': return '#3B82F6';
      case 'read': return '#10B981';
      default: return '#9CA3AF';
    }
  };

  const UserList = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Search Bar */}
      <Box sx={{ p: 2, borderBottom: '1px solid #E5E7EB' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#9CA3AF' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: '#F9FAFB',
            }
          }}
        />
      </Box>

      {/* User List */}
      <List sx={{ flex: 1, overflow: 'auto', py: 0 }}>
        {filteredUsers.map((user, index) => (
          <React.Fragment key={user.id}>
            <ListItem
              button
              selected={selectedUser?.id === user.id}
              onClick={() => handleUserSelect(user)}
              sx={{
                px: 2,
                py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: '#EFF6FF',
                  borderLeft: '3px solid #3B82F6',
                },
                '&:hover': {
                  backgroundColor: '#F9FAFB',
                }
              }}
            >
              <ListItemAvatar>
                <Box sx={{ position: 'relative' }}>
                  <Avatar sx={{ bgcolor: '#3B82F6' }}>
                    {user.avatar}
                  </Avatar>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      backgroundColor: user.online ? '#10B981' : '#9CA3AF',
                      border: '2px solid white'
                    }}
                  />
                </Box>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.timestamp}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '150px'
                      }}
                    >
                      {user.lastMessage}
                    </Typography>
                    {typingUsers.has(user.id) && (
                      <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                        typing...
                      </Typography>
                    )}
                    {user.unread > 0 && (
                      <Badge
                        badgeContent={user.unread}
                        color="primary"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '10px',
                            height: '18px',
                            minWidth: '18px',
                          }
                        }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItem>
            {index < filteredUsers.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  const ChatWindow = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      {selectedUser && (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'white',
            borderBottom: '1px solid #E5E7EB'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton onClick={() => setMobileDrawerOpen(true)} sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Avatar sx={{ bgcolor: '#3B82F6', mr: 2 }}>
              {selectedUser.avatar}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {selectedUser.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Circle sx={{ fontSize: 8, color: selectedUser.online ? '#10B981' : '#9CA3AF' }} />
                <Typography variant="body2" color="text.secondary">
                  {selectedUser.online ? 'Online' : 'Offline'} {isConnected ? '(Connected)' : '(Demo Mode)'}
                </Typography>
                {typingUsers.has(selectedUser.id) && (
                  <Typography variant="body2" color="primary">
                    typing...
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={<Phone sx={{ fontSize: 16 }} />}
              label={selectedUser.phone}
              variant="outlined"
              size="small"
              sx={{ fontSize: '11px' }}
            />
            <Chip
              icon={<Email sx={{ fontSize: 16 }} />}
              label={selectedUser.email}
              variant="outlined"
              size="small"
              sx={{ fontSize: '11px' }}
            />
            <Button
              variant="contained"
              startIcon={<ShoppingBasket />}
              size="small"
              sx={{ ml: 1, borderRadius: '20px' }}
            >
              {selectedUser.orderId}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Messages Area */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#F9FAFB' }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'admin' ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            <Box sx={{ maxWidth: '70%' }}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: message.sender === 'admin' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  backgroundColor: message.sender === 'admin' ? '#3B82F6' : 'white',
                  color: message.sender === 'admin' ? 'white' : 'black',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="body1">
                  {message.text}
                </Typography>
              </Paper>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 0.5, px: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {message.timestamp}
                </Typography>
                {message.sender === 'admin' && (
                  <Typography
                    variant="caption"
                    sx={{ ml: 1, color: getStatusColor(message.status) }}
                  >
                    {message.status === 'sent' && '✓'}
                    {message.status === 'delivered' && '✓✓'}
                    {message.status === 'read' && (
                      <Box component="span" sx={{ color: '#10B981' }}>✓✓</Box>
                    )}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          bgcolor: 'white',
          borderTop: '1px solid #E5E7EB'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <IconButton sx={{ color: '#6B7280' }}>
            <AttachFile />
          </IconButton>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            disabled={!selectedUser}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                backgroundColor: '#F9FAFB',
              }
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            sx={{
              bgcolor: '#3B82F6',
              color: 'white',
              '&:hover': {
                bgcolor: '#2563EB',
              }
            }}
          >
            <Send />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );

  if (!selectedUser) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Select a user to start chatting
        </Typography>
      </Box>
    );
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <Box sx={{ height: '100vh', bgcolor: 'white' }}>
        <Drawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: '80%',
              maxWidth: '300px',
            }
          }}
        >
          <UserList />
        </Drawer>
        <ChatWindow />
      </Box>
    );
  }

  // Desktop Layout
  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex' }}>
      {/* Left Panel - User List */}
      <Box sx={{ width: '350px', borderRight: '1px solid #E5E7EB', bgcolor: 'white' }}>
        <UserList />
      </Box>

      {/* Right Panel - Chat Window */}
      <Box sx={{ flex: 1 }}>
        <ChatWindow />
      </Box>
    </Box>
  );
}
