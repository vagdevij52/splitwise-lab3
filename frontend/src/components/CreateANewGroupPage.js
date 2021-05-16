import React from 'react';
import { useState, useRef, useContext, useEffect} from "react";
import mainlogo from '../assets/logo.png';
import axios from 'axios';
import avatar from '../assets/avatar.png';
import Form from "react-validation/build/form";
import NavbarAfterLogin from './NavbarAfterLogin';
import '../styles/createNewGroup.css';
import {Link} from 'react-router-dom';
import {  useSelector } from 'react-redux';
import {useHistory} from "react-router-dom";
import {Image} from "cloudinary-react";


const CreateANewGroupPage = () => {
    //const groupAdmin = user.email;
    const history = useHistory();
    var userLocalStorage = JSON.parse(localStorage.getItem("user"));
    // if(!userLocalStorage){
    //     history.push("/login");
    // }
    const token = userLocalStorage.token;

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const[createGroupName,setCreateGroupName] = useState("");
    const[groupAvatar, setGroupAvatar] = useState("");
    const[imageSelected, setImageSelected] = useState("");
    const[groupMemName, setGroupMemName] = useState("");
    const[groupMemEmail, setGroupMemEmail] = useState("");
    const[groupNameInValid,setGroupNameInValid] = useState("");
    const[newGrpCreatedMsg,setNewGrpCreatedMsg] = useState("");

    const [fields, setFields] = useState([{ value: null }]);

    const avatar = useSelector((state) => state.profileReducer.avatar);

    const handleCreateGroup = (e) =>{
        e.preventDefault();

        console.log("Fields: "+JSON.stringify(fields));
        console.log("No. of emails: "+fields.length);
        const params = new URLSearchParams();
        params.append('groupName',createGroupName);
        var grpN = params.get('groupName');
        for(var i=0;i<fields.length;i++){
            params.append('emails', fields[i].value);
            console.log(params.get('emails'));
        }
        params.append('emails',userLocalStorage.email);
        params.append('groupAvatar', groupAvatar);
        // fields.forEach( (el)=>{
        //     params.append('email',value);
        // });

        console.log("params: ", grpN);

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded' ,
            'Authorization': token
        }
        axios.post("http://localhost:4000/api/group/createNewGroup",params,{
            headers: headers
        })
        .then(response=>{
            if(response.status === 200){
                console.log("Group data: "+response.data);
              console.log("New Group Created");
              setNewGrpCreatedMsg("Group Created Sucessfully!");
            }else if(response.status===400){
                console.log("bad request!"+response.status);
                setGroupNameInValid(response.data);
            }
          }).catch(err=>{
            setGroupNameInValid("A group with same name already exists.Please provide a unique name");
            console.log(err);
        });
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
            setGroupAvatar(data.secure_url);
        });
    }
    function handleChange(i, event) {
        const values = [...fields];
        values[i].value = event.target.value;
        setFields(values);
      }
    
      function handleAdd() {
        const values = [...fields];
        values.push({ value: null });
        setFields(values);
      }
    
      function handleRemove(i) {
        const values = [...fields];
        values.splice(i, 1);
        setFields(values);
      }
    return(
    <body>
        {/* <h3 style={{margin:"20px",color:"#5bc5a7",fontWeight:"bold"}}>{newGrpCreatedMsg}</h3>             */}
        <NavbarAfterLogin/>
        <div>
        <Form onSubmit={handleCreateGroup}>               
               <div style={{width:"auto", maxWidth: "510px", marginLeft:"400px",paddingTop: "60px"}}>
                   {/* <img width="200" height="200" style={{float:"left",marginRight:"25px"}} src={mainlogo} alt="logo"/> */}
                   <div style={{float:"left", maxWidth: "200px", marginLeft: "10px", paddingBottom: "60px"}}>
                   <Image 
                    cloudName="dh9bmhy5e" 
                    publicId={groupAvatar} 
                    style={{width:200,float:"left",marginRight:"25px"}} 
                    />
                    <input 
                    type="file"
                    onChange={(e)=>setImageSelected(e.target.files[0])} 
                    style={{borderColor:"#ccc",fontSize:"13px",borderRadius:"5px",float:"left",marginRight:"25px"}} />
                    <button type="button" 
                    style={{background:"#5bc5a7",fontSize:"13px",color:"#fff",borderRadius:"5px",float:"left",marginRight:"25px"}} 
                    onClick={uploadImage}>
                    Upload Image
                    </button>
                    </div>
                   <div style={{float:"left", maxWidth: "240px", marginLeft: "15px", paddingBottom: "60px"}}>
                       <div style={{textTransform: "uppercase", fontSize: "18px", color: "gray",fontWeight:"bold" ,lineHeight: "20px"}}>
                       START A NEW GROUP
                       </div>
                       {/* <form onSubmit={handleCreateGroup} style={{margin: "15px 0 0", width: "260px"}}> */}
                           <div style={{fontSize: "20px", lineHeight: "140%", margin: "16px 0 5px"}}>
                           My group shall be called…
                           </div>
                           <div>
                               <div className="input">
                                   <input 
                                   autoComplete="off" 
                                   style={{borderRadius:"5px",borderColor:"#ccc",fontSize: "35px", height: "45px"}}
                                   type="text"
                                   onChange={e => setCreateGroupName(e.target.value)}
                                   />
                               </div>
                               <div style={{color:"red",fontWeight:"bold",fontSize:"15px"}}>{groupNameInValid}</div>
                               <br/>
                           </div><br/>
                           <div style={{marginTop: "10px", position: "relative"}}>
                               <hr style={{marginTop: "-30px",width:"380px",borderWidth:"2px"}}></hr>
                                <div style={{minHeight: "230px",width:"500px"}}>
                                <h4 style={{marginBottom:"10px",color:"#999",fontWeight:"bold"}}>GROUP MEMBERS</h4>
                                <Image roundedCircle width="20" height="20" style={{float:"left",marginRight:"25px"}} src={avatar} alt="logo"/>
                                 <span style={{marginLeft:"-15px",fontSize:"15px"}}>{userLocalStorage.username}("<em>{userLocalStorage.email}</em>")</span>
                                 {/* get logged in username and email id */}
                                 <br/><br/>
                              {fields.map((field, idx) => {
                                return(
                                 <div className="field" key={`${field}-${idx}`}>
                                     <input 
                                     type="text" 
                                     style={{borderRadius:"5px",borderColor:"#ccc",height:"35px",fontSize:"17px",width:"30%",marginRight:"2px"}} 
                                     placeholder="Name"
                                     onChange={e => handleChange(idx, e)} 
                                     />
                                     &nbsp;
                                     <input 
                                     type="text" 
                                     style={{borderRadius:"5px",borderColor:"#ccc",height:"35px",fontSize:"17px",width:"50%",marginRight:"7px",marginBottom:"2px"}} 
                                     placeholder="Email address"
                                     onChange={e => handleChange(idx, e)}
                                     />
                                     <Link style={{color: "#c00",fontWeight:"bold",fontSize:"20px",right:"5px"}} onClick={() => handleRemove(idx)}>x</Link>
                                 </div>
                                )
                               })}
                                <div className="addPerson">
                                <Link style={{fontSize:"15px"}} onClick={() => handleAdd()} >+Add a person</Link>                                    
                                </div>
                                </div>
                                
                           </div>
                           <input type="submit" value="Save" style={{borderColor:"#ccc",fontWeight:"bold",width:"90px",fontSize: "18px",marginLeft:"-1px",background:"#ff652f",color:"#fff",textShadow:"0 -1px 0 #c83400",borderRadius:"5px"}} />
                           <br />
                           <div style={{fontWeight:"bold",color:"#5bc5a7",fontSize:"15px"}}>{newGrpCreatedMsg}</div>
                       {/* </form> */}
                   </div>
               </div>
               </Form>            
               </div>
            </body>
            );
}

export default CreateANewGroupPage;