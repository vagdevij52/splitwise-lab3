import React from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import { useState} from "react";
import {useSelector, useDispatch} from 'react-redux';
import logged from '../actions/loginActions';
import '../styles/login.css';
import mainlogo from '../assets/logo.png';
import { FormControl,Modal,Container,Row,Col,Image, Form, FormLabel} from 'react-bootstrap';
import NavbarBeforeLogin from './NavbarBeforeLogin';

const LoginPage = () => {

  const history = useHistory();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[inValidLoginUser, setInValidLoginUser] = useState("");
  const isLogged = useSelector((state) => state.loggedReducer.username);
  const dispatch = useDispatch();

  const loadSuccess = () =>{
    history.push('/dashboard');
  }
  const handleLogin = (e) => {
    e.preventDefault();
    axios
    .post("http://localhost:4000/api/users/login", {
      email,
      password,
    })
    .then((response) => {
      if (response.status !== 400) {
        localStorage.setItem("user", JSON.stringify(response.data));
        console.log("Before action dispatch");
        loadSuccess();
        console.log("After action dispatch");
        dispatch(logged(response.data.username,response.data.email));
      }
    }).catch(err=>{
       setInValidLoginUser("Email or password is invalid");
        });
   }
    return(
      <>
      <NavbarBeforeLogin />
      <br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <Row>
        <Col></Col>
        <Col></Col>
          <Col>
          <Image style={{height:"200px",width:"200px",float:"left"}} src={mainlogo} />
          </Col>
          <Col>
          <Row className="titleLoginPage">WELCOME TO SPLITWISE</Row>
          <Form onSubmit={handleLogin}>
            <Row><label style={{fontSize:"18px",color:"#353839"}}>Email address</label></Row>
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
            <div style={{color:"red", fontWeight:"bold"}}>{inValidLoginUser}</div>
            <br/>
            <Row><FormLabel style={{fontSize:"18px",color:"#353839"}}>Password</FormLabel></Row>
            <Row>
              <input
              type="password"
              className="iemail"
              name="email"
              value={password} 
              onChange={e=> setPassword(e.target.value)}
              />
            </Row><br/><br/><br/><br/>
            <Row>
              <input
              type="submit"
              value="Log In"
              className="loginBtnInLogin"
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

export default LoginPage;

