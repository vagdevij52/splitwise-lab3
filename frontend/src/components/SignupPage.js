import React from 'react';
import axios from 'axios';
import { useState} from "react";
import {Redirect} from 'react-router-dom';
import { useDispatch } from 'react-redux'
import ReactDOM from 'react-dom';
import '../styles/signup.css';
import mainlogo from '../assets/logo.png';
import { FormControl,Modal,Container,Row,Col,Image,Button, Form, FormLabel} from 'react-bootstrap';
import NavbarBeforeLogin from './NavbarAfterLogin';

const SignupPage = (props) => {
  const dispatch = useDispatch()
  //const { posts, loading, hasErrors } = useSelector(userSelector);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[emailAlrdyErr, setEmailAlrdyErr] = useState("");
  const handleSignUp = async(e) =>{
    e.preventDefault();
    try{
    const response = await axios.post("http://localhost:4000/api/users/signup", {
      username,
      email,
      password,
    })
      console.log("Res: "+response);
      if(response.status === 200){
      console.log("Response from axios: "+JSON.stringify(response.data));
      var strRes = JSON.stringify(response.data);
      var data = JSON.parse(strRes);
      console.log(data.username);
      localStorage.setItem("user", JSON.stringify(response.data));
      //console.log("calling user slice");
      //dispatch(storeRegUserData(data.username,data.email));
      props.history.push("/dashboard");
      }
    }catch(err){
      console.log("Error: "+err);
      setEmailAlrdyErr("Email already exists!");
    }
  }
    return(
      <>
      <NavbarBeforeLogin />
      <Row></Row>
      <Row></Row>
      <Row></Row>
      <br/><br/><br/><br/>
      <Row>
        <Col></Col>
        <Col></Col>
          <Col>
          <Image style={{height:"200px",width:"200px",float:"left"}} src={mainlogo} />
          </Col>
          <Col>
          <Row className="title">INTRODUCE YOURSELF</Row>
          <Form onSubmit={handleSignUp}>
            <Row className="name">Hi there! My name is</Row>
            <Row>
              <input
              type="text"
              name="username"
              value={username} 
              onChange={e=> setUsername(e.target.value)}
              autoCapitalize="off" 
              className="iuname"
              />
            </Row><br/>
            <Row><label style={{fontSize:"18px",color:"#353839"}}>Here’s my <strong>email Address</strong></label></Row>
            <Row>
              <input
              type="text"
              name="email"
              value={email} 
              onChange={e=> setEmail(e.target.value)}
              autoCapitalize="off" 
              className="iemail"
              />
            </Row>
            <div style={{color:"red", fontWeight:"bold", fontSize:"15px"}}>{emailAlrdyErr}</div>
            <br/>
            <Row><FormLabel style={{fontSize:"18px",color:"#353839"}}>And here’s my <strong>password</strong></FormLabel></Row>
            <Row>
              <input
              type="password"
              className="iemail"
              name="email"
              value={password} 
              onChange={e=> setPassword(e.target.value)}
              />
            </Row><br/><br/>
            <Row>
              <input
              type="submit"
              value="Sign me up!"
              className="submitBtn"
              />
            </Row>
          </Form>
          </Col>
          <Col></Col>
          <Col></Col>
      </Row>
      </>
    );
}

export default SignupPage;