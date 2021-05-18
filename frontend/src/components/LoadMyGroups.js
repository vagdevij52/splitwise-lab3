import axios from 'axios';
import {Link} from 'react-router-dom';
import React, {Component} from 'react';
import mainlogo from '../assets/logo.png';
import '../styles/dashboard.css';
import { useState, useEffect ,setState} from 'react'
import { FormControl,Modal,Row, Col,Image} from 'react-bootstrap';
import Button from '@material-ui/core/Button'
import CheckIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


const LoadMyGroups = () =>{

    //const user = AuthService.getCurrentUser();
    //const userEmail = user.email;
    var userLocalStorage = JSON.parse(localStorage.getItem("user"));
    const token = userLocalStorage.token;

    const inviteProcessed = 'Sent';
    const waitingInviteStatus = 'NoReply';
    const acceptGroupsInviteStatus = 'Accepted';
    const rejectGroupsInviteStatus = 'Rejected';

    const [paredObj, setParedObj] = useState([]);
    const [myGrpParedObj, setMyGrpParedObj] = useState([]);
    const[showMsg, setShowMsg] = useState("");
    const[showNoOtherGrpMsg, setShowNoOtherGrpMsg] = useState("");
    const[showNoMyGrpMsg, setShowNoMyGrpMsg] = useState("");

    useEffect(() =>{
    const loadOnStartMyGroups = () =>{
        const requestOptions = {
            method: 'GET',
           headers: { 'Content-Type': 'application/json' ,'Authorization': token},
          }
        axios.get("http://localhost:4000/api/group/getMyGroups",requestOptions)
        .then((response) =>{
            console.log("My Groups: "+JSON.stringify(response.data));
            if(response.status===200){
            var grpNamesList = JSON.stringify(response.data);
            setMyGrpParedObj(JSON.parse(grpNamesList));
            }else if(response.status===400){
                setShowNoMyGrpMsg("You are not a part of any group!");
            }
        }).catch(err=>{
            console.log(err);
            setShowNoMyGrpMsg("You are not a part of any group!");
        });

        //graphql way
        // const qlQuery = async (query, variables = {}) => {
        //     const resp = await fetch("http://localhost:4000", {
        //         method: 'POST',
        //         headers: {'Content-Type': 'application/json'},
        //         body: JSON.stringify({query, variables}),
        //     });
        //     return (await resp.json()).data;
        // };
    
        // (async () => {
        //     //Query group details
        //     console.log(await qlQuery(
        //         "{getGroup{email}}")
        //         );
        // })();
        
    }
    loadOnStartMyGroups();
},[]);
   


    return(
        // <Container>
        //     <Row style={{marginLeft:"20px"}}>
        //             <Row>
        //                 <h2>Your groups</h2>
        //             </Row>
        //     </Row>
        //         <Row style={{marginLeft:"20px"}}>
        //                  {myGrpParedObj.map(grp => (
        //                 <ul>
        //                  <li> 
        //                 <Link to={{
        //                 pathname: '/group',
        //                 state:`${grp.groupName}`
        //                  }} 
        //                  style={{paddingTop:"7px",marginLeft:"18px",color:"#5bc5a7",fontSize:"20px"}}>{grp.groupName}
        //                  </Link>
        //                  </li>
        //                  </ul>
        //                  ))}
        //              <p style={{fontSize:"20px",color:"red"}}>{showNoMyGrpMsg}</p>

        //         </Row>

        // </Container>

        <Container>
        <Row></Row>
    <Grid container>
        <br/><br/>
        <Grid item>
            <Paper style={{ height:35 , width:900, background:"#ccc",fontSize:25,fontWeight:"bold"}}>
                My groups
            </Paper>
        </Grid>
    </Grid><br/>
    <Grid container spacing="2">
    {myGrpParedObj.map(grp => (
        <Grid item>
            <Paper style={{ height:40 , width:900, background:"#eee",fontSize:30}}>

            <Link 
            style={{marginLeft:"7px",color:"#353839",fontSize:"23px"}}
            to={{
                pathname: '/group',
                state:`${grp.groupName}`
            }}
            >
            {grp.groupName} </Link>
            <p style={{fontSize:"20px",color:"red"}}>{showNoMyGrpMsg}</p>
            </Paper>
        </Grid>
    ))}

    
    </Grid>
    </Container>
    );

}

export default LoadMyGroups;