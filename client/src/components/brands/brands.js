import React, { Component, Fragment} from 'react'
import Modal from 'react-responsive-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import data from '../../assets/data/category';
import Submitted from './tabs/submitted';
import Approved from './tabs/approved';
import Arabic from './tabs/arabic';
import Completed from './tabs/completed';
import Confirmed from './tabs/confirmed';
import Done from './tabs/done';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import { connect } from 'react-redux';
import { addItem, initializeAll } from '../../actions'
import { Config } from '../../config/config';
import axios from 'axios';
axios.defaults.baseURL = Config.api_url;

export class Brands extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brandName: "",
            open: false,
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
            SubmittedCount: 0,
            ApprovedCount: 0,
            ArabicCount: 0,
            CompletedCount: 0,
            ConfirmedCount: 0,
            DoneCount: 0,
        };
        this.props.initializeAll();
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onOpenModal = () => {
        this.props.initializeAll();
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    getBrandName = () => {
        let name = "";
        this.props.activeBrands.map(brand => {
            if(brand._id === this.props.currentBrandId) {
                name = brand.name;
            }
        });
        this.setState({
            brandName: name
        })
    }

    getAllCounts = () => {
        let tempSubmittedCount = 0;
        let tempApprovedCount = 0;
        let tempArabicCount = 0;
        let tempCompletedCount = 0;
        let tempConfirmedCount = 0;
        let tempDoneCount = 0;

        this.props.items.map(item => {
            if(item._brandId._id === this.props.currentBrandId) {
                switch(item.status) {
                    case "Submitted":
                        tempSubmittedCount ++;
                        break;
                    case "Approved":
                        tempApprovedCount ++;
                        break;
                    case "Arabic":
                        tempArabicCount ++;
                        break;
                    case "Completed":
                        tempCompletedCount ++;
                        break;
                    case "Confirmed":
                        tempConfirmedCount ++;
                        break;
                    case "Done":
                        tempDoneCount ++;
                        break;
                    default:
                        tempSubmittedCount ++;
                        break;
                }
            }
        })

        this.setState({
            SubmittedCount: tempSubmittedCount,
            ApprovedCount: tempApprovedCount,
            ArabicCount: tempArabicCount,
            CompletedCount: tempCompletedCount,
            ConfirmedCount: tempConfirmedCount,
            DoneCount: tempDoneCount,
        })
    }

    componentWillMount() {
        this.getBrandName();
        this.getAllCounts();
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

        if(this.uploadInput.files[0] === undefined) {
            toast.error("Please upload the image of the item!");
            return;
        }

        let pictureUrl = this.changeFileName(this.uploadInput.files[0].name, this.state.upc);

        let newItem = {
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
        var myJSON = JSON.stringify(newItem)
        let data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        data.append('fileName', pictureUrl);
        data.append('product',myJSON);
        this.props.addItem(data);

    }

    cancel = () => {
        this.setState({
            open: false,
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

    render() {
        const { open, brandName, SubmittedCount, ApprovedCount, ArabicCount, CompletedCount, ConfirmedCount, DoneCount } = this.state;
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
                                            <h5>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Submitted {SubmittedCount} items</small></h5>
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
                                                            <div className="form-group">                                                              
                                                                <input className="form-control" ref={(ref) => { this.uploadInput = ref; }} type="file" required={true}/>
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >UPC :</label>
                                                                <input type="text" className="form-control col-md-7" name="upc" onChange={this.onChange} />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Title :</label>
                                                                <input type="text" className="form-control col-md-7" name="title" onChange={this.onChange} />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Title(Arab) :</label>
                                                                <input type="text" className="form-control col-md-7" name="titleArab" onChange={this.onChange} />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Form :</label>
                                                                <input type="text" className="form-control col-md-7" name="formValue" onChange={this.onChange} />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Type :</label>
                                                                <input type="text" className="form-control col-md-7" name="typeValue" onChange={this.onChange} />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Unit Of Size :</label>
                                                                <input type="text" className="form-control col-md-7" name="unit" onChange={this.onChange} />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Size :</label>
                                                                <input type="text" className="form-control col-md-7" name="size" onChange={this.onChange} />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Product Description :</label>
                                                                <input type="text" className="form-control col-md-7" name="description" onChange={this.onChange} />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >How To Use?</label>
                                                                <input type="text" className="form-control col-md-7" name="howToUse" onChange={this.onChange} />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Product Description(Arab) :</label>
                                                                <input type="text" className="form-control col-md-7" name="descriptionArab" onChange={this.onChange} />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >How To Use(Arab)?</label>
                                                                <input type="text" className="form-control col-md-7" name="howToUseArab" onChange={this.onChange} />
                                                            </div>
                                                            <div className="form-group row">
                                                                <label htmlFor="recipient-name" className="col-form-label col-md-4" >Editor Comments :</label>
                                                                <input type="text" className="form-control col-md-7" name="comments" onChange={this.onChange} />
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
                                                <Submitted
                                                    multiSelectOption={false}
                                                    myData={data} 
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
                                            <h5>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Approved {ApprovedCount} items</small></h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="btn-popup pull-right">
                                            </div>
                                            <div className="clearfix"></div>
                                            <div id="basicScenario" className="product-physical">
                                                <Approved
                                                    multiSelectOption={false}
                                                    myData={data} 
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
                                            <h5>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Arabic {ArabicCount} items</small></h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="btn-popup pull-right">
                                            </div>
                                            <div className="clearfix"></div>
                                            <div id="basicScenario" className="product-physical">
                                                <Arabic
                                                    multiSelectOption={false}
                                                    myData={data} 
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
                                            <h5>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Completed {CompletedCount} items</small></h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="btn-popup pull-right">
                                            </div>
                                            <div className="clearfix"></div>
                                            <div id="basicScenario" className="product-physical">
                                                <Completed
                                                    multiSelectOption={false}
                                                    myData={data} 
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
                                            <h5>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Confirmed {ConfirmedCount} items</small></h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="btn-popup pull-right">
                                            </div>
                                            <div className="clearfix"></div>
                                            <div id="basicScenario" className="product-physical">
                                                <Confirmed
                                                    multiSelectOption={false}
                                                    myData={data} 
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
                                            <h5>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Done {DoneCount} items</small></h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="btn-popup pull-right">
                                            </div>
                                            <div className="clearfix"></div>
                                            <div id="basicScenario" className="product-physical">
                                                <Done
                                                    multiSelectOption={false}
                                                    myData={data} 
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
                                                <h5>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Submitted {SubmittedCount} items</small></h5>
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
                                                                <div className="form-group">
                                                                    <input className="form-control" ref={(ref) => { this.uploadInput = ref; }} type="file" required={true}/>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-4" >UPC :</label>
                                                                    <input type="text" className="form-control col-md-7" name="upc" onChange={this.onChange} />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-4" >Title :</label>
                                                                    <input type="text" className="form-control col-md-7" name="title" onChange={this.onChange} />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-4" >Title(Arab) :</label>
                                                                    <input type="text" className="form-control col-md-7" name="titleArab" onChange={this.onChange} />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-4" >Form :</label>
                                                                    <input type="text" className="form-control col-md-7" name="formValue" onChange={this.onChange} />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-4" >Type :</label>
                                                                    <input type="text" className="form-control col-md-7" name="typeValue" onChange={this.onChange} />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-4" >Unit Of Size :</label>
                                                                    <input type="text" className="form-control col-md-7" name="unit" onChange={this.onChange} />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-4" >Size :</label>
                                                                    <input type="text" className="form-control col-md-7" name="size" onChange={this.onChange} />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-4" >Product Description :</label>
                                                                    <input type="text" className="form-control col-md-7" name="description" onChange={this.onChange} />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-4" >How To Use?</label>
                                                                    <input type="text" className="form-control col-md-7" name="howToUse" onChange={this.onChange} />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-4" >Product Description(Arab) :</label>
                                                                    <input type="text" className="form-control col-md-7" name="descriptionArab" onChange={this.onChange} />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-4" >How To Use(Arab)?</label>
                                                                    <input type="text" className="form-control col-md-7" name="howToUseArab" onChange={this.onChange} />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="recipient-name" className="col-form-label col-md-4" >Editor Comments :</label>
                                                                    <input type="text" className="form-control col-md-7" name="comments" onChange={this.onChange} />
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
                                                    <Submitted
                                                        multiSelectOption={false}
                                                        myData={data} 
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
                                                <h5>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Approved {ApprovedCount} items</small></h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="btn-popup pull-right">
                                                </div>
                                                <div className="clearfix"></div>
                                                <div id="basicScenario" className="product-physical">
                                                    <Approved
                                                        multiSelectOption={false}
                                                        myData={data} 
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
                                                <h5>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Arabic {ArabicCount} items</small></h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="btn-popup pull-right">
                                                </div>
                                                <div className="clearfix"></div>
                                                <div id="basicScenario" className="product-physical">
                                                    <Arabic
                                                        multiSelectOption={false}
                                                        myData={data} 
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
                                                <h5>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Completed {CompletedCount} items</small></h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="btn-popup pull-right">
                                                </div>
                                                <div className="clearfix"></div>
                                                <div id="basicScenario" className="product-physical">
                                                    <Completed
                                                        multiSelectOption={false}
                                                        myData={data} 
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
                                                <h5>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Confirmed {ConfirmedCount} items</small></h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="btn-popup pull-right">
                                                </div>
                                                <div className="clearfix"></div>
                                                <div id="basicScenario" className="product-physical">
                                                    <Confirmed
                                                        multiSelectOption={false}
                                                        myData={data} 
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
                                                <h5>{brandName}   <small style={{color: 'rgb(198, 198, 198)'}}>Done {DoneCount} items</small></h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="btn-popup pull-right">
                                                </div>
                                                <div className="clearfix"></div>
                                                <div id="basicScenario" className="product-physical">
                                                    <Done
                                                        multiSelectOption={false}
                                                        myData={data} 
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
});

export default connect(
    mapStateToProps,
    { addItem, initializeAll }
)(Brands);