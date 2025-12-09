// import React from "react";
// import { Box, Typography, Link, Container, Grid, IconButton } from "@mui/material";
// import { Facebook, Instagram, Twitter } from "@mui/icons-material";

// export default function Footer() {
//   const PrimaryGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
//   const AccentColor = '#00d4ff';

//   return (
//     <Box
//       component="footer"
//       sx={{
//         background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)',
//         color: "#fff",
//         py: 8,
//         mt: 5,
//         position: 'relative',
//         overflow: 'hidden',
//         '&::before': {
//           content: '""',
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           height: '3px',
//           background: PrimaryGradient,
//         },
//         '&::after': {
//           content: '""',
//           position: 'absolute',
//           top: '20%',
//           right: '-10%',
//           width: 400,
//           height: 400,
//           background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
//           borderRadius: '50%',
//           filter: 'blur(60px)',
//         }
//       }}
//     >
//       <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
//         <Grid container spacing={5}>
//           {/* Contact / Address */}
//           <Grid item xs={12} md={4}>
//             <Box 
//               sx={{ 
//                 p: 3, 
//                 borderRadius: 4, 
//                 background: 'rgba(255,255,255,0.03)',
//                 backdropFilter: 'blur(20px)',
//                 border: '1px solid rgba(255,255,255,0.05)',
//               }}
//             >
//               <Typography 
//                 variant="h6" 
//                 gutterBottom 
//                 sx={{ 
//                   fontWeight: 700,
//                   background: PrimaryGradient,
//                   backgroundClip: 'text',
//                   WebkitBackgroundClip: 'text',
//                   WebkitTextFillColor: 'transparent',
//                   mb: 2,
//                 }}
//               >
//                 Contact Us
//               </Typography>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
//                 <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <Box component="span" sx={{ color: AccentColor }}>📍</Box> Kilinochchi, Paranthan
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <Box component="span" sx={{ color: AccentColor }}>📞</Box> 0716600100
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <Box component="span" sx={{ color: AccentColor }}>📱</Box> 0771233100
//                 </Typography>
//               </Box>
//             </Box>
//           </Grid>

//           {/* Quick Links */}
//           <Grid item xs={12} md={4}>
//             <Typography 
//               variant="h6" 
//               gutterBottom 
//               sx={{ 
//                 fontWeight: 700,
//                 background: PrimaryGradient,
//                 backgroundClip: 'text',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 mb: 2,
//               }}
//             >
//               Quick Links
//             </Typography>
//             {["Home", "Products", "Cart", "Orders"].map((link) => (
//               <Link
//                 key={link}
//                 href={`/${link.toLowerCase()}`}
//                 color="inherit"
//                 underline="none"
//                 display="block"
//                 sx={{
//                   py: 1,
//                   color: 'rgba(255,255,255,0.6)',
//                   transition: 'all 0.3s ease',
//                   position: 'relative',
//                   pl: 2,
//                   "&::before": {
//                     content: '""',
//                     position: 'absolute',
//                     left: 0,
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     width: 6,
//                     height: 6,
//                     borderRadius: '50%',
//                     background: 'rgba(255,255,255,0.2)',
//                     transition: 'all 0.3s ease',
//                   },
//                   "&:hover": { 
//                     color: AccentColor,
//                     pl: 3,
//                     "&::before": {
//                       background: AccentColor,
//                       boxShadow: `0 0 10px ${AccentColor}`,
//                     }
//                   },
//                 }}
//               >
//                 {link}
//               </Link>
//             ))}
//           </Grid>

//           {/* Social / Info */}
//           <Grid item xs={12} md={4}>
//             <Typography 
//               variant="h6" 
//               gutterBottom 
//               sx={{ 
//                 fontWeight: 700,
//                 background: PrimaryGradient,
//                 backgroundClip: 'text',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 mb: 2,
//               }}
//             >
//               Follow Us
//             </Typography>
//             <Box sx={{ display: "flex", gap: 2 }}>
//               {[Facebook, Instagram, Twitter].map((Icon, index) => (
//                 <IconButton 
//                   key={index}
//                   href="#" 
//                   sx={{ 
//                     color: "#fff",
//                     background: 'rgba(255,255,255,0.05)',
//                     border: '1px solid rgba(255,255,255,0.1)',
//                     backdropFilter: 'blur(10px)',
//                     transition: 'all 0.3s ease',
//                     '&:hover': {
//                       background: PrimaryGradient,
//                       transform: 'translateY(-3px)',
//                       boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
//                     }
//                   }}
//                 >
//                   <Icon />
//                 </IconButton>
//               ))}
//             </Box>
//             <Typography variant="body2" sx={{ mt: 3, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
//               Stay connected with us for the latest updates, offers, and motorcycle parts news.
//             </Typography>
//           </Grid>
//         </Grid>

