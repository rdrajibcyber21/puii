// import React from 'react';
// import { Card, CardContent, Typography } from '@mui/material';
// import { Pie, PieChart, Tooltip, Cell, ResponsiveContainer } from 'recharts';

// const COLORS = ['#00bfa5', '#ffb74d', '#ff5252'];

// const ThreatBreakdownChart = ({ data }) => (
//   <Card>
//     <CardContent sx={{ height: 320 }}>
//       <Typography variant="h6" gutterBottom>
//         Threat Breakdown
//       </Typography>
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             data={data}
//             dataKey="count"
//             nameKey="label"
//             cx="50%"
//             cy="50%"
//             outerRadius={90}
//             label
//           >
//             {data.map((entry, index) => (
//               <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </ResponsiveContainer>
//     </CardContent>
//   </Card>
// );

// export default ThreatBreakdownChart;


import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Pie, PieChart, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#00bfa5', '#ffb74d', '#ff5252'];

const ThreatBreakdownChart = ({ data, onClick }) => (
  <Card
    elevation={4}
    sx={{
      borderRadius: 3,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s',
      '&:hover': onClick
        ? {
            transform: 'translateY(-4px)',
          }
        : {},
    }}
    onClick={onClick}
  >
    <CardContent sx={{ height: 340 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Threat Breakdown
      </Typography>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default ThreatBreakdownChart;