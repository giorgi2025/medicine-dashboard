import React, { Component, Fragment} from 'react'
import Modal from 'react-responsive-modal';
import 'react-toastify/dist/ReactToastify.css';
import UserList from './userList';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { connect } from 'react-redux';
import { addUser, initializeAll } from '../../actions'

export class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            name: "",
            username: "",
            password: "",
            brands: [{
                number: 0,
                _brandId: "",
                Submitted: false,
                Approved: false,
                Arabic: false,
                Completed: false,
                Confirmed: false,
                Done: false,    
            }]
        };
        this.props.initializeAll();
    }
    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleBrandSelectChange = (e, count) => {
        let tempBrands = this.state.brands;
        
        let name = "_brandId";
        let value = e.target.value;

        const oneItem = tempBrands[count];

        tempBrands[count] = {
            ...oneItem,
            [name] : value
        };

        this.setState({
            brands: [...tempBrands]
        })
    }

    handleBrandCheckBoxChange = (e, count) => {
        let tempBrands = this.state.brands;
        
        let name = e.target.name;
        let value = !tempBrands[count][e.target.name];

        const oneItem = tempBrands[count];

        tempBrands[count] = {
            ...oneItem,
            [name] : value
        };

        this.setState({
            brands: [...tempBrands]
        })
    }

    addMoreBrand = (e) => {
        let tempBrands = this.state.brands;
        
        let newBrand = {
            number: this.state.brands.length,
            _brandId: "",
            Submitted: false,
            Approved: false,
            Arabic: false,
            Completed: false,
            Confirmed: false,
            Done: false,  
        }

        this.setState({
            brands: [...tempBrands, newBrand]
        })
    }

    save = () => {

        let newUser = {};
        let userBrands = [];
        this.state.brands.map( brand => {
            let oneBrand = {
                _brandId: brand._brandId,
                Submitted: brand.Submitted,
                Approved: brand.Approved,
                Arabic: brand.Arabic,
                Completed: brand.Completed,
                Confirmed: brand.Confirmed,
                Done: brand.Done,  
            }
            userBrands.push(oneBrand);
        });

        newUser = {
            name: this.state.name,
            username: this.state.username,
            password: this.state.password,
            brands: userBrands
        }

        this.props.addUser(newUser);

        this.setState({ 
            open: false,
            name: "",
            username: "",
            password: "",
            brands: [{
                number: 0,
                _brandId: "",
                Submitted: false,
                Approved: false,
                Arabic: false,
                Completed: false,
                Confirmed: false,
                Done: false,    
            }]
        });
    }

    cancel = () => {
        this.setState({ 
            open: false,
            name: "",
            username: "",
            password: "",
            brands: [{
                number: 0,
                _brandId: "",
                Submitted: false,
                Approved: false,
                Arabic: false,
                Completed: false,
                Confirmed: false,
                Done: false,    
            }]
        });
    }

    render() {
        const { open } = this.state;
        return (
            <Fragment>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card" style={{marginTop: 80}}>
                                <div className="card-header">
                                    <h5>Users</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">

                                        <button type="button" className="btn btn-primary" onClick={this.onOpenModal} data-toggle="modal" data-original-title="test" data-target="#exampleModal">Add New User</button>
                                        <Modal open={open} onClose={this.cancel} >
                                            <div className="modal-header">
                                                <h5 className="modal-title f-w-600" id="exampleModalLabel2">Create New User</h5>
                                            </div>
                                            <div className="modal-body">
                                                <form>
                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Name :</label>
                                                        <input type="text" className="form-control" name="name" value={this.state.name} onChange={this.handleChange} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >User Name :</label>
                                                        <input type="text" className="form-control" name="username" value={this.state.username} onChange={this.handleChange} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Password :</label>
                                                        <input type="text" className="form-control" name="password" value={this.state.password} onChange={this.handleChange} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Brands Access :</label>
                                                        {this.state.brands.map(brand =>  
                                                            <>
                                                                <select className="form-control digits" name="brandSelect" onChange={ (e) => this.handleBrandSelectChange(e, brand.number) }>
                                                                    <option value="" >Select Brand</option>
                                                                    {this.props.activeBrands.map(oneBrand => 
                                                                        <option key={oneBrand._id} value={oneBrand._id} selected={brand._brandId === oneBrand._id ? true: false}>
                                                                            {oneBrand.name}
                                                                        </option>
                                                                    )}
                                                                    
                                                                </select>

                                                                <FormControlLabel
                                                                    control={
                                                                    <Checkbox
                                                                        checked={brand.Submitted}
                                                                        onChange={ (e) => this.handleBrandCheckBoxChange(e, brand.number)}
                                                                        name="Submitted"
                                                                        color="primary"
                                                                    />
                                                                    }
                                                                    label="Submitted"
                                                                />

                                                                <FormControlLabel
                                                                    control={
                                                                    <Checkbox
                                                                        checked={brand.Approved}
                                                                        onChange={ (e) => this.handleBrandCheckBoxChange(e, brand.number)}
                                                                        name="Approved"
                                                                        color="primary"
                                                                    />
                                                                    }
                                                                    label="Approved"
                                                                />

                                                                <FormControlLabel
                                                                    control={
                                                                    <Checkbox
                                                                        checked={brand.Arabic}
                                                                        onChange={ (e) => this.handleBrandCheckBoxChange(e, brand.number)}
                                                                        name="Arabic"
                                                                        color="primary"
                                                                    />
                                                                    }
                                                                    label="Arabic"
                                                                />
                                                                <FormControlLabel
                                                                    control={
                                                                    <Checkbox
                                                                        checked={brand.Completed}
                                                                        onChange={ (e) => this.handleBrandCheckBoxChange(e, brand.number)}
                                                                        name="Completed"
                                                                        color="primary"
                                                                    />
                                                                    }
                                                                    label="Completed"
                                                                />

                                                                <FormControlLabel
                                                                    control={
                                                                    <Checkbox
                                                                        checked={brand.Confirmed}
                                                                        onChange={ (e) => this.handleBrandCheckBoxChange(e, brand.number)}
                                                                        name="Confirmed"
                                                                        color="primary"
                                                                    />
                                                                    }
                                                                    label="Confirmed"
                                                                />

                                                                <FormControlLabel
                                                                    control={
                                                                    <Checkbox
                                                                        checked={brand.Done}
                                                                        onChange={ (e) => this.handleBrandCheckBoxChange(e, brand.number)}
                                                                        name="Done"
                                                                        color="primary"
                                                                    />
                                                                    }
                                                                    label="Done"
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                    <button type="button" onClick={this.addMoreBrand}>+ Add More Brand</button>    
                                                </form>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-primary" onClick={this.save}>Save</button>
                                                <button type="button" className="btn btn-secondary" onClick={this.cancel}>Close</button>
                                            </div>
                                        </Modal>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div id="basicScenario" className="product-physical">
                                        <UserList
                                            multiSelectOption={false}
                                            pageSize={5} 
                                            pagination={true}
                                            class="-striped -highlight" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    unknown_error: state.currentStatus.unknown_error,
    activeBrands: state.brand.activeBrands
});

export default connect(
    mapStateToProps,
    { addUser, initializeAll }
)(Users);