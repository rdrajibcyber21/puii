// import { Card, CardContent, Typography } from '@mui/material';
// import React from 'react';

// const MetricCard = ({ title, value, caption }) => (
//   <Card>
//     <CardContent>
//       <Typography color="text.secondary" gutterBottom>
//         {title}
//       </Typography>
//       <Typography variant="h3">{value}</Typography>
//       {caption && (
//         <Typography variant="body2" color="text.secondary">
//           {caption}
//         </Typography>
//       )}
//     </CardContent>
//   </Card>
// );

// export default MetricCard;


import { Card, CardContent, Typography, Box } from '@mui/material';
import React from 'react';

const MetricCard = ({ title, value, caption, color, onClick, data }) => (
  <Card
    elevation={4}
    onClick={onClick}
    sx={{
      borderRadius: 3,
      background: 'linear-gradient(135deg, #1e1e1e 0%, #2c2c2c 100%)',
      color: '#fff',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': onClick
        ? {
            transform: 'translateY(-4px)',
            boxShadow: 8,
          }
        : {},
    }}
  >
    <CardContent>
      <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
        {title}
      </Typography>

      <Typography variant="h3" sx={{ fontWeight: 'bold', color: color ?? '#4caf50' }}>
        {value}
      </Typography>

      {caption && (
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          {caption}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default MetricCard;