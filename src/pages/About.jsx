import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              About Vin2Grow
            </h1>
            <div className="w-20 h-1 bg-green-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our journey in crafting timeless wooden treasures
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 md:p-12">
            {/* Story Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <div>
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Our Story
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  At VIN2GROW, our mission is to identify and empower talented
                  individuals from villages and local communities — people who
                  possess exceptional skills in handmade crafts but lack access
                  to digital platforms and modern markets. We believe that true
                  talent often remains hidden simply because of a lack of
                  awareness, exposure, or opportunities. VIN2GROW bridges this
                  gap by providing a platform for these artisans to showcase
                  their craftsmanship and bring their unique, handmade products
                  to a wider audience. From wooden crafts and toys to jute bags
                  and eco-friendly frames, every product reflects the
                  creativity, hard work, and cultural heritage of our local
                  artisans. 
                </p>
                <p>Our aim is simple: Encourage your talent. Support
                  your passion. Help you grow. Together, we bring rural
                  craftsmanship to the global marketplace. VIN2GROW – Crafting
                  Opportunities, Growing Futures.</p>
              </div>
            </motion.div>

            {/* Mission, Vision, Values Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {/* Mission */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 bg-gray-700 hover:bg-gray-600 p-6 rounded-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/7198/7198217.png"
                    alt="Our Mission"
                    className="w-6 h-6 filter invert"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Our Mission
                </h3>
                <p className="text-gray-300">
                  To create handcrafted wooden products that blend traditional
                  craftsmanship with modern functionality, using sustainable
                  materials and ethical practices.
                </p>
              </motion.div>

              {/* Vision */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 bg-gray-700 hover:bg-gray-600 p-6 rounded-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/7653/7653862.png"
                    alt="Our Vision"
                    className="w-6 h-6 filter invert"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white">Our Vision</h3>
                <p className="text-gray-300">
                  To become a globally recognized brand for premium wooden
                  crafts that preserve traditional techniques while innovating
                  for contemporary lifestyles.
                </p>
              </motion.div>

              {/* Values */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 bg-gray-700 hover:bg-gray-600 p-6 rounded-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/18866/18866935.png"
                    alt="Our Values"
                    className="w-6 h-6 filter invert"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white">Our Values</h3>
                <p className="text-gray-300">
                  Craftsmanship, sustainability, authenticity, and customer
                  satisfaction guide our every decision in creating products
                  that stand the test of time.
                </p>
              </motion.div>
            </motion.div>

            {/* Additional Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">
                The Vin2Grow Promise
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Every wooden piece carries a heartbeat — a quiet echo of our
                love for tradition, nature, and the comfort of home. These
                aren't just products; they're memories carved with care,
                inspired by the warmth of childhood, and made to last for
                generations.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-3">
                    Sustainable Materials
                  </h3>
                  <p className="text-gray-300">
                    We source our wood responsibly from sustainable forests,
                    ensuring minimal environmental impact while maintaining the
                    highest quality standards.
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-3">
                    Artisan Craftsmanship
                  </h3>
                  <p className="text-gray-300">
                    Each product is handcrafted by skilled artisans who combine
                    traditional techniques with meticulous attention to detail.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
