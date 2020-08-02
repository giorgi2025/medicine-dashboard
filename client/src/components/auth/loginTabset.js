import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { login, initializeAll } from '../../actions';

export class LoginTabset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeShow: true,
            startDate: new Date(),
            username: "",
            password: ""
        }
        this.handleChangeDate = this.handleChangeDate.bind(this)
        this.props.initializeAll();
    }

    clickActive = (event) => {
        document.querySelector(".nav-link").classList.remove('show');
        event.target.classList.add('show');
    }

    handleChangeDate(date) {
        this.setState({
            startDate: date
        });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    routeChange = (e) => {
        e.preventDefault();

        let userData = {
            username: this.state.username,
            password: this.state.password
        };

        this.props.login(userData);
    }
    
    renderAlert() {
        if (this.props.unknown_error !== "") {
            return (
                <div className="alert alert-warning">
                    <strong>Oops! </strong>{this.props.unknown_error}
                </div>
            )
        }
    }  

    render() {
        return (
            <div>
                <Fragment>
                    <form className="form-horizontal auth-form">
                        <h3 style={{color: 'black', marginBottom: '50px' }}>Welcome to Brands Database!</h3>
                        {this.renderAlert()}
                        <div className="form-group">
                            <input required="" name="username" type="text" className="form-control" placeholder="Username" onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                            <input required="" name="password" type="password" className="form-control" placeholder="Password" onChange={this.handleChange} />
                        </div>
                        <div className="form-terms">
                            <div className="custom-control custom-checkbox mr-sm-2">
                                <input type="checkbox" className="custom-control-input" id="customControlAutosizing" />
                                {/* <label className="d-block">
                                    <input className="checkbox_animated" id="chk-ani2" type="checkbox" />
                                        Reminder Me <span className="pull-right"> <a href="#" className="btn btn-default forgot-pass p-0">lost your password</a></span>
                                </label> */}
                            </div>
                        </div>
                        <button className="btn btn-primary pull-right" type="submit"  onClick={(e) => this.routeChange(e)}>Login</button>
                        <div className="form-button" style={{marginTop: '110px', marginLeft: 100}}>
                            <span> You don't have an account? 
                                <Link
                                    to={`${process.env.PUBLIC_URL}/auth/signup`}
                                >
                                    Sign Up
                                </Link>
                            </span>
                        </div>
                    </form>
                </Fragment>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    unknown_error: state.currentStatus.unknown_error
});

export default connect(
    mapStateToProps,
    { login, initializeAll }
)(withRouter(LoginTabset));