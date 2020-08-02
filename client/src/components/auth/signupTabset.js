import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { signup, initializeAll } from '../../actions';

export class SignupTabset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeShow: true,
            startDate: new Date(),
            name: "",
            username: "",
            password: ""
        }
        this.handleChangeDate = this.handleChangeDate.bind(this)
        this.props.initializeAll();
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
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

    routeChange = (e) => {
        e.preventDefault();

        let newUser = {
            username: this.state.username,
            name: this.state.name,
            password: this.state.password
        };

        this.props.signup(newUser);
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
                            <input required="" name="name" type="text" className="form-control" placeholder="Name" onChange={this.handleChange} />
                        </div>
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
                        <button className="btn btn-primary pull-right" type="submit"  onClick={(e) => this.routeChange(e)}>Sign Up</button>
                        <div className="form-button" style={{marginTop: '20px', marginLeft: 30}}>
                            <span> You already have an account? 
                                <Link
                                    to={`${process.env.PUBLIC_URL}/`}
                                >
                                    Login
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
    { signup, initializeAll }
)(withRouter(SignupTabset));