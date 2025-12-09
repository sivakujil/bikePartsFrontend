import React, { useState, useContext } from "react";
import {
  AppBar, Toolbar, IconButton, Typography, Badge, Button,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box,
  Menu, MenuItem, InputBase, useTheme, Tooltip, Divider, Avatar
} from "@mui/material";
import { styled, alpha } from '@mui/material/styles';

import {
  Menu as MenuIcon,
  Home as HomeIcon,
  TwoWheeler as ProductsIcon, // Changed icon for better context
  LocalShipping as OrdersIcon, // Changed icon for better context
  SupportAgent as ChatIcon, // Changed icon for better context
  ShoppingCart as ShoppingCartIcon,
  Person as AccountCircle,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  AppRegistration as RegisterIcon,
  ChevronRight
} from "@mui/icons-material";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

// === STYLED COMPONENTS === //

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: alpha('#0F0F11', 0.85), // Deep dark transparent bg
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
}));

const BrandText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  letterSpacing: '1px',
  background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  '& span': { // The Accent part
    background: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)', // Hot Orange/Red Gradient
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }
}));

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  backgroundColor: alpha('#fff', 0.05),
  border: '1px solid rgba(255,255,255,0.1)',
  transition: 'all 0.3s ease',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: alpha('#fff', 0.1),
    borderColor: 'rgba(255,255,255,0.2)',
  },
  '&:focus-within': {
    width: '100%',
    backgroundColor: alpha('#000', 0.4),
    borderColor: '#FF4B2B', // Accent Color
    boxShadow: '0 0 0 4px rgba(255, 75, 43, 0.1)',
    [theme.breakpoints.up('sm')]: {
      width: '400px',
    }
  },
  [theme.breakpoints.up('sm')]: {
    width: '280px',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#fff',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1.5, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    fontSize: '0.95rem',
    width: '100%',
  },
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  color: active ? '#fff' : '#a1a1aa',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.95rem',
  margin: '0 4px',
  position: 'relative',
  '&:hover': {
    color: '#fff',
    backgroundColor: 'transparent',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 6,
    left: '50%',
    transform: active ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
    width: '20px',
    height: '3px',
    borderRadius: '2px',
    backgroundColor: '#FF4B2B',
    transition: 'transform 0.3s ease',
  },
  '&:hover::after': {
    transform: 'translateX(-50%) scaleX(1)',
    width: '100%', // Expands on hover
  }
}));

// === MAIN NAVBAR COMPONENT === //

