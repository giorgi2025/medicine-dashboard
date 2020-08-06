import React, { Component, Fragment } from 'react'
import User_panel from './user-panel';
import { Link } from 'react-router-dom';
// import { MENUITEMS } from '../../../constants/menu';

import { connect } from 'react-redux';
import { setSidebarMenuItem } from '../../../actions'

var MENUITEMS = [];
var mainmenu = [];
var showMenu = [];

export class sidebar extends Component {

    state = { selectedPath: "1", mainmenu: [], flag: false };
    onItemSelection = (arg, e) => {
        this.setState({ selectedPath: arg.path });
    };

    componentDidMount() {
        var currentUrl = window.location.pathname;

        showMenu.filter(items => {
            if (!items.children) {
                if (items.path === currentUrl)
                    this.setNavActive(items)
                return false
            }
        })
    }

    setNavActive(item) {

        MENUITEMS.filter(menuItem => {
            if (menuItem != item)
                menuItem.active = false
            if (menuItem.children && menuItem.children.includes(item))
                menuItem.active = true
        })
        if(item.active === false){
            item.active = !item.active
        };

        let newFlag = this.state.flag;
        this.setState({
            flag: !newFlag
        })

        this.props.setSidebarMenuItem(item.id);
    }

    render() {
        const theme = {
            selectionColor: "#C51162"
        };

        let index = 0;
        if(localStorage.getItem("role") === "0") {
            console.log("local-admin")
            for( let i = 0 ; i < this.props.activeBrands.length ; i ++ ) {
                let isNewMENUITEMS = false;
                let brand = this.props.activeBrands[i];
                for( let j = 0 ; j < MENUITEMS.length ; j ++) {
                    if(MENUITEMS[j].id === brand._id) {
                        //some function
                        let tempCount = 0;
                        this.props.items.map(item => {
                            if(item._brandId._id === brand._id)
                                ++tempCount;
                        })
                        MENUITEMS[j].count = tempCount;

                        isNewMENUITEMS = true;
                        ++ index;
                        break;
                    }
                }
                if(!isNewMENUITEMS) {
                    let tempCount = 0;
                    this.props.items.map(item => {
                        if(item._brandId._id === brand._id)
                            ++tempCount;
                    })
    
                    let oneItem = {
                        path: `/brands/${brand._id}`, title: brand.name, count: tempCount, number: ++index, type: 'link', badgeType: 'primary', active: false, id: brand._id
                    }
                    MENUITEMS.push(oneItem);
                }
            }
            
        } else {
            if(this.props.user.brands !== undefined) {

                for( let i = 0 ; i < this.props.user.brands.length ; i ++ ) {
                    let brand = this.props.user.brands[i];
                    if(brand._brandId.allow) {

                        let tempCount = 0;
                        let isNewMENUITEMS = false;

                        for( let j = 0 ; j < MENUITEMS.length ; j ++) {
                            if(MENUITEMS[j].id === brand._brandId._id) {
                                //some function
                                let tempCount = 0;
                                this.props.items.map(item => {
                                    if(item._brandId._id === brand._brandId._id)
                                        switch(item.status) {
                                            case "Submitted":
                                                if(brand.Submitted === true)
                                                    ++tempCount;
                                                break;
                                            case "Approved":
                                                if(brand.Approved === true)
                                                    ++tempCount;
                                                break;
                                            case "Arabic":
                                                if(brand.Arabic === true)
                                                    ++tempCount;
                                                break;
                                            case "Completed":
                                                if(brand.Completed === true)
                                                    ++tempCount;
                                                break;
                                            case "Confirmed":
                                                if(brand.Confirmed === true)
                                                    ++tempCount;
                                                break;
                                            case "Done":
                                                if(brand.Done === true)
                                                    ++tempCount;
                                                break;
                                            default:
                                                break;
                                        }
                                })
                                MENUITEMS[j].count = tempCount;
        
                                isNewMENUITEMS = true;
                                break;
                            }
                        }
                        if(!isNewMENUITEMS) {
                            let tempCount = 0;
                            this.props.items.map(item => {
                                if(item._brandId._id === brand._brandId._id)
                                    switch(item.status) {
                                        case "Submitted":
                                            if(brand.Submitted === true)
                                                ++tempCount;
                                            break;
                                        case "Approved":
                                            if(brand.Approved === true)
                                                ++tempCount;
                                            break;
                                        case "Arabic":
                                            if(brand.Arabic === true)
                                                ++tempCount;
                                            break;
                                        case "Completed":
                                            if(brand.Completed === true)
                                                ++tempCount;
                                            break;
                                        case "Confirmed":
                                            if(brand.Confirmed === true)
                                                ++tempCount;
                                            break;
                                        case "Done":
                                            if(brand.Done === true)
                                                ++tempCount;
                                            break;
                                        default:
                                            break;
                                    }
                            })
            
                            let oneItem = {
                                path: `/brands/${brand._brandId._id}`, title: brand._brandId.name, count: tempCount, number: ++index, type: 'link', badgeType: 'primary', active: false, id: brand._brandId._id
                            }
                            MENUITEMS.push(oneItem);
                        }
                    }
                }
            }
        }
        mainmenu = MENUITEMS.map((menuItem, i) => 
            <li className={`${menuItem.active ? 'active' : ''}`} key={i}>
                {(menuItem.sidebartitle) ?
                    <div className="sidebar-title">{menuItem.sidebartitle}</div>
                    : ''}
                <Link
                    to={`${process.env.PUBLIC_URL}${menuItem.path}`}
                    className={`sidebar-header ${menuItem.active ? 'active' : ''}`}

                    onClick={() => this.setNavActive(menuItem)}
                >
                    <span style={{color: 'rgb(198, 198, 198)', fontSize: 17}} >{menuItem.number + ". "}</span><span>{menuItem.title}</span>
                    <i className="fa fa-angle-right pull-right" style={{marginRight: 25, display: `${menuItem.active ? '' : 'none'}`}}> </i>
                    <small style={{color: 'rgb(50, 50, 50)', fontSize: 15, backgroundColor: 'rgb(193, 193, 193)', padding: '2px 6px', marginRight: menuItem.active ? 15 : 50 }} className="pull-right">{menuItem.count}</small>
                </Link>
        </li>
        )

        return (
            <Fragment>
                <div className="page-sidebar">
                    <div className="main-header-left d-none d-lg-block">
                        <div className="logo-wrapper">
                            {/* <Link to={`${process.env.PUBLIC_URL}/dashboard`}> */}
                                <span>Brands Database</span>
                            {/* </Link> */}
                        </div>
                    </div>
                    <div className="sidebar custom-scrollbar">
                        <User_panel />
                        <ul className="sidebar-menu">
                            {mainmenu}
                        </ul>
                    </div>
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    activeBrands: state.brand.activeBrands,
    items: state.item.items,
});

export default connect(
    mapStateToProps,
    { setSidebarMenuItem }
)(sidebar);