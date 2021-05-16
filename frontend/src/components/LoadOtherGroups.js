import axios from 'axios';
import {Link} from 'react-router-dom';
import React, {Component} from 'react';
import mainlogo from '../assets/logo.png';
import {Redirect} from 'react-router';
import { useState, useEffect ,setState} from 'react'
import { FormControl,Modal,Row, Col,Image} from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import CheckIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from "@material-ui/core/Box";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';



const LoadOtherGroups = () =>{

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
    const [openAccepted, setOpenAccepted] = React.useState(false);
    const [openRejected, setOpenRejected] = React.useState(false);

    useEffect(() =>{
        const loadOnStartMyGroups = () =>{
            const requestOptions = {
                method: 'GET',
               headers: { 'Content-Type': 'application/json' ,'Authorization': token},
              }
            axios.get("http://localhost:4000/api/group/getGroupInvites",requestOptions)
            .then((response) =>{
                console.log("My Groups: "+JSON.stringify(response.data));
                if(response.status===200){
                var grpNamesList = JSON.stringify(response.data);
                setMyGrpParedObj(JSON.parse(grpNamesList));
                }else if(response.status===400){
                    setShowNoOtherGrpMsg("You have not been invited yet!");
                }
            }).catch(err=>{
                console.log(err);
                setShowNoOtherGrpMsg("You have not been invited yet!");
            });
    
            
        }
        loadOnStartMyGroups();
    },[]);

    function Alert(props) {
        return <MuiAlert elevation={10} variant="filled" {...props} />;
    }
    const handleAcceptedClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }    
        setOpenAccepted(false);
      };
      const handleRejectedClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }    
        setOpenRejected(false);
      };

const handleAcceptGroupRequest = (grpName) => {
    console.log("Group name to be accepted: "+grpName);
      const headers = {
        'Content-Type': 'application/json' ,
        'Authorization': token
    }
    const body = {
        groupName: grpName
       }
    axios.post("http://localhost:4000/api/group/acceptInvite",body,{
        headers: headers
    })
    .then((response) =>{
        if(response.status === 200){
        //setShowMsg("Congrats!You joined the group");
        console.log("Congrats!You joined the group: "+JSON.stringify(response.data));
        var index = myGrpParedObj.indexOf(grpName);
        console.log("position id in array: "+index);
        // myGrpParedObj.splice(index,1);
        //alert("You joined "+grpName+" group");
        setOpenAccepted(true);
        //window.location.reload();
        }
    }).catch(err=>{
        console.log(err);
    });
}

const handleRejectGroupRequest = (grpName) => {
    console.log("Group name to be rejected: "+grpName);
      const headers = {
        'Content-Type': 'application/json' ,
        'Authorization': token
    }
    const body = {
        groupName: grpName
       }
    axios.post("http://localhost:4000/api/group/rejectInvite",body,{
        headers: headers
    })
    .then((response) =>{
        if(response.status === 200){
        console.log("Sorry to see you leave..."+JSON.stringify(response.data));
        //alert("You have declined "+grpName+" group request");
        setOpenRejected(true);
        //window.location.reload();
        }
    }).catch(err=>{
        console.log(err);
    });
}
return(
                <Container>

                <Snackbar open={openAccepted} autoHideDuration={6000} onClose={handleAcceptedClose}>
                    <Alert style={{fontSize:"20px"}} onClose={handleAcceptedClose} severity="success">
                        You have joined the group!
                    </Alert>
                </Snackbar>

                <Snackbar open={openRejected} autoHideDuration={6000} onClose={handleRejectedClose}>
                    <Alert style={{fontSize:"20px"}} onClose={handleRejectedClose} severity="error">
                        You have rejected the group request!
                    </Alert>
                </Snackbar>

                    <Row></Row>
                <Grid container>
                    <br/><br/>
                    <Grid item>
                        <Paper style={{ height:35 , width:900, background:"#ccc",fontSize:25,fontWeight:"bold"}}>
                            Group requests
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
                        <Button 
                        size="large" 
                        fontSize="50" 
                        startIcon={<CancelIcon />} 
                        variant="contained" 
                        style={{fontWeight:"bold",backgroundColor:"#ff652f",color:"white",fontSize:"14px",float:"right"}}
                        onClick={()=>handleRejectGroupRequest(grp.groupName)}     
                        >     
                        Reject 
                        </Button>
                        <Button 
                        size="large" 
                        startIcon={<CheckIcon />} 
                        variant="contained" 
                        style={{fontWeight:"bold",backgroundColor:"#5bc5a7",color:"white",fontSize:"14px",float:"right"}}
                        onClick={()=>handleAcceptGroupRequest(grp.groupName)}     
                        > 
                        Accept 
                        </Button>
                        {/* <p style={{fontSize:"10px",color:"#5bc5a7"}}>{showMsg}</p> */}
                        <p style={{fontSize:"20px",color:"red"}}>{showNoOtherGrpMsg}</p>                        

                        </Paper>
                    </Grid>
                        ))}

                </Grid>
                </Container>
);
}

export default LoadOtherGroups;