export default function Navbar({ onSearch }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [query, setQuery] = useState("");

  const { cartCount } = useCart();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const AccentColor = '#FF4B2B'; // Premium Automotive Orange/Red
  const isUserAdminOrVendor = user && (user.role === "admin" || user.role === "vendor");

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const navLinks = [
    { text: "Home", path: "/", icon: <HomeIcon /> },
    { text: "Products", path: "/products", icon: <ProductsIcon /> },
    { text: "Orders", path: "/orders", icon: <OrdersIcon /> },
    { text: "Chat", path: "/chat", icon: <ChatIcon /> },
    { text: "Rider", path: "/rider", icon: <HomeIcon /> },
  ];

  return (
    <>
      <GlassAppBar position="sticky" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between", height: '80px', px: { xs: 1, md: 4 } }}>
          
          {/* LEFT: Logo & Mobile Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton 
              onClick={() => setDrawerOpen(true)} 
              sx={{ 
                color: "#fff", 
                display: { md: 'none' },
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px'
              }}
            >
              <MenuIcon />
            </IconButton>

            <Link to="/" style={{ textDecoration: 'none' }}>
              <Box component="img" src="/logo.png" alt="Bike Parts Logo" sx={{ height: '50px', width: 'auto' }} />
            </Link>
          </Box>

          {/* MIDDLE: Desktop Nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navLinks.map((item) => (
              <NavButton 
                key={item.text} 
                component={Link} 
                to={item.path}
                active={location.pathname === item.path ? 1 : 0}
              >
                {item.text}
              </NavButton>
            ))}
          </Box>

          {/* RIGHT: Search & Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            
            {/* Search Bar */}
            <Box component="form" onSubmit={handleSearch} sx={{ display: { xs: 'none', md: 'block' } }}>
              <SearchContainer>
                <Box sx={{ position: 'absolute', left: 12, color: '#71717a', display: 'flex' }}>
                  <SearchIcon fontSize="small" />
                </Box>
                <StyledInputBase
                  placeholder="Search parts..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </SearchContainer>
            </Box>
             
             {/* Mobile Search Icon */}
            <IconButton 
                onClick={() => onSearch && onSearch(query)} 
                sx={{ color: "#fff", display: { xs: 'flex', md: 'none' } }}
            >
              <SearchIcon />
            </IconButton>

            {/* Cart */}
            <Tooltip title="View Cart">
              <IconButton component={Link} to="/cart" sx={{ color: "#fff", transition: 'transform 0.2s', '&:hover':{ transform: 'scale(1.1)'} }}>
                <Badge 
                  badgeContent={cartCount} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: AccentColor,
                      fontWeight: 'bold'
                    }
                  }}
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User Profile / Auth */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {user ? (
                <>
                  <IconButton 
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{ 
                      p: 0, 
                      border: `2px solid ${AccentColor}`,
                      transition: 'box-shadow 0.2s',
                      '&:hover': { boxShadow: `0 0 10px ${AccentColor}` }
                    }}
                  >
                    <Avatar 
                      sx={{ width: 35, height: 35, bgcolor: '#18181b', color: AccentColor, fontSize: '0.9rem', fontWeight: 'bold' }}
                    >
                      {user.name ? user.name[0].toUpperCase() : <AccountCircle />}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        bgcolor: '#18181b',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        minWidth: 180
                      }
                    }}
                  >
                    <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }}>Profile</MenuItem>
                    <MenuItem onClick={() => { setAnchorEl(null); navigate('/orders'); }}>My Orders</MenuItem>
                    {isUserAdminOrVendor && (
                      <MenuItem onClick={() => { setAnchorEl(null); navigate('/admin'); }}>Dashboard</MenuItem>
                    )}
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                    <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
                      <ListItemIcon sx={{ color: 'inherit', minWidth: 30 }}><LogoutIcon fontSize="small" /></ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
                  <Button 
                    component={Link} 
                    to="/login" 
                    sx={{ color: '#fff', '&:hover': { color: AccentColor } }}
                  >
                    Login
                  </Button>
                  <Button 
                    component={Link} 
                    to="/register" 
                    variant="contained"
                    sx={{ 
                      bgcolor: AccentColor, 
                      fontWeight: 'bold',
                      boxShadow: '0 4px 15px rgba(255, 75, 43, 0.4)',
                      '&:hover': { bgcolor: '#ff3300' }
                    }}
                  >
                    Join
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Toolbar>
      </GlassAppBar>

      {/* === MOBILE DRAWER === */}
      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, bgcolor: '#0F0F11', borderRight: '1px solid rgba(255,255,255,0.1)' }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', color: '#fff' }}>
          
          {/* Drawer Header */}
          <Box sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, #1c1c1e 0%, #0F0F11 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <Box component="img" src="/logo.png" alt="Bike Parts Logo" sx={{ height: '40px', width: 'auto' }} />
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>
              Premium Motorcycle Parts
            </Typography>
          </Box>

          <List sx={{ flexGrow: 1, px: 2, py: 2 }}>
            {navLinks.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  component={Link} 
                  to={item.path} 
                  onClick={() => setDrawerOpen(false)}
                  sx={{ 
                    borderRadius: '8px',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                  }}
                >
                  <ListItemIcon sx={{ color: AccentColor, minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
                  <ChevronRight sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 18 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 2 }} />

          <Box sx={{ p: 2 }}>
            {user ? (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ 
                  borderColor: 'rgba(239, 68, 68, 0.5)', 
                  color: '#ef4444',
                  justifyContent: 'flex-start',
                  '&:hover': { borderColor: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)' }
                }}
              >
                Logout
              </Button>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                 <Button
                  fullWidth
                  component={Link} 
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', justifyContent: 'flex-start' }}
                  variant="outlined"
                >
                  Log In
                </Button>
                <Button
                  fullWidth
                  component={Link} 
                  to="/register"
                  startIcon={<RegisterIcon />}
                  sx={{ bgcolor: AccentColor, color: '#fff', justifyContent: 'flex-start', '&:hover': { bgcolor: '#ff3300' } }}
                  variant="contained"
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}