import React, { Component } from "react";
import "./Header.css";
import Grid from "@material-ui/core/Grid";
import Fastfood from "@material-ui/icons/Fastfood";
import Search from "@material-ui/icons/Search";
import Input from "@material-ui/core/Input";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Button from "@material-ui/core/Button";
import Modal from "react-modal";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withRouter, Link } from 'react-router-dom';

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const TabContainer = function (props) {
  return (
    <Typography component="div" style={{ padding: 0, textAlign: "center" }}>
      {props.children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
      backgroundColor: '#DFDFDF',
      padding: 8,
      marginTop: 4,
    },
  })(props => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));

  const StyledMenuItem = withStyles(theme => ({
    root: {
      padding: 4,
      minHeight: 'auto',
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      loginContactnoRequired: "dispNone",
      value: 0,
      loginContactno: "",
      loginContactnoRequired: "dispNone",
      loginContactnoError: "",
      loginpassword: "",
      loginpasswordRequired: "dispNone",
      loginpasswordError: "",
      firstname: "",
      firstnameRequired: "dispNone",
      lastname: "",
      lastnameRequired: "dispNone",
      email: "",
      emailRequired: "dispNone",
      emailError: "",
      password: "",
      passwordRequired: "dispNone",
      passwordError: "",
      contactno: "",
      contactnoRequired: "dispNone",
      contactnoError: "",
      signupSuccess: false,
      loggedIn: sessionStorage.getItem("login") === "null" ? false: true,
      loggedInFirstName:
        sessionStorage.getItem("login") === "null"
          ? ""
          : sessionStorage.getItem("login"),
      loggedInLastName: "",
      loggedInEmail: "",
      loggedInContactNumber: "",
      open: false,
      anchorEl: null,
      snackBarOpen: false,
      snackBarMessage: "",
    };
  }

  openModalHandler = () => {
    this.setState({ modalIsOpen: true });
    this.setState({ loginContactno: "" });
    this.setState({ loginpassword: "" });
    this.setState({ firstname: "" });
    this.setState({ lastname: "" });
    this.setState({ email: "" });
    this.setState({ password: "" });
    this.setState({ contactno: "" });
    this.setState({ loginContactnoRequired: "dispNone" });
    this.setState({loginpasswordRequired: "dispNone"});
    this.setState({firstnameRequired: "dispNone"});
    this.setState({lastnameRequired:"dispNone"});
    this.setState({emailRequired: "dispNone"});
    this.setState({passwordRequired: "dispNone"});
    this.setState({contactnoRequired: "dispNone"});
    this.setState({ value: 0 });

  };

  closeModalHandler = () => {
    this.setState({ modalIsOpen: false });
  };

  tabChangeHandler = (event, value) => {
    this.setState({ value });
  };

  inputLoginContactnoHandler = (e) => {
    this.setState({ loginContactno: e.target.value });
  };

  inputLoginpasswordHandler = (e) => {
    this.setState({ loginpassword: e.target.value });
  };

  loginClickHandler = () => {

    if (this.state.loginContactno === "") {
        this.setState({loginContactnoRequired: "dispBlock"});
        this.setState({loginContactnoError: "required"});
    } else if (this.state.loginContactno.toString().match(/^(?=.*\d).{10,10}$/i) === null) {
        this.setState({loginContactnoRequired: "dispBlock"});
        this.setState({loginContactnoError: "Invalid Contact"});
        return;
    } else {
        this.setState({loginContactnoRequired: "dispNone"});
        this.setState({loginContactnoError: ""});
    }

    if (this.state.loginpassword === "") {
        this.setState({loginpasswordRequired: "dispBlock"});
        this.setState({loginpasswordError: "required"});
        return;
    } else {
        this.setState({loginpasswordRequired: "dispNone"});
        this.setState({loginpasswordError: ""});
    }

    let loginData = null;
    let xhrLogin = new XMLHttpRequest();
    let that = this;
    xhrLogin.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (xhrLogin.status === 200 || xhrLogin.status === 201){
                let loginData = JSON.parse(this.responseText);
                sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
                sessionStorage.setItem("access-token", xhrLogin.getResponseHeader("access-token"));
                that.setState({
                  loggedIn: true,
                  loggedInFirstName: loginData.first_name
              });

                sessionStorage.setItem("login", loginData.first_name);
                that.snackBarHandler("Logged in successfully!");

                that.closeModalHandler();
                
                
            } else {
                that.setState({loginpasswordRequired: "dispBlock"});
                that.setState({loginpasswordError: JSON.parse(this.responseText).message});
            }
        }
    });

    xhrLogin.open("POST", "http://localhost:8080/api/customer/login");
    xhrLogin.setRequestHeader("Authorization", "Basic " + window.btoa(this.state.loginContactno + ":" + this.state.loginpassword));
    xhrLogin.setRequestHeader("Content-Type", "application/json");
    xhrLogin.setRequestHeader("Cache-Control", "no-cache");
    xhrLogin.send(loginData);
    
}


  inputFirstnameHandler = (e) => {
    this.setState({ firstname: e.target.value });
  };

  inputLastnameHandler = (e) => {
    this.setState({ lastname: e.target.value });
  };

  inputEmailHandler = (e) => {
    this.setState({ email: e.target.value });
  };

  inputPasswordHandler = (e) => {
    this.setState({ password: e.target.value });
  };

  inputContactnoHandler = (e) => {
    this.setState({ contactno: e.target.value });
  };

  signupClickHandler = () => {
    this.state.firstname === ""
      ? this.setState({ firstnameRequired: "dispBlock" })
      : this.setState({ firstnameRequired: "dispNone" });
    this.state.lastname === ""
      ? this.setState({ lastnameRequired: "dispBlock" })
      : this.setState({ lastnameRequired: "dispNone" });
    this.state.password === ""
      ? this.setState({ passwordRequired: "dispBlock" })
      : this.setState({ passwordRequired: "dispNone" });
    this.state.contactno === ""
      ? this.setState({ contactnoRequired: "dispBlock" })
      : this.setState({ contactnoRequired: "dispNone" });

    if (this.state.password === "") {
      this.setState({ passwordRequired: "dispBlock" });
      this.setState({ passwordError: "required" });
    } else if (
      this.state.password
        .toString()
        .match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,32}$/i) === null
    ) {
      this.setState({ passwordRequired: "dispBlock" });
      this.setState({
        passwordError:
          "Password must contain at least one capital letter, one small letter, one number, and one special character",
      });
    } else {
      this.setState({ passwordRequired: "dispNone" });
      this.setState({ passwordError: "" });
    }

    if (this.state.email === "") {
      this.setState({ emailRequired: "dispBlock" });
      this.setState({ emailError: "required" });
    } else if (
      this.state.email
        .toString()
        .match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) === null
    ) {
      this.setState({ emailRequired: "dispBlock" });
      this.setState({ emailError: "Invalid Email" });
    } else {
      this.setState({ emailRequired: "dispNone" });
      this.setState({ emailError: "" });
    }

    if (this.state.contactno === "") {
      this.setState({ contactnoRequired: "dispBlock" });
      this.setState({ contactnoError: "required" });
      return;
    } else if (
      this.state.contactno.toString().match(/^(?=.*\d).{10,10}$/i) === null
    ) {
      this.setState({ contactnoRequired: "dispBlock" });
      this.setState({
        contactnoError:
          "Contact No. must contain only numbers and must be 10 digits long",
      });
    } else {
      this.setState({ contactnoRequired: "dispNone" });
      this.setState({ contactnoError: "" });
    }

    let dataSignup = JSON.stringify({
        "contact_number": this.state.contactno,
        "email_address": this.state.email,
        "first_name": this.state.firstname,
        "last_name": this.state.lastname,
        "password": this.state.password
    });

    let xhrSignup = new XMLHttpRequest();
    let that = this;
    xhrSignup.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (xhrSignup.status === 200 || xhrSignup.status === 201){
                that.setState({
                    signupSuccess: true,
                });
                that.snackBarHandler("Registered successfully! Please login now!");
                that.openModalHandler();
            } else {
                that.setState({contactnoRequired: "dispBlock"});
                that.setState({contactnoError: JSON.parse(this.responseText).message});
            }
        }
    });

    xhrSignup.open("POST", "http://localhost:8080/api/customer/signup");
    xhrSignup.setRequestHeader("Content-Type", "application/json");
    xhrSignup.setRequestHeader("Cache-Control", "no-cache");
    xhrSignup.send(dataSignup);
  };

  snackBarHandler = (message) => {
    this.setState({ snackBarOpen: false});
    this.setState({ snackBarMessage: message});
    this.setState({ snackBarOpen: true});
};

handleMenuClose = () => {
  this.setState({ anchorEl: null });
};

handleMenuClick = (event) => {
  this.setState({ anchorEl: event.currentTarget });

};

handleLogOut = () => {''
  this.setState({loggedIn : false});
  this.setState({ anchorEl: null });
  sessionStorage.setItem("login",null);
};

profileClickHandler = () => {
  this.props.history.push("/profile");
}




  render() {
    return (
      <div>
        <header className="app-header flex-container">
          <Grid
            container
            spacing={3}
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={12} sm>
              <Fastfood className="app-logo" style={{ fontSize: "35px" }} />
            </Grid>

            <Grid item xs={12} sm>
              <div className="searchbox">
                <Search />
                <Input
                  style={{ color: "grey", width: 250 }}
                  className="searchField"
                  type="text"
                  placeholder="Search by Restaurant Name"
                  onChange={this.props.onChange}                 
                />
              </div>
            </Grid>

            <Grid item xs={12} sm>
              <div className="login">
              {this.state.loggedIn ?              
              <div id="loginMenu">               
                  <Button className="loggedInButton" disableRipple={true} varient='text' aria-owns={this.state.anchorEl? 'simple-menu' : undefined}
                                    aria-haspopup="true" onClick={this.handleMenuClick}>
                                        <AccountCircle className="account-circle" style={{marginRight:4}}/> {this.state.loggedInFirstName}
                                    </Button>
                                    <Menu className="simple-menu"                             
                                     elevation={0}
                                    getContentAnchorEl={null}
                                    anchorEl={this.state.anchorEl}
                                    anchorOrigin={{
                                      vertical: 'bottom',
                                      horizontal: 'center',
                                  }}
                                  transformOrigin={{
                                      vertical: 'top',
                                      horizontal: 'center',
                                  }}
                                  keepMounted
                                     open={Boolean(this.state.anchorEl)}
                                    onClose={this.handleMenuClose}
                                    > 
                                    <div className="menubg">
                                        <MenuItem className="menu-item" onClick={this.profileClickHandler}>
                                          My Profile
                                        </MenuItem> 
                                        
                                        <MenuItem className="menu-item" onClick={this.handleLogOut}>
                                          Logout
                                        </MenuItem> 
                                    </div>
                                    </Menu>
                </div> :
                <Button
                  variant="contained"
                  color="default"
                  className="login-btn"
                  onClick={this.openModalHandler}
                >
                  <AccountCircle className="account-circle" />
                  LOGIN
                </Button>
  }
              </div>
            </Grid>
          </Grid>
        </header>

        <Modal
          ariaHideApp={false}
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModalHandler}
          style={customStyles}
          contentLabel="LOGIN"
        >
          <Tabs className="tabs" value={this.state.value} onChange={this.tabChangeHandler} variant="fullWidth">
            <Tab label="LOGIN" />
            <Tab label="SIGNUP" />
          </Tabs>

          {this.state.value === 0 && (
            <TabContainer>
              <FormControl required>
                <InputLabel htmlFor="loginContactno">Contact No.</InputLabel>
                <Input
                  id="loginContactno"
                  type="text"
                  value={this.state.loginContactno}
                  className={this.state.loginContactno}
                  onChange={this.inputLoginContactnoHandler}
                />
                <FormHelperText className={this.state.loginContactnoRequired}>
                  <span className="red">{this.state.loginContactnoError}</span>
                </FormHelperText>
              </FormControl>
              <br /> <br />
              <FormControl required>
                <InputLabel htmlFor="loginpassword">Password</InputLabel>
                <Input
                  id="loginpassword"
                  type="password"
                  defaultValue={this.state.loginpassword}
                  className={this.state.loginpassword}
                  onChange={this.inputLoginpasswordHandler}
                />
                <FormHelperText className={this.state.loginpasswordRequired}>
                  <span className="red">{this.state.loginpasswordError}</span>
                </FormHelperText>
              </FormControl>
              <br /> <br />
              <Button
                variant="contained"
                color="primary"
                onClick={this.loginClickHandler}
              >
                LOGIN
              </Button>
            </TabContainer>
          )}
          {this.state.value === 1 && (
            <TabContainer>
              <FormControl required>
                <InputLabel htmlFor="firstname">First Name</InputLabel>
                <Input
                  id="firstname"
                  type="text"
                  value={this.state.firstname}                 
                  className={this.state.firstname}
                  onChange={this.inputFirstnameHandler}
                />
                <FormHelperText className={this.state.firstnameRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br /> <br />
              <FormControl required>
                <InputLabel htmlFor="lastname">Last Name</InputLabel>
                <Input
                  id="lastname"
                  type="text"
                  value={this.state.lastname}
                  className={this.state.lastname}
                  onChange={this.inputLastnameHandler}
                />
              </FormControl>
              <br /> <br />
              <FormControl required>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  id="email"
                  type="email"
                  value={this.state.email}
                  className={this.state.email}
                  onChange={this.inputEmailHandler}
                />
                <FormHelperText className={this.state.emailRequired}>
                  <span className="red">{this.state.emailError}</span>
                </FormHelperText>
              </FormControl>
              <br /> <br />
              <FormControl required>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  type="password"
                  defaultValue={this.state.password}
                  className={this.state.password}
                  onChange={this.inputPasswordHandler}
                />
                <FormHelperText className={this.state.passwordRequired}>
                  <span className="red">{this.state.passwordError}</span>
                </FormHelperText>
              </FormControl>
              <br /> <br />
              <FormControl required>
                <InputLabel htmlFor="contactno">Contact No.</InputLabel>
                <Input
                  id="contactno"
                  type="text"
                  value={this.state.contactno}
                  className={this.state.contactno}
                  onChange={this.inputContactnoHandler}
                />
                <FormHelperText className={this.state.contactnoRequired}>
                  <span className="red">{this.state.contactnoError}</span>
                </FormHelperText>
              </FormControl>
              <br /> <br />
              <Button
                variant="contained"
                color="primary"
                onClick={this.signupClickHandler}
              >
                SIGNUP
              </Button>
            </TabContainer>
          )}
        </Modal>

        <Snackbar 
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }} 
                        open={this.state.snackBarOpen} 
                        autoHideDuration={6000}  
                        onClose={() => this.setState({ snackBarOpen: false })}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">{this.state.snackBarMessage}</span>}
                        action={[
                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="inherit"
                                // className={classes.close}
                                onClick={() => this.setState({ snackBarOpen: false })}
                                >
                                <CloseIcon />
                            </IconButton>
                        ]}
                    />
      </div>
    );
  }
}

export default withRouter(Header);
