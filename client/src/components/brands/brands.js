import React, { Component, Fragment} from 'react'
import Modal from 'react-responsive-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Datatable from './datatable';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import { connect } from 'react-redux';

import * as service from '../../services';
import { addItem, initializeAll, createItemIdList } from '../../actions'
import { Config } from '../../config/config';

import axios from 'axios';
axios.defaults.baseURL = Config.api_url;

export class Brands extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            brands: [],
            upc: "",
            _brandId: "",
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
            flagComponentUpdate: true,
            file: "",
            isDoubleUPC: false,
        };

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

    onOpenModal = () => {
        this.props.initializeAll();
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    createBrandsOfState() {
        let tempBrands = [];
        let number = 0;
        if(localStorage.getItem("role") === "0"){
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
        } else {
            this.props.user.brands.map(brand => {
                let oneBrand = {
                    number: number,
                    _brandId: brand._brandId._id,
                    allow: brand._brandId.allow,
                    name: brand._brandId.name,
                    picture: brand._brandId.picture,
                }
                tempBrands.push(oneBrand);
                number ++;
            });
        }

        this.setState({
            brands: tempBrands,
            _brandId: tempBrands.length > 0 ? tempBrands[0]._brandId : "",
        })
    }

    componentWillMount() {
        this.createBrandsOfState();
        // this.nextFunc();
    }

    handleOneBrandOfItemChange = (e) => {
        this.setState({
            _brandId: e.target.value
        })
    }

    getBrandId() {
        let tempBrands = [], _brandId = "";
        let number = 0;
        if(localStorage.getItem("role") === "0"){
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
        } else {
            this.props.user.brands.map(brand => {
                let oneBrand = {
                    number: number,
                    _brandId: brand._brandId._id,
                    allow: brand._brandId.allow,
                    name: brand._brandId.name,
                    picture: brand._brandId.picture,
                }
                tempBrands.push(oneBrand);
                number ++;
            });
        }

        _brandId = tempBrands.length > 0 ? tempBrands[0]._brandId : "";
        return _brandId;

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
        this.props.initializeAll();

        if(this.props.activeBrands.length === 0) {
            toast.error("Before adding new item, please add at least one brand!");
            return;
        }

        if(this.props.currentBrandId === "") {
            toast.error("Before adding new item, please select any brand!");
            return;
        }

        if(this.state.upc === "") {
            toast.error("Please type utc field correctly.");
            return;
        }

        if(this.state.isDoubleUPC) {
            toast.error("upc already exists!");
            return;
        }

        if(this.uploadInput.files.length === 0 ) {
            toast.error("Please upload the image of the item!");
            return;
        }
        let pictureUrl = this.changeFileName(this.uploadInput.files[0].name, this.state.upc);

        let newItem = {
            upc: this.state.upc,
            _brandId: this.props.currentBrandId,
            brand: this.state.brand,
            picture: pictureUrl,
            picture2: this.state.picture2,
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
        var myJSON = JSON.stringify(newItem)
        let data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        data.append('fileName', pictureUrl);
        data.append('product',myJSON);
        this.props.addItem(data);

        this.setState({
            open: false,
            brand: "",
            upc: "",
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
            file: ""
        })
    }

    cancel = () => {
        this.setState({
            open: false,
            brand: "",
            upc: "",
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
            file: ""
        })
        this.props.initializeAll();

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

    download = (cat) =>{
        axios({url:`/exportCSV/${this.state._brandId}/${cat}`,
        method: 'POST',
        responseType: 'blob' // important
        }).then(response => {       
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.zip');
            document.body.appendChild(link);
            link.click();               
            
        })
        .catch(err => console.log(err));
    }

    handleFileChange = (event) => {
        this.setState({
            file: event.target.files[0] !== undefined
                    ? URL.createObjectURL(event.target.files[0])
                    : ""
        })
    }

    render() {
        const { open } = this.state;
        const { SubmittedCount, ApprovedCount, ArabicCount, CompletedCount, ConfirmedCount, DoneCount } = this.props.categoryCountObj;
        const { brandName, brandPicture } = this.props.brandInfo;
        let tabItems = [];
        if(localStorage.getItem("role") === "1" ) {
            this.props.user.brands.map(oneBrand => {
                if( oneBrand._brandId._id === this.props.currentBrandId) {
                    if(oneBrand.Submitted) tabItems.push("Submitted");
                    if(oneBrand.Approved) tabItems.push("Approved");
                    if(oneBrand.Arabic) tabItems.push("Arabic");
                    if(oneBrand.Completed) tabItems.push("Completed");
                    if(oneBrand.Confirmed) tabItems.push("Confirmed");
                    if(oneBrand.Done) tabItems.push("Done");
                }
            })
        }

        return (
            <Fragment>
                {localStorage.getItem("role") === "0" ?
                <Tabs defaultIndex={this.props.currentTabIndex}>
                    <TabList className="nav nav-tabs tab-coupon">
                        <Tab className="nav-link">Submitted</Tab>
                        <Tab className="nav-link">Approved</Tab>
                        <Tab className="nav-link">Arabic</Tab>
                        <Tab className="nav-link">Completed</Tab>
                        <Tab className="nav-link">Confirmed</Tab>
                        <Tab className="nav-link">Done</Tab>
                    </TabList>
                    <TabPanel>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <button type="button" className="btn btn-primary pull-right" onClick={this.onOpenModal} data-toggle="modal" data-original-title="test" data-target="#exampleModal">Add Item</button>
                                            <h5 style={{color: 'rgb(0, 141, 216)'}}>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Submitted {SubmittedCount} items</small></h5>
                                            <div className="form-group row">
                                                {brandPicture === "" ?
                                                    <span style={{marginRight: 'auto', marginLeft: 'auto', fontSize: 20}}>{"Please select left sidebar."}</span>
                                                    :    
                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/brands/${brandPicture}`} style={{width:'100px',height:'auto', marginRight: 'auto', marginLeft: 'auto'}} alt={"Item picture"} /> }
                                            </div>
                                        </div>
                                        <div className="card-body">
    
                                            <div className="btn-popup">

                                                <Modal open={open} onClose={this.cancel} >
                                                    <div className="modal-header">
                                                        <h5 className="modal-title f-w-600" id="exampleModalLabel2">Add Item</h5>
                                                    </div>
                                                    <div className="modal-body">
                                                        <form>
                                                            {this.renderAlert()}

                                                            {this.state.file !== "" ?
                                                                <div className="form-group">                                                              
                                                                    <img className="form-control" src={this.state.file} style={{width: 900, height: 900, marginLeft: 'auto', marginRight: 'auto'}} />
                                                                </div>
                                                                :
                                                                <></>
                                                            }
                                                            <div className="form-group row">                                                              
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Product Image :</span></label>
                                                                <input className="form-control col-md-9" ref={(ref) => { this.uploadInput = ref; }} type="file" onChange={this.handleFileChange} required={true}/>
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
                                                                <input type="text" className="form-control col-md-9" name="upc" onChange={this.onChange} placeholder="UPC" />
                                                            </div>

                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Brand :</span></label>
                                                                <input type="text" className="form-control col-md-9" name="brand" onChange={this.onChange} placeholder="Brand" />
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
                                                                <input type="text" className="form-control col-md-9" name="title" onChange={this.onChange} placeholder="Title" />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Title(Arab) :</span></label>
                                                                <input type="text" className="form-control col-md-9" name="titleArab" onChange={this.onChange} placeholder="Title(Arab)" />
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
                                                                <input type="text" className="form-control col-md-9" name="formValue" onChange={this.onChange} placeholder="Form" />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Type :</span></label>
                                                                <input type="text" className="form-control col-md-9" name="typeValue" onChange={this.onChange} placeholder="Type" />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Unit Of Size :</span></label>
                                                                <input type="text" className="form-control col-md-9" name="unit" onChange={this.onChange} placeholder="Unit Of Size" />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Size :</span></label>
                                                                <input type="text" className="form-control col-md-9" name="size" onChange={this.onChange} placeholder="Size" />
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
                                                                <input type="text" className="form-control col-md-9" name="description" onChange={this.onChange} placeholder="Product Description" />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">How To Use?</span></label>
                                                                <input type="text" className="form-control col-md-9" name="howToUse" onChange={this.onChange} placeholder="How To Use?" />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Product Description(Arab)</span></label>
                                                                <input type="text" className="form-control col-md-9" name="descriptionArab" onChange={this.onChange} placeholder="Product Description" />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">How To Use(Arab)?</span></label>
                                                                <input type="text" className="form-control col-md-9" name="howToUseArab" onChange={this.onChange} placeholder="How To Use(Arab)" />
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
                                                                <input type="text" className="form-control col-md-9" name="comments" onChange={this.onChange} placeholder="UPC" />
                                                            </div>
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
                                                <Datatable
                                                    currentTab="Submitted"
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
                    </TabPanel>
                    <TabPanel>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 style={{color: 'rgb(0, 141, 216)'}}>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Approved {ApprovedCount} items</small></h5>
                                            <div className="form-group row">
                                                {brandPicture === "" ?
                                                    <span style={{marginRight: 'auto', marginLeft: 'auto', fontSize: 20}}>{"Please select left sidebar."}</span>
                                                    :    
                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/brands/${brandPicture}`} style={{width:'100px',height:'auto', marginRight: 'auto', marginLeft: 'auto'}} alt={"Item picture"} /> }
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="btn-popup pull-right">
                                            </div>
                                            <div className="clearfix"></div>
                                            <div id="basicScenario" className="product-physical">
                                                <Datatable
                                                    currentTab="Approved"
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
                    </TabPanel>
                    <TabPanel>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 style={{color: 'rgb(0, 141, 216)'}}>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Arabic {ArabicCount} items</small></h5>
                                            <div className="form-group row">
                                                {brandPicture === "" ?
                                                    <span style={{marginRight: 'auto', marginLeft: 'auto', fontSize: 20}}>{"Please select left sidebar."}</span>
                                                    :    
                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/brands/${brandPicture}`} style={{width:'100px',height:'auto', marginRight: 'auto', marginLeft: 'auto'}} alt={"Item picture"} /> }
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="btn-popup pull-right">
                                            </div>
                                            <div className="clearfix"></div>
                                            <div id="basicScenario" className="product-physical">
                                                <Datatable
                                                    currentTab="Arabic"
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
                    </TabPanel>
                    <TabPanel>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 style={{color: 'rgb(0, 141, 216)'}}>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Completed {CompletedCount} items</small></h5>
                                            <div className="form-group row">
                                                {brandPicture === "" ?
                                                    <span style={{marginRight: 'auto', marginLeft: 'auto', fontSize: 20}}>{"Please select left sidebar."}</span>
                                                    :    
                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/brands/${brandPicture}`} style={{width:'100px',height:'auto', marginRight: 'auto', marginLeft: 'auto'}} alt={"Item picture"} /> }
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="btn-popup pull-right">
                                            </div>
                                            <div className="clearfix"></div>
                                            <div id="basicScenario" className="product-physical">
                                                <Datatable
                                                    currentTab="Completed"
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
                    </TabPanel>
                    <TabPanel>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <button type="button" className="pull-right" style={{cursor: 'pointer' }} onClick={()=>this.download("Confirmed")} data-toggle="modal" data-original-title="test" data-target="#exampleModal">csv</button>
                                            <h5 style={{color: 'rgb(0, 141, 216)'}}>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Confirmed {ConfirmedCount} items</small></h5>
                                            <div className="form-group row">
                                                {brandPicture === "" ?
                                                    <span style={{marginRight: 'auto', marginLeft: 'auto', fontSize: 20}}>{"Please select left sidebar."}</span>
                                                    :    
                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/brands/${brandPicture}`} style={{width:'100px',height:'auto', marginRight: 'auto', marginLeft: 'auto'}} alt={"Item picture"} /> }
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="btn-popup pull-right">
                                            </div>
                                            <div className="clearfix"></div>
                                            <div id="basicScenario" className="product-physical">
                                                <Datatable
                                                    currentTab="Confirmed"
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
                    </TabPanel>
                    <TabPanel>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <button type="button" className="pull-right" style={{cursor: 'pointer' }} onClick={()=>this.download('Done')} data-toggle="modal" data-original-title="test" data-target="#exampleModal">csv</button>
                                            <h5 style={{color: 'rgb(0, 141, 216)'}}>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Done {DoneCount} items</small></h5>
                                            <div className="form-group row">
                                                {brandPicture === "" ?
                                                    <span style={{marginRight: 'auto', marginLeft: 'auto', fontSize: 20}}>{"Please select left sidebar."}</span>
                                                    :    
                                                    <img src={`${process.env.PUBLIC_URL}/assets/images/brands/${brandPicture}`} style={{width:'100px',height:'auto', marginRight: 'auto', marginLeft: 'auto'}} alt={"Item picture"} /> }
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="btn-popup pull-right">
                                            </div>
                                            <div className="clearfix"></div>
                                            <div id="basicScenario" className="product-physical">
                                                <Datatable
                                                    currentTab="Done"
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
                    </TabPanel>

                </Tabs>
                :
                <Tabs defaultIndex={this.props.currentTabIndex}>
                    <TabList className="nav nav-tabs tab-coupon">
                        {tabItems.map(oneItem =>
                            <Tab className="nav-link">{oneItem}</Tab>
                        )}
                    </TabList>
                    {tabItems.indexOf("Submitted") !== -1 ?
                        <TabPanel>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <button type="button" className="btn btn-primary pull-right" onClick={this.onOpenModal} data-toggle="modal" data-original-title="test" data-target="#exampleModal">Add Item</button>
                                                <h5 style={{color: 'rgb(0, 141, 216)'}}>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Submitted {SubmittedCount} items</small></h5>
                                                <div className="form-group row">
                                                    {brandPicture === "" ?
                                                        <span style={{marginRight: 'auto', marginLeft: 'auto', fontSize: 20}}>{"Please select left sidebar."}</span>
                                                        :    
                                                        <img src={`${process.env.PUBLIC_URL}/assets/images/brands/${brandPicture}`} style={{width:'100px',height:'auto', marginRight: 'auto', marginLeft: 'auto'}} alt={"Item picture"} /> }
                                                </div>
                                            </div>
                                            <div className="card-body">
        
                                                <div className="btn-popup">

                                                    <Modal open={open} onClose={this.onCloseModal} >
                                                        <div className="modal-header">
                                                            <h5 className="modal-title f-w-600" id="exampleModalLabel2">Add Item</h5>
                                                        </div>
                                                        <div className="modal-body">
                                                            <form>
                                                                {this.renderAlert()}

                                                                {this.state.file !== "" ?
                                                                    <div className="form-group">                                                              
                                                                        <img className="form-control" src={this.state.file} style={{width: 900, height: 900, marginLeft: 'auto', marginRight: 'auto'}} />
                                                                    </div>
                                                                    :
                                                                    <></>
                                                                }
                                                                <div className="form-group row">                                                              
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Product Image :</span></label>
                                                                    <input className="form-control col-md-9" ref={(ref) => { this.uploadInput = ref; }} type="file" onChange={this.handleFileChange} required={true}/>
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
                                                                    <input type="text" className="form-control col-md-9" name="upc" onChange={this.onChange} placeholder="UPC" />
                                                                </div>
                                                                
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Brand :</span></label>
                                                                    <input type="text" className="form-control col-md-9" name="brand" onChange={this.onChange} placeholder="Brand" />
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
                                                                    <input type="text" className="form-control col-md-9" name="title" onChange={this.onChange} placeholder="Title" />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Title(Arab) :</span></label>
                                                                    <input type="text" className="form-control col-md-9" name="titleArab" onChange={this.onChange} placeholder="Title(Arab)" />
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
                                                                    <input type="text" className="form-control col-md-9" name="formValue" onChange={this.onChange} placeholder="Form" />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Type :</span></label>
                                                                    <input type="text" className="form-control col-md-9" name="typeValue" onChange={this.onChange} placeholder="Type" />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Unit Of Size :</span></label>
                                                                    <input type="text" className="form-control col-md-9" name="unit" onChange={this.onChange} placeholder="Unit Of Size" />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Size :</span></label>
                                                                    <input type="text" className="form-control col-md-9" name="size" onChange={this.onChange} placeholder="Size" />
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
                                                                    <input type="text" className="form-control col-md-9" name="description" onChange={this.onChange} placeholder="Product Description" />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">How To Use?</span></label>
                                                                    <input type="text" className="form-control col-md-9" name="howToUse" onChange={this.onChange} placeholder="How To Use?" />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">Product Description(Arab)</span></label>
                                                                    <input type="text" className="form-control col-md-9" name="descriptionArab" onChange={this.onChange} placeholder="Product Description" />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-3" ><span className="pull-right">How To Use(Arab)?</span></label>
                                                                    <input type="text" className="form-control col-md-9" name="howToUseArab" onChange={this.onChange} placeholder="How To Use(Arab)" />
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
                                                                    <input type="text" className="form-control col-md-9" name="comments" onChange={this.onChange} placeholder="UPC" />
                                                                </div>
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
                                                    <Datatable
                                                        currentTab="Submitted"
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
                        </TabPanel>
                    : null }
                    {tabItems.indexOf("Approved") !== -1 ?
                        <TabPanel>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 style={{color: 'rgb(0, 141, 216)'}}>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Approved {ApprovedCount} items</small></h5>
                                                <div className="form-group row">
                                                    {brandPicture === "" ?
                                                        <span style={{marginRight: 'auto', marginLeft: 'auto', fontSize: 20}}>{"Please select left sidebar."}</span>
                                                        :    
                                                        <img src={`${process.env.PUBLIC_URL}/assets/images/brands/${brandPicture}`} style={{width:'100px',height:'auto', marginRight: 'auto', marginLeft: 'auto'}} alt={"Item picture"} /> }
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="btn-popup pull-right">
                                                </div>
                                                <div className="clearfix"></div>
                                                <div id="basicScenario" className="product-physical">
                                                    <Datatable
                                                        currentTab="Approved"
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
                        </TabPanel>
                    : null }
                    {tabItems.indexOf("Arabic") !== -1 ?
                        <TabPanel>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 style={{color: 'rgb(0, 141, 216)'}}>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Arabic {ArabicCount} items</small></h5>
                                                <div className="form-group row">
                                                    {brandPicture === "" ?
                                                        <span style={{marginRight: 'auto', marginLeft: 'auto', fontSize: 20}}>{"Please select left sidebar."}</span>
                                                        :    
                                                        <img src={`${process.env.PUBLIC_URL}/assets/images/brands/${brandPicture}`} style={{width:'100px',height:'auto', marginRight: 'auto', marginLeft: 'auto'}} alt={"Item picture"} /> }
                                                </div>                                            
                                            </div>
                                            <div className="card-body">
                                                <div className="btn-popup pull-right">
                                                </div>
                                                <div className="clearfix"></div>
                                                <div id="basicScenario" className="product-physical">
                                                    <Datatable
                                                        currentTab="Arabic"
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
                        </TabPanel>
                    : null }
                    {tabItems.indexOf("Completed") !== -1 ?
                        <TabPanel>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 style={{color: 'rgb(0, 141, 216)'}}>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Completed {CompletedCount} items</small></h5>
                                                <div className="form-group row">
                                                    {brandPicture === "" ?
                                                        <span style={{marginRight: 'auto', marginLeft: 'auto', fontSize: 20}}>{"Please select left sidebar."}</span>
                                                        :    
                                                        <img src={`${process.env.PUBLIC_URL}/assets/images/brands/${brandPicture}`} style={{width:'100px',height:'auto', marginRight: 'auto', marginLeft: 'auto'}} alt={"Item picture"} /> }
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="btn-popup pull-right">
                                                </div>
                                                <div className="clearfix"></div>
                                                <div id="basicScenario" className="product-physical">
                                                    <Datatable
                                                        currentTab="Completed"
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
                        </TabPanel>
                    : null }
                    {tabItems.indexOf("Confirmed") !== -1 ?
                        <TabPanel>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <button type="button" className="pull-right" style={{cursor: 'pointer' }} onClick={()=>this.download('Confirmed')} data-toggle="modal" data-original-title="test" data-target="#exampleModal">csv</button>
                                                <h5 style={{color: 'rgb(0, 141, 216)'}}>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Confirmed {ConfirmedCount} items</small></h5>
                                                <div className="form-group row">
                                                    {brandPicture === "" ?
                                                        <span style={{marginRight: 'auto', marginLeft: 'auto', fontSize: 20}}>{"Please select left sidebar."}</span>
                                                        :    
                                                        <img src={`${process.env.PUBLIC_URL}/assets/images/brands/${brandPicture}`} style={{width:'100px',height:'auto', marginRight: 'auto', marginLeft: 'auto'}} alt={"Item picture"} /> }
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="btn-popup pull-right">
                                                </div>
                                                <div className="clearfix"></div>
                                                <div id="basicScenario" className="product-physical">
                                                    <Datatable
                                                        currentTab="Confirmed"
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
                        </TabPanel>
                    : null }
                    {tabItems.indexOf("Done") !== -1 ?
                        <TabPanel>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <button type="button" className="pull-right" style={{cursor: 'pointer' }} onClick={()=>this.download('Done')} data-toggle="modal" data-original-title="test" data-target="#exampleModal">csv</button>
                                                <h5 style={{color: 'rgb(0, 141, 216)'}}>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Done {DoneCount} items</small></h5>
                                                <div className="form-group row">
                                                    {brandPicture === "" ?
                                                        <span style={{marginRight: 'auto', marginLeft: 'auto', fontSize: 20}}>{"Please select left sidebar."}</span>
                                                        :    
                                                        <img src={`${process.env.PUBLIC_URL}/assets/images/brands/${brandPicture}`} style={{width:'100px',height:'auto', marginRight: 'auto', marginLeft: 'auto'}} alt={"Item picture"} /> }
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="btn-popup pull-right">
                                                </div>
                                                <div className="clearfix"></div>
                                                <div id="basicScenario" className="product-physical">
                                                    <Datatable
                                                        currentTab="Done"
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
                        </TabPanel>
                    : null }
                </Tabs>
                }
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    activeBrands: state.brand.activeBrands,
    currentBrandId: state.currentStatus.currentBrandId,
    currentTabIndex: state.currentStatus.currentTabIndex,
    unknown_error: state.currentStatus.unknown_error,
    items: state.item.items,
    user: state.user.user,
    uploadedFile: state.currentStatus.uploadedFile,
    // currentTabData: service.getCurrentTabData(state.item.items, state.currentStatus.currentBrandId, service.getTabIndexFromText()),
    categoryCountObj: service.getCategoryCount(state.item.items, state.currentStatus.currentBrandId),
    brandInfo: service.getBrandInfoByBrandId(state.brand.activeBrands, state.currentStatus.currentBrandId),
});

export default connect(
    mapStateToProps,
    { addItem, initializeAll, createItemIdList }
)(Brands);