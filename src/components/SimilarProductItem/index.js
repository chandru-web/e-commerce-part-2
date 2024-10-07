import './index.css'

const SimilarProductItem = props => {
  const {similarProductDetails} = props
  const {imageUrl, title, price, rating, brand} = similarProductDetails
  return (
    <li className="list-item">
      <div className="product-item">
        <img
          src={imageUrl}
          alt={`similar product ${title}`}
          className="product-image"
        />
        <h1 className="heading">{title}</h1>
        <p className="by">By {brand}</p>
        <div className="price-rating-container">
          <p className="price">Rs {price}/- </p>
          <div className="rating-container">
            <p className="rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