//         <Box 
//           sx={{ 
//             textAlign: "center", 
//             mt: 6, 
//             pt: 4, 
//             borderTop: '1px solid rgba(255,255,255,0.05)' 
//           }}
//         >
//           <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
//             &copy; {new Date().getFullYear()} <Box component="span" sx={{ color: AccentColor }}>BikeParts</Box>. All Rights Reserved.
//           </Typography>
//         </Box>
//       </Container>
//     </Box>
//   );
// }



import React from "react";
import { Box, Typography, Link, Container, Grid, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

export default function Footer() {
  // Changed to a sophisticated Gold/Yellow accent for a premium look
  // or keep it blue if you prefer. This fits "BikeParts" well.
  const PrimaryGradient = 'linear-gradient(to right, #ffffff, #f0f0f0)'; 
  const AccentColor = '#fbbf24'; // Amber/Gold for high contrast and premium feel

  return (
    <Box
      component="footer"
      sx={{
        // Design Change: Deep Matte Black/Grey for high-end retail feel
        bgcolor: '#0F0F11',
        color: "#a1a1aa", // Softer grey text is easier to read than pure white
        pt: 10,
        pb: 6,
        mt: 5,
        borderTop: '1px solid #27272a', // Subtle border
        position: 'relative',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={8}> {/* Increased spacing for breathing room */}
          
          {/* Contact / Address */}
          <Grid item xs={12} md={4}>
            <Box 
              sx={{ 
                // Design Change: Removed the "Box/Card" look. 
                // Clean text blends better in professional footers.
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography 
                variant="h5" // Larger heading
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '-0.5px',
                  mb: 3,
                }}
              >
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#d4d4d8', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box component="span" sx={{ color: AccentColor, bgcolor: 'rgba(251, 191, 36, 0.1)', p: 1, borderRadius: '50%' }}>📍</Box> 
                  Kilinochchi, Paranthan
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#d4d4d8', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box component="span" sx={{ color: AccentColor, bgcolor: 'rgba(251, 191, 36, 0.1)', p: 1, borderRadius: '50%' }}>📞</Box> 
                  0716600100
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.95rem', color: '#d4d4d8', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box component="span" sx={{ color: AccentColor, bgcolor: 'rgba(251, 191, 36, 0.1)', p: 1, borderRadius: '50%' }}>📱</Box> 
                  0771233100
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: '#fff',
                textTransform: 'uppercase', // E-commerce standard
                fontSize: '0.85rem',
                letterSpacing: '1px',
                mb: 3,
              }}
            >
              Quick Links
            </Typography>
            {["Home", "Products", "Cart", "Orders"].map((link) => (
              <Link
                key={link}
                href={`/${link.toLowerCase()}`}
                underline="none"
                display="block"
                sx={{
                  py: 1.2,
                  color: '#a1a1aa',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease-in-out',
                  // Design Change: Simple, clean slide hover effect
                  "&:hover": { 
                    color: AccentColor,
                    transform: 'translateX(5px)', 
                  },
                }}
              >
                {link}
              </Link>
            ))}
          </Grid>

          {/* Social / Info */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: '#fff',
                textTransform: 'uppercase',
                fontSize: '0.85rem',
                letterSpacing: '1px',
                mb: 3,
              }}
            >
              Follow Us
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <IconButton 
                  key={index}
                  href="#" 
                  sx={{ 
                    color: "#fff",
                    bgcolor: '#27272a', // Solid neutral background
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: AccentColor,
                      color: '#000', // Black icon on Gold background
                      transform: 'translateY(-3px)',
                    }
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
            <Typography variant="body2" sx={{ mt: 4, color: '#71717a', lineHeight: 1.6, fontSize: '0.875rem' }}>
              Stay connected with us for the latest updates, offers, and motorcycle parts news. We provide quality parts for your ride.
            </Typography>
          </Grid>
        </Grid>

        <Box 
          sx={{ 
            textAlign: "center", 
            mt: 8, 
            pt: 4, 
            borderTop: '1px solid #27272a',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            alignItems: 'center' 
          }}
        >
          <Typography variant="body2" sx={{ color: '#52525b' }}>
            &copy; {new Date().getFullYear()} <Box component="span" sx={{ color: '#fff', fontWeight: 600 }}>BikeParts</Box>. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}