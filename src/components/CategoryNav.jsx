import React from "react";
import { Box, Button } from "@mui/material";

const CATEGORIES = [
  "All Parts", "Engine Parts", "Brake Systems", "Tires & Wheels", "Electrical", "Body Parts", "Accessories"
];

export default function CategoryNav({ onSelect }) {
  return (
    <Box sx={{ display: "flex", gap: 2, overflowX: "auto", mb: 3, py: 1 }}>
      {CATEGORIES.map((cat) => (
        <Button
          key={cat}
          onClick={() => onSelect?.(cat)}
          sx={{
            whiteSpace: "nowrap",
            textTransform: "none",
            color: "text.primary"
          }}
        >
          {cat}
        </Button>
      ))}
    </Box>
  );
}



// import React, { useState } from "react";
// import { Box, Button } from "@mui/material";

// const CATEGORIES = [
//   "All Parts", "Engine Parts", "Brake Systems", "Tires & Wheels", "Electrical", "Body Parts", "Accessories"
// ];

// export default function CategoryNav({ onSelect }) {
//   const [active, setActive] = useState("All Parts");

//   const handleClick = (cat) => {
//     setActive(cat);
//     onSelect?.(cat);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         gap: 2,
//         overflowX: "auto",
//         mb: 3,
//         py: 1,
//         px: 1,
//         "&::-webkit-scrollbar": { display: "none" }, // hide scrollbar
//       }}
//     >
//       {CATEGORIES.map((cat) => (
//         <Button
//           key={cat}
//           onClick={() => handleClick(cat)}
//           sx={{
//             whiteSpace: "nowrap",
//             textTransform: "none",
//             px: 3,
//             py: 1,
//             borderRadius: "20px",
//             border: active === cat ? "2px solid #1976d2" : "2px solid transparent",
//             backgroundColor: active === cat ? "#e3f2fd" : "transparent",
//             color: active === cat ? "#1976d2" : "text.primary",
//             fontWeight: active === cat ? 600 : 400,
//             transition: "all 0.3s ease",
//             "&:hover": {
//               backgroundColor: "#bbdefb",
//               color: "#0d47a1",
//             },
//           }}
//         >
//           {cat}
//         </Button>
//       ))}
//     </Box>
//   );
// }
