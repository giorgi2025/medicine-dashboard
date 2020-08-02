import React, { Component,Fragment } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { AlignLeft, Maximize2, Bell, MoreHorizontal } from 'react-feather';

import {
    LogOut,
} from 'react-feather';

import { logout } from '../../../actions';

export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebar: true,
            rightSidebar: true,
            navMenus: false
        }
    }

    toggle() {
        this.setState(prevState => ({
            navMenus: !prevState.navMenus
        }));
    }

    showRightSidebar = () => {
        if (this.state.rightSidebar) {
            this.setState({ rightSidebar: false })
            document.querySelector(".right-sidebar").classList.add('show');
        } else {
            this.setState({ rightSidebar: true })
            document.querySelector(".right-sidebar").classList.remove('show');
        }
    }

    goFull = () => {
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }

    openCloseSidebar = () => {
        if (this.state.sidebar) {
            this.setState({ sidebar: false })
            document.querySelector(".page-main-header").classList.add('open');
            document.querySelector(".page-sidebar").classList.add('open');
        } else {
            this.setState({ sidebar: true })
            document.querySelector(".page-main-header").classList.remove('open');
            document.querySelector(".page-sidebar").classList.remove('open');
        }
    }

    logout = (e) => {
        e.preventDefault();

        this.props.logout();
    }

    render() {
        return (
            <Fragment>
                {/* open */}
                <div className="page-main-header ">
                    <div className="main-header-right row">
                        <div className="main-header-left d-lg-none" >
                            <div className="logo-wrapper">
                                {/* <a href="index.html">
                                    <img className="blur-up lazyloaded" src={logo} alt="" />
                                </a> */}
                                <span>Brands Database</span>
                            </div>
                        </div>
                        <div className="mobile-sidebar">
                            <div className="media-body text-right switch-sm">
                                <label className="switch"><a onClick={this.openCloseSidebar}><AlignLeft /></a></label>
                            </div>
                        </div>
                        <div className="nav-right col">
                            <ul className={"nav-menus " + (this.state.navMenus ? 'open' : '')}>
                                {localStorage.getItem("role") === "0" ?
                                <>
                                    <li>
                                        <Link
                                            to={`${process.env.PUBLIC_URL}/users`}
                                            style={{color: 'rgb(198, 198, 198)'}}
                                        >
                                        Users
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to={`${process.env.PUBLIC_URL}/addRemoveBrand`}
                                            style={{color: 'rgb(198, 198, 198)'}}
                                        >
                                        Brands
                                        </Link>
                                    </li>
                                </> : null }
                                <li>
                                    <Link
                                        to={`#!`}
                                        className="text-dark"
                                        onClick={this.goFull}
                                    >
                                        <Maximize2 />
                                    </Link>
                                </li>
                                
                                <LogOut style={{ cursor: 'pointer'}} onClick={(e) => this.logout(e)} />
                            </ul>
                            <div className="d-lg-none mobile-toggle pull-right" onClick={() => this.toggle()}><MoreHorizontal /></div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default connect(
    null,
    { logout }
)(Header);
