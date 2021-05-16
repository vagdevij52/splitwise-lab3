import React from 'react';
import '../styles/landing.css'
import backgroundimg from '../assets/bgimg100.jpeg';
import NavbarBeforeLogin from '../components/NavbarBeforeLogin';

 const landing = () => {
    return(
    <>
    <NavbarBeforeLogin />
        <body style={{marginTop:"-15px",width:"100%",height:"800px",backgroundImage: "url(" + backgroundimg + ")"}}>
        </body>
    </>
    );
}

export default landing;