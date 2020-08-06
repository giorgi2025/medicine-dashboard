import React, { Component, Fragment} from 'react'
import Modal from 'react-responsive-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActiveBrands from './sub/activeBrands';
import DeletedBrands from './sub/deletedBrands';
import { connect } from 'react-redux';
import { allBrands, addBrand, initializeAll } from '../../actions';

export class AddRemoveBrand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            brandName: "",
            brandPicture: "",
            file: "",
            isDoubleBrandName: false
        };

        // //Dropzone constants & methods
        // this.dropzone = null;
        // this.files = [];

        // this.djsConfig = {
        //     addRemoveLinks: true,
        //     acceptedFiles: "image/jpeg,image/png,image/gif",
        //     maxFiles: 1
        // };
   
        // this.dropzoneComponentConfig = {
        //     iconFiletypes: ['.jpg', '.png', '.gif'],
        //     showFiletypeIcon: true,
        //     postUrl: '/',
        // };
          
        // this.callbackArray = [() => console.log('Hi!'), () => console.log('Ho!')];
        // this.callback = (e) => {this.files.push(e);};
        // this.success = file => console.log('uploaded', file);
        // this.removedfile = file => {
        //     for(let i = 0 ; i < this.files.length ; i ++ ) {
        //         if(this.files[i] === file) {
        //             this.files.splice(i, 1);
        //             break;
        //         }
        //     }
        // }

    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })

        if(e.target.name === "brandName") {
            let tempFlag = false;
            this.props.activeBrands.map(oneBrand => {
                if(oneBrand.name === e.target.value) {
                    tempFlag = true;
                } 
            })
            this.props.deletedBrands.map(oneBrand => {
                if(oneBrand.name === e.target.value) {
                    tempFlag = true;
                } 
            })
            this.setState({
                isDoubleBrandName: tempFlag
            })
        }

    }

    save = (e) => {
        e.preventDefault();
        this.props.initializeAll();

        if(this.state.brandName === "" ) {
            toast.error("Please type brand name");
            return;
        }

        if(this.state.isDoubleBrandName) {
            toast.error("brand's name already exists!");
            return;
        }

        if(this.uploadInput.files.length === 0 ) {
            toast.error("Please upload the image of the item!");
            return;
        }
        
        let pictureUrl = this.uploadInput.files[0].name;

        let newBrand = {
            name: this.state.brandName,
            picture: pictureUrl,
        }
        var myJSON = JSON.stringify(newBrand)
        let data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        data.append('fileName', pictureUrl);
        data.append('product',myJSON);
        this.props.addBrand(data);

        this.setState({
            open: false,
            brandName: "",
            brandPicture: "",
            file: "",
            isDoubleBrandName: false
        })
    }

    cancel = (e) => {
        this.setState({
            open: false,
            brandName: "",
            brandPicture: "",
            file: "",
            isDoubleBrandName: false
        })
        this.props.initializeAll();

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

        return (
            <Fragment>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="card" style={{marginTop: 80}}>
                                <div className="card-header">
                                    <h5>Active Brands</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">

                                        <span 
                                            style={{fontSize: 25, color: 'white', backgroundColor: 'rgb(0, 164, 228)', padding: '8px 15px', borderRadius: 25, cursor: 'pointer'}}
                                            onClick={this.onOpenModal} data-toggle="modal" data-original-title="test" data-target="#exampleModal"
                                        >
                                            +
                                        </span>
                                        <Modal open={open} onClose={this.cancel} >
                                            <div className="modal-header">
                                                <h5 className="modal-title f-w-600" id="exampleModalLabel2">Add Brand</h5>
                                            </div>
                                            <div className="modal-body">
                                                <form>
                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Brand Name :</label>
                                                        <input type="text" className="form-control" name="brandName" onChange={this.onChange} />
                                                    </div>

                                                    {this.state.file !== "" ?
                                                        <div className="form-group">                                                              
                                                            <img className="form-control" src={this.state.file} style={{width: 300, height: 'auto', marginLeft: 'auto', marginRight: 'auto'}} />
                                                        </div>
                                                        :
                                                        <></>
                                                    }

                                                    <div className="form-group">
                                                        <label htmlFor="message-text" className="col-form-label">Brand Image :</label>
                                                        <input className="form-control" ref={(ref) => { this.uploadInput = ref; }} type="file" onChange={this.handleFileChange} required={true}/>
                                                    </div>

                                                </form>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-primary" onClick={this.save}>Save</button>
                                                <button type="button" className="btn btn-secondary" onClick={() => this.cancel}>Close</button>
                                            </div>
                                        </Modal>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div id="basicScenario" className="product-physical">
                                        <ActiveBrands
                                            multiSelectOption={false}
                                            pageSize={5} 
                                            pagination={true}
                                            class="-striped -highlight" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6">
                            <div className="card" style={{marginTop: 80}}>
                                <div className="card-header">
                                    <h5>Deleted Brands</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">
                                    </div>
                                    <div className="clearfix"></div>
                                    <div id="basicScenario" className="product-physical" style={{marginTop: 35}}>
                                        <DeletedBrands
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
    activeBrands: state.brand.activeBrands,
    deletedBrands: state.brand.deletedBrands,
});

export default connect(
    mapStateToProps,
    { allBrands, addBrand, initializeAll }
)(AddRemoveBrand);