import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import {Image, Col, Button, Modal} from 'react-bootstrap';
import Axios from 'axios';
import queryString from 'query-string'

import { addToCart } from '../actions';
import { API_URL_1 } from '../supports/api-url/apiurl';

// Add to cart is yet to be protected
// Need to fix routing method
// Check for bugs pls

class ProductDetails extends Component {
    state = {product: null, amount: 1, show: false, error:'', cart: ''}

    componentWillMount(){
        this.getSelectedProduct()
    }
    getSelectedProduct(){
        Axios.get(API_URL_1 + 'products/' + queryString.parse(this.props.location.search).idproducts)
        .then(ok=>{
            this.setState({product:ok.data})
        })
    }
    renderContent(){
        console.log(this.state.product)
        if(this.state.product.length >= 0 ){
            const {ProductName, ProductPrice, Description, Brand, Color, ScreenSize, RAM, Storage, Stock} = this.state.product[0]
            return([
                ProductName,
                ProductPrice,
                Description, 
                Brand, 
                Color, 
                ScreenSize, 
                RAM, 
                Storage, 
                Stock
            ])
        }
    }
    addToCart=()=>{
        const {idproducts, ProductName, ProductPrice} = this.state.product[0]
        const amount = this.refs.amount.value
        
        if(this.refs.amount.value < 1){
            window.alert('Jumlah Item Harus Lebih dari 0')
        }
        Axios.post(API_URL_1 + 'cart', {
            idproducts, 
            ProductName, 
            ProductPrice, 
            amount,
            username: this.props.auth.username
        }).then(ok=>{
            console.log(ok.data)
            if(typeof(ok.data) == typeof('a')){
                this.setState({error:ok.data})
            }
            else this.setState({cart: ok.data})
        }).catch(err=>{
            console.log(err)
        })
    }

    renderStock=()=>{
        const Stock = [];
        for(var i=1; i<=this.state.product[0].Stock; i++){
            console.log(i)
                Stock.push(<option value={i}>{i}</option>)
        }
       return(Stock)
    }

    renderTotal=()=>{
        return this.state.product[0].ProductPrice * this.state.amount;
    }
    changeAmount=()=>{
        this.setState({amount: this.refs.amount.value})
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleClose=()=>{
        this.setState({ show: false });
    }

    onBuyBtnClick=()=>{
        this.handleShow()
        this.addToCart(this.state.product[0].idproducts)
    }
    
    renderCart = () => {
        if(this.state.cart == ''){
            return <h4>Your Cart is Empty</h4>
        }
        console.log(this.state.cart)
        return this.state.cart.map(cart=>{
            return(
                <tr>
                    <td style={{textAlign:"center"}}>{cart.ProductName}</td>
                    <td style={{textAlign:"center"}}>Rp. {parseInt(cart.ProductPrice).toLocaleString('id')}</td>
                    <td style={{textAlign:"center"}}>{cart.amount} Unit(s)</td>
                    <td style={{textAlign:"center"}}>Rp. {parseInt(cart.ProductPrice * cart.amount).toLocaleString('id')}</td>
                    <td style={{textAlign:"center"}}><button onClick={()=>{this.deleteItem(cart.idcart)}} >Delete</button></td>
                </tr>
            )
        })
    }

    deleteItem=(id)=>{
        const { username } = this.props.auth
        Axios.delete(API_URL_1 + 'cart', {
            params: {
                id: id,
                username: username
            }
        }).then(ok=>{
            console.log(ok.data)
            this.setState({cart: ok.data})
        }).catch(err=>{
            console.log(err);
        })
    }

    renderGrandTotal=()=>{
        var GrandTotal = 0;
        if(this.state.cart == ''){
            return <h4>Loading ...</h4>
        }
        this.state.cart.map(cart=>{
            GrandTotal += cart.ProductPrice * cart.amount
        })
        return GrandTotal;
    }

    checkout(){
        // insert redirecting function here
    }

    cartPopUp = () => {
        if (this.props.auth === undefined) {
            return(
                <div>
                    <h3>Please Wait</h3>
                </div>
                
            )
        }
        // console.log(this.props.auth)
        if(this.state.error !== ''){
            return  <h4>Stok Tidak Cukup</h4>
        }
        
        else if(this.props.auth.username == ''){
            return(
                <div>
                    <Modal.Header closeButton>
                        <Modal.Title>You are not Logged In</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Please Log in <Link to="/login">here</Link>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Close</Button>
                    </Modal.Footer>
                </div>
            )
        }
        return(
            <div>
                <Modal.Header closeButton>
                    <Modal.Title>Your Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className='tftable'>
                        <thead>
                            <tr>
                                <th style={{textAlign:"center"}}>ProductName</th>
                                <th style={{textAlign:"center"}}>Price</th>
                                <th style={{textAlign:"center"}}>Amount</th>
                                <th style={{textAlign:"center"}}>Total Price</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderCart()}
                        </tbody>
                        <tfoot>
                            <th style={{textAlign:"center"}}>GrandTotal</th>
                            <th style={{textAlign:"center"}}></th>
                            <th style={{textAlign:"center"}}></th>
                            <th style={{textAlign:"center"}}>Rp. {parseInt(this.renderGrandTotal()).toLocaleString('id')}</th>
                        </tfoot>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.props.history.push('/checkoutPage')}>
                        Checkout
                    </Button>
                    <Button onClick={this.handleClose}>Continue Shopping</Button>
                </Modal.Footer>
            </div>
        )
    }
    render(){
        if (this.state.product === null) {
            return(
                <div>
                    <br/>
                    <br/>
                    <br/>
                    <h3>Please Wait</h3>
                </div>
                
            )
        }
        console.log(this.state.product[0])
        return(
            <div >
                <h3>
                    <br/>
                    <br/>
                    <br/>
                    {this.state.product[0].ProductName}
                </h3>
                <Col className="container container-fluid" xs={12} >
                     <Image src={this.state.product[0].Img} responsive />
                </Col>

                <div>
                    {this.state.product[0].Description}
                </div>

                <br/>
                <br/>

                <div>
                    Available Stock : {this.state.product[0].Stock}
                </div>
                <div>
                    Rp. {parseInt(this.state.product[0].ProductPrice).toLocaleString('id')} x {' '}
                    <select onChange={this.changeAmount} ref='amount'>
                        {this.renderStock()}
                    </select>     
                </div>
                 
                 <div>
                     Total Price : Rp. {parseInt(this.renderTotal()).toLocaleString('id')}
                 </div>

                <Button onClick={ this.onBuyBtnClick } bsStyle="success">Add to Cart</Button>

                <br/>
                <br/>
                <div>

                </div>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    
                    {this.cartPopUp()}
                    
                </Modal>
            </div>
        )
        
    }
}

const mapStateToProps = (state) => {
    const auth = state.auth;
    const selectedProduct = state.selectedProduct;
    return { auth, selectedProduct };
}

export default withRouter(connect(mapStateToProps, addToCart)(ProductDetails));
// export default ProductDetails;