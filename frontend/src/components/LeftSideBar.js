import React from 'react';
import { useState, useRef, useContext} from "react";
import {Redirect} from 'react-router-dom';
import { FormControl,Modal,Container,Row,Col,Image,Button, Form, FormLabel} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import '../styles/leftsidebar.css';
import {Link} from 'react-router-dom';


const LeftSideBar = () => {
    return(
        <div className="leftSideBlock">
            <Col>
            <br/>
            <Row>
                <Link style={{textDecoration:"none",marginLeft:"5px",color:"#5bc5a7",fontWeight:"bold",fontSize:"20px"}} 
                to="dashboard">Dashboard
                </Link>
            </Row>
            <Row>
                <Link style={{textDecoration:"none",marginLeft:"5px",color:"#5bc5a7",fontWeight:"bold",fontSize:"20px"}} 
                to="recentactivity">Recent Activity
                </Link>
            </Row><br/>
            <Row>
                <Link style={{textDecoration:"none",marginLeft:"5px",color:"#414a4c",fontWeight:"bold",fontSize:"13px"}} 
                to="mygroups">GROUPS
                </Link>
            </Row>
            {/* <Row>
                <Link style={{marginLeft:"5px",color:"#414a4c",fontWeight:"bold",fontSize:"13px"}} 
                to="group">FRIENDS
                </Link>
            </Row> */}
            </Col>
        </div>





            // <body>            
            // <div className="left_sidebar">
            //     <div className="viewLinks">
            //     <a href="/dashboard" className="dashboardlink"><span >Dashboard</span></a><br/>
            //     <a href="/recentactivity"><span className="recentactivitylink">Recent Activity</span></a><br/><br/>
            //     <div>
            //         <span className="groupnames">GROUPS</span>
            //         <div className="currentgroups">
            //             {/* display list of groups user is part of */}
            //         </div>                    
            //     </div><br/>
            //     <a href="/mygroups">
            //         <span className="groupnames">MY GROUPS</span>
            //     </a>
            //     </div>
            // </div>
            // </body>
    );
}

export default LeftSideBar;