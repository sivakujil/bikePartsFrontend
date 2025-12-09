import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Select,
  MenuItem,
  Box,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Button,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import api from "../../services/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  const load = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Load orders failed", err);
    }
  };

  useEffect(() => { load(); }, []);

  const changeStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      load();
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update status");
    }
  };

  const toggleRowExpansion = (orderId) => {
    setExpandedRows(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "warning";
      case "Processing": return "info";
      case "Shipped": return "primary";
      case "Delivered": return "success";
      case "Cancelled": return "error";
      default: return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>Manage Orders</Typography>
      <Paper sx={{ overflow: "auto" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell></TableCell>
              <TableCell fontWeight="bold">Order ID</TableCell>
              <TableCell fontWeight="bold">Customer</TableCell>
              <TableCell fontWeight="bold">Date</TableCell>
              <TableCell fontWeight="bold">Total</TableCell>
              <TableCell fontWeight="bold">Items</TableCell>
              <TableCell fontWeight="bold">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <React.Fragment key={o._id}>
                <TableRow hover>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleRowExpansion(o._id)}
                    >
                      {expandedRows[o._id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {o._id.slice(-8)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {o.user_id?.name || o.user_id?.email || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(o.createdAt || o.date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      Rs {o.totalAmount?.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {o.items?.length || 0} items
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={o.status || "Pending"}
                      onChange={(e) => changeStatus(o._id, e.target.value)}
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 0 }}>
                    <Collapse in={expandedRows[o._id]} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" mb={1}>Order Items</Typography>
                        {o.items?.map((it, i) => (
                          <Box key={i} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="body2">
                              • {it.product_id?.name || it.productName || "Unknown Product"}
                            </Typography>
                            <Typography variant="body2">
                              x{it.quantity} @ Rs {it.price?.toFixed(2) || "N/A"}
                            </Typography>
                          </Box>
                        ))}
                        {o.shippingAddress && (
                          <Box mt={2}>
                            <Typography variant="subtitle2" mb={1}>Shipping Address</Typography>
                            <Typography variant="body2">
                              {o.shippingAddress.street}, {o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.zipCode}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
