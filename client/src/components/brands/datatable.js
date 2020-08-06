import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-responsive-modal';

import { connect } from 'react-redux';
import { initializeAll, updateItem, updateItemStatus, deleteItem, createItemIdList } from '../../actions'

import * as service from '../../services';
import store from "../../store";

var statusOfItem = [];

export class Datatable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkedValues: [],
            myData: [],
            brandsOfItem: [],
            openEditDialog: false,
            openViewDialog: false,
            _id: "",
            upc: "",
            _brandId: this.props.currentBrandId,
            brand: "",
            picture: "",
            picture2: "",
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
            file: "",
            file2: ""
        }

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

    changeFileName2 = (originalFileName, newFileName) => {
        let pictureUrl = "", pictureName = "", pictureExtension = "" ;
        let beforePictureUrl = originalFileName;
        let dotIndex = beforePictureUrl.lastIndexOf(".");
        pictureExtension = beforePictureUrl.substr(dotIndex);
        pictureName = newFileName + "-B";
        pictureUrl = pictureName + pictureExtension;
        return pictureUrl;
    }

    save = () => {
        this.props.initializeAll();

        if(this.state.upc === "" ) {
            toast.error("Please type all fields correctly.");
            return;
        }

        if(this.state.isDoubleUPC) {
            toast.error("upc already exists!");
            return;
        }

        let pictureUrl = "", pictureUrl2 = "";
        if(this.uploadInput.files.length === 0 ) {
            pictureUrl = this.state.picture;
        } else {
            pictureUrl = this.changeFileName(this.uploadInput.files[0].name, this.state.upc);
        }

        if(this.uploadInput2.files.length === 0 ) {
            pictureUrl2 = this.state.picture2;
        } else {
            pictureUrl2 = this.changeFileName2(this.uploadInput2.files[0].name, this.state.upc);
        }


        let item = {
            _id: this.state._id,
            upc: this.state.upc,
            _brandId: this.state._brandId,
            brand: this.state.brand,
            picture: pictureUrl,
            picture2: pictureUrl2,
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
        data.append('file2', this.uploadInput2.files[0]);
        data.append('fileName', pictureUrl);
        data.append('fileName2', pictureUrl2);
        data.append('product',myJSON);
        this.props.updateItem(data, this.props.currentTab);

        this.setState({
            openEditDialog: false,
            openViewDialog: false,
            _id: "",
            upc: "",
            _brandId: this.props.currentBrandId,
            brand: "",
            picture: "",
            picture2: "",
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
            file: "",
            file2: "",
        })
    }

    cancel = () => {
        this.setState({
            openEditDialog: false,
            openViewDialog: false,
            _id: "",
            upc: "",
            _brandId: this.props.currentBrandId,
            brand: "",
            picture: "",
            picture2: "",
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
            file: "",
            file2: "",
        })
        this.props.initializeAll();
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })

        if(e.target.name === "upc") {
            let tempFlag = false;
            this.props.items.map(item => {
                if(item.upc === e.target.value) {
                    tempFlag = true;
                } 
            })
            this.setState({
                isDoubleUPC: tempFlag
            })
        }
    }

    handleBrandOfItemChange = (e,index) => {
        let value = e.target.value;
        statusOfItem[index] = value;
    }

    
    send = (newItem, row, currentTabStatus) => {

        let item = {
            _id: newItem._id,
            upc: newItem.upc,
            _brandId: statusOfItem[row.index],
            brand: newItem.brand,
            picture: newItem.picture,
            picture2: newItem.picture2,
            title: newItem.title,
            titleArab: newItem.titleArab,
            formValue: newItem.formValue,
            typeValue: newItem.typeValue,
            unit: newItem.unit,
            size: newItem.size,
            description: newItem.description,
            howToUse: newItem.howToUse,
            descriptionArab: newItem.descriptionArab,
            howToUseArab: newItem.howToUseArab,
            comments: newItem.comments,
        }
        var myJSON = JSON.stringify(item)
        let data = new FormData();
        data.append('file', null);
        data.append('fileName', newItem.picture);
        data.append('product',myJSON);
        this.props.updateItem(data,currentTabStatus);
    }
    
    handleFileChange = (event) => {
        this.setState({
            file: event.target.files[0] !== undefined
                    ? URL.createObjectURL(event.target.files[0])
                    : ""
        })
    }

    handleFile2Change = (event) => {
        this.setState({
            file2: event.target.files[0] !== undefined
                    ? URL.createObjectURL(event.target.files[0])
                    : ""
        })
    }

    render() {
        const { pageSize, myClass, multiSelectOption, pagination, currentTab } = this.props;
        const { openEditDialog, openViewDialog } = this.state


        const columns = [];

        //Create width's list
        let widthList = [];
        switch(this.props.currentTab) {
            case "Submitted":
            case "Approved":
            case "Arabic":
            case "Completed":            
            case "Confirmed":
            case "Done":
                widthList = [ 50, 170, 140, 90, 90, 100, 160, 200];
                break;
            default:
                widthList = [ 50, 170, 140, 90, 90, 100, 160, 200];
                break;
        }

        let index = 0;


        //Create table's data.
        var tableData = [];
        var itemIdList = [];
        statusOfItem = [];
        this.props.items.map(item => {
            if( (item._brandId._id === this.props.currentBrandId) && (item.status === this.props.currentTab) ) {
                let oneData = {
                    image: <img src={`${process.env.PUBLIC_URL}/assets/images/items/${item.picture}`} style={{width:50,height:50}} placeholder={"Item picture"} />,
                    NAME: item.title,
                    UPC: item.upc,
                    SIZE: item.size,
                    UNIT: item.unit,
                    FORM: item.formValue,
                    BRAND: item.brand,
                    LAST_UPDATED: item.lastUpdatedTime,
                }
                tableData.push(oneData);
                itemIdList.push(item);
                statusOfItem.push(this.props.currentBrandId);
            }
        })

        // //Get current tab's data by brand's id and tab's index.
        // this.props.createItemIdList(this.props.items, this.props.currentBrandId, this.props.currentTab);

        for (var key in tableData[0]) {
            columns.push({
                Header: key !== 'image'? <b>{this.Capitalize(key.toString())}</b> : null,
                accessor: key,
                filterable: key === 'image' || key === 'LAST_UPDATED' ? false : true,
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

        //Add "send" button.
        columns.push(
            {
                Header: null,
                id: 'send',
                accessor: str => "send",
                Cell: (row) => (
                    <div className="row" style={{marginLeft: 2}}>
                        <select className="form-control digits col-sm-8" name="brandSelect" style={{marginRight: 2, fontSize: 15}} onChange={ (e) => this.handleBrandOfItemChange(e,row.index) }>
                            {this.props.brandsList.map(oneBrand => 
                                <option key={oneBrand._brandId} value={oneBrand._brandId} selected={this.props.currentBrandId === oneBrand._brandId ? true: false}>
                                    { this.props.currentTab + ": " + oneBrand.name}
                                </option>
                            )}
                            
                        </select>

                        <span
                            onClick={() => {
                                let item = {
                                    _id: itemIdList[row.index]._id,
                                    upc: itemIdList[row.index].upc,
                                    _brandId: this.props.currentBrandId,
                                    brand: itemIdList[row.index].brand,
                                    picture: itemIdList[row.index].picture,
                                    picture2: itemIdList[row.index].picture2,
                                    title: itemIdList[row.index].title,
                                    titleArab: itemIdList[row.index].titleArab,
                                    formValue: itemIdList[row.index].formValue,
                                    typeValue: itemIdList[row.index].typeValue,
                                    unit: itemIdList[row.index].unit,
                                    size: itemIdList[row.index].size,
                                    description: itemIdList[row.index].description,
                                    howToUse: itemIdList[row.index].howToUse,
                                    descriptionArab: itemIdList[row.index].descriptionArab,
                                    howToUseArab: itemIdList[row.index].howToUseArab,
                                    comments: itemIdList[row.index].comments,
                                };
                                this.send(item, row, this.props.currentTab);
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


        //Add action buttons according to tab status.
        if(this.props.currentTab === "Submitted") {
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
                                        _id: itemIdList[row.index]._id,
                                        upc: itemIdList[row.index].upc,
                                        _brandId: this.props.currentBrandId,
                                        brand: itemIdList[row.index].brand,
                                        picture: itemIdList[row.index].picture,
                                        picture2: itemIdList[row.index].picture2,
                                        title: itemIdList[row.index].title,
                                        titleArab: itemIdList[row.index].titleArab,
                                        formValue: itemIdList[row.index].formValue,
                                        typeValue: itemIdList[row.index].typeValue,
                                        unit: itemIdList[row.index].unit,
                                        size: itemIdList[row.index].size,
                                        description: itemIdList[row.index].description,
                                        howToUse: itemIdList[row.index].howToUse,
                                        descriptionArab: itemIdList[row.index].descriptionArab,
                                        howToUseArab: itemIdList[row.index].howToUseArab,
                                        comments: itemIdList[row.index].comments,
                                    })

                                    this.onOpenEditModal();
                                }}
                            >
                                <i className="fa fa-pencil" style={{ width: 35, fontSize: 20, padding: 11,color:'rgb(40, 167, 69)', cursor: 'pointer' }}></i>
                            </span>

                            <span
                                onClick={() => {
                                    this.setState({
                                        _id: itemIdList[row.index]._id,
                                        upc: itemIdList[row.index].upc,
                                        _brandId: this.props.currentBrandId,
                                        brand: itemIdList[row.index].brand,
                                        picture: itemIdList[row.index].picture,
                                        picture2: itemIdList[row.index].picture2,
                                        title: itemIdList[row.index].title,
                                        titleArab: itemIdList[row.index].titleArab,
                                        formValue: itemIdList[row.index].formValue,
                                        typeValue: itemIdList[row.index].typeValue,
                                        unit: itemIdList[row.index].unit,
                                        size: itemIdList[row.index].size,
                                        description: itemIdList[row.index].description,
                                        howToUse: itemIdList[row.index].howToUse,
                                        descriptionArab: itemIdList[row.index].descriptionArab,
                                        howToUseArab: itemIdList[row.index].howToUseArab,
                                        comments: itemIdList[row.index].comments,
                                    })

                                    this.onOpenViewModal();
                                }}
                                style={{backgroundColor: 'rgb(0, 164, 228)', color: 'white', marginRight: '5px', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                View
                            </span>

                            <span
                                onClick={() => {
                                    if (window.confirm('Are you sure you wish to delete this item?')) {
                                        this.props.deleteItem(itemIdList[row.index]._id);
                                    }
                                }}
                                style={{backgroundColor: 'rgb(199, 0, 28)', color: 'white', marginRight: '5px', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Delete
                            </span>

                            
                            <span
                                onClick={() => {
                                    let itemObj = {
                                        _id: itemIdList[row.index]._id,
                                        status: "Approved"
                                    }
                                    this.props.updateItemStatus(itemObj);
                                }}
                                style={{backgroundColor: 'rgb(0, 165, 79)', color: 'white', marginRight: '5px', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Approve
                            </span>
                        </div>
                ),
                style: {
                    textAlign: 'center'
                },
                sortable: false,
                width: 270
            })
        } else if(this.props.currentTab === "Approved") {
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
                                        _id: itemIdList[row.index]._id,
                                        upc: itemIdList[row.index].upc,
                                        _brandId: this.props.currentBrandId,
                                        brand: itemIdList[row.index].brand,
                                        picture: itemIdList[row.index].picture,
                                        picture2: itemIdList[row.index].picture2,
                                        title: itemIdList[row.index].title,
                                        titleArab: itemIdList[row.index].titleArab,
                                        formValue: itemIdList[row.index].formValue,
                                        typeValue: itemIdList[row.index].typeValue,
                                        unit: itemIdList[row.index].unit,
                                        size: itemIdList[row.index].size,
                                        description: itemIdList[row.index].description,
                                        howToUse: itemIdList[row.index].howToUse,
                                        descriptionArab: itemIdList[row.index].descriptionArab,
                                        howToUseArab: itemIdList[row.index].howToUseArab,
                                        comments: itemIdList[row.index].comments,
                                    })

                                    this.onOpenEditModal();
                                }}
                            >
                                <i className="fa fa-pencil" style={{ width: 35, fontSize: 20, padding: 11,color:'rgb(40, 167, 69)', cursor: 'pointer' }}></i>
                            </span>

                            <span
                                onClick={() => {
                                    this.setState({
                                        _id: itemIdList[row.index]._id,
                                        upc: itemIdList[row.index].upc,
                                        _brandId: this.props.currentBrandId,
                                        brand: itemIdList[row.index].brand,
                                        picture: itemIdList[row.index].picture,
                                        picture2: itemIdList[row.index].picture2,
                                        title: itemIdList[row.index].title,
                                        titleArab: itemIdList[row.index].titleArab,
                                        formValue: itemIdList[row.index].formValue,
                                        typeValue: itemIdList[row.index].typeValue,
                                        unit: itemIdList[row.index].unit,
                                        size: itemIdList[row.index].size,
                                        description: itemIdList[row.index].description,
                                        howToUse: itemIdList[row.index].howToUse,
                                        descriptionArab: itemIdList[row.index].descriptionArab,
                                        howToUseArab: itemIdList[row.index].howToUseArab,
                                        comments: itemIdList[row.index].comments,
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
                                        _id: itemIdList[row.index]._id,
                                        status: "Submitted"
                                    }
                                    this.props.updateItemStatus(itemObj, "Approved");
                                }}
                                style={{backgroundColor: 'rgb(199, 0, 28)', color: 'white', marginRight: '5px', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Review
                            </span>

                            
                            <span
                                onClick={() => {
                                    let itemObj = {
                                        _id: itemIdList[row.index]._id,
                                        status: "Arabic"
                                    }
                                    this.props.updateItemStatus(itemObj, "Approved");
                                }}
                                style={{backgroundColor: 'rgb(242, 119, 0)', color: 'white', marginRight: '5px', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Arabic
                            </span>

                        </div>
                ),
                style: {
                    textAlign: 'center'
                },
                sortable: false,
                width: 270
            })
        } else if(this.props.currentTab === "Arabic") {
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
                                        _id: itemIdList[row.index]._id,
                                        upc: itemIdList[row.index].upc,
                                        _brandId: this.props.currentBrandId,
                                        brand: itemIdList[row.index].brand,
                                        picture: itemIdList[row.index].picture,
                                        picture2: itemIdList[row.index].picture2,
                                        title: itemIdList[row.index].title,
                                        titleArab: itemIdList[row.index].titleArab,
                                        formValue: itemIdList[row.index].formValue,
                                        typeValue: itemIdList[row.index].typeValue,
                                        unit: itemIdList[row.index].unit,
                                        size: itemIdList[row.index].size,
                                        description: itemIdList[row.index].description,
                                        howToUse: itemIdList[row.index].howToUse,
                                        descriptionArab: itemIdList[row.index].descriptionArab,
                                        howToUseArab: itemIdList[row.index].howToUseArab,
                                        comments: itemIdList[row.index].comments,
                                    })

                                    this.onOpenEditModal();
                                }}
                            >
                                <i className="fa fa-pencil" style={{ width: 35, fontSize: 20, padding: 11,color:'rgb(40, 167, 69)', cursor: 'pointer' }}></i>
                            </span>

                            <span
                                onClick={() => {
                                    this.setState({
                                        _id: itemIdList[row.index]._id,
                                        upc: itemIdList[row.index].upc,
                                        _brandId: this.props.currentBrandId,
                                        brand: itemIdList[row.index].brand,
                                        picture: itemIdList[row.index].picture,
                                        picture2: itemIdList[row.index].picture2,
                                        title: itemIdList[row.index].title,
                                        titleArab: itemIdList[row.index].titleArab,
                                        formValue: itemIdList[row.index].formValue,
                                        typeValue: itemIdList[row.index].typeValue,
                                        unit: itemIdList[row.index].unit,
                                        size: itemIdList[row.index].size,
                                        description: itemIdList[row.index].description,
                                        howToUse: itemIdList[row.index].howToUse,
                                        descriptionArab: itemIdList[row.index].descriptionArab,
                                        howToUseArab: itemIdList[row.index].howToUseArab,
                                        comments: itemIdList[row.index].comments,
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
                                        _id: itemIdList[row.index]._id,
                                        status: "Approved"
                                    }
                                    this.props.updateItemStatus(itemObj, "Arabic");
                                }}
                                style={{backgroundColor: 'rgb(199, 0, 28)', color: 'white', marginRight: '5px', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Cancel
                            </span>
                        
                            <span
                                onClick={() => {
                                    let itemObj = {
                                        _id: itemIdList[row.index]._id,
                                        status: "Completed"
                                    }
                                    this.props.updateItemStatus(itemObj, "Arabic");
                                }}
                                style={{backgroundColor: 'rgb(255, 0, 109)', color: 'white', marginRight: '5px', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Complete
                            </span>

                        </div>
                ),
                style: {
                    textAlign: 'center'
                },
                sortable: false,
                width: 270
            })
        } else if(this.props.currentTab === "Completed") {

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
                                        _id: itemIdList[row.index]._id,
                                        upc: itemIdList[row.index].upc,
                                        _brandId: this.props.currentBrandId,
                                        brand: itemIdList[row.index].brand,
                                        picture: itemIdList[row.index].picture,
                                        picture2: itemIdList[row.index].picture2,
                                        title: itemIdList[row.index].title,
                                        titleArab: itemIdList[row.index].titleArab,
                                        formValue: itemIdList[row.index].formValue,
                                        typeValue: itemIdList[row.index].typeValue,
                                        unit: itemIdList[row.index].unit,
                                        size: itemIdList[row.index].size,
                                        description: itemIdList[row.index].description,
                                        howToUse: itemIdList[row.index].howToUse,
                                        descriptionArab: itemIdList[row.index].descriptionArab,
                                        howToUseArab: itemIdList[row.index].howToUseArab,
                                        comments: itemIdList[row.index].comments,
                                    })

                                    this.onOpenEditModal();
                                }}
                            >
                                <i className="fa fa-pencil" style={{ width: 35, fontSize: 20, padding: 11,color:'rgb(40, 167, 69)', cursor: 'pointer' }}></i>
                            </span>

                            <span
                                onClick={() => {
                                    this.setState({
                                        _id: itemIdList[row.index]._id,
                                        upc: itemIdList[row.index].upc,
                                        _brandId: this.props.currentBrandId,
                                        brand: itemIdList[row.index].brand,
                                        picture: itemIdList[row.index].picture,
                                        picture2: itemIdList[row.index].picture2,
                                        title: itemIdList[row.index].title,
                                        titleArab: itemIdList[row.index].titleArab,
                                        formValue: itemIdList[row.index].formValue,
                                        typeValue: itemIdList[row.index].typeValue,
                                        unit: itemIdList[row.index].unit,
                                        size: itemIdList[row.index].size,
                                        description: itemIdList[row.index].description,
                                        howToUse: itemIdList[row.index].howToUse,
                                        descriptionArab: itemIdList[row.index].descriptionArab,
                                        howToUseArab: itemIdList[row.index].howToUseArab,
                                        comments: itemIdList[row.index].comments,
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
                                        _id: itemIdList[row.index]._id,
                                        status: "Arabic"
                                    }
                                    this.props.updateItemStatus(itemObj, "Completed");
                                }}
                                style={{backgroundColor: 'rgb(199, 0, 28)', color: 'white', marginRight: '5px', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Cancel
                            </span>

                            
                            <span
                                onClick={() => {
                                    let itemObj = {
                                        _id: itemIdList[row.index]._id,
                                        status: "Confirmed"
                                    }
                                    this.props.updateItemStatus(itemObj, "Completed");
                                }}
                                style={{backgroundColor: 'rgb(1, 1, 1)', color: 'white', marginRight: '5px', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Confirm
                            </span>
                            
                        </div>
                ),
                style: {
                    textAlign: 'center'
                },
                sortable: false,
                width: 270
            })
        } else if(this.props.currentTab === "Confirmed") {

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
                                        _id: itemIdList[row.index]._id,
                                        upc: itemIdList[row.index].upc,
                                        _brandId: this.props.currentBrandId,
                                        brand: itemIdList[row.index].brand,
                                        picture: itemIdList[row.index].picture,
                                        picture2: itemIdList[row.index].picture2,
                                        title: itemIdList[row.index].title,
                                        titleArab: itemIdList[row.index].titleArab,
                                        formValue: itemIdList[row.index].formValue,
                                        typeValue: itemIdList[row.index].typeValue,
                                        unit: itemIdList[row.index].unit,
                                        size: itemIdList[row.index].size,
                                        description: itemIdList[row.index].description,
                                        howToUse: itemIdList[row.index].howToUse,
                                        descriptionArab: itemIdList[row.index].descriptionArab,
                                        howToUseArab: itemIdList[row.index].howToUseArab,
                                        comments: itemIdList[row.index].comments,
                                    })

                                    this.onOpenEditModal();
                                }}
                            >
                                <i className="fa fa-pencil" style={{ width: 35, fontSize: 20, padding: 11,color:'rgb(40, 167, 69)', cursor: 'pointer' }}></i>
                            </span>

                            <span
                                onClick={() => {
                                    this.setState({
                                        _id: itemIdList[row.index]._id,
                                        upc: itemIdList[row.index].upc,
                                        _brandId: this.props.currentBrandId,
                                        brand: itemIdList[row.index].brand,
                                        picture: itemIdList[row.index].picture,
                                        picture2: itemIdList[row.index].picture2,
                                        title: itemIdList[row.index].title,
                                        titleArab: itemIdList[row.index].titleArab,
                                        formValue: itemIdList[row.index].formValue,
                                        typeValue: itemIdList[row.index].typeValue,
                                        unit: itemIdList[row.index].unit,
                                        size: itemIdList[row.index].size,
                                        description: itemIdList[row.index].description,
                                        howToUse: itemIdList[row.index].howToUse,
                                        descriptionArab: itemIdList[row.index].descriptionArab,
                                        howToUseArab: itemIdList[row.index].howToUseArab,
                                        comments: itemIdList[row.index].comments,
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
                                        _id: itemIdList[row.index]._id,
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
                                        _id: itemIdList[row.index]._id,
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
        } else if(this.props.currentTab === "Done") {

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
                                        _id: itemIdList[row.index]._id,
                                        upc: itemIdList[row.index].upc,
                                        _brandId: this.props.currentBrandId,
                                        brand: itemIdList[row.index].brand,
                                        picture: itemIdList[row.index].picture,
                                        picture2: itemIdList[row.index].picture2,
                                        title: itemIdList[row.index].title,
                                        titleArab: itemIdList[row.index].titleArab,
                                        formValue: itemIdList[row.index].formValue,
                                        typeValue: itemIdList[row.index].typeValue,
                                        unit: itemIdList[row.index].unit,
                                        size: itemIdList[row.index].size,
                                        description: itemIdList[row.index].description,
                                        howToUse: itemIdList[row.index].howToUse,
                                        descriptionArab: itemIdList[row.index].descriptionArab,
                                        howToUseArab: itemIdList[row.index].howToUseArab,
                                        comments: itemIdList[row.index].comments,
                                    })

                                    this.onOpenEditModal();
                                }}
                            >
                                <i className="fa fa-pencil" style={{ width: 35, fontSize: 20, padding: 11,color:'rgb(40, 167, 69)', cursor: 'pointer' }}></i>
                            </span>

                            <span
                                onClick={() => {
                                    this.setState({
                                        _id: itemIdList[row.index]._id,
                                        upc: itemIdList[row.index].upc,
                                        _brandId: this.props.currentBrandId,
                                        brand: itemIdList[row.index].brand,
                                        picture: itemIdList[row.index].picture,
                                        picture2: itemIdList[row.index].picture2,
                                        title: itemIdList[row.index].title,
                                        titleArab: itemIdList[row.index].titleArab,
                                        formValue: itemIdList[row.index].formValue,
                                        typeValue: itemIdList[row.index].typeValue,
                                        unit: itemIdList[row.index].unit,
                                        size: itemIdList[row.index].size,
                                        description: itemIdList[row.index].description,
                                        howToUse: itemIdList[row.index].howToUse,
                                        descriptionArab: itemIdList[row.index].descriptionArab,
                                        howToUseArab: itemIdList[row.index].howToUseArab,
                                        comments: itemIdList[row.index].comments,
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
                                        _id: itemIdList[row.index]._id,
                                        status: "Confirmed"
                                    }
                                    this.props.updateItemStatus(itemObj, "Completed");
                                }}
                                style={{backgroundColor: 'rgb(199, 0, 28)', color: 'white', marginRight: '5px', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Cancel
                            </span>

                        </div>
                ),
                style: {
                    textAlign: 'center'
                },
                sortable: false,
                width: 270
            })
        }       
        
        return (

            <Fragment>
                <ReactTable
                    data={tableData}
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

                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right" style={{color: 'rgb(0, 141, 216)', fontWeight: '700'}}>Images</span></label>
                                <hr
                                    style={{
                                        color: 'rgb(233, 233, 233)',
                                        width: '100%',
                                        height: 5
                                    }}
                                    className="col-md-8"
                                />
                            </div>

                            {this.state.file !== "" ?
                                <div className="form-group">                                                              
                                    <img className="form-control" src={this.state.file} style={{width: 900, height: 900, marginLeft: 'auto', marginRight: 'auto'}} />
                                </div>
                                :
                                <div className="form-group row">                                                              
                                    <img src={`${process.env.PUBLIC_URL}/assets/images/items/${this.state.picture}`} style={{width: 900, height: 900, marginRight: 'auto', marginLeft: 'auto'}} placeholder={"Item picture"} />
                                </div>
                            }
                            
                            <div className="form-group row">                                                              
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Primary Image :</span></label>
                                <input className="form-control col-md-9" ref={(ref) => { this.uploadInput = ref; }} type="file" onChange={this.handleFileChange} required={true}/>
                            </div>

                            {this.state.picture2 !== "" && this.state.file2 === "" ?
                                <div className="form-group row">                                                              
                                    <img src={`${process.env.PUBLIC_URL}/assets/images/items/${this.state.picture2}`} style={{width: 900, height: 900, marginRight: 'auto', marginLeft: 'auto'}} placeholder={"Item picture"} />
                                </div>
                                :
                                null
                            }

                            {this.state.file2 !== "" ?
                                <div className="form-group">                                                              
                                    <img className="form-control" src={this.state.file2} style={{width: 900, height: 900, marginLeft: 'auto', marginRight: 'auto'}} />
                                </div>
                                :
                                null
                            }

                            <div className="form-group row">                                                              
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Secondary Image :</span></label>
                                <input className="form-control col-md-9" ref={(ref) => { this.uploadInput2 = ref; }} type="file" onChange={this.handleFile2Change} required={true}/>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right" style={{color: 'rgb(0, 141, 216)', fontWeight: '700'}}>Product Info</span></label>
                                <hr
                                    style={{
                                        color: 'rgb(233, 233, 233)',
                                        width: '100%',
                                        height: 5
                                    }}
                                    className="col-md-8"
                                />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">UPC :</span></label>
                                <input type="text" className="form-control col-md-9" name="upc" value={this.state.upc} onChange={this.onChange} placeholder="UPC" />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Brand :</span></label>
                                <input type="text" className="form-control col-md-9" name="brand" value={this.state.brand} onChange={this.onChange} placeholder="Brand" />
                            </div>

                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right" style={{color: 'rgb(0, 141, 216)', fontWeight: '700'}}>Title</span></label>
                                <hr
                                    style={{
                                        color: 'rgb(233, 233, 233)',
                                        width: '100%',
                                        height: 5
                                    }}
                                    className="col-md-8"
                                />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Title :</span></label>
                                <input type="text" className="form-control col-md-9" name="title" value={this.state.title} onChange={this.onChange} placeholder="Title" />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Title(Arab) :</span></label>
                                <input type="text" className="form-control col-md-9" name="titleArab" value={this.state.titleArab} onChange={this.onChange} placeholder="Title(Arab)" />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right" style={{color: 'rgb(0, 141, 216)', fontWeight: '700'}}>Details</span></label>
                                <hr
                                    style={{
                                        color: 'rgb(233, 233, 233)',
                                        width: '100%',
                                        height: 5
                                    }}
                                    className="col-md-8"
                                />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Form :</span></label>
                                <input type="text" className="form-control col-md-9" name="formValue" value={this.state.formValue} onChange={this.onChange} placeholder="Form" />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Type :</span></label>
                                <input type="text" className="form-control col-md-9" name="typeValue" value={this.state.typeValue} onChange={this.onChange} placeholder="Type" />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Unit Of Size :</span></label>
                                <input type="text" className="form-control col-md-9" name="unit" value={this.state.unit} onChange={this.onChange} placeholder="Unit Of Size" />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Size :</span></label>
                                <input type="text" className="form-control col-md-9" name="size" value={this.state.size} onChange={this.onChange} placeholder="Size" />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right" style={{color: 'rgb(0, 141, 216)', fontWeight: '700'}}>Description</span></label>
                                <hr
                                    style={{
                                        color: 'rgb(233, 233, 233)',
                                        width: '100%',
                                        height: 5
                                    }}
                                    className="col-md-8"
                                />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Product Description :</span></label>
                                <input type="text" className="form-control col-md-9" name="description" value={this.state.description} onChange={this.onChange} placeholder="Product Description" />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">How To Use?</span></label>
                                <input type="text" className="form-control col-md-9" name="howToUse" value={this.state.howToUse} onChange={this.onChange} placeholder="How To Use?" />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Product Description(Arab)</span></label>
                                <input type="text" className="form-control col-md-9" name="descriptionArab" value={this.state.descriptionArab} onChange={this.onChange} placeholder="Product Description" />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">How To Use(Arab)?</span></label>
                                <input type="text" className="form-control col-md-9" name="howToUseArab" value={this.state.howToUseArab} onChange={this.onChange} placeholder="How To Use(Arab)" />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right" style={{color: 'rgb(0, 141, 216)', fontWeight: '700'}}>Other</span></label>
                                <hr
                                    style={{
                                        color: 'rgb(233, 233, 233)',
                                        width: '100%',
                                        height: 5
                                    }}
                                    className="col-md-8"
                                />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Editor Comments :</span></label>
                                <input type="text" className="form-control col-md-9" name="comments" value={this.state.comments} onChange={this.onChange} placeholder="UPC" />
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
                            {this.renderAlert()}

                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right" style={{color: 'rgb(0, 141, 216)', fontWeight: '700'}}>Primary Image</span></label>
                                <hr
                                    style={{
                                        color: 'rgb(233, 233, 233)',
                                        width: '100%',
                                        height: 5
                                    }}
                                    className="col-md-8"
                                />
                            </div>

                            {this.state.picture !== "" ?
                                <div className="form-group row">                                                              
                                    <img src={`${process.env.PUBLIC_URL}/assets/images/items/${this.state.picture}`} style={{width: 900, height: 900, marginRight: 'auto', marginLeft: 'auto'}} placeholder={"Item picture"} />
                                </div>
                                :
                                null
                            }

                            {this.state.picture2 !== "" ?
                                <>
                                    <div className="form-group row">
                                        <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right" style={{color: 'rgb(0, 141, 216)', fontWeight: '700'}}>Secondary Image</span></label>
                                        <hr
                                            style={{
                                                color: 'rgb(233, 233, 233)',
                                                width: '100%',
                                                height: 5
                                            }}
                                            className="col-md-8"
                                        />
                                    </div>

                                    <div className="form-group row">                                                              
                                        <img src={`${process.env.PUBLIC_URL}/assets/images/items/${this.state.picture2}`} style={{width: 900, height: 900, marginRight: 'auto', marginLeft: 'auto'}} placeholder={"Item picture"} />
                                    </div>
                                </>
                                :
                                null
                            }

                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right" style={{color: 'rgb(0, 141, 216)', fontWeight: '700'}}>Product Info</span></label>
                                <hr
                                    style={{
                                        color: 'rgb(233, 233, 233)',
                                        width: '100%',
                                        height: 5
                                    }}
                                    className="col-md-8"
                                />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">UPC :</span></label>
                                <input type="text" className="form-control col-md-9" name="upc" value={this.state.upc} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Brand :</span></label>
                                <input type="text" className="form-control col-md-9" name="brand" value={this.state.brand} readOnly/>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right" style={{color: 'rgb(0, 141, 216)', fontWeight: '700'}}>Title</span></label>
                                <hr
                                    style={{
                                        color: 'rgb(233, 233, 233)',
                                        width: '100%',
                                        height: 5
                                    }}
                                    className="col-md-8"
                                />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Title :</span></label>
                                <input type="text" className="form-control col-md-9" name="title" value={this.state.title} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Title(Arab) :</span></label>
                                <input type="text" className="form-control col-md-9" name="titleArab" value={this.state.titleArab} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right" style={{color: 'rgb(0, 141, 216)', fontWeight: '700'}}>Details</span></label>
                                <hr
                                    style={{
                                        color: 'rgb(233, 233, 233)',
                                        width: '100%',
                                        height: 5
                                    }}
                                    className="col-md-8"
                                />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Form :</span></label>
                                <input type="text" className="form-control col-md-9" name="formValue" value={this.state.formValue} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Type :</span></label>
                                <input type="text" className="form-control col-md-9" name="typeValue" value={this.state.typeValue} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Unit Of Size :</span></label>
                                <input type="text" className="form-control col-md-9" name="unit" value={this.state.unit} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Size :</span></label>
                                <input type="text" className="form-control col-md-9" name="size" value={this.state.size} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right" style={{color: 'rgb(0, 141, 216)', fontWeight: '700'}}>Description</span></label>
                                <hr
                                    style={{
                                        color: 'rgb(233, 233, 233)',
                                        width: '100%',
                                        height: 5
                                    }}
                                    className="col-md-8"
                                />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Product Description :</span></label>
                                <input type="text" className="form-control col-md-9" name="description" value={this.state.description} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">How To Use?</span></label>
                                <input type="text" className="form-control col-md-9" name="howToUse" value={this.state.howToUse} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Product Description(Arab)</span></label>
                                <input type="text" className="form-control col-md-9" name="descriptionArab" value={this.state.descriptionArab} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">How To Use(Arab)?</span></label>
                                <input type="text" className="form-control col-md-9" name="howToUseArab" value={this.state.howToUseArab} readOnly />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right" style={{color: 'rgb(0, 141, 216)', fontWeight: '700'}}>Other</span></label>
                                <hr
                                    style={{
                                        color: 'rgb(233, 233, 233)',
                                        width: '100%',
                                        height: 5
                                    }}
                                    className="col-md-8"
                                />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Editor Comments :</span></label>
                                <input type="text" className="form-control col-md-9" name="comments" value={this.state.comments} readOnly />
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
    brandsList: localStorage.getItem("role") === "0" 
        ? service.createBrandsList(state.brand.activeBrands, 0) 
        : service.createBrandsList(state.user.user.brands, 1),
});

export default connect(
    mapStateToProps,
    { initializeAll, updateItem, updateItemStatus, deleteItem, createItemIdList }
)(Datatable);