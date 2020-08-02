import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-responsive-modal';

import { connect } from 'react-redux';
import { initializeAll, updateItem, updateItemStatus, deleteItem } from '../../../actions'

export class Confirmed extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkedValues: [],
            myData: [],
            tabData: [],
            brands: [],
            brandsOfItem: [],
            currentId: "",
            openEditDialog: false,
            openViewDialog: false,
            upc: "",
            _brandId: this.props.currentBrandId,
            picture: "",
            title: "",
            titleArab: "",
            formValue: "",
            typeValue: "",
            unit: "",
            size: "",
            description: "",
            howToUse: "",
            descriptionArab: "",
            howToUseArab: "",
            comments: "",
        }
    }

    createBrandsOfState() {
        let tempBrands = [];
        let number = 0;
        this.props.activeBrands.map( brand => {
            let oneBrand = {
                number: number,
                _brandId: brand._id,
                allow: brand.allow,
                name: brand.name,
                picture: brand.picture
            }
            tempBrands.push(oneBrand);
            number ++;
        });
        this.setState({
            brands: tempBrands
        })
    }

    createTableData() {
        let data = [];
        let tempData = [];
        let tempBrands = [];

        this.props.items.map(item => {
            if( (item._brandId._id === this.props.currentBrandId) && (item.status === "Confirmed") ) {
                let oneData = {
                    image: <img src={`${process.env.PUBLIC_URL}/assets/images/items/${item.picture}`} style={{width:50,height:50}} placeholder={"Item picture"} />,
                    NAME: item.title,
                    UPC: item.upc,
                    SIZE: item.size,
                    UNIT: item.unit,
                    FORM: item.formValue,
                    BRAND: item._brandId.name,
                    LAST_UPDATED: item.lastUpdatedTime,
                }
                data.push(oneData);
                tempData.push(item);
                tempBrands.push(this.props.currentBrandId);
            }
        })
        this.setState({
            myData: data,
            tabData: tempData,
            brandsOfItem: tempBrands
        })
    }

    componentWillMount() {
        this.createBrandsOfState();
        this.createTableData();
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

    renderAlert() {
        if (this.props.unknown_error !== "") {
            return (
                <div className="alert alert-warning">
                    <strong>Oops! </strong>{this.props.unknown_error}
                </div>
            )
        }
    }  

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

    onOpenEditModal = () => {
        this.props.initializeAll();
        this.setState({ openEditDialog: true });
    };

    onOpenViewModal = () => {
        this.props.initializeAll();
        this.setState({ openViewDialog: true });
    };

    onCloseViewModal = () => {
        this.props.initializeAll();
        this.setState({ openViewDialog: false });
    }

    changeFileName = (originalFileName, newFileName) => {
        let pictureUrl = "", pictureName = "", pictureExtension = "" ;
        let beforePictureUrl = originalFileName;
        let dotIndex = beforePictureUrl.lastIndexOf(".");
        pictureExtension = beforePictureUrl.substr(dotIndex);
        pictureName = newFileName;
        pictureUrl = pictureName + pictureExtension;
        return pictureUrl;
    }

    save = () => {

        if(this.state.upc === "" || this.state._brandId === "" || this.state.title === "" || this.state.titleArab === "" || this.state.formValue === "" || this.state.typeValue === "" || this.state.unit === "" || this.state.size === "" || this.state.description === "" || this.state.howToUse === "" || this.state.descriptionArab === "" || this.state.howToUseArab === "" || this.state.comments === "" ) {
            toast.error("Please type all fields correctly.");
            return;
        }

        let pictureUrl = "";
        if(this.uploadInput.files[0] === undefined) {
            pictureUrl = this.state.picture;
        } else {
            pictureUrl = this.changeFileName(this.uploadInput.files[0].name, this.state.upc);
        }

        let item = {
            _id: this.state.currentId,
            upc: this.state.upc,
            _brandId: this.state._brandId,
            picture: pictureUrl,
            title: this.state.title,
            titleArab: this.state.titleArab,
            formValue: this.state.formValue,
            typeValue: this.state.typeValue,
            unit: this.state.unit,
            size: this.state.size,
            description: this.state.description,
            howToUse: this.state.howToUse,
            descriptionArab: this.state.descriptionArab,
            howToUseArab: this.state.howToUseArab,
            comments: this.state.comments,
        }
        var myJSON = JSON.stringify(item)
        let data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        data.append('fileName', pictureUrl);
        data.append('product',myJSON);
        this.props.updateItem(data, "Confirmed");

    }

    cancel = () => {
        this.setState({
            currentId: "",
            openEditDialog: false,
            openViewDialog: false,
            upc: "",
            _brandId: this.props.currentBrandId,
            picture: "",
            title: "",
            titleArab: "",
            formValue: "",
            typeValue: "",
            unit: "",
            size: "",
            description: "",
            howToUse: "",
            descriptionArab: "",
            howToUseArab: "",
            comments: "",
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleBrandOfItemChange = (e,index) => {
        let tempBrands = this.state.brandsOfItem;
        
        let value = e.target.value;

        tempBrands[index] = value;

        this.setState({
            brandsOfItem: tempBrands
        })
    }

    send = (row) => {
        let item = {
            _id: this.state.tabData[row.index]._id,
            upc: this.state.tabData[row.index].upc,
            _brandId: this.state.brandsOfItem[row.index],
            picture: this.state.tabData[row.index].picture,
            title: this.state.tabData[row.index].title,
            titleArab: this.state.tabData[row.index].titleArab,
            formValue: this.state.tabData[row.index].formValue,
            typeValue: this.state.tabData[row.index].typeValue,
            unit: this.state.tabData[row.index].unit,
            size: this.state.tabData[row.index].size,
            description: this.state.tabData[row.index].description,
            howToUse: this.state.tabData[row.index].howToUse,
            descriptionArab: this.state.tabData[row.index].descriptionArab,
            howToUseArab: this.state.tabData[row.index].howToUseArab,
            comments: this.state.tabData[row.index].comments,
        }
        var myJSON = JSON.stringify(item)
        let data = new FormData();
        data.append('file', null);
        data.append('fileName', this.state.tabData[row.index].picture);
        data.append('product',myJSON);
        this.props.updateItem(data,"Confirmed");
    }

    render() {
        const { pageSize, myClass, multiSelectOption, pagination } = this.props;
        const { openEditDialog, myData, openViewDialog } = this.state

        const columns = [];

        const widthList = [ 50, 170, 140, 90, 90, 100, 160, 200];
        let index = 0;

        for (var key in myData[0]) {
            columns.push({
                Header: ( key !== 'image' ) && ( key !== 'SEND' ) ? <b>{this.Capitalize(key.toString())}</b> : null,
                accessor: key,
                filterable: key === 'UPC'? true : false,
                filterMethod: (filter, row) => 
                    row[filter.id].indexOf(filter.value) !== -1,
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
                Header: null,
                id: 'send',
                accessor: str => "send",
                Cell: (row) => (
                    <div className="row" style={{marginLeft: 2}}>
                        <select value={this.state.brandsOfItem[row.index]} className="form-control digits col-sm-8" name="brandSelect" style={{marginRight: 2, fontSize: 15}} onChange={ (e) => this.handleBrandOfItemChange(e,row.index) }>
                            {this.state.brands.map(oneBrand => 
                                <option key={oneBrand._brandId} value={oneBrand._brandId}>
                                    { "Confirmed: " + oneBrand.name}
                                </option>
                            )}
                            
                        </select>

                        <span
                            onClick={() => {
                                this.send(row);
                            }}
                            style={{backgroundColor: 'rgb(132, 230, 0)', color: 'black', marginRight: '5px', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Send
                        </span>

                    </div>
            ),
            style: {
                textAlign: 'center'
            },
            sortable: false,
            width: 250
        })

        columns.push(
            {
                Header: <b>ACTION</b>,
                id: 'edit',
                accessor: str => "edit",
                Cell: (row) => (
                    <div>
                        <span
                            onClick={() => {
                                this.setState({
                                    currentId: this.state.tabData[row.index]._id,
                                    upc: this.state.tabData[row.index].upc,
                                    _brandId: this.props.currentBrandId,
                                    picture: this.state.tabData[row.index].picture,
                                    title: this.state.tabData[row.index].title,
                                    titleArab: this.state.tabData[row.index].titleArab,
                                    formValue: this.state.tabData[row.index].formValue,
                                    typeValue: this.state.tabData[row.index].typeValue,
                                    unit: this.state.tabData[row.index].unit,
                                    size: this.state.tabData[row.index].size,
                                    description: this.state.tabData[row.index].description,
                                    howToUse: this.state.tabData[row.index].howToUse,
                                    descriptionArab: this.state.tabData[row.index].descriptionArab,
                                    howToUseArab: this.state.tabData[row.index].howToUseArab,
                                    comments: this.state.tabData[row.index].comments,
                                })

                                this.onOpenEditModal();
                            }}
                        >
                            <i className="fa fa-pencil" style={{ width: 35, fontSize: 20, padding: 11,color:'rgb(40, 167, 69)', cursor: 'pointer' }}></i>
                        </span>

                        <span
                            onClick={() => {
                                this.setState({
                                    currentId: this.state.tabData[row.index]._id,
                                    upc: this.state.tabData[row.index].upc,
                                    _brandId: this.props.currentBrandId,
                                    picture: this.state.tabData[row.index].picture,
                                    title: this.state.tabData[row.index].title,
                                    titleArab: this.state.tabData[row.index].titleArab,
                                    formValue: this.state.tabData[row.index].formValue,
                                    typeValue: this.state.tabData[row.index].typeValue,
                                    unit: this.state.tabData[row.index].unit,
                                    size: this.state.tabData[row.index].size,
                                    description: this.state.tabData[row.index].description,
                                    howToUse: this.state.tabData[row.index].howToUse,
                                    descriptionArab: this.state.tabData[row.index].descriptionArab,
                                    howToUseArab: this.state.tabData[row.index].howToUseArab,
                                    comments: this.state.tabData[row.index].comments,
                                })

                                this.onOpenViewModal();
                            }}
                            style={{backgroundColor: 'rgb(0, 164, 228)', color: 'white', marginRight: '5px', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            View
                        </span>

                        <span
                            onClick={() => {
                                let itemObj = {
                                    _id: this.state.tabData[row.index]._id,
                                    status: "Completed"
                                }
                                this.props.updateItemStatus(itemObj, "Confirmed");
                            }}
                            style={{backgroundColor: 'rgb(199, 0, 28)', color: 'white', marginRight: '5px', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Cancel
                        </span>

                        
                        <span
                            onClick={() => {
                                let itemObj = {
                                    _id: this.state.tabData[row.index]._id,
                                    status: "Done"
                                }
                                this.props.updateItemStatus(itemObj, "Confirmed");
                            }}
                            style={{backgroundColor: 'rgb(96, 99, 98)', color: 'white', marginRight: '5px', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Done
                        </span>

                    </div>
            ),
            style: {
                textAlign: 'center'
            },
            sortable: false,
            width: 270
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

                <Modal open={openEditDialog} onClose={this.cancel} >
                    <div className="modal-header">
                        <h5 className="modal-title f-w-600" id="exampleModalLabel2">Edit Item</h5>
                    </div>
                    <div className="modal-body">
                        <form>
                            {this.renderAlert()}
                            <div className="form-group">
                                <input className="form-control" ref={(ref) => { this.uploadInput = ref; }} type="file" required={true}/>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >UPC :</label>
                                <input type="text" className="form-control col-md-7" name="upc" value={this.state.upc} onChange={this.onChange} />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Title :</label>
                                <input type="text" className="form-control col-md-7" name="title" value={this.state.title} onChange={this.onChange} />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Title(Arab) :</label>
                                <input type="text" className="form-control col-md-7" name="titleArab" value={this.state.titleArab} onChange={this.onChange} />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Form :</label>
                                <input type="text" className="form-control col-md-7" name="formValue" value={this.state.formValue} onChange={this.onChange} />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Type :</label>
                                <input type="text" className="form-control col-md-7" name="typeValue" value={this.state.typeValue} onChange={this.onChange} />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Unit Of Size :</label>
                                <input type="text" className="form-control col-md-7" name="unit" value={this.state.unit} onChange={this.onChange} />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Size :</label>
                                <input type="text" className="form-control col-md-7" name="size" value={this.state.size} onChange={this.onChange} />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Product Description :</label>
                                <input type="text" className="form-control col-md-7" name="description" value={this.state.description} onChange={this.onChange} />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >How To Use?</label>
                                <input type="text" className="form-control col-md-7" name="howToUse" value={this.state.howToUse} onChange={this.onChange} />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Product Description(Arab) :</label>
                                <input type="text" className="form-control col-md-7" name="descriptionArab" value={this.state.descriptionArab} onChange={this.onChange} />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >How To Use(Arab)?</label>
                                <input type="text" className="form-control col-md-7" name="howToUseArab" value={this.state.howToUseArab} onChange={this.onChange} />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Editor Comments :</label>
                                <input type="text" className="form-control col-md-7" name="comments" value={this.state.comments} onChange={this.onChange} />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={this.save}>Save</button>
                        <button type="button" className="btn btn-secondary" onClick={this.cancel}>Close</button>
                    </div>
                </Modal>

                <Modal open={openViewDialog} onClose={this.onCloseViewModal} >
                    <div className="modal-header">
                        <h5 className="modal-title f-w-600" id="exampleModalLabel2">View Item</h5>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >UPC :</label>
                                <input type="text" className="form-control col-md-7" name="upc" value={this.state.upc} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Title :</label>
                                <input type="text" className="form-control col-md-7" name="title" value={this.state.title} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Title(Arab) :</label>
                                <input type="text" className="form-control col-md-7" name="titleArab" value={this.state.titleArab} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Form :</label>
                                <input type="text" className="form-control col-md-7" name="formValue" value={this.state.formValue} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Type :</label>
                                <input type="text" className="form-control col-md-7" name="typeValue" value={this.state.typeValue} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Unit Of Size :</label>
                                <input type="text" className="form-control col-md-7" name="unit" value={this.state.unit} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Size :</label>
                                <input type="text" className="form-control col-md-7" name="size" value={this.state.size} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Product Description :</label>
                                <input type="text" className="form-control col-md-7" name="description" value={this.state.description} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >How To Use?</label>
                                <input type="text" className="form-control col-md-7" name="howToUse" value={this.state.howToUse} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Product Description(Arab) :</label>
                                <input type="text" className="form-control col-md-7" name="descriptionArab" value={this.state.descriptionArab} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >How To Use(Arab)?</label>
                                <input type="text" className="form-control col-md-7" name="howToUseArab" value={this.state.howToUseArab} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Editor Comments :</label>
                                <input type="text" className="form-control col-md-7" name="comments" value={this.state.comments} readOnly />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={this.onCloseViewModal}>Close</button>
                    </div>
                </Modal>

                <ToastContainer />

            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    items: state.item.items,
    currentBrandId: state.currentStatus.currentBrandId,
    unknown_error: state.currentStatus.unknown_error,
    activeBrands: state.brand.activeBrands,
});

export default connect(
    mapStateToProps,
    { initializeAll, updateItem, updateItemStatus, deleteItem }
)(Confirmed);