import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard,
  Inventory2,
  Assignment,
  People,
  DeliveryDining,
  Warning,
  Assessment,
  Settings,
  Menu as MenuIcon,
  Chat,
} from "@mui/icons-material";
import { NavLink, Outlet } from "react-router-dom";


const drawerWidth = 220;

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: <Dashboard /> },
  { name: "Orders", path: "/admin/orders", icon: <Assignment /> },
  { name: "Products", path: "/admin/products", icon: <Inventory2 /> },
  { name: "Users", path: "/admin/users", icon: <People /> },
  { name: "Chat", path: "/admin/chat", icon: <Chat /> },
  { name: "Riders", path: "/admin/riders", icon: <DeliveryDining /> },
  { name: "Reports", path: "/admin/reports", icon: <Assessment /> },
  { name: "Profile", path: "/admin/profile", icon: <Settings /> },
];

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: "#111" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit" edge="start">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">BikeParts Admin</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2">Admin</Typography>
            <Avatar sx={{ bgcolor: "primary.main" }}>A</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#1f2937",
            color: "#fff",
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.name}
              component={NavLink}
              to={item.path}
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#374151" : "inherit",
                color: isActive ? "#f59e0b" : "#fff",
              })}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: `${drawerWidth}px`,
          mt: "64px", // AppBar height
          minHeight: "100vh",
          bgcolor: "#f4f4f4",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
