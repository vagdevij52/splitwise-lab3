import React from 'react';
import mainlogo from '../assets/logo.png';
import '../styles/mygroups.css';
import {Redirect} from 'react-router';
import LeftSideBar from './LeftSideBar';
import { FormControl,Modal,Container,Row, Col,Image,Button} from 'react-bootstrap';
import LoadMyGroups from './LoadMyGroups';
import LoadOtherGroups from './LoadOtherGroups';
import NavbarAfterLogin from './NavbarAfterLogin';

export const MyGroupsPage = () => {
    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = query => setSearchQuery(query);
    return(
        <body>
        <NavbarAfterLogin /> 
        <br/><br/>
        <Row>
            <Col></Col>
            <Col>
            {/* <TextField style={{width:"300px",fontSize:"50px"}}
                            id="searchInput"
                            placeholder="Search for your groups"   
                            margin="dense"
                            endIcon={<SearchIcon />}
                            // onChange={this.onSearchInputChange}
                            /> */}
                            {/* <SearchBar /> */}

            </Col>
            <Col>
                 <Row><LoadOtherGroups /></Row><br/>
                 <Row><LoadMyGroups /></Row>
            </Col>
            <Col></Col>
            <Col></Col>
            <Col></Col>
        </Row>
        </body>

        // <>
        // <NavbarAfterLogin/>
        // <Row>
        // <Col></Col>
        //     <Col>
        //         <LeftSideBar />
        //     </Col>
        //     <Col>
        //         <Row>
        //             <LoadOtherGroups />
        //         </Row>
        //         <Row>
        //             <LoadMyGroups />
        //         </Row>
        //     </Col>
        //     <Col></Col>
        // </Row>
        // </>
    );
}

export default MyGroupsPage;


// className="notification"