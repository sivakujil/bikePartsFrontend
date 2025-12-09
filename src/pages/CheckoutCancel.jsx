import React from "react";
import { Container, Typography, Box, Button, Paper } from "@mui/material";
import { Cancel, ShoppingCart, Refresh } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function CheckoutCancel() {
    const navigate = useNavigate();

    const handleReturnToCart = () => {
        navigate("/cart");
    };

    const handleTryAgain = () => {
        navigate("/checkout");
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4, textAlign: "center" }}>
                <Cancel 
                    sx={{ 
                        fontSize: 64, 
                        color: "error.main", 
                        mb: 2 
                    }} 
                />
                
                <Typography variant="h4" gutterBottom color="error.main">
                    Payment Cancelled
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Your payment was cancelled. No charges were made to your account.
                </Typography>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        What would you like to do?
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300, mx: 'auto' }}>
                        <Button 
                            variant="contained" 
                            startIcon={<Refresh />}
                            onClick={handleTryAgain}
                            fullWidth
                        >
                            Try Payment Again
                        </Button>
                        
                        <Button 
                            variant="outlined" 
                            startIcon={<ShoppingCart />}
                            onClick={handleReturnToCart}
                            fullWidth
                        >
                            Review Cart
                        </Button>
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary">
                    If you encountered any issues during payment, please try again or contact our support team.
                </Typography>
            </Paper>
        </Container>
    );
}
