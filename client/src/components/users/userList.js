import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-responsive-modal';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { connect } from 'react-redux';
import { updateUser, deleteUser, initializeAll } from '../../actions'

export class UserList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkedValues: [],
            myData: [],
            open: false,
            allUsers: [],
            currentId: "",
            name: "",
            username: "",
            password: "",
            brands: [],
        }
    }

    createTableData() {
        let data = [];
        let tempData = [];
        this.props.users.map(user => {
            let userBrand = "";
            let count = 0;
            user.brands.map(oneItem => {
                if( count === 0)
                    userBrand += oneItem._brandId.name;
                else
                    userBrand += ", " + oneItem._brandId.name;
                count ++;
            })
            let oneData = {
                Name: user.name,
                UserName: user.username,
                Brands: userBrand,
                CreatedAt: user.createdTime,
            }
            data.push(oneData);
            tempData.push(user);
        })
        this.setState({
            myData: data,
            allUsers: tempData,
        })
    }

    componentWillMount() {
        this.createTableData();
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

    selectRow = (e, i) => {
        if (!e.target.checked) {
            this.setState({
                checkedValues: this.state.checkedValues.filter((item, j) => i !== item)
            });
        } else {
            this.state.checkedValues.push(i);
            this.setState({
                checkedValues: this.state.checkedValues
            })
        }
    }

    handleRemoveRow = () => {
        const selectedValues = this.state.checkedValues;
        const updatedData = this.state.myData.filter(function (el) {
            return selectedValues.indexOf(el.id) < 0;
        });
        this.setState({
            myData: updatedData
        })
        toast.success("Successfully Deleted !")
    };

    renderEditable = (cellInfo) => {
        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.myData];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({ myData: data });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.myData[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }

    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    save = () => {

        let updatedUser = {};
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

        updatedUser = {
            _id: this.state.currentId,
            name: this.state.name,
            username: this.state.username,
            password: this.state.password,
            brands: userBrands
        }

        this.props.updateUser(updatedUser);

        this.setState({ 
            open: false,
            currentId: "",
            name: "",
            username: "",
            password: "",
            brands: [],
        });
    }

    cancel = () => {
        this.setState({ 
            open: false,
            currentId: "",
            name: "",
            username: "",
            password: "",
            brands: [],
        });
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

    render() {
        const { pageSize, myClass, multiSelectOption, pagination } = this.props;
        const { myData, allUsers, open } = this.state

        const columns = [];

        const widthList = [ 200, 250, 600, 250]
        let index = 0;

        for (var key in myData[0]) {
            columns.push({
                Header: key !== 'image'? <b>{this.Capitalize(key.toString())}</b> : null,
                accessor: key,
                Cell: null,
                style: {
                    textAlign: 'center',
                },
                width: widthList[index]
            });

            index ++;
        }

        columns.push(
            {
                Header: <b>ACTION</b>,
                id: 'delete',
                accessor: str => "delete",
                Cell: (row) => (
                    <div>
                        <span
                            onClick={() => {

                                let userBrands = [];
                                let number = 0;
                                allUsers[row.index].brands.map( brand => {
                                    let oneBrand = {
                                        number: number,
                                        _brandId: brand._brandId,
                                        Submitted: brand.Submitted,
                                        Approved: brand.Approved,
                                        Arabic: brand.Arabic,
                                        Completed: brand.Completed,
                                        Confirmed: brand.Confirmed,
                                        Done: brand.Done,  
                                    }
                                    userBrands.push(oneBrand);
                                    number ++;
                                });

                                this.setState({
                                    currentId: allUsers[row.index]._id,
                                    name: allUsers[row.index].name,
                                    username: allUsers[row.index].username,
                                    brands: userBrands,
                                })
                                this.onOpenModal();
                            }}
                        >
                            <i className="fas fa-edit" style={{ width: 35, fontSize: 20, paddingRight: 3,color:'rgb(0, 123, 253)', cursor: 'pointer' }}></i>
                        </span>
                        
                        <span style={{fontSize: 20}}>|</span>                        
                        
                        <span
                            onClick={() => {
                                if (window.confirm('Are you sure you wish to delete this user?')) {
                                    let currentId = allUsers[row.index]._id;
                                    this.props.deleteUser(currentId);
                                }
                            }}
                        >
                            <i className="fa fa-trash" style={{ width: 35, fontSize: 25, color:'rgb(0, 123, 253)', cursor: 'pointer' }}></i>
                        </span>
                    </div>
            ),
            style: {
                textAlign: 'center'
            },
            sortable: false,
            width: 200
        })

        return (
            <Fragment>
                <ReactTable
                    data={myData}
                    columns={columns}
                    defaultPageSize={pageSize}
                    className={myClass}
                    showPagination={pagination}
                />

                <Modal open={open} onClose={this.cancel} >
                    <div className="modal-header">
                        <h5 className="modal-title f-w-600" id="exampleModalLabel2">Update User</h5>
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
                            {/* <div className="form-group">
                                <label htmlFor="recipient-name" className="col-form-label" >Password :</label>
                                <input type="text" className="form-control" name="password" value={this.state.password} onChange={this.handleChange} />
                            </div> */}
                            <div className="form-group">
                                <label htmlFor="recipient-name" className="col-form-label" >Brands Access :</label>
                                {this.state.brands.map(brand =>  
                                    <>
                                        <select className="form-control digits" name="brandSelect" onChange={ (e) => this.handleBrandSelectChange(e, brand.number) }>
                                            <option value="" >Select Brand</option>
                                            {this.props.activeBrands.map(oneBrand => 
                                                <option key={oneBrand._id} value={oneBrand._id} selected={brand._brandId._id === oneBrand._id ? true: false}>
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

                <ToastContainer />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    users: state.user.users,
    unknown_error: state.currentStatus.unknown_error,
    activeBrands: state.brand.activeBrands,
});

export default connect(
    mapStateToProps,
    { updateUser, deleteUser, initializeAll }
)(UserList);