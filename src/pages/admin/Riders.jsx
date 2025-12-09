import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  TextField,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  LinearProgress,
  Rating,
  Tabs,
  Tab,
  MenuItem,
} from "@mui/material";
import {
  Visibility,
  Edit,
  LocalShipping,
  Phone,
  Email,
  Person,
  Star,
  Assignment,
  Message,
  ToggleOn,
  ToggleOff,
  Add,
  Search,
} from "@mui/icons-material";
import api from "../../services/api";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`riders-tabpanel-${index}`}
      aria-labelledby={`riders-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Riders() {
  const [riders, setRiders] = useState([]);
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);
  const [profileDialog, setProfileDialog] = useState(false);
  const [messageDialog, setMessageDialog] = useState(false);
  const [addRiderDialog, setAddRiderDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [tabValue, setTabValue] = useState(0);

  // Add rider form state
  const [newRider, setNewRider] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    vehicleType: "",
    vehicleNumber: "",
    licenseNumber: ""
  });

  useEffect(() => {
    loadRiders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [riders, search]);

  const loadRiders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/riders");
      setRiders(response.data.filter(user => user.role === "rider"));
    } catch (error) {
      console.error("Failed to load riders:", error);
      setError("Failed to load riders. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...riders];
    
    if (search) {
      filtered = filtered.filter(rider =>
        rider.name?.toLowerCase().includes(search.toLowerCase()) ||
        rider.email?.toLowerCase().includes(search.toLowerCase()) ||
        rider.phone?.includes(search)
      );
    }

    setFilteredRiders(filtered);
  };

  const handleToggleOnlineStatus = async (riderId, isOnline) => {
    try {
      await api.put(`/admin/riders/${riderId}/status`, { isOnline });
      loadRiders();
    } catch (error) {
      console.error("Failed to update rider status:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedRider || !message.trim()) return;

    try {
      await api.post(`/admin/riders/${selectedRider._id}/message`, {
        message: message.trim(),
      });
      setMessage("");
      setMessageDialog(false);
      
      // Show success message (you could use a snackbar here)
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message");
    }
  };

  const getOnlineRidersCount = () => riders.filter(rider => rider.isOnline).length;
  const getAverageRating = () => {
    if (riders.length === 0) return 0;
    const sum = riders.reduce((acc, rider) => acc + (rider.rating || 0), 0);
    return (sum / riders.length).toFixed(1);
  };

  const getPerformanceStats = () => {
    const totalOrders = riders.reduce((acc, rider) => acc + (rider.assignedOrders?.length || 0), 0);
    const avgOrdersPerRider = riders.length > 0 ? Math.round(totalOrders / riders.length) : 0;

    return { totalOrders, avgOrdersPerRider };
  };

  const handleAddRider = async () => {
    try {
      await api.post("/admin/riders", {
        ...newRider,
        role: "rider"
      });

      // Reset form
      setNewRider({
        name: "",
        email: "",
        password: "",
        phone: "",
        vehicleType: "",
        vehicleNumber: "",
        licenseNumber: ""
      });

      setAddRiderDialog(false);
      loadRiders(); // Refresh the list

      alert("Rider added successfully!");
    } catch (error) {
      console.error("Failed to add rider:", error);
      alert("Failed to add rider. Please check the form and try again.");
    }
  };

  const handleNewRiderChange = (field, value) => {
    setNewRider(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Riders
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {error}
        </Typography>
        <Button variant="contained" onClick={loadRiders} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" mb={3}>Riders Management</Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="primary">
                    {riders.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Riders
                  </Typography>
                </Box>
                <Person color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="success.main">
                    {getOnlineRidersCount()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Online Now
                  </Typography>
                </Box>
                <ToggleOn color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {getAverageRating()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Avg Rating
                  </Typography>
                </Box>
                <Star color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="info.main">
                    {getPerformanceStats().totalOrders}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Orders
                  </Typography>
                </Box>
                <Assignment color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="All Riders" />
          <Tab label="Online" />
          <Tab label="Performance" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <TextField
              placeholder="Search riders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />
              }}
              sx={{ width: 300 }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddRiderDialog(true)}
            >
              Add Rider
            </Button>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rider</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned Orders</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRiders.map((rider) => (
                <TableRow key={rider._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2, bgcolor: rider.isOnline ? "success.main" : "grey.500" }}>
                        {rider.name?.charAt(0) || 'R'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {rider.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {rider._id.slice(-8)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" display="flex" alignItems="center">
                        <Phone sx={{ mr: 1, fontSize: 16 }} />
                        {rider.phone || "N/A"}
                      </Typography>
                      <Typography variant="body2" display="flex" alignItems="center" color="textSecondary">
                        <Email sx={{ mr: 1, fontSize: 16 }} />
                        {rider.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {rider.vehicleType || "N/A"}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {rider.vehicleNumber || "No plate"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Chip
                        size="small"
                        label={rider.isOnline ? "Online" : "Offline"}
                        color={rider.isOnline ? "success" : "default"}
                        sx={{ mr: 1 }}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={rider.isOnline}
                            onChange={(e) => handleToggleOnlineStatus(rider._id, e.target.checked)}
                            size="small"
                          />
                        }
                        label=""
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {rider.assignedOrders?.length || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Rating value={rider.rating || 0} readOnly size="small" precision={0.1} />
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        ({rider.rating || 0})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedRider(rider);
                        setProfileDialog(true);
                      }}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedRider(rider);
                        setMessageDialog(true);
                      }}
                    >
                      <Message />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {riders.filter(rider => rider.isOnline).map((rider) => (
            <Grid item xs={12} md={6} lg={4} key={rider._id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2, bgcolor: "success.main" }}>
                      {rider.name?.charAt(0) || 'R'}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="h6">{rider.name}</Typography>
                      <Chip
                        size="small"
                        label="Online"
                        color="success"
                        icon={<LocalShipping />}
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" mb={1}>
                    <Phone sx={{ mr: 1, fontSize: 16 }} />
                    {rider.phone || "N/A"}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary" mb={1}>
                    <LocalShipping sx={{ mr: 1, fontSize: 16 }} />
                    {rider.vehicleType} - {rider.vehicleNumber}
                  </Typography>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Typography variant="body2">
                      {rider.assignedOrders?.length || 0} orders
                    </Typography>
                    <Rating value={rider.rating || 0} readOnly size="small" />
                  </Box>
                  
                  <Box mt={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedRider(rider);
                        setMessageDialog(true);
                      }}
                      startIcon={<Message />}
                    >
                      Send Message
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>Top Performers</Typography>
                <List>
                  {riders
                    .sort((a, b) => (b.assignedOrders?.length || 0) - (a.assignedOrders?.length || 0))
                    .slice(0, 5)
                    .map((rider, index) => (
                      <React.Fragment key={rider._id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                              {index + 1}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={rider.name}
                            secondary={`${rider.assignedOrders?.length || 0} orders delivered`}
                          />
                          <Rating value={rider.rating || 0} readOnly size="small" />
                        </ListItem>
                        {index < 4 && <Divider />}
                      </React.Fragment>
                    ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>Performance Summary</Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    Average Orders per Rider
                  </Typography>
                  <Typography variant="h4">
                    {getPerformanceStats().avgOrdersPerRider}
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    Total Orders Delivered
                  </Typography>
                  <Typography variant="h4">
                    {getPerformanceStats().totalOrders}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Average Rating
                  </Typography>
                  <Typography variant="h4">
                    {getAverageRating()}/5.0
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Rider Profile Dialog */}
      <Dialog open={profileDialog} onClose={() => setProfileDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Rider Profile</DialogTitle>
        <DialogContent>
          {selectedRider && (
            <Box>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ mr: 2, width: 64, height: 64, bgcolor: "primary.main" }}>
                  {selectedRider.name?.charAt(0) || 'R'}
                </Avatar>
                <Box>
                  <Typography variant="h5">{selectedRider.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedRider.email}
                  </Typography>
                  <Chip
                    label={selectedRider.isOnline ? "Online" : "Offline"}
                    color={selectedRider.isOnline ? "success" : "default"}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" mb={2}>Contact Information</Typography>
                  <Typography variant="body2" mb={1}>
                    <Phone sx={{ mr: 1, fontSize: 16 }} />
                    {selectedRider.phone || "N/A"}
                  </Typography>
                  <Typography variant="body2" mb={1}>
                    <Email sx={{ mr: 1, fontSize: 16 }} />
                    {selectedRider.email}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" mb={2}>Vehicle Details</Typography>
                  <Typography variant="body2" mb={1}>
                    Type: {selectedRider.vehicleType || "N/A"}
                  </Typography>
                  <Typography variant="body2" mb={1}>
                    Plate: {selectedRider.vehicleNumber || "N/A"}
                  </Typography>
                  <Typography variant="body2" mb={1}>
                    License: {selectedRider.licenseNumber || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" mb={2}>Performance</Typography>
                  <Typography variant="body2" mb={1}>
                    Assigned Orders: {selectedRider.assignedOrders?.length || 0}
                  </Typography>
                  <Typography variant="body2" mb={1}>
                    Rating: <Rating value={selectedRider.rating || 0} readOnly size="small" />
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" mb={2}>Account Status</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={selectedRider.isOnline}
                        onChange={(e) => handleToggleOnlineStatus(selectedRider._id, e.target.checked)}
                      />
                    }
                    label="Online Status"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialog(false)}>Close</Button>
          <Button variant="contained" onClick={() => setProfileDialog(false)}>
            Edit Profile
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialog} onClose={() => setMessageDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Message to Rider</DialogTitle>
        <DialogContent>
          {selectedRider && (
            <Box>
              <Typography variant="body2" color="textSecondary" mb={2}>
                Send message to: <strong>{selectedRider.name}</strong>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Rider Dialog */}
      <Dialog open={addRiderDialog} onClose={() => setAddRiderDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Rider</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={newRider.name}
                onChange={(e) => handleNewRiderChange("name", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newRider.email}
                onChange={(e) => handleNewRiderChange("email", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={newRider.password}
                onChange={(e) => handleNewRiderChange("password", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={newRider.phone}
                onChange={(e) => handleNewRiderChange("phone", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Vehicle Type"
                value={newRider.vehicleType}
                onChange={(e) => handleNewRiderChange("vehicleType", e.target.value)}
                required
              >
                <MenuItem value="motorcycle">Motorcycle</MenuItem>
                <MenuItem value="scooter">Scooter</MenuItem>
                <MenuItem value="bicycle">Bicycle</MenuItem>
                <MenuItem value="car">Car</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vehicle Number/Plate"
                value={newRider.vehicleNumber}
                onChange={(e) => handleNewRiderChange("vehicleNumber", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="License Number"
                value={newRider.licenseNumber}
                onChange={(e) => handleNewRiderChange("licenseNumber", e.target.value)}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddRiderDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddRider}
            disabled={!newRider.name || !newRider.email || !newRider.password || !newRider.phone || !newRider.vehicleType || !newRider.vehicleNumber || !newRider.licenseNumber}
          >
            Add Rider
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
