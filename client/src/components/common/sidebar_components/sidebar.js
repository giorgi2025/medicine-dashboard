import React, { Component, Fragment } from 'react'
import User_panel from './user-panel';
import { Link } from 'react-router-dom';
// import { MENUITEMS } from '../../../constants/menu';

import { connect } from 'react-redux';
import { setSidebarMenuItem } from '../../../actions'

const MENUITEMS = [];

export class sidebar extends Component {

    state = { selectedPath: "1", mainmenu: [] };
    onItemSelection = (arg, e) => {
        this.setState({ selectedPath: arg.path });
    };

    componentWillMount() {

        let index = 0;
        if(localStorage.getItem("role") === "0") {
            this.props.activeBrands.map(brand => {

                let tempCount = 0;
                this.props.items.map(item => {
                    if(item._brandId._id === brand._id)
                        ++tempCount;
                })

                let oneItem = {
                    path: `/brands/${brand._id}`, title: brand.name, count: tempCount, number: ++index, type: 'link', badgeType: 'primary', active: false, id: brand._id
                }
                MENUITEMS.push(oneItem);
            });
        } else {
            console.log(this.props.userBrands)
            this.props.userBrands.map(brand => {
                if(brand._brandId.allow) {
                    let tempCount = 0;
                    this.props.items.map(item => {
                        if(item._brandId._id === brand._brandId._id)
                            ++tempCount;
                    })

                    let oneItem = {
                        path: `/brands/${brand._brandId._id}`, title: brand._brandId.name, count: tempCount, number: ++index, type: 'link', badgeType: 'primary', active: false, id: brand._brandId._id
                    }
                    MENUITEMS.push(oneItem);
                }
            })
        }

        this.setState({
            mainmenu: MENUITEMS
        })
    }
    componentDidMount() {
        var currentUrl = window.location.pathname;

        this.state.mainmenu.filter(items => {
            if (!items.children) {
                if (items.path === currentUrl)
                    this.setNavActive(items)
                return false
            }
            items.children.filter(subItems => {
                if (subItems.path === currentUrl)
                    this.setNavActive(subItems)
                if (!subItems.children) return false
                subItems.children.filter(subSubItems => {
                    if (subSubItems.path === currentUrl)
                        this.setNavActive(subSubItems)
                })
            })
        })
    }

    setNavActive(item) {

        MENUITEMS.filter(menuItem => {
            if (menuItem != item)
                menuItem.active = false
            if (menuItem.children && menuItem.children.includes(item))
                menuItem.active = true
            if (menuItem.children) {
                menuItem.children.filter(submenuItems => {
                    if (submenuItems != item) {
                        submenuItems.active = false
                    }
                    if (submenuItems.children) {
                        submenuItems.children.map(childItem => {
                            childItem.active = false;
                        })
                        if (submenuItems.children.includes(item)) {
                            submenuItems.active = true
                            menuItem.active = true
                        }
                    }
                })
            }
        })
        if(item.active === false)
            item.active = !item.active

        this.setState({
            mainmenu: MENUITEMS
        })

        this.props.setSidebarMenuItem(item.id);
    }

    render() {
        const theme = {
            selectionColor: "#C51162"
        };

        const mainmenu = this.state.mainmenu.map((menuItem, i) =>
            <li className={`${menuItem.active ? 'active' : ''}`} key={i}>
                {(menuItem.sidebartitle) ?
                    <div className="sidebar-title">{menuItem.sidebartitle}</div>
                    : ''}
                {(menuItem.type === 'sub') ?
                    <a className="sidebar-header " href="javascript:void(0)" onClick={() => this.setNavActive(menuItem)}>
                        <menuItem.icon />
                        <span>{menuItem.title}</span>
                        <i className="fa fa-angle-right pull-right"></i>
                    </a>
                    : ''}
                {(menuItem.type === 'link') ?
                    <a
                        href={`${process.env.PUBLIC_URL}${menuItem.path}`}
                        className={`sidebar-header ${menuItem.active ? 'active' : ''}`}

                        onClick={() => this.setNavActive(menuItem)}
                    >
                        {menuItem.number + ". "}<span>{menuItem.title}</span>
                        <small style={{color: 'rgb(50, 50, 50)', fontSize: 15, backgroundColor: 'rgb(193, 193, 193)', padding: '2px 6px', marginRight: 20 }} className="pull-right">{menuItem.count}</small>
                        {menuItem.children ?
                            <i className="fa fa-angle-right pull-right"></i> : ''}
                    </a>
                    : ''}
                {menuItem.children ?
                    <ul
                        className={`sidebar-submenu ${menuItem.active ? 'menu-open' : ''}`}
                        style={menuItem.active ? { opacity: 1, transition: 'opacity 500ms ease-in' } : {}}
                    >
                        {menuItem.children.map((childrenItem, index) =>
                            <li key={index} className={childrenItem.children ? childrenItem.active ? 'active' : '' : ''}>
                                {(childrenItem.type === 'sub') ?
                                    <a href="javascript:void(0)" onClick={() => this.setNavActive(childrenItem)} >
                                        <i className="fa fa-circle"></i>{childrenItem.title} <i className="fa fa-angle-right pull-right"></i></a>
                                    : ''}

                                {(childrenItem.type === 'link') ?
                                    <Link
                                        to={`${process.env.PUBLIC_URL}${childrenItem.path}`}
                                        className={childrenItem.active ? 'active' : ''}
                                        onClick={() => this.setNavActive(childrenItem)}
                                    >
                                        <i className="fa fa-circle"></i>{childrenItem.title} </Link>
                                    : ''}
                                {childrenItem.children ?
                                    <ul className={`sidebar-submenu ${childrenItem.active ? 'menu-open' : 'active'}`}>
                                        {childrenItem.children.map((childrenSubItem, key) =>
                                            <li className={childrenSubItem.active ? 'active' : ''} key={key}>
                                                {(childrenSubItem.type === 'link') ?
                                                    <Link
                                                        to={`${process.env.PUBLIC_URL}${childrenSubItem.path}`}
                                                        className={childrenSubItem.active ? 'active' : ''}
                                                        onClick={() => this.setNavActive(childrenSubItem)}
                                                    >
                                                        <i className="fa fa-circle"></i>{childrenSubItem.title}</Link>
                                                    : ''}
                                            </li>
                                        )}
                                    </ul>
                                    : ''}
                            </li>
                        )}
                    </ul>
                    : ''}
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
    userBrands: state.user.user.brands,
    activeBrands: state.brand.activeBrands,
    items: state.item.items,
});

export default connect(
    mapStateToProps,
    { setSidebarMenuItem }
)(sidebar);