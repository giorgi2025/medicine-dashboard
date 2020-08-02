import React, { Component, Fragment} from 'react'
import Modal from 'react-responsive-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import data from '../../assets/data/brandsData';
import ActiveBrands from './sub/activeBrands';
import DeletedBrands from './sub/deletedBrands';
import { connect } from 'react-redux';
import { allBrands, addBrand } from '../../actions';

export class AddRemoveBrand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            brandName: "",
            brandPicture: ""
        };
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
    }

    save = (e) => {
        e.preventDefault();

        if(this.state.brandName === "" ) {
            toast.error("Please type brand name");
            return;
        }

        if(this.uploadInput.files[0] === undefined) {
            toast.error("Please upload the image of the brand!");
            return;
        }

        let newBrand = {
            name: this.state.brandName,
            picture: this.uploadInput.files[0].name,
        }
        var myJSON = JSON.stringify(newBrand)
        let data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        data.append('fileName', this.uploadInput.files[0].name);
        data.append('product',myJSON);
        this.props.addBrand(data);
    }

    render() {
        const { open } = this.state;
        return (
            <Fragment>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="card">
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
                                        <Modal open={open} onClose={this.onCloseModal} >
                                            <div className="modal-header">
                                                <h5 className="modal-title f-w-600" id="exampleModalLabel2">Add Brand</h5>
                                            </div>
                                            <div className="modal-body">
                                                <form>
                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Brand Name :</label>
                                                        <input type="text" className="form-control" name="brandName" onChange={this.onChange} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="message-text" className="col-form-label">Brand Image :</label>
                                                        <input className="form-control" ref={(ref) => { this.uploadInput = ref; }} type="file" required={true}/>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-primary" onClick={this.save}>Save</button>
                                                <button type="button" className="btn btn-secondary" onClick={() => this.onCloseModal('VaryingMdo')}>Close</button>
                                            </div>
                                        </Modal>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div id="basicScenario" className="product-physical">
                                        <ActiveBrands
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

                        <div className="col-sm-6">
                            <div className="card">
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
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    unknown_error: state.currentStatus.unknown_error
});

export default connect(
    mapStateToProps,
    { allBrands, addBrand }
)(AddRemoveBrand);