import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";
import apiService from "../api/apiService";

const BACKEND_URL = "https://vin2grow.in/api";
const getImageUrl = (img) => {
  try {
    if (!img) return "/placeholder.svg";

    // Handle both string and object formats
    let imageUrl = img;
    if (typeof img === "object" && img.url) {
      imageUrl = img.url;
    } else if (typeof img !== "string") {
      console.warn("Invalid image format:", img);
      return "/placeholder.svg";
    }

    if (imageUrl.startsWith("http")) return imageUrl;
    // Remove any leading slashes and ensure proper path construction
    return BACKEND_URL + imageUrl.replace(/^\/+/, "");
  } catch (error) {
    console.error("Error processing image URL:", error, img);
    return "/placeholder.svg";
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await apiService.getProduct(id);
        setProduct(productData);
        setQuantity(productData.minOrder || 1);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value) => {
    if (!product) return;

    const newValue = parseInt(value);
    if (isNaN(newValue)) {
      setQuantity(product.minOrder || 1);
      return;
    }

    const maxAllowed = Math.min(product.maxOrder || 100, product.stock || 100);
    const clampedValue = Math.max(
      product.minOrder || 1,
      Math.min(maxAllowed, newValue)
    );
    setQuantity(clampedValue);
  };

  const handleIncrement = () => {
    if (!product) return;
    setQuantity((prev) => {
      const newValue = prev + 1;
      const maxAllowed = Math.min(
        product.maxOrder || 100,
        product.stock || 100
      );
      return Math.min(newValue, maxAllowed);
    });
  };

  const handleDecrement = () => {
    if (!product) return;
    setQuantity((prev) => {
      const newValue = prev - 1;
      return Math.max(newValue, product.minOrder || 1);
    });
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);

      // Transform product data to match cart context expectations
      const productData = {
        _id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        images: product.images || [],
        stock: product.stock || 0,
        quantity: quantity,
        length: product.length || 0,
        width: product.width || 0,
        height: product.height || 0,
        discount: product.discount || 0,
        minOrder: product.minOrder || 1,
        maxOrder: product.maxOrder || 100,
        category: product.category,
      };

      await addToCart(productData);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Error handling is already done in the cart context
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubscribe = () => {
    navigate("/subscriptions", {
      state: {
        product: {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0],
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {error || "Product not found"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-sm mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button
                onClick={() => navigate("/")}
                className="hover:text-primary-600 transition-colors duration-200"
              >
                Home
              </button>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li>
              <button
                onClick={() => navigate("/products")}
                className="hover:text-primary-600 transition-colors duration-200"
              >
                Products
              </button>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li className="text-gray-900 font-medium truncate">
              {product?.name || "Product"}
            </li>
          </ol>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="bg-white rounded-xl shadow-sm p-2 lg:p-4">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Thumbnails - Desktop View */}
              <div className="hidden lg:flex flex-col gap-2">
                {(product.images || []).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${
                      selectedImage === index
                        ? "ring-2 ring-primary-500"
                        : "ring-1 ring-gray-200"
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-fill"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 max-w-md mx-auto"
                >
                  <img
                    src={getImageUrl((product.images || [])[selectedImage])}
                    alt={product.name}
                    className="w-full h-full object-fill"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                      {product.discount}% OFF
                    </div>
                  )}
                </motion.div>

                {/* Thumbnails - Mobile View */}
                <div className="flex lg:hidden gap-2 overflow-x-auto mt-3 pb-2">
                  {(product.images || []).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${
                        selectedImage === index
                          ? "ring-2 ring-primary-500"
                          : "ring-1 ring-gray-200"
                      }`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-fill"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm p-2 lg:p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            (product.rating || 0) > 0 &&
                            i < Math.floor(product.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {(product.reviews || 0) > 0
                        ? `${product.rating || 0} (${product.reviews} reviews)`
                        : product.rating
                        ? `${product.rating} (No reviews yet)`
                        : "No reviews yet"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary-600">
                      ₹{product.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.length && product.width && product.height ? (
                        <span>
                          /{" "}
                          <span className="text-gray-900 font-semibold">
                            Dimensions:
                          </span>{" "}
                          Length: {product.length} cm, Width: {product.width}{" "}
                          cm, Height: {product.height} cm
                        </span>
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                  <div className="mt-1">
                    {product.discount > 0 ? (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          ₹
                          {Math.round(
                            product.price * (1 + product.discount / 100)
                          )}
                        </span>
                        <span className="ml-2 text-sm text-green-600">
                          Save ₹
                          {Math.round(product.price * (product.discount / 100))}
                        </span>
                      </>
                    ) : product.originalPrice &&
                      product.originalPrice !== product.price ? (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </span>
                        <span className="ml-2 text-sm text-green-600">
                          Save ₹{product.originalPrice - product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">
                        {product.originalPrice &&
                        product.originalPrice !== product.price
                          ? `Original Price: ₹${product.originalPrice}`
                          : "Regular Price"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-base md:text-lg text-gray-700">
                  {showFullDescription
                    ? product.description
                    : product.shortDescription}
                  {product.description !== product.shortDescription && (
                    <button
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                      className="ml-1 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {showFullDescription ? "Show less" : "Read more"}
                    </button>
                  )}
                </p>
              </div>

              {/* Product Dimensions */}
              {product.length && product.width && product.height && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Product Dimensions
                  </h3>
                  <div className="grid grid-cols-1 gap-1">
                    <span className="block text-xs text-gray-900 font-semibold">
                      Length: {product.length} cm
                    </span>
                    <span className="block text-xs text-gray-900 font-semibold">
                      Width: {product.width} cm
                    </span>
                    <span className="block text-xs text-gray-900 font-semibold">
                      Height: {product.height} cm
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <span className="text-sm text-gray-500">
                    Available: {product.stock} units
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={handleDecrement}
                      disabled={!product || quantity <= (product.minOrder || 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={product?.minOrder || 1}
                      max={product?.maxOrder || 100}
                      value={quantity || 1}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-16 text-center border-2 border-gray-300 rounded-lg py-1 text-sm text-black"
                    />
                    <button
                      onClick={handleIncrement}
                      disabled={
                        !product ||
                        quantity >= (product.maxOrder || 100) ||
                        quantity >= (product.stock || 100)
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      +
                    </button>
                  </div>
                  {/* <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    {addingToCart ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Adding...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                          />
                        </svg>
                        Add to Cart
                      </>
                    )}
                  </button> */}
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                {product.category === "milk" ? (
                  <button
                    onClick={handleSubscribe}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Subscribe Now</span>
                    <span className="text-sm bg-white/20 px-2 py-1 rounded">
                      Subscription Only
                    </span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      {addingToCart ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Adding...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                            />
                          </svg>
                          Add to Cart
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        handleAddToCart().then(() => {
                          navigate("/cart");
                        });
                      }}
                      disabled={addingToCart}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      Buy Now
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Subscription Plans */}
            {product.subscriptionAvailable && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Subscription Plans
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(product.subscriptionPlans || []).map((plan, index) => (
                    <div
                      key={index}
                      className="border-2 border-gray-200 rounded-lg p-4 text-center hover:border-primary-500 transition-colors duration-200 cursor-pointer"
                    >
                      <span className="block text-lg font-medium text-gray-900">
                        {plan.duration}
                      </span>
                      <span className="block text-sm text-primary-600 mt-1">
                        Save {plan.discount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
