import React from 'react';
import {Link} from 'react-router-dom';
import mainlogo from '../assets/swlogo101.png';
import '../styles/landing.css';
import {Image} from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

const NavbarBeforeLogin = () => {
    const classes = useStyles();

    return(
        // <Navbar expand="lg">
        // <Image style={{height:"70px",width:"70px",float:"left"}} src={mainlogo} />
        //     <Navbar.Brand><Nav.Link href="/">Splitwise</Nav.Link></Navbar.Brand>
        //     <Navbar.Collapse id="basic-navbar-nav">
        //         <Nav className="ml-auto">
        //             <Link to="login" className="loginBtn">Login</Link>
        //             <div className="divider"/>
        //             <Link to="signup" className="signupBtn">Sign up</Link>
        //         </Nav>
        //     </Navbar.Collapse>
        // </Navbar>

        // <AppBar position="static" style={{backgroundColor:"#5bc5a7"}}>
        //     <Toolbar>
        //         <Typography variant="title" color="inherit">
        //         <Image style={{height:"50px",width:"50px",float:"left"}} src={mainlogo} />
        //         Splitwise
        //         </Typography>
        //     </Toolbar>
        // </AppBar>

        <div className={classes.root}>
        <AppBar position="static" style={{background:"#5bc5a7"}}>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
             <Image rounded style={{width:"40px",height:"35px"}} src={mainlogo}
             />
            </IconButton>
            <Typography variant="h2" className={classes.title}>
            <Link style={{textDecoration:"none", color:"white",fontFamily:"-apple-system, BlinkMacSystemFont, sans-serif"}} to="landing">Splitwise</Link>
            </Typography>
            {/* <Button color="inherit">Login</Button> */}
            <Link to="login" className="loginBtn">Login</Link>
            {/* <Button color="inherit">Sign up</Button> */}
            <Link to="signup" className="signupBtn">Sign up</Link>
          </Toolbar>
        </AppBar>
      </div>
    );
}

export default NavbarBeforeLogin;