import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'

import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemList: {},
    apiStatus: apiConstants.initial,
    productCount: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    try {
      const apiResponse = await fetch(apiUrl, options)
      if (apiResponse.ok) {
        const apiFetchedData = await apiResponse.json()
        const formattedData = {
          id: apiFetchedData.id,
          imageUrl: apiFetchedData.image_url,
          title: apiFetchedData.title,
          price: apiFetchedData.price,
          description: apiFetchedData.description,
          brand: apiFetchedData.brand,
          totalReviews: apiFetchedData.total_reviews,
          rating: apiFetchedData.rating,
          availability: apiFetchedData.availability,
          similarProducts: apiFetchedData.similar_products.map(eachProduct => ({
            id: eachProduct.id,
            imageUrl: eachProduct.image_url,
            title: eachProduct.title,
            style: eachProduct.style,
            price: eachProduct.price,
            description: eachProduct.description,
            brand: eachProduct.brand,
            totalReviews: eachProduct.total_reviews,
            rating: eachProduct.rating,
            availability: eachProduct.availability,
          })),
        }
        this.setState({
          apiStatus: apiConstants.success,
          productItemList: formattedData,
        })
      } else {
        this.setState({apiStatus: apiConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onNavigateToProduct = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-view"
      />
      <h1>Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping-button"
        onClick={this.onNavigateToProduct}
      >
        Continue Shopping
      </button>
    </div>
  )

  onIncrementCount = () => {
    this.setState(prevState => ({
      productCount: prevState.productCount + 1,
    }))
  }

  onDecrementCount = () => {
    const {productCount} = this.state
    if (productCount > 1) {
      this.setState(prevState => ({
        productCount: prevState.productCount - 1,
      }))
    }
  }

  renderProductsView = () => {
    const {productItemList, productCount} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
      similarProducts,
    } = productItemList

    return (
      <div className="product-details">
        <div className="product-image-container">
          <img src={imageUrl} alt="product" className="product-image" />
        </div>
        <div className="products-description-container">
          <h1 className="product-heading">{title}</h1>
          <p className="price">Rs {price}/-</p>
          <div className="rating-review-container">
            <div className="rating-container">
              <p className="rating">{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star"
              />
            </div>
            <p className="reviews">{totalReviews} Reviews</p>
          </div>
          <p className="description">{description}</p>
          <p className="available-stock">
            availability: <span className="in-stock">{availability}</span>
          </p>
          <p className="brand">
            brand: <span className="brand-name">{brand}</span>
          </p>
          <hr />
          <div className="product-count-container">
            <button
              type="button"
              className="button-count"
              data-testid="minus"
              onClick={this.onDecrementCount}
            >
              <BsDashSquare />
            </button>
            <p className="product-count">{productCount}</p>
            <button
              type="button"
              className="button-count"
              data-testid="plus"
              onClick={this.onIncrementCount}
            >
              <BsPlusSquare />
            </button>
          </div>
          <button type="button" className="add-to-cart-button">
            Add To Cart
          </button>
        </div>
        <ul className="similar-products-list">
          {similarProducts.map(eachProduct => (
            <SimilarProductItem
              key={eachProduct.id}
              similarProductDetails={eachProduct}
            />
          ))}
        </ul>
      </div>
    )
  }

  apiBasedRender = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderProductsView()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Header />
        <div className="product-items-details-container">
          {this.apiBasedRender()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
