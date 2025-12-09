// // import React from "react";
// // import { Box, Typography, Button, Grid } from "@mui/material";

// // export default function HeroBanner() {
// //   return (
// //     <Box sx={{ bgcolor: "transparent", mb: 4 }}>
// //       <Grid container alignItems="center" sx={{
// //         borderRadius: 2,
// //         overflow: "hidden",
// //         boxShadow: 3
// //       }}>
// //         {/* Left text column */}
// //         <Grid item xs={12} md={6} sx={{
// //           p: { xs: 4, md: 8 },
// //           background: "linear-gradient(90deg,#ff6a00 0%, #e63900 100%)",
// //           color: "#fff",
// //           display: "flex",
// //           flexDirection: "column",
// //           justifyContent: "center",
// //           gap: 2
// //         }}>
// //           <Typography variant="h5" sx={{ fontWeight: 700 }}>Original Bike Parts</Typography>
// //           <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.05 }}>
// //             Delivered Fast
// //           </Typography>
// //           <Typography variant="body1" sx={{ mt: 2, maxWidth: 600 }}>
// //             Get genuine motorcycle parts delivered to your doorstep. Quality guaranteed, fast shipping, and competitive prices.
// //           </Typography>

// //           <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
// //             <Button variant="contained" color="secondary" sx={{ bgcolor: "#fff", color: "#e63900", fontWeight: 700 }}>
// //               Shop Now
// //             </Button>
// //             <Button variant="outlined" sx={{ borderColor: "rgba(255,255,255,0.6)", color: "#fff" }}>
// //               Collections
// //             </Button>
// //           </Box>

// //           <Box sx={{ display: "flex", gap: 6, mt: 6 }}>
// //             <Box>
// //               <Typography variant="h6" sx={{ fontWeight: 700 }}>100% Original</Typography>
// //               <Typography variant="caption">Genuine Parts</Typography>
// //             </Box>
// //             <Box>
// //               <Typography variant="h6" sx={{ fontWeight: 700 }}>Fast Delivery</Typography>
// //               <Typography variant="caption">2-3 Days</Typography>
// //             </Box>
// //             <Box>
// //               <Typography variant="h6" sx={{ fontWeight: 700 }}>Expert Support</Typography>
// //               <Typography variant="caption">24/7 Available</Typography>
// //             </Box>
// //           </Box>
// //         </Grid>

// //         {/* Right image column */}
// //         <Grid item xs={12} md={6} sx={{
// //           display: "flex",
// //           alignItems: "center",
// //           justifyContent: "center",
// //           bgcolor: "#fff",
// //           p: { xs: 3, md: 6 }
// //         }}>
// //           <Box component="img"
// //                src="https://bikeparts.lk/files/mainbanners/photo/6bdd4579-90b2-489e-82ed-a02ab96c7aae/large_BikeParts-5.jpg"
// //                alt="hero"
// //                sx={{ width: { xs: "150%", md: "150%" }, borderRadius: 3, boxShadow: 5 }}
// //           />
// //         </Grid>
// //       </Grid>
// //     </Box>
// //   );
// // }





// import React from "react";
// import { Box, Typography, Button, Grid, useTheme } from "@mui/material";
// import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

// export default function HeroBanner() {
//   const theme = useTheme(); // Access the MUI theme for color consistency

//   // Modern Color Palette (Deep Blue/Grey with Orange Accent)
//   const ModernDarkBg = '#1c1c1c'; // Deep dark background
//   const ModernAccent = theme.palette.error.main || '#ff4b00'; // Using the theme's error/red for a striking orange/red accent

