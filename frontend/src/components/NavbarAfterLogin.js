import React from 'react';
import { useState, useRef, useContext} from "react";
import {Redirect} from 'react-router-dom';
import ReactDOM from 'react-dom';
import {Nav, Navbar, Button, Dropdown, DropdownButton,Image} from 'react-bootstrap';
import mainlogo from '../assets/logo.png';
import '../styles/navbarafterlogin.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import {  useSelector,useDispatch } from 'react-redux';




const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      textDecoration: "none",
      color:"white"
    },
    largeIcon: {
        width: 100,
        height: 100,
      },
  }));

const NavbarAfterLogin = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    
    const avatar = useSelector((state) => state.profileReducer.avatar);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };

    const handleLogout = () => {
      localStorage.removeItem("user");
    }
return(

    <div className={classes.root}>
      <FormGroup>

      </FormGroup>
      <AppBar position="static" style={{background:"#5bc5a7"}}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
             <Image rounded style={{width:"35px",height:"35px"}} src={mainlogo}
             />
            </IconButton>
            <Typography variant="h2" className={classes.title}>
              <Link style={{textDecoration:"none", color:"white",fontFamily:"-apple-system, BlinkMacSystemFont, sans-serif"}} to="dashboard">Splitwise</Link>
            </Typography>
          {(
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                
              >
                {/* <AccountCircle style={{fontSize:"30px"}} /> */}
                <Avatar alt="user" src={avatar} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem style={{textDecoration:"none",fontSize:"17px"}} component={Link} to='profile'>Your Account</MenuItem>
                <MenuItem style={{textDecoration:"none",fontSize:"17px"}} component={Link} to='createnewgroup'>Create a group</MenuItem>
                <MenuItem style={{textDecoration:"none",fontSize:"17px"}} component={Link} onClick={handleLogout} to='landing'>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
);
}
export default NavbarAfterLogin;