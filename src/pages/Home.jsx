import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import apiService from "../api/apiService";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";

// Custom arrow components
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-green-600 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
    aria-label="Previous slide"
  >
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-green-600 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
    aria-label="Next slide"
  >
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  </button>
);

// Custom dot component
const CustomDot = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-3 h-3 mx-1 rounded-full bg-white opacity-50 hover:opacity-100 transition-opacity duration-200"
    aria-label="Go to slide"
  />
);

const Home = () => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [bestSellers, setBestSellers] = useState([]);
  const [bestSellersLoading, setBestSellersLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [featuredProducts] = useState([
    {
      id: 1,
      name: "Sanchi Stupa",
      description:
        "Beautifully crafted wooden replica of the famous Sanchi Stupa.",
      price: 1870,
      image:
        "https://res.cloudinary.com/dnbqgzh4t/image/upload/v1749720533/u1yytg3rpbdhkw3fui0s.jpg",
      category: "Wooden Art",
      rating: 4.8,
      reviews: 120,
    },
    {
      id: 2,
      name: "Warli House",
      description: "Traditional Warli art inspired wooden house decoration.",
      price: 2200,
      image:
        "https://res.cloudinary.com/dnbqgzh4t/image/upload/v1749720630/zcdgdxj8b66ckyl2rajo.jpg",
      category: "Wooden Art",
      rating: 4.9,
      reviews: 85,
    },
    {
      id: 3,
      name: "Tiger Crafting",
      description:
        "Exquisite wooden tiger sculpture showcasing fine craftsmanship.",
      price: 3500,
      image:
        "https://res.cloudinary.com/dnbqgzh4t/image/upload/v1749636035/d1elvtmj2dijdjlav1hp.jpg",
      category: "Wooden Sculpture",
      rating: 4.7,
      reviews: 95,
    },
  ]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Fetch best sellers data
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setBestSellersLoading(true);
        const data = await apiService.getBestSellers(6);
        ///console.log(data);

        setBestSellers(data);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
        // Fallback to empty array if API fails
        setBestSellers([]);
      } finally {
        setBestSellersLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  // Handle add to cart
  const handleAddToCart = async (product) => {
    try {
      // Validate product data
      if (!product.id || !product.name || !product.price) {
        toast.error("Invalid product data");
        return;
      }

      setAddingToCart((prev) => ({ ...prev, [product.id]: true }));

      // Transform product data to match cart context expectations
      const productData = {
        _id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        images: product.image ? [{ url: product.image }] : [],
        stock: 100, // Default stock value
        quantity: 1,
        length: product.length || 0,
        width: product.width || 0,
        height: product.height || 0,
        discount: product.discount || 0,
        minOrder: 1,
        maxOrder: 100,
      };

      await addToCart(productData);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Error handling is already done in the cart context
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    customPaging: () => <CustomDot />,
    appendDots: (dots) => (
      <div className="absolute bottom-4 left-0 right-0">
        <ul className="flex justify-center items-center m-0 p-0"> {dots} </ul>
      </div>
    ),
  };

  const carouselItems = [
    {
      id: 1,
      title: "Handcrafted Wooden Treasures",
      description: "Discover our unique collection of wooden art pieces",
      image:
        "https://res.cloudinary.com/dnbqgzh4t/image/upload/v1749718407/b6pvrj91gd2rklbwtmsl.jpg",
      buttonText: "Shop Now",
      buttonLink: "/products",
    },
    {
      id: 2,
      title: "Traditional Craftsmanship",
      description: "Made with love and delivered with care",
      image:
        "https://res.cloudinary.com/dnbqgzh4t/image/upload/v1749641740/q38ghohv1ugnq1pbqdte.jpg",
      buttonText: "Explore Collection",
      buttonLink: "/products",
    },
    {
      id: 3,
      title: "Eco-Friendly Bamboo Collection",
      description: "Sustainable bamboo products for conscious living",
      image:
        "https://res.cloudinary.com/dnbqgzh4t/image/upload/v1749720630/zcdgdxj8b66ckyl2rajo.jpg",
      buttonText: "View Bamboo",
      buttonLink: "/products",
    },
    {
      id: 4,
      title: "Artisan Wooden Puppets",
      description: "Traditional puppetry meets modern craftsmanship",
      image:
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1753891711/wooden-toys_nzwq2t.webp",
      buttonText: "Discover Puppets",
      buttonLink: "/products",
    },
    {
      id: 5,
      title: "Premium Jute Collection",
      description: "Natural jute bags and accessories for everyday use",
      image:
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1753891711/IN_Jute-Bag-Combo_Hero-image_01_g81xtv.webp",
      buttonText: "Shop Jute",
      buttonLink: "/products",
    },
    {
      id: 6,
      title: "Exotic Coco Collection",
      description: "Discover our unique coconut shell crafted products",
      image:
        "https://res.cloudinary.com/dk6rrrwum/image/upload/v1753891711/coco-products_hero_image.webp",
      buttonText: "Explore Coco",
      buttonLink: "/products",
    },
  ];

  const categories = [
    {
      id: 1,
      name: "Tiger Crafting",
      image:
        "https://res.cloudinary.com/dnbqgzh4t/image/upload/v1749720533/u1yytg3rpbdhkw3fui0s.jpg",
      link: "/products",
    },
    {
      id: 2,
      name: "Bamboo Swords",
      image:
        "https://res.cloudinary.com/dnbqgzh4t/image/upload/v1749720630/zcdgdxj8b66ckyl2rajo.jpg",
      link: "/products",
    },
    {
      id: 3,
      name: "Wooden Crafting",
      image:
        "https://res.cloudinary.com/dnbqgzh4t/image/upload/v1749636034/rrs7jli0pece2df0bowd.jpg",
      link: "/products",
    },
    {
      id: 4,
      name: "Wooden Tray",
      image:
        "https://res.cloudinary.com/dnbqgzh4t/image/upload/v1749638109/nzqplnbr1di59kmdzktg.jpg",
      link: "/products",
    },
    {
      id: 5,
      name: "House Crafting",
      image:
        "https://res.cloudinary.com/dnbqgzh4t/image/upload/v1749640469/cxi2h6vuvuedhvarj8bj.jpg",
      link: "/products",
    },
    {
      id: 6,
      name: "Tribal Mask",
      image:
        "https://res.cloudinary.com/dnbqgzh4t/image/upload/v1749636035/d1elvtmj2dijdjlav1hp.jpg",
      link: "/products",
    },
  ];

  const whyChoosePoints = [
    {
      id: 1,
      title: "Handcrafted Excellence",
      description:
        "Each wooden product is meticulously handcrafted by skilled artisans with generations of experience.",
      icon: "https://cdn-icons-png.flaticon.com/512/3281/3281289.png", // Woodworking icon
    },
    {
      id: 2,
      title: "Premium Materials",
      description:
        "We use only the finest quality wood sourced from sustainable forests for long-lasting durability.",
      icon: "https://cdn-icons-png.flaticon.com/512/3281/3281306.png", // Tree/wood icon
    },
    {
      id: 3,
      title: "Unique Designs",
      description:
        "Our collection features exclusive designs that blend traditional craftsmanship with modern aesthetics.",
      icon: "https://cdn-icons-png.flaticon.com/512/3281/3281313.png", // Design icon
    },
    {
      id: 4,
      title: "Eco-Friendly",
      description:
        "Sustainable practices and materials that respect the environment.",
      icon: "https://cdn-icons-png.flaticon.com/512/3281/3281320.png", // Eco icon
    },
  ];

  return (
    <div className="bg-gray-900 text-gray-100">
      {/* Hero Carousel */}
      <div className="relative">
        <Slider {...carouselSettings} className="w-full">
          {carouselItems.map((item) => (
            <div key={item.id} className="relative h-[300px] sm:h-[500px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${item.image})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40" />
              </div>
              <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
                >
                  {item.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg sm:text-xl text-white mb-6 max-w-2xl"
                >
                  {item.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Link
                    to={item.buttonLink}
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-lg"
                  >
                    {item.buttonText}
                  </Link>
                </motion.div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Best Sellers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Best Sellers
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Discover our most popular and highly-rated handcrafted products
            </p>
            <div className="w-24 h-1 bg-green-500 mx-auto mt-6"></div>
          </div>
          {bestSellersLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-pulse"
                >
                  <div className="h-64 bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded mb-3"></div>
                    <div className="h-8 bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : bestSellers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {bestSellers.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {product.badge}
                      </span>
                    </div>
                    {/* <div className="absolute top-3 right-3">
                      <div className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        {product.rating}
                      </div>
                    </div> */}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(product.rating) ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm ml-2">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-white">
                          ₹{product.price}
                        </span>
                        <span className="text-gray-400 line-through ml-2">
                          ₹{product.originalPrice}
                        </span>
                      </div>
                      <span className="text-green-400 text-sm font-medium">
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        % OFF
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">
                        {product.sold} sold
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={addingToCart[product.id]}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-2 px-3 rounded transition-colors duration-200 text-sm flex items-center gap-1"
                        >
                          {addingToCart[product.id] ? (
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
                        </button>
                        <Link
                          to={`/products/${product._id || product.id}`}
                          className="bg-transparent hover:bg-gray-700 text-white font-medium py-2 px-3 rounded border border-gray-600 transition-colors duration-200 text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                No best sellers available at the moment
              </div>
              <Link
                to="/products"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Browse All Products
              </Link>
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explore Our Collections
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <Link to={category.link} className="block">
                  <div className="relative overflow-hidden rounded-lg h-64">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                          {category.name}
                        </h3>
                        <button className="mt-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 py-2 px-4 rounded transition-colors duration-300">
                          View Collection
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Vin2Grow */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Vin2Grow?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We combine traditional craftsmanship with modern techniques to
              bring you the finest wooden products.
            </p>
            <div className="w-24 h-1 bg-green-500 mx-auto mt-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChoosePoints.map((point) => (
              <motion.div
                key={point.id}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 rounded-lg p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <img src={point.icon} alt={point.title} className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {point.title}
                </h3>
                <p className="text-gray-300">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 to-green-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Bring Handcrafted Beauty to Your Home?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Explore our collection of unique wooden treasures today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/products"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Shop Now
            </Link>
            <Link
              to="/about"
              className="bg-transparent hover:bg-gray-800 text-white font-medium py-4 px-8 rounded-lg text-lg border-2 border-white transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
