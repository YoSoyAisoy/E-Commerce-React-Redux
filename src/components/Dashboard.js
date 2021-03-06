import React, {Component} from 'react';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import '../supports/css/bootstrap.css'
import { API_URL_1 } from '../supports/api-url/apiurl';

class Dashboard extends Component {
    
    state = { products: [], editedItemID: 0, show: false, transDetail: [], UserTransactionHistory: [] };

    componentWillMount(){
        Axios.get(API_URL_1 + "productsDetails")
        .then(ok=>{
            this.setState({products:ok.data, editedItemID : 0})
        })
        this.getTransHistory();
    }

    componentWillReceiveProps(newProps) {
        if(newProps.admin.username == "") {
            <Redirect to='/' />    
        }
    }

    onEditBtnCLick=(id)=>{
        this.setState( {editedItemID: id} )
    }

    onDeleteBtnCLick(idproducts){
        if(window.confirm('Are You Sure You Want To Delete This Data?')){
            Axios.delete(API_URL_1 + 'products/' + idproducts)
            .then((res)=>{
                alert('Delete Success');
                this.setState({products: res.data})
            }).catch((err)=>{
                alert('Error');
                console.log(err)
            })
        }
    }
    
    onAddBtnClick = () => {
        const { AddProductName, AddProductPrice, AddDescription, AddRAM, AddStock, AddStorage } = this.refs

        // Get product sebaiknya disatukan di back-end
        Axios.post(API_URL_1 + 'products', {
            ProductName: AddProductName.value,
            ProductPrice: AddProductPrice.value,
            Description: AddDescription.value,
            RAM: AddRAM.value,
            Storage: AddStorage.value,
            Stock: AddStock.value
        }).then((res)=>{
            Axios.get(API_URL_1 + "productsDetails")
            .then(ok=>{
                this.setState({products:ok.data, editedItemID : 0})
            })
        }).catch((err)=>{
            alert('Error');
            console.log(err)
        })
    }

    onCancelBtnClick=()=>{
        this.setState({editedItemID: 0})
    }

    onSaveBtnClick=(id)=>{
        const { editDescription, editNama, editPrice, editRAM, editStock, editStorage } = this.refs
        Axios.put(API_URL_1 + `products/${id}`, {
            ProductName: editNama.value,
            ProductPrice: editPrice.value,
            Description: editDescription.value,
            RAM: editRAM.value,
            Storage: editStorage.value,
            Stock: editStock.value
        }).then((res)=>{
            alert('edit sakses');
            this.setState({products: res.data, editedItemID:0});
            console.log(res.data)
        }).catch((err)=>{
            alert('Error');
            console.log(err)
        })
    }

    renderTabelProduct = () => {
        const arrJSX = this.state.products.map((products, key)=>{
            if(this.state.editedItemID == products.idproducts){
                return(
                    <tr key={key}>
                    <td>{products.idproducts}</td>
                    <td><input type='text' ref='editNama' defaultValue={products.ProductName}/></td>
                    <td>Rp.<input type='number' ref='editPrice'defaultValue={products.ProductPrice}/></td>
                    <td></td>
                    <td><input type='text' ref='editDescription' defaultValue={products.Description}/></td>
                    <td><input type='number' ref='editRAM'defaultValue={products.RAM}/></td>
                    <td><input type='number' ref='editStorage'defaultValue={products.Storage}/></td>
                    <td><input type='number' ref='editStock'defaultValue={products.Stock}/></td>

                    <td>
                        <input type='button' onClick={()=>this.onSaveBtnClick(products.idproducts)} value='Save'/>
                        <input type='button' onClick={this.onCancelBtnClick} value='Cancel'/>
                    </td>
                </tr>
                )
            }
            return(
                <tr key={key}>
                    <td>{products.idproducts}</td>
                    <td>{products.ProductName}</td>
                    <td>Rp.{products.ProductPrice}</td>
                    <td>{products.Category}</td>
                    <td>{products.Description}</td>
                    <td>{products.RAM}</td>
                    <td>{products.Storage}</td>
                    <td>{products.Stock}</td>

                    <td>
                        <input type='button' onClick={()=>this.onEditBtnCLick(products.idproducts)} value='Edit'/>
                        <input type='button' onClick={()=>this.onDeleteBtnCLick(products.idproducts)} value='Delete'/>
                    </td>
                </tr>
            )
        })
        return arrJSX;
    }

    renderOptionCategory = () => {
        const arrJSX = this.state.products.map((data, key)=>{
            return(
                <option key={key} value={data.idCategory}>{data.Category}</option>
            )
        })
        return arrJSX;
    }

    handleShow =()=> {
        this.setState({ show: true });
    }

    handleClose=()=>{
        this.setState({ show: false });
    }

    getTransDetail = (id) => {
        Axios.post(API_URL_1 + `adminTransHistoryDetail`, { idtranshistory: id })
        .then(res => {
            console.log(res.data)
            this.setState({ transDetail: res.data })
        }).catch( err => { 
            console.log(err)
        })
    }

