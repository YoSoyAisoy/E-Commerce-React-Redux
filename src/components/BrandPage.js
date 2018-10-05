import React, {Component} from 'react';
import {Grid, Row, Col, Thumbnail, Button} from 'react-bootstrap';
import XPS15 from '../supports/img/XPS 15.jpg';
import MiNotebookAir13 from '../supports/img/Mi Notebook Air 13.jpg';
import {Link, Redirect} from 'react-router-dom';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';

const cookies = new Cookies();

class CategoryPage extends Component {
    state = { products : []}

    // componentWillMount(){
    //     this.getProductList();
    // }
    
    // getProductList(){
    //     var selectedProduct = cookies.get('SelectedCategory')
    //     console.log(selectedProduct)
    //     Axios.get("http://localhost:1002/categories/" + selectedProduct)
    //     .then(ok=>{
    //         // console.log(ok)
    //         this.setState({products:ok.data})
    //         // console.log(this.state.products)
    //     })
    // }

    selectedProduct(id){
        cookies.set('SelectedProduct', id, { path: '/' });
    }

    renderItemList(){
        if(this.props.Product.productList == '' || this.props.Select.selectedBrand == ""){
            return <h4> Please Wait . . .</h4>
        }
        return this.props.Product.productList.map(data=>{
            // console.log(data.Category);
            if(data.Brand == this.props.Select.selectedBrand){
                console.log(data);
                return(
                    <Col xs={6} md={4}>
                        <Thumbnail src={MiNotebookAir13} alt="Picture Not Found">
                            <h3>{data.ProductName} </h3>
                            <p>{data.description}</p><br/>
                            <p>{data.ProductPrice}</p>
                            <p>
                                <Button  onClick={ () => this.selectedProduct(data.idproducts)} bsStyle="primary">
                                    <Link to="/productDetails">Details</Link>
                                </Button>
                                &nbsp;
                                {/* <Button bsStyle="default">Buy</Button> */}
                            </p>
                        </Thumbnail>
                    </Col>
                )
            }
            
        })
    }

    renderCategoryName(idCategory){
        var ArrBrand = [
            "Null",
            "Acer Laptops",
            "Apple Laptops",
            "Asus Laptops",
            "Dell Laptops",
            "HP Laptops",
            "Lenovo Laptops",
            "Xiaomi Laptops",
            "Other Laptops",
        ]
        return(
            <h2>{ArrBrand[idCategory]}</h2>
        )
        
    }
    render() {
        console.log(this.props.Select)
        if(this.props.Select.selectedBrand == ""){
            return <Redirect to='/'/>
        }
        return(
            <div>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <h3>{this.renderCategoryName(this.props.Select.selectedBrand)}</h3>
                {this.renderItemList()}
            </div>
        );
    };
}

const mapStateToProps = (state) => {
    const Product = state.Product
    const Select = state.Select
    return {Product, Select};
}

export default connect(mapStateToProps)(CategoryPage);
``