//   return (
//     <Box 
//       sx={{ 
//         mb: 6, // Increased bottom margin for better separation from content below
//       }}
//     >
//       <Grid 
//         container 
//         alignItems="stretch" // Ensure both columns are the same height
//         sx={{
//           borderRadius: 3, // Slightly larger border radius for a softer look
//           overflow: "hidden",
//           boxShadow: `0 20px 50px rgba(0, 0, 0, 0.25)`, // Softer, more dispersed shadow
//           minHeight: { xs: 'auto', md: 500 }, // Define a minimum height
//         }}
//       >
//         {/* Left text column - Deep Modern Background */}
//         <Grid 
//           item 
//           xs={12} 
//           md={6} 
//           sx={{
//             p: { xs: 5, md: 8, lg: 10 },
//             background: ModernDarkBg, 
//             color: "#fff",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between", // Pushes footer stats to the bottom
//             gap: 2,
//             position: 'relative',
//           }}
//         >
//           {/* Main Content */}
//           <Box>
//             <Typography 
//               variant="subtitle1" 
//               sx={{ fontWeight: 600, color: ModernAccent, textTransform: 'uppercase', mb: 1 }}
//             >
//               The Next-Gen Ride
//             </Typography>
//             <Typography 
//               variant="h2" // Larger headline for maximum impact
//               sx={{ 
//                 fontWeight: 900, 
//                 lineHeight: 1.1, 
//                 letterSpacing: '-1px', // Tighter kerning for modern feel
//                 mb: 2 
//               }}
//             >
//               Original Bike Parts. <Box component="span" sx={{ color: ModernAccent }}>Delivered Fast.</Box>
//             </Typography>
//             <Typography variant="body1" sx={{ mt: 2, maxWidth: 500, color: 'rgba(255,255,255,0.75)' }}>
//               Get genuine motorcycle parts and premium accessories delivered to your doorstep. Quality guaranteed, fast shipping, and expert support.
//             </Typography>
//           </Box>

//           {/* Buttons */}
//           <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
//             <Button 
//               variant="contained" 
//               endIcon={<ArrowRightAltIcon />}
//               sx={{ 
//                 bgcolor: ModernAccent, 
//                 color: "#fff", 
//                 fontWeight: 700,
//                 py: 1.5, // Taller button
//                 px: 3,
//                 '&:hover': {
//                   bgcolor: '#ff6600', // Subtle hover change
//                 }
//               }}
//             >
//               Shop All Parts
//             </Button>
//             <Button 
//               variant="outlined" 
//               sx={{ 
//                 borderColor: 'rgba(255,255,255,0.3)', 
//                 color: "#fff",
//                 py: 1.5,
//               }}
//             >
//               Collections
//             </Button>
//           </Box>

//           {/* Stats/Value Props - Cleaner Look */}
//           <Box sx={{ display: "flex", gap: { xs: 3, sm: 6 }, mt: 6, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
//             <Box>
//               <Typography variant="h5" sx={{ fontWeight: 800, color: ModernAccent }}>100%</Typography>
//               <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Genuine</Typography>
//             </Box>
//             <Box>
//               <Typography variant="h5" sx={{ fontWeight: 800, color: ModernAccent }}>48H</Typography>
//               <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Delivery</Typography>
//             </Box>
//             <Box>
//               <Typography variant="h5" sx={{ fontWeight: 800, color: ModernAccent }}>24/7</Typography>
//               <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Support</Typography>
//             </Box>
//           </Box>
//         </Grid>

//         {/* Right image column - Focus on Visuals */}
//         <Grid 
//           item 
//           xs={12} 
//           md={6} 
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "flex-end", // Push image to the right edge
//             bgcolor: '#0f0f0f', // Very dark or black background for visual contrast
//             position: 'relative',
//             overflow: 'hidden',
//           }}
//         >
//           <Box 
//             component="img"
//             src="https://bikeparts.lk/files/mainbanners/photo/6bdd4579-90b2-489e-82ed-a02ab96c7aae/large_BikeParts-5.jpg"
//             alt="Motorcycle Parts Display"
//             sx={{ 
//               width: "100%", 
//               height: '100%',
//               objectFit: 'cover', // Ensures image covers the space without distortion
//               transform: 'scale(1.2)', // Slightly zoom in the image for drama
//               opacity: 0.85, // Subtle darkening overlay
//               filter: 'brightness(0.85)',
//               display: { xs: 'none', md: 'block' } // Hide image on small screens if necessary
//             }}
//           />
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }


import React from "react";
import { Box, Typography, Button, Grid, useTheme } from "@mui/material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

