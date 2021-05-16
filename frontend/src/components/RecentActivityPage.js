import axios from 'axios';
import React from 'react';
import mainlogo from '../assets/logo.png';
import '../styles/dashboard.css';
import '../styles/recentActivity.css';
import { useState, useEffect} from 'react'
import { FormControl,Modal,Row, Col,Image} from 'react-bootstrap';
import Button from '@material-ui/core/Button'
import CheckIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import NavbarAfterLogin from './NavbarAfterLogin';
import activitylogo from '../assets/activity.png';
import ReactPaginate from 'react-paginate';

const RecentActivityPage = () =>{

    //const user = AuthService.getCurrentUser();
    //const userEmail = user.email;
    var userLocalStorage = JSON.parse(localStorage.getItem("user"));
    const token = userLocalStorage.token;
    var recentActivityList = [];
    //pagination
    const [page, setPage] = React.useState(2);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [recentActivityParedObj, setRecentActivityParedObj] = useState([]);

    
    useEffect(() =>{
    const loadRecentActivity = () =>{
        const requestOptions = {
            method: 'GET',
           headers: { 'Content-Type': 'application/json' ,'Authorization': token},
          }
        axios.get("http://localhost:4000/api/group/getRecentActivity",requestOptions)
        .then((response) =>{
            console.log("Recent Activity: "+JSON.stringify(response.data));
             if(response.status===200){
                var recentActivityList = JSON.stringify(response.data);            
                setRecentActivityParedObj(JSON.parse(recentActivityList));
            }else if(response.status===400){
            }
        }).catch(err=>{
            console.log(err);
        });        
    }
    loadRecentActivity();
},[]);

    const[pageNumber, setPageNumber] = useState(0);
    const activitiesPerPage = 10;
    const pagesVisited = pageNumber*activitiesPerPage;
    const[pagAct, setPagAct] = useState();
    const pageCount = Math.ceil(recentActivityParedObj.length/activitiesPerPage);

    const displayPaginatedActivities = () =>{
        
    }
    const handleOnPageChange = ({selected}) =>{
        setPageNumber(selected);
    }
   
            const handleChangePage = (event, newPage) => {
            setPage(newPage);
            };

            const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(parseInt(event.target.value, 5));
            setPage(0);
            };

    return(
        <body>
            <NavbarAfterLogin />
            <br/> 
            <Container>
        <Row></Row>
    <Grid container>
        <br/><br/>
        <Grid item>
            <Paper style={{ marginLeft:"20px" , height:45 , width:1000, background:"#ccc",fontSize:30,fontWeight:"bold"}}>
                Recent Activity
            </Paper>
        </Grid>
    </Grid><br/>
    <Grid container spacing="2">
    {recentActivityParedObj
    .slice(pagesVisited,pagesVisited+activitiesPerPage)
    .map(activity => (
        <Grid item>
            <Paper style={{ marginLeft:"20px" ,height:43 , width:1000, background:"#eee",fontSize:20}}>
            {/* <Link 
            style={{marginLeft:"7px",color:"#353839",fontSize:"23px"}}
            >
            {activity.groupName} 
            </Link> */}                                            
            <Image  width="40" height="40" src={activitylogo} alt="logo"/>
                <strong style={{marginLeft:"7px"}}>{activity.expenseDesc}</strong>&nbsp;
                    "is added in"&nbsp;&nbsp;
                <strong>{activity.groupName}</strong>&nbsp;
                    "group". Cost:$
                <strong>{activity.expenseAmount}</strong>
            </Paper>
        </Grid>
    ))}
<br/><br/>
    <ReactPaginate 
    previousLabel={"Previous"}
    nextLabel={"Next"}
    pageCount={pageCount}
    onPageChange={handleOnPageChange}
    containerClassName={"paginationBttns"}
    previousClassName={"previousBttn"}
    nextClassName={"nextBttn"}
    disabledClassName={"paginationDisabled"}
    activeClassName={"paginationActive"}
    />
    </Grid>
    
    </Container>

    {/* <TablePagination
      component="div"
      count={100}
      page={page}
      onChangePage={handleChangePage}
      rowsPerPage={rowsPerPage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    /> */}
    
    </body>
    );

}

export default RecentActivityPage;