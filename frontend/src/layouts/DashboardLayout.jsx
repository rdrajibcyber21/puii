// import { Logout, Policy, Report, Security, Sensors, Shield, Monitor } from '@mui/icons-material';
// import {
//   AppBar,
//   Box,
//   Button,
//   Divider,
//   Drawer,
//   IconButton,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Toolbar,
//   Typography,
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import React, { useState } from 'react';
// import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
// import { useAuthContext } from '../context/AuthContext.jsx';

// const navItems = [
//   { to: '/', label: 'Dashboard', icon: <Security /> },
//   { to: '/events', label: 'Events', icon: <Sensors /> },
//   { to: '/alerts', label: 'Alerts', icon: <Shield /> },
//   { to: '/policies', label: 'Policies', icon: <Policy /> },
//   { to: '/reports', label: 'Reports', icon: <Report /> },
// ];

// const drawerWidth = 240;

// const DashboardLayout = () => {
//   const location = useLocation();
//   const { user, logout } = useAuthContext();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const drawer = (
//     <Box onClick={() => setMobileOpen(false)} sx={{ textAlign: 'center' }}>
//       <Typography variant="h6" sx={{ my: 2 }}>
//         PUII Console
//       </Typography>
//       <Divider />
//       <List>
//         {navItems.map((item) => (
//           <ListItemButton
//             key={item.to}
//             component={RouterLink}
//             to={item.to}
//             selected={location.pathname === item.to}
//           >
//             <ListItemIcon>{item.icon}</ListItemIcon>
//             <ListItemText primary={item.label} />
//           </ListItemButton>
//         ))}
//       </List>
//     </Box>
//   );

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <AppBar component="nav" position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={() => setMobileOpen(!mobileOpen)}
//             sx={{ mr: 2, display: { sm: 'none' } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             PUII Security Operations Center
//           </Typography>
//           <Typography sx={{ mr: 2 }}>{user?.email}</Typography>
//           <Button color="inherit" startIcon={<Logout />} onClick={logout}>
//             Logout
//           </Button>
//         </Toolbar>
//       </AppBar>
//       <Box component="nav">
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={() => setMobileOpen(false)}
//           ModalProps={{
//             keepMounted: true,
//           }}
//           sx={{
//             display: { xs: 'block', sm: 'none' },
//             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//           }}
//         >
//           {drawer}
//         </Drawer>
//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: 'none', sm: 'block' },
//             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//           }}
//           open
//         >
//           {drawer}
//         </Drawer>
//       </Box>
//       <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
//         <Toolbar />
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default DashboardLayout;


import {
  Logout,
  Policy,
  Report,
  Security,
  Sensors,
  Shield,
  Monitor,
  Memory,
  Description,
  Assignment,
  NetworkCheck,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from 'react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: <Security /> },
  { to: '/events', label: 'Events', icon: <Sensors /> },
  { to: '/alerts', label: 'Alerts', icon: <Shield /> },
  { to: '/policies', label: 'Policies', icon: <Policy /> },
  { to: '/reports', label: 'Reports', icon: <Report /> },
  { to: '/monitoring', label: 'Monitoring', icon: <Monitor /> },
  { to: '/resources', label: 'Resources', icon: <Memory />, badge: 'Dev' },
  { to: '/logs', label: 'Logs', icon: <Description />, badge: 'Dev' },
  { to: '/tickets', label: 'Tickets', icon: <Assignment />, badge: 'Dev' },
  { to: '/traffic-flow', label: 'Traffic Flow', icon: <NetworkCheck />, badge: 'Dev' },
];

const drawerWidth = 240;

const DashboardLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Drawer content
  const drawer = (
    <Box sx={{ height: '100%', backgroundColor: '#111827', color: '#fff' }}>
      {/* Logo / Title */}
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          PUII Console
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      {/* Navigation Items */}
      <List sx={{ mt: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={RouterLink}
            to={item.to}
            selected={location.pathname === item.to}
            sx={{
              color: '#fff',
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.12)',
              },
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#90caf9' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  {item.label}
                  {item.badge && (
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: 'rgba(255, 152, 0, 0.2)',
                        color: '#ff9800',
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 1,
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.badge}
                    </Typography>
                  )}
                </Box>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* TOP BAR */}
      <AppBar
        component="nav"
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1f2937',
        }}
      >
        <Toolbar>
          {/* Hamburger (mobile) */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PUII Security Operations Center
          </Typography>

          {/* User Email */}
          <Typography sx={{ mr: 2 }}>{user?.email}</Typography>

          {/* Logout */}
          <Button color="inherit" startIcon={<Logout />} onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* SIDE DRAWER */}
      <Box component="nav">
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#111827',
              color: '#fff',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Permanent Desktop Drawer */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#111827',
              color: '#fff',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* MAIN PAGE CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Push content below AppBar
          ml: { sm: `${drawerWidth}px` }, // FIX: Prevent overlap with side drawer
          backgroundColor: '#0f172a',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;