export default function HeroBanner() {
  const theme = useTheme();

  // COLOUR CONFIGURATION: Yellow & Black
  const PrimaryGradient = 'linear-gradient(135deg, #FFD700 0%, #FFAA00 100%)'; // Gold to Orange-Gold
  const AccentColor = '#FFD700'; // Bright Yellow/Gold
  const DarkBg = '#050505'; // Almost pure black

  return (
    <Box 
      sx={{ 
        mb: 6,
      }}
    >
      <Grid 
        container 
        alignItems="stretch"
        sx={{
          borderRadius: 6,
          overflow: "hidden",
          // Changed shadow from blue to yellow glow
          boxShadow: `0 25px 80px rgba(255, 215, 0, 0.15)`, 
          minHeight: { xs: 'auto', md: 550 },
          background: DarkBg,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // Changed radial gradient from blue to faint yellow
            background: 'radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 50%)',
            pointerEvents: 'none',
          }
        }}
      >
        {/* Left text column */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{
            p: { xs: 4, md: 7, lg: 9 },
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 2,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Main Content */}
          <Box>
            <Box 
              sx={{ 
                display: 'inline-block',
                // Changed background/border to yellow
                background: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: 10,
                px: 2,
                py: 0.5,
                mb: 3,
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ fontWeight: 600, color: AccentColor, textTransform: 'uppercase', letterSpacing: 2 }}
              >
                ✦ The Next-Gen Ride
              </Typography>
            </Box>
            <Typography 
              variant="h2"
              sx={{ 
                fontWeight: 800, 
                lineHeight: 1.05, 
                letterSpacing: '-2px',
                mb: 2,
                background: 'linear-gradient(180deg, #ffffff 0%, #a0a0a0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Original Bike Parts.
            </Typography>
            <Typography 
              variant="h2"
              sx={{ 
                fontWeight: 800, 
                lineHeight: 1.05, 
                letterSpacing: '-2px',
                mb: 3,
                // Applied Yellow Gradient
                background: PrimaryGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Delivered Fast.
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 450, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
              Get genuine motorcycle parts and premium accessories delivered to your doorstep. Quality guaranteed, fast shipping, and expert support.
            </Typography>
          </Box>

          {/* Buttons */}
          <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              endIcon={<ArrowRightAltIcon />}
              sx={{ 
                background: PrimaryGradient,
                color: "#000", // Changed text to black for better contrast on yellow
                fontWeight: 800,
                py: 1.8,
                px: 4,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1rem',
                // Yellow shadow
                boxShadow: '0 10px 40px rgba(255, 215, 0, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFAA00 0%, #FFD700 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 50px rgba(255, 215, 0, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Shop All Parts
            </Button>
            <Button 
              variant="outlined" 
              sx={{ 
                borderColor: 'rgba(255,255,255,0.2)', 
                color: "#fff",
                py: 1.8,
                px: 4,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1rem',
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.05)',
                '&:hover': {
                  borderColor: AccentColor,
                  color: AccentColor, // Make text yellow on hover
                  background: 'rgba(255, 215, 0, 0.1)',
                }
              }}
            >
              Collections
            </Button>
          </Box>

          {/* Stats */}
          <Box 
            sx={{ 
              display: "flex", 
              gap: { xs: 2, sm: 4 }, 
              mt: 5, 
              p: 3,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {[
              { value: '100%', label: 'Genuine' },
              { value: '48H', label: 'Delivery' },
              { value: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <Box key={index} sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, background: PrimaryGradient, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Right image column */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              height: 400,
              // Changed glow behind image to yellow
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.25) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(60px)',
            }
          }}
        >
          <Box 
            component="img"
            src="https://bikeparts.lk/files/mainbanners/photo/6bdd4579-90b2-489e-82ed-a02ab96c7aae/large_BikeParts-5.jpg"
            alt="Motorcycle Parts Display"
            sx={{ 
              width: "90%", 
              height: '85%',
              objectFit: 'cover',
              borderRadius: 4,
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              display: { xs: 'none', md: 'block' },
              position: 'relative',
              zIndex: 1,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}