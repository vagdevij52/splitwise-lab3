import React from 'react';
import  { useEffect } from "react";
import NavbarAfterLogin from './NavbarAfterLogin';
import Form from "react-validation/build/form";
import { useState} from "react";
import axios from 'axios';
import setProfile from '../actions/profileActions';
import styled from 'styled-components'; 
import { FormControl,Modal,Container,Row, Col,Button} from 'react-bootstrap';
import {useHistory} from "react-router-dom";
import {Image} from "cloudinary-react";
import {  useSelector,useDispatch } from 'react-redux';



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

const ProfilePage = (props) =>{

    var userLocalStorage = JSON.parse(localStorage.getItem("user"));
    const token = userLocalStorage.token;
    const storeUsername = useSelector((state) => state.profileReducer.username);
    const storeEmail = useSelector((state) => state.profileReducer.email);
    const storeAvatar = useSelector((state) => state.profileReducer.avatar);
    const storePhone = useSelector((state) => state.profileReducer.phone);
    const storeDefaultCurrency = useSelector((state) => state.profileReducer.defaultCurrency);
    const storeTimezone = useSelector((state) => state.profileReducer.timezone);
    const storeLanguage = useSelector((state) => state.profileReducer.language);


    const[noProfileError, setNoProfileError] = useState(false);
    const[noProfileErrorMsg, setNoProfileErrorMsg] = useState("");
    const[profileCreatedMsg,setProfileCreatedMsg] = useState("");
    const[noAvatarMsg, setAvatarMsg] = useState("");
    const[noPhoneMsg, setNoPhoneMsg] = useState("");
    const[noDefaultCurrMsg, setNoDefaultCurrMsg] = useState("");
    const[noTimezoneMsg, setNoTimezoneMsg] = useState("");
    const[noLanguageMsg, setNoLanguageMsg] = useState("");

    const noProfileRedirectProfilePage = () =>{
        history.push("/profile");
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

              dispatch(setProfile(response.data.username,response.data.email,response.data.avatar,response.data.phone,response.data.defaultCurrency,response.data.timezone,response.data.language));
              //history.push('/profile');
            }
          }).catch(err=>{
            //User has no profile.Needs to create new profile
            console.log(err);
            setUsername(userLocalStorage.username);
            setEmail(userLocalStorage.email);
            noProfileRedirectProfilePage();
            setNoProfileError(true);
            setNoProfileErrorMsg("Please first create a profile");
        });
	}, []);

    

    const dispatch = useDispatch();
    const history = useHistory();


    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handle = userLocalStorage.username;
    var [username, setUsername] = useState("");
    var [email, setEmail] = useState("");
    var [avatar, setAvatar] = useState("");
    var [phone, setPhone] = useState("");
    var [defaultCurrency, setDefaultCurrency] = useState("");
    var [timezone, setTimezone] = useState("");
    var [language, setLanguage] = useState("");

    const[imageSelected, setImageSelected] = useState("");
    const[imagePublicUrl, setImagePublicUrl] = useState("");

    const [isUpdated,setIsUpdated] = useState("");

    const handleEditClick = (e) => {
        e.preventDefault();
        console.log(e.traget.username.value);
    }

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

    const handleSaveProfile = (e) => {
        e.preventDefault();
        console.log("username: "+username);
        //if user does NOT input values then use store values for axios call

        // if(!username){
        //     setUsername(storeUsername);
        // }

        if(!email){
            setEmail(userLocalStorage.email);
        }
        if(!avatar){
            setAvatarMsg("Please upload an image")
        }
        if(!phone){
            setNoPhoneMsg("Please provide phone number");
        }
        if(!defaultCurrency){
            setNoDefaultCurrMsg("Please provide currency");
        }
        if(!timezone){
            setNoTimezoneMsg("Please provide timezone");
        }
        if(!language){
            setNoLanguageMsg("Please provide a language")
        }
        
        console.log("Updating the profile with token: "+token);
        console.log("Handle: "+handle);
        console.log("Username: "+username);
        console.log("Email: "+email);
        console.log("Avatar: "+avatar);
        console.log("Phone: "+phone);
        console.log("Def Curr: "+defaultCurrency);
        console.log("Timezone: "+timezone);
        console.log("Language: "+language);
        const headers = {
            'Content-Type': 'application/json' ,
            'Authorization': token
        }
        const body = {
           'handle': handle,'username': username,'email':email,'avatar':avatar,'phone':phone,'defaultCurrency':defaultCurrency,'timezone':timezone,'language':language
          }
          console.log("Requestoptions: "+JSON.stringify(body));
        axios.post("http://localhost:4000/api/profile",body,{
            headers: headers
        })
        .then(response=>{
            if(response.status === 200){
              console.log("Profile page::Saved profile in Database");
              setNoProfileErrorMsg("");
              setProfileCreatedMsg("Profile Created/Updated Sucessfully!");
              setUsername(response.data.username);
              setEmail(response.data.email);
              setAvatar(response.data.avatar);
              setPhone(response.data.phone);
              setDefaultCurrency(response.data.defaultCurrency);
              setTimezone(response.data.timezone);
              setLanguage(response.data.language);

              dispatch(setProfile(response.data.username,response.data.email,response.data.avatar,response.data.phone,response.data.defaultCurrency,response.data.timezone,response.data.language));
              history.push("/profile");
              //loadSuccess();              
          }
          }).catch(err=>{
            console.log(err);
        });
        
    }
    return(
    <>
        <Styles>
            <NavbarAfterLogin/>
            <h3 style={{margin:"20px",color:"red",fontWeight:"bold"}}>{noProfileErrorMsg}</h3>
            <h3 style={{margin:"20px",color:"#5bc5a7",fontWeight:"bold"}}>{profileCreatedMsg}</h3>
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
            <span style={{fontWeight:"bold"}}>{username}</span>
            </Row>
            {/* <Row style={{marginLeft:"0px"}}>
            <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter new value"
            onChange={e=> setUsername(e.target.value)}
            style={{borderColor:"#ccc",fontSize: "17px", height: "30px",borderRadius:"5px",width:"150px"}}
            />           
            </Row> */}
            {/* <small><label>Enter a new value</label></small> */}
            <br /><br />

            <Row style={{marginLeft:"0px"}}>
            Your email address
            </Row>
            <Row style={{marginLeft:"0px"}}>
            <span style={{fontWeight:"bold"}}>{email}</span>

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
            <span style={{fontWeight:"bold"}}>{phone}</span>
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
            <span style={{fontWeight:"bold"}}>{defaultCurrency}</span>
            </Row>
            <Row style={{marginLeft:"0px"}}>
            <input
            type="text"
            name="defaultCurrency"
            value={defaultCurrency}
            placeholder="Enter new value"
            onChange={e=> setDefaultCurrency(e.target.value)}
            style={{borderColor:"#ccc",fontSize: "17px", height: "30px",borderRadius:"5px",width:"150px"}}
            />           
            </Row>
            <small><label>Enter a new value</label></small>
            <br /><br/>
            <Row style={{marginLeft:"-4px"}}>
            Your time zone
            </Row>
            <Row style={{marginLeft:"0px"}}>
            <span style={{fontWeight:"bold"}}>{timezone}</span>
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
            <span style={{fontWeight:"bold"}}>{language}</span>
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
                </Col>
            </Row>
            </Form>
            </Container>
        </Styles>
    </>
    )
}

export default ProfilePage;