import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { 
  FiActivity, 
  FiUsers, 
  FiCalendar, 
  FiShield, 
  FiClock, 
  FiHeart,
  FiCheckCircle,
  FiArrowRight,
  FiStar,
  FiPhone,
  FiMail,
  FiMapPin
} from 'react-icons/fi';
import Chatbot from "../modules/chatbot/Chatbot.jsx";

const LandingPage = () => {
  const features = [
    {
      icon: FiUsers,
      title: "Patient Management",
      description: "Comprehensive patient records, medical history, and profile management in one secure platform."
    },
    {
      icon: FiCalendar,
      title: "Appointment Scheduling",
      description: "Smart scheduling system with automated reminders and real-time availability updates."
    },
    {
      icon: FiActivity,
      title: "Medical Records",
      description: "Digital medical records with easy access to patient history, prescriptions, and treatment plans."
    },
    {
      icon: FiShield,
      title: "Secure & Compliant",
      description: "HIPAA-compliant security measures ensuring patient data privacy and protection."
    },
    {
      icon: FiClock,
      title: "Time Management",
      description: "Efficient time slot management for doctors and clinics with optimized scheduling."
    },
    {
      icon: FiHeart,
      title: "Care Coordination",
      description: "Seamless coordination between doctors, staff, and patients for better healthcare outcomes."
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      content: "WellNests has transformed how we manage patient care. The intuitive interface and comprehensive features have improved our efficiency by 40%.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Clinic Administrator",
      content: "The appointment scheduling and patient management features are exactly what our clinic needed. Highly recommended!",
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Family Physician",
      content: "Managing medical records has never been easier. The system is user-friendly and saves us hours every day.",
      rating: 5
    }
  ];

  const stats = [
    { number: "10,000+", label: "Patients Managed" },
    { number: "500+", label: "Healthcare Providers" },
    { number: "50+", label: "Medical Facilities" },
    { number: "99.9%", label: "Uptime Guarantee" }
  ];

  const [showChatbot, setShowChatbot] = useState(false); //  Togglechatbot
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <FiActivity className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold text-gray-900">WellNests</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Features</a>
              <a href="#about" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">About</a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">Contact</a>
              <Link 
                to="/login" 
                className="btn-primary"
              >
                Sign In
              </Link>
            </div>

            <div className="md:hidden">
              <Link to="/login" className="btn-primary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Modern Healthcare
                <span className="text-primary-600 block">Management</span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Streamline your medical practice with our comprehensive patient management system. 
                Secure, efficient, and designed for modern healthcare providers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link to="/login" className="btn-primary text-lg px-8 py-4">
                  Get Started
                  <FiArrowRight className="ml-2" />
                </Link>
                <button className="btn-secondary text-lg px-8 py-4">
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center mt-8 space-x-6">
                <div className="flex items-center">
                  <FiCheckCircle className="text-success-600 mr-2" />
                  <span className="text-gray-600">HIPAA Compliant</span>
                </div>
                <div className="flex items-center">
                  <FiCheckCircle className="text-success-600 mr-2" />
                  <span className="text-gray-600">24/7 Support</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-primary-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Patient Dashboard</h3>
                    <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Today's Appointments</span>
                      <span className="font-semibold text-primary-600">12</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Patients</span>
                      <span className="font-semibold text-success-600">248</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pending Reports</span>
                      <span className="font-semibold text-warning-600">5</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiActivity className="text-primary-600 text-2xl" />
                  </div>
                  <p className="text-gray-600 text-sm">Real-time Healthcare Analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Modern Healthcare
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools healthcare providers need 
              to deliver exceptional patient care efficiently and securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-primary-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built for Healthcare Professionals
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                WellNests was created by healthcare professionals who understand the daily 
                challenges of managing patient care. Our platform combines cutting-edge 
                technology with intuitive design to streamline your workflow.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiCheckCircle className="text-success-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Secure by Design</h4>
                    <p className="text-gray-600">End-to-end encryption and HIPAA compliance built into every feature.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FiCheckCircle className="text-success-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Easy Integration</h4>
                    <p className="text-gray-600">Seamlessly integrate with existing healthcare systems and workflows.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FiCheckCircle className="text-success-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                    <p className="text-gray-600">Round-the-clock technical support from our healthcare IT specialists.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-blue-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <FiUsers className="text-primary-600 text-2xl mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-sm text-gray-600">Doctors</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <FiHeart className="text-error-600 text-2xl mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">10K+</div>
                    <div className="text-sm text-gray-600">Patients</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <FiCalendar className="text-success-600 text-2xl mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">50K+</div>
                    <div className="text-sm text-gray-600">Appointments</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <FiShield className="text-warning-600 text-2xl mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-sm text-gray-600">Secure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what medical professionals are saying about WellNests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="text-warning-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-600 font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Healthcare Practice?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who trust WellNests 
            to manage their patient care efficiently and securely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center">
              Start Free Trial
              <FiArrowRight className="ml-2" />
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We're here to help you get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPhone className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-2">24/7 technical support</p>
              <p className="text-primary-600 font-semibold">+1 (555) 123-4567</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-2">Get help via email</p>
              <p className="text-primary-600 font-semibold">support@wellnests.com</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Office Location</h3>
              <p className="text-gray-600 mb-2">Visit our headquarters</p>
              <p className="text-primary-600 font-semibold">San Francisco, CA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <FiActivity className="text-white text-xl" />
                </div>
                <span className="text-2xl font-bold">WellNests</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Modern healthcare management platform designed for medical professionals.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2025 WellNests. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
          {/* Chatbot Toggle Button */}
          <button
              onClick={() => setShowChatbot(!showChatbot)}
              className="fixed bottom-6 right-6 bg-primary-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-primary-700 z-50"
          >
            {showChatbot ? 'Close Chatbot' : 'Chat with us'}
          </button>

          {/* Chatbot Panel */}
          {showChatbot&&<Chatbot/>}




        </div>
      </footer>
    </div>
  );
};

export default LandingPage;