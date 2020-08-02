import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-responsive-modal';

import { connect } from 'react-redux';
import { updateBrand, deleteBrand } from '../../../actions';

export class ActiveBrands extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkedValues: [],
            myData: [],
            open: false,
            brandName: "",
            brandPicture: "",
            currentId: "",
        }
    }

    componentWillMount(){
        let data = [];
        let index = 0;
        this.props.activeBrands.map(brand => {
            if(brand.allow) {
                let oneBrand = {
                    index: ++ index,
                    image: <img src={`${process.env.PUBLIC_URL}/assets/images/brands/${brand.picture}`} style={{width:150,height:35}} placeholder={"Brand picture"} />,
                    name: brand.name
                }
                data.push(oneBrand);
            }
        });
        this.setState({
            myData: data
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
        // toast.success("Successfully Deleted !")
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

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    save = async (e) => {
        
        if(this.state.brandName === "") {
            toast.error("Before making current brand changes, please type new brand name.");
            return;
        }

        let pictureUrl = "";
        if(this.uploadInput.files[0] === undefined) {
            pictureUrl = this.state.brandPicture;
        } else {
            pictureUrl = this.uploadInput.files[0].name;
        }

        let brandObj = {
            _id: this.state.currentId,
            name: this.state.brandName,
            picture: pictureUrl,
            allow: true,
        }
        var myJSON = JSON.stringify(brandObj)
        let data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        data.append('fileName', pictureUrl);
        data.append('product',myJSON);
        await this.props.updateBrand(data);

    }

    cancel = (e) => {
        this.setState({
            open: false,
            brandName: "",
            brandPicture: "",
            currentId: "",
        })
    }

    render() {
        const { pageSize, myClass, pagination } = this.props;
        const { myData } = this.state

        const columns = [];

        const widthList = [ 80, 300, 230];
        let index = 0;

        const { open } = this.state;

        for (var key in myData[0]) {
            columns.push({
                accessor: key,
                Cell: null,
                style: {
                    textAlign: key === 'index'? 'center' : 'left',
                    padding: 0
                },
                maxWidth: widthList[index]
            });

            index ++;
        }

        columns.push(
            {
                id: 'action',
                accessor: str => "action",
                Cell: (row) => (
                    <div>
                        <span
                            onClick={() => {
                                this.setState({
                                    currentId: this.props.activeBrands[row.index]._id,
                                    brandName: this.props.activeBrands[row.index].name,
                                    brandPicture: this.props.activeBrands[row.index].picture,
                                })

                                this.onOpenModal();
                            }}
                        >
                            <i className="fa fa-pencil" style={{ width: 35, fontSize: 20, padding: 11,color:'rgb(40, 167, 69)', cursor: 'pointer' }} />
                        </span>

                        <span
                            onClick={() => {
                                if (window.confirm('Are you sure you wish to delete this brand?')) {

                                    this.props.deleteBrand(this.props.activeBrands[row.index]._id);
    
                                    // toast.success("Successfully Deleted !")
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
            maxWidth: 100
        })

        return (
            <Fragment>
                <ReactTable
                    TheadComponent={_ => null}
                    data={myData}
                    columns={columns}
                    defaultPageSize={pageSize}
                    className={myClass}
                    showPagination={pagination}
                />
                <Modal open={open} onClose={this.cancel} >
                    <div className="modal-header">
                        <h5 className="modal-title f-w-600" id="exampleModalLabel2">Add Brand</h5>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="recipient-name" className="col-form-label" >Brand Name :</label>
                                <input type="text" className="form-control" name="brandName" value={this.state.brandName} onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message-text" className="col-form-label">Brand Image :</label>
                                <input className="form-control" ref={(ref) => { this.uploadInput = ref; }} type="file" required={true}/>
                            </div>
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
    unknown_error: state.currentStatus.unknown_error,
    activeBrands: state.brand.activeBrands
});

export default connect(
    mapStateToProps,
    { updateBrand, deleteBrand }
)(ActiveBrands);