    renderTransDetail = () => {
        if(this.state.transDetail.length > 0){
            return this.state.transDetail.map(data=>{
                return(
                    <tr onClick={ () => { this.getTransDetail(data.idtranshistory), this.handleShow() }}>
                        <td>{data.idtranshistory}</td>
                        <td>{data.ProductName}</td>
                        <td>Rp.{parseInt(data.ProductPrice).toLocaleString('id')}</td>
                        <td>{data.amount}</td>
                        <td>Rp.{parseInt(data.GrandTotal).toLocaleString('id')}</td>
                    </tr>
                )
            })
        }else {
            return <h3> Please Wait . . . </h3>
        }
        
    }

    getTransHistory = () => {
        Axios.get(API_URL_1 + `adminTransactionHistory`)
        .then(res => {
            console.log(res.data);
            this.setState({ UserTransactionHistory: res.data });
        }).catch(err => {
            console.log(err)
        })
    }

    renderTransHistory=()=>{
        if(this.state.UserTransactionHistory == ""){
            <div>
                Please Wait . . .
            </div>
        }
        else {
            return this.state.UserTransactionHistory.map(data=>{
                return(
                    <tr onClick={ () => { this.getTransDetail(data.idtranshistory), this.handleShow() }}>
                        <td>{data.idtranshistory}</td>
                        <td>{data.username}</td>
                        <td>Rp.{parseInt(data.TransactionValue).toLocaleString('id')}</td>
                        <td>{data.Address}</td>
                        <td>{data.DeliveryMethod}</td>
                        <td>{data.Payment}</td>
                        <td>{data.Date}</td>
                    </tr>
                )
            })
        }
    }

    renderGrandTotal=()=>{
        var GrandTotal = 0;
        if(this.state.transDetail == ''){
            return <h4>Loading ...</h4>
        }
        this.state.transDetail.map(data=>{
            GrandTotal += data.ProductPrice * data.amount
        })
        return GrandTotal;
    }

    render() {
        if(this.props.admin.username !== ""){
            return (
                <div>

                    <br/>
                    <br/>
                    <br/>
                <table style={{ margin: 'auto' }} className='tftable'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ProductName</th>
                            <th>ProductPrice</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>RAM</th>
                            <th>Storage</th>
                            <th>Stock</th>
                            <th>Edit</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.renderTabelProduct()}
                    </tbody>

                    <tfoot >
                        <td></td>
                        <td><input id='1' type='text' ref='AddProductName'/></td>
                        <td><input id='2'type='number' ref='AddProductPrice'/></td>
                        <td></td>
                        <td><input id='4'type='text' ref='AddDescription' /></td>
                        <td><input id='5'type='number' ref='AddRAM'/></td>
                        <td><input id='6'type='number' ref='AddStorage'/></td>
                        <td><input id='7'type='number' ref='AddStock'/></td>
                        <td>
                            <input type='button' onClick={this.onAddBtnClick} value='add'/>
                        </td>
                    </tfoot>
                </table> 

                Transaction History
                <table style={{ margin: 'auto' }} className='tftable'>
                    <thead>
                        <tr >
                            <th style={{textAlign:"center"}}>ID</th>
                            <th style={{textAlign:"center"}}>Username</th>
                            <th style={{textAlign:"center"}}>Transaction Value</th>
                            <th style={{textAlign:"center"}}>Address</th>
                            <th style={{textAlign:"center"}}>Delivery Method</th>
                            <th style={{textAlign:"center"}}>Payment Method</th>
                            <th style={{textAlign:"center"}}>Transaction Date</th>

                        </tr>
                    </thead>

                    <tbody>
                        {this.renderTransHistory()}
                    </tbody>
                </table> 

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <table style={{ margin: 'auto' }} className='tftable'>
                        <thead>
                            <tr>
                                <th style={{textAlign:"center"}}>Transaction ID</th>
                                <th style={{textAlign:"center"}}>ProductName</th>
                                <th style={{textAlign:"center"}}>Price</th>
                                <th style={{textAlign:"center"}}>Amount</th>
                                <th style={{textAlign:"center"}}>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTransDetail()}
                        </tbody>
                        <tfoot>
                            <th style={{textAlign:"center"}}>GrandTotal</th>
                            <th style={{textAlign:"center"}}></th>
                            <th style={{textAlign:"center"}}></th>
                            <th style={{textAlign:"center"}}></th>
                            <th style={{textAlign:"center"}}>Rp. {parseInt(this.renderGrandTotal()).toLocaleString('id')}</th>
                        </tfoot>
                    </table>
                </Modal>

                </div>
            )
        }
        return <Redirect to="/"/>
    }
}

const mapStateToProps = (state) => {
    return { admin: state.admin };
}
export default connect(mapStateToProps)(Dashboard);