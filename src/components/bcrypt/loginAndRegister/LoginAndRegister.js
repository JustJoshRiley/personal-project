import React from "react";
//package
import axios from "axios";
//routing
import {Redirect} from "react-router-dom";
//redux
import {connect} from "react-redux";
import {updateUser} from "../../../redux/reducers/userReducer";

class LoginAndRegister extends React.Component {
    constructor() {
        super();
        this.state={
            username: "",
            password: "",
            email: "",
            firstName: "",
            lastName: "",
            clickedRegister:false,
            triedToClick:false,
            shouldRedirect:false,
            serverErrorMessage: ""
        }
    }
    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleRegisterClick = () => {
        const {username,password,email, firstName,lastName} = this.state;
        console.log(username);
        if(username !== "" && password !== "" && email !== "" && firstName !== "" && lastName !== "") {
            axios.post("/auth/register", {
                username,password,email,firstName,lastName
            }).then(response => {
                this.props.updateUser({username, email, firstName, lastName});
                this.setState({shouldRedirect: true});
            }).catch(error => {
                this.setState({serverErrorMessage: error.response.data .error});
            })
        } else {
            this.setState({triedToClick: true})
        }
    }
    handleLoginClick = e => {
        const {username, password} = this.state;
        if(username === "" && password === "") {
            this.setState({triedToClick: true});
        } else {
            axios.post("/auth/login", {
                username, password
            }).then(response => {
                this.props.updateUser(response.data);
                this.setState({shouldRedirect: true});
            }).catch(error => {
                this.setState({serverErrorMessage: error.response.data.error});
            })
        }
    }
    render(){
        if(this.state.shouldRedirect === true ) {
            return <Redirect to="/Feed" />
        }
        return(
            <>
                <div>
                    {this.state.triedToClick === true ? <h1>Please Fill in all the Fields</h1> : null}
                    {this.state.serverErrorMessage !== "" ? <h1>{this.state.serverErrorMessage}</h1> : null}
                    <input
                    placeholder="Username"
                    name="username"
                    onChange={this.handleChange}
                    />
                    <input
                    placeholder="Password"
                    type="password"
                    name="password"
                    onChange={this.handleChange}
                />
                </div>
                <button
                onClick={this.handleLoginClick}
                >login</button>
                <button
                onClick={() => this.setState({clickedRegister: !this.state.clickedRegister})}
                >
                    {this.state.clickedRegister === true ? "Cancel" : "Register"}
                </button>
                {
                    this.state.clickedRegister === true ?
                    <>
                        <input
                        placeholder="First Name"
                        name="firstName"
                        onChange={this.handleChange}
                        />
                        <input
                        placeholder="Last Name"
                        name="lastName"
                        onChange={this.handleChange}
                        />
                        <input
                        placeholder="Email"
                        name="email"
                        onChange={this.handleChange}
                        />
                    <button
                    onClick={this.handleRegisterClick}
                    >Sign Up!</button>
                </>
                :
                null
                }
            </>
        )
    }
}

export default connect(undefined, {
    updateUser
} )(LoginAndRegister);