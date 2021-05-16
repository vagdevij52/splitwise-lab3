import {Route} from 'react-router-dom';
import React from 'react';
import LandingPage from './components/LandingPage';
import CreateANewGroupPage from './components/CreateANewGroupPage';
import DashboardPage from './components/DashboardPage';
import GroupPage from './components/GroupPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MyGroupsPage from './components/MyGroupsPage';
import ProfilePage from './components/ProfilePage';
import RecentActivityPage from './components/RecentActivityPage';
import NavbarBeforeLogin from './components/NavbarBeforeLogin';
import {BrowserRouter} from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
    <div className="App">
                <Route path="/landing" component={LandingPage}/>
                <Route path="/createnewgroup" component={CreateANewGroupPage}/>
                <Route path="/dashboard" component={DashboardPage} />
                <Route path="/group" component={GroupPage}/>
                <Route path="/signup" component={SignupPage}/>
                <Route path="/login" component={LoginPage}/>
                <Route path="/mygroups" component={MyGroupsPage}/>
                <Route path="/profile" component={ProfilePage}/>
                <Route path="/recentactivity" component={RecentActivityPage}/>
    </div>
    </BrowserRouter>
  );
}

export default App;
