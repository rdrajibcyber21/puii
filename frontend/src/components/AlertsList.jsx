// import {
//   Avatar,
//   Card,
//   CardContent,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Typography,
// } from '@mui/material';
// import { PriorityHigh } from '@mui/icons-material';
// import React from 'react';

// const severityColors = {
//   low: 'success.main',
//   medium: 'info.main',
//   high: 'warning.main',
//   critical: 'error.main',
// };

// const AlertsList = ({ alerts }) => (
//   <Card sx={{ height: '100%' }}>
//     <CardContent>
//       <Typography variant="h6" gutterBottom>
//         Recent Alerts
//       </Typography>
//       <List>
//         {alerts.map((alert) => (
//           <ListItem key={alert.id} disableGutters>
//             <ListItemAvatar>
//               <Avatar sx={{ bgcolor: severityColors[alert.severity] || 'primary.main' }}>
//                 <PriorityHigh />
//               </Avatar>
//             </ListItemAvatar>
//             <ListItemText
//               primary={alert.message}
//               secondary={`Severity: ${alert.severity} • ${new Date(alert.created_at || Date.now()).toLocaleString()}`}
//             />
//           </ListItem>
//         ))}
//         {alerts.length === 0 && (
//           <Typography variant="body2" color="text.secondary">
//             No alerts yet.
//           </Typography>
//         )}
//       </List>
//     </CardContent>
//   </Card>
// );

// export default AlertsList;


import {
  Avatar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { PriorityHigh } from '@mui/icons-material';
import React from 'react';

const severityColors = {
  low: '#4caf50',
  medium: '#29b6f6',
  high: '#ff9800',
  critical: '#ef5350',
};

const AlertsList = ({ alerts, onAlertClick }) => (
  <Card elevation={4} sx={{ borderRadius: 3, height: '100%' }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Recent Alerts
      </Typography>

      <List>
        {alerts.map((alert) => (
          <ListItem
            key={alert.id}
            sx={{
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
            }}
            onClick={() => onAlertClick && onAlertClick(alert)}
          >
            <ListItemAvatar>
              <Avatar sx={{ backgroundColor: severityColors[alert.severity] || '#9c27b0' }}>
                <PriorityHigh />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={alert.message}
              secondary={`Severity: ${alert.severity.toUpperCase()} • ${new Date(
                alert.created_at,
              ).toLocaleString()}`}
            />
          </ListItem>
        ))}

        {alerts.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No alerts yet.
          </Typography>
        )}
      </List>
    </CardContent>
  </Card>
);

export default AlertsList;