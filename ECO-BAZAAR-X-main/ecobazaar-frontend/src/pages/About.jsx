import React from 'react';
import { Leaf, Users, ShoppingBag, TrendingDown, Globe, Shield, Award, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full">
              <Leaf className="w-16 h-16" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">About EcoBazaarX</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Your gateway to sustainable shopping and carbon-conscious living. We're revolutionizing e-commerce 
            by connecting eco-conscious consumers with environmentally responsible sellers.
          </p>
          <div className="flex justify-center space-x-8 text-lg">
            <div className="flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              <span>Carbon Footprint Aware</span>
            </div>
            <div className="flex items-center">
              <Globe className="w-6 h-6 mr-2" />
              <span>Planet-Friendly</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-6 h-6 mr-2" />
              <span>Community Driven</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To create a sustainable marketplace where every purchase contributes to environmental protection, 
              where sellers are rewarded for eco-friendly practices, and where customers can make informed 
              decisions about their carbon footprint.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Reduce Carbon Emissions</h3>
              <p className="text-gray-600">
                Every eco-friendly purchase helps reduce your personal carbon footprint and contributes to global environmental goals.
              </p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Support Green Businesses</h3>
              <p className="text-gray-600">
                Connect with verified eco-friendly sellers who prioritize sustainability in their products and practices.
              </p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Transparent Impact</h3>
              <p className="text-gray-600">
                Get detailed carbon footprint scores for every product, helping you make informed environmental choices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">How EcoBazaarX Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes sustainable shopping simple and rewarding for everyone involved.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* For Sellers */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">For Sellers</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Get Verified</h4>
                    <p className="text-gray-600">Register as a verified eco-friendly seller and showcase your sustainable practices.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Add Your Products</h4>
                    <p className="text-gray-600">Upload eco-friendly products with detailed carbon footprint information and sustainability metrics.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Reach Conscious Consumers</h4>
                    <p className="text-gray-600">Connect with environmentally conscious customers who value sustainable products and practices.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Track Your Impact</h4>
                    <p className="text-gray-600">Monitor your environmental contribution and get rewarded for your sustainable business practices.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Customers */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <ShoppingBag className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">For Customers</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Browse Eco-Friendly Products</h4>
                    <p className="text-gray-600">Discover a curated selection of sustainable products with transparent carbon footprint scores.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Make Informed Choices</h4>
                    <p className="text-gray-600">Compare products based on environmental impact, sustainability metrics, and eco-friendly certifications.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Reduce Your Carbon Footprint</h4>
                    <p className="text-gray-600">Every purchase contributes to lowering your personal carbon emissions and environmental impact.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Track Your Impact</h4>
                    <p className="text-gray-600">Monitor your environmental contribution and see how your choices make a difference.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carbon Footprint Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Understanding Carbon Footprint</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how your shopping choices impact the environment and how EcoBazaarX helps you make a positive difference.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">What is Carbon Footprint?</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                A carbon footprint is the total amount of greenhouse gases (including carbon dioxide and methane) 
                that are generated by our actions. In e-commerce, this includes:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3 mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Product Manufacturing</h4>
                    <p className="text-gray-600 text-sm">Materials, production processes, and energy consumption</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3 mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Packaging & Shipping</h4>
                    <p className="text-gray-600 text-sm">Transportation emissions and packaging materials</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3 mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Product Lifecycle</h4>
                    <p className="text-gray-600 text-sm">Usage, disposal, and end-of-life environmental impact</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">How We Help Reduce Emissions</h3>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <TrendingDown className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Carbon Scoring</h4>
                    <p className="text-gray-600 text-sm">Every product has a transparent carbon footprint score</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Eco-Certifications</h4>
                    <p className="text-gray-600 text-sm">Verified sustainable and eco-friendly product standards</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Local Sourcing</h4>
                    <p className="text-gray-600 text-sm">Promote local sellers to reduce transportation emissions</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-orange-100 p-3 rounded-full mr-4">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Impact Tracking</h4>
                    <p className="text-gray-600 text-sm">Monitor your personal environmental contribution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Why Choose EcoBazaarX?</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Join thousands of conscious consumers and sustainable sellers making a positive impact on our planet.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Eco-Friendly</h3>
              <p className="opacity-90">Every product is verified for sustainability and environmental friendliness.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Sellers</h3>
              <p className="opacity-90">All sellers are authenticated and committed to sustainable practices.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Carbon Tracking</h3>
              <p className="opacity-90">Monitor and reduce your personal carbon footprint with every purchase.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Impact</h3>
              <p className="opacity-90">Be part of a community that cares about the planet's future.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join EcoBazaarX today and start your journey towards sustainable living. 
            Whether you're a conscious consumer or an eco-friendly seller, together we can create a greener future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Start Shopping Sustainably
            </button>
            <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Become a Seller
            </button>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">Trusted by thousands of eco-conscious users worldwide</p>
            <div className="flex justify-center items-center space-x-8 text-gray-400">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">10,000+</div>
                <div className="text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">5,000+</div>
                <div className="text-sm">Eco Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">50%</div>
                <div className="text-sm">Carbon Reduction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
