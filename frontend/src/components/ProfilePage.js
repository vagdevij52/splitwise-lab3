import React, {Component} from 'react';
import  { useEffect, state } from "react";
import NavbarAfterLogin from './NavbarAfterLogin';
import Form from "react-validation/build/form";
import { useState} from "react";
import {Redirect} from 'react-router';
import axios from 'axios';
import styled from 'styled-components'; 
import { FormControl,Modal,Container,Row, Col,Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {useHistory} from "react-router-dom";
import {Image} from "cloudinary-react";
import {GraphQLClient} from 'graphql-request';
import {TextField, MenuItem} from '@material-ui/core';


const Styles = styled.div`
.navbar{
    background-color: #1CC29F;
}
.navbar-brand{
    color: #ffffff;
    padding: 4.5px 20px 8.5px;
    float: left;
    margin-left: -20px;
    padding: 4px 20px 2px;
    line-height: 1;
    font-size:30px;
    font-weight: 600;
    font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;

    .nav-link{
        color: #ffffff;
    }
}
.nav-item .nav-link{
    color: #ffffff;
}
.profile{
    color: #ffffff;
    background: #5bc5a7;
    font-weight: 700;
    font-size: 16px;
    border-color: #ccc;
    border-radius: 5px;
}
.divider{
    width:5px;
}

.dropdownItem{
    font-size: 14px
}
.dropdownItem:hover{
    background-color:#5bc5a7;
    color: white;
}
.profilepic{
    width:200;
    height:200;
    float:left;
}

`;
const currencies = [
    {
      value: "USD",
      label: "usd"
    },
    {
      value: "EUR",
      label: "eur"
    },
    {
      value: "BTC",
      label: "btc"
    },
    {
      value: "JPY",
      label: "jpy"
    }
];

const ProfilePage = (props) =>{

     // State for the input
    const [task, setTask] = useState("");
    const [value, setValue] = React.useState("");
    var user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;
    const API_URL = "http://localhost:3001/";

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //console.log("User from local storage in Profile page: "+user.username);

     var onloadUsername = user.username;
     var onloadEmail = user.email;

    var onloadPhone = user.phone;
    var onloadDefaultCurrency = user.defaultCurrency;
    var onloadTimezone = user.timezone;
    var onloadLanguage = user.language;
    var onloadAvatar = user.avatar;

    const handle = user.username;
    var [username, setUsername] = useState(onloadUsername);
    var [email, setEmail] = useState(onloadEmail);
    var [phone, setPhone] = useState(onloadPhone);
    var [defaultCurrency, setDefaultCurrency] = useState(onloadDefaultCurrency);
    var [timezone, setTimezone] = useState(onloadTimezone);
    var [language, setLanguage] = useState(onloadLanguage);
    var [avatar, setAvatar] = useState(onloadAvatar);

    const[imageSelected, setImageSelected] = useState("");
    const [isUpdated,setIsUpdated] = useState("");

        const handleEditClick = (e) => {
        e.preventDefault();
        console.log(e.traget.username.value);
    }

    useEffect(() => {
        console.log("Token being set:: "+token);
        const requestOptions = {
            method: 'GET',
           headers: { 'Content-Type': 'application/json' ,'Authorization': token},
          }
        axios.get("http://localhost:4000/api/profile",requestOptions)
        .then(response=>{
            if(response.status === 200){
              console.log("Profile page::Get user profile");
              //loadSuccess();
              setUsername(response.data.username);
              setEmail(response.data.email);
              setAvatar(response.data.avatar);
              setPhone(response.data.phone);
              setDefaultCurrency(response.data.defaultCurrency);
              setTimezone(response.data.timezone);
              setLanguage(response.data.language);

              //history.push('/profile');
            }
          }).catch(err=>{
            //User has no profile.Needs to create new profile
            console.log(err);
            setUsername(user.username);
            setEmail(user.email);
        });
	}, []);




    const uploadImage = (files) =>{
        console.log(files[0]);
        console.log("Uploading to cloudinary");
        var formData = new FormData();
        formData.append("file", imageSelected);
        formData.append("upload_preset", "gvfsmpgq");
        axios.post("https://api.cloudinary.com/v1_1/dh9bmhy5e/image/upload", formData)
        .then((response) =>{
            console.log(JSON.stringify(response.data));
            var strRes = JSON.stringify(response.data);
            var data = JSON.parse(strRes);
            setAvatar(data.secure_url);
        });
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        console.log("Uploading to cloudinary");
        var formData = new FormData();
        formData.append("file", imageSelected);
        formData.append("upload_preset", "gvfsmpgq");
        axios.post("https://api.cloudinary.com/v1_1/dh9bmhy5e/image/upload", formData)
        .then((response) =>{
            console.log(JSON.stringify(response.data));
            var strRes = JSON.stringify(response.data);
            var data = JSON.parse(strRes);
            setImageSelected(data.secure_url);
        });
        console.log(e[0]);


        //graphql way
        const qlQuery = async (query, variables = {}) => {
            const resp = await fetch("http://localhost:4000", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({query, variables}),
            });
            return (await resp.json()).data;
        };
    
        (async () => {
            // Mutation update profile
            console.log(await qlQuery(
                "mutation _($currencyProfileInput: CurrencyProfileInput) {updateDefaultCurrency(profile: $currencyProfileInput) {email defaultCurrency}}",
                {"currencyProfileInput": {"email": email, "defaultCurrency": value}} //variables need to passed as the second argument
            ));

            //Query users
            // console.log(await qlQuery(
            // "{profile{email}}")
            // );
        })();


        const headers = {
            'Content-Type': 'application/json' ,
            'Authorization': token
        }
        const body = {
           'handle': handle,'username': username,'email':email,'avatar':avatar,'phone':phone,'defaultCurrency':value,'timezone':timezone,'language':language
          }
          console.log("Requestoptions: "+JSON.stringify(body));
        axios.post("http://localhost:4000/api/profile",body,{
            headers: headers
        })
        .then(response=>{
            if(response.status === 200){
              console.log("Profile page::Saved profile in Database");
              setUsername(response.data.username);
              setEmail(response.data.email);
              setAvatar(response.data.avatar);
              setPhone(response.data.phone);
              setDefaultCurrency(response.data.defaultCurrency);
              setTimezone(response.data.timezone);
              setLanguage(response.data.language);
              //loadSuccess();              
          }
          }).catch(err=>{
            console.log(err);
        });


        // console.log("Updating the profile");
        // const headers = {
        //     'Content-Type': 'application/json' ,
        //     'Authorization': token
        // }
        // const body = {
        //    'handle': handle,'username': username,'email':email,'avatar':avatar,'phone':phone,'defaultCurrency':defaultCurrency,'timezone':timezone,'language':language
        //   }
        //   console.log("Requestoptions: "+JSON.stringify(body));

        // const ME_QUERY = `
        // {
        //     me{
                
        //     }
        // }
        // `
        // const client = new GraphQLClient('http://localhost:4000/api/profile',{
        //     headers: headers
        // });
        // const response = await client.request(ME_QUERY);
        // console.log("Response for profile save: "+response);
    }
    return(
    <>
        <Styles>
        <NavbarAfterLogin/>
            <Container fluid="md">
            <br /><br /><br />
            <Row>
            <h1 style={{marginLeft:"10px",fontSize:"30px"}}>Your Account</h1><br />
            </Row>
            <Form onSubmit={handleSaveProfile}>
            <Row>
            <Col>
            <Row>
            <Image 
            cloudName="dh9bmhy5e" 
            publicId={avatar} 
            style={{width:200}} 
            />
            </Row>
            <br />
            <Row>
                <input 
                type="file"
                onChange={(e)=>setImageSelected(e.target.files[0])} 
                style={{borderColor:"#ccc",fontSize:"13px",borderRadius:"5px"}} />
            </Row>
            <Row><button type="button" style={{background:"#5bc5a7",fontSize:"13px",color:"#fff",borderRadius:"5px"}} onClick={uploadImage}>
            Upload Image
            </button>
            </Row>
            </Col>
            <Col style={{fontSize:"15px"}}>
            Your name
            <Row style={{marginLeft:"0px"}}>
            <span style={{fontWeight:"bold"}}>{onloadUsername}</span>
            {/* <input
            type="text"
            name="onloadUsername"
            value={onloadUsername}
            readOnly
            style={{borderColor:"#ccc",fontSize: "17px", height: "30px",borderRadius:"5px",width:"150px"}}
            />            */}
            </Row>
            <Row style={{marginLeft:"0px"}}>
            <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter new value"
            onChange={e=> setUsername(e.target.value)}
            style={{borderColor:"#ccc",fontSize: "17px", height: "30px",borderRadius:"5px",width:"150px"}}
            />           
            </Row>
            <small><label>Enter a new value</label></small>
            <br /><br />

            <Row style={{marginLeft:"0px"}}>
            Your email address
            </Row>
            <Row style={{marginLeft:"0px"}}>
            {/* <input
            type="text"
            name="onloadEmail"
            value={onloadEmail}
            readOnly
            style={{borderColor:"#ccc",fontSize: "17px", height: "30px",borderRadius:"5px",width:"150px"}}
            />            */}
            <span style={{fontWeight:"bold"}}>{onloadEmail}</span>

            </Row>
            <Row style={{marginLeft:"0px"}}>
            <input
            type="text"
            name="email"
            value={email}
            placeholder="Enter new value"
            onChange={e=> setEmail(e.target.value)}
            style={{borderColor:"#ccc",fontSize: "17px", height: "30px",borderRadius:"5px",width:"150px"}}
            />           
            </Row>
            <small><label>Enter a new value</label></small>
            <br /><br/>

            <Row style={{marginLeft:"0px"}}>
            Your phone number
            </Row>
            <Row style={{marginLeft:"0px"}}>
            {/* <input
            type="text"
            name="onloadPhone"
            value={onloadPhone}
            readOnly
            style={{borderColor:"#ccc",fontSize: "17px", height: "30px",borderRadius:"5px",width:"150px"}}
            />            */}
            <span style={{fontWeight:"bold"}}>{onloadPhone}</span>
            </Row>
            <Row style={{marginLeft:"0px"}}>
            <input
            type="text"
            name="phone"
            value={phone}
            placeholder="Enter new value"
            onChange={e=> setPhone(e.target.value)}
            style={{borderColor:"#ccc",fontSize: "17px", height: "30px",borderRadius:"5px",width:"150px"}}
            />           
            </Row>
            <small><label>Enter a new value</label></small>
            </Col>
            <Col style={{fontSize:"15px"}}>
            <Row style={{marginLeft:"-4px"}}>
            Your default currency
            </Row>
            <Row style={{marginLeft:"0px"}}>
            {/* <input
            type="text"
            name="onloadDefaultCurrency"
            value={onloadDefaultCurrency}
            readOnly
            style={{borderColor:"#ccc",fontSize: "17px", height: "30px",borderRadius:"5px",width:"150px"}}
            />            */}
            <span style={{fontWeight:"bold"}}>{onloadDefaultCurrency}</span>
            </Row>
            {/* <Row style={{marginLeft:"0px"}}>
            <input
            type="text"
            name="defaultCurrency"
            value={defaultCurrency}
            placeholder="Enter new value"
            onChange={e=> setDefaultCurrency(e.target.value)}
            style={{borderColor:"#ccc",fontSize: "17px", height: "30px",borderRadius:"5px",width:"150px"}}
            />           
            </Row>
            <small><label>Enter a new value</label></small> */}
            <Row style={{marginLeft:"0px"}}>
            <TextField
            id="standard-select-currency"
            select
            fullWidth
            label="Filter By"
            InputLabelProps={{ shrink: true }}
            margin="normal"
            value={value}
            onChange={e => setValue(e.target.value)}
            >
            {currencies.map(option => (
            <MenuItem key={option.value} value={option.value}>
            {option.label}
            </MenuItem>
            ))}
            </TextField>
            </Row>
            <br /><br/>

            <Row style={{marginLeft:"-4px"}}>
            Your time zone
            </Row>
            <Row style={{marginLeft:"0px"}}>
            {/* <input
            type="text"
            name="onloadTimezone"
            value={onloadTimezone}
            readOnly
            style={{borderColor:"#ccc",fontSize: "17px", height: "30px",borderRadius:"5px",width:"150px"}}
            />            */}
            <span style={{fontWeight:"bold"}}>{onloadTimezone}</span>
            </Row>
            <Row style={{marginLeft:"0px"}}>
            <input
            type="text"
            name="timezone"
            value={timezone}
            placeholder="Enter new value"
            onChange={e=> setTimezone(e.target.value)}
            style={{borderColor:"#ccc",fontSize: "17px", height: "30px",borderRadius:"5px",width:"150px"}}
            />           
            </Row>
            <small><label>Enter a new value</label></small>
           <br /><br/>
           <Row style={{marginLeft:"-4px"}}>
            Your language
            </Row>
            <Row style={{marginLeft:"0px"}}>
            {/* <input
            type="text"
            name="onloadLanguage"
            value={onloadLanguage}
            readOnly
            style={{borderColor:"#ccc",fontSize: "17px", height: "30px",borderRadius:"5px",width:"150px"}}
            />            */}
            <span style={{fontWeight:"bold"}}>{onloadLanguage}</span>
            </Row>
            <Row style={{marginLeft:"0px"}}>
            <input
            type="text"
            name="language"
            value={language}
            placeholder="Enter new value"
            onChange={e=> setLanguage(e.target.value)}
            style={{borderColor:"#ccc",fontSize: "17px", height: "30px",borderRadius:"5px",width:"150px"}}
            />           
            </Row>
            <small><label>Enter a new value</label></small>
            </Col>
            </Row>
            <br /><br /><br /><br /><br />
            <Row>
                <Col></Col>
                <Col>
                <Row>
                <input  
                type="submit" 
                value="Save" 
                style={{borderColor:"#ccc",width: "90px",borderRadius: "5px",textShadow: "0 -1px 0 #c83400" ,marginTop: "10px", marginBottom: "10px", fontSize: "18px",color: "#fff",fontWeight:"bold",float:"left",background: "#ff652f"}} />
                </Row>
                {/* <Row>
                <input  
                type="reset" 
                value="Reset" 
                style={{borderColor:"#ccc",width: "90px",borderRadius: "5px",textShadow: "0 -1px 0 #c83400" ,marginTop: "10px", marginBottom: "10px", fontSize: "18px",color: "gray",fontWeight:"bold",float:"left",background: "#ccc"}} />
                </Row> */}
                </Col>
            </Row>
            </Form>
            </Container>
        </Styles>
    </>
    )
}

export default ProfilePage;