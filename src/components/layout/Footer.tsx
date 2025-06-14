import { useAuth } from '@/components/auth/AuthContext';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  // Role-specific quick links
  const getQuickLinks = () => {
    if (!user) {
      return [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About Us' },
        { to: '/services', label: 'Our Services' },
        { to: '/join', label: 'Become a Supplier' },
        { to: '/contact', label: 'Contact' },
      ];
    }

    if (userRole === 'admin') {
      return [
        { to: '/admin', label: 'Manage Suppliers' },
        { to: '/admin/schools', label: 'Manage Schools' },
      ];
    }

    if (userRole === 'school') {
      return [
        { to: '/school-dashboard', label: 'Dashboard' },
        { to: '/services', label: 'Find Services' },
        // { to: '/messaging', label: 'Messages' },
        { to: '/legal-complaint', label: 'Legal Complaints' },
        { to: '/profile', label: 'School Profile' },
      ];
    }

    if (userRole === 'supplier') {
      return [
        { to: '/supplier-dashboard', label: 'Dashboard' },
        { to: '/profile', label: 'Supplier Profile' },
        { to: '/pricing-management', label: 'Pricing Management' },
        // { to: '/messaging', label: 'Messages' },
        
      ];
    }

    return [];
  };

  // Role-specific service categories
  const getServiceCategories = () => {
    if (userRole === 'admin') {
      return [
        { to: '/profile', label: 'Admin Profile' },
      ];
    }

    if (!user || userRole === 'school') {
      return [
        { to: '/services/edtech-solutions', label: 'EdTech Solutions' },
        { to: '/services/school-furniture', label: 'School Furniture' },
        { to: '/services/curriculum', label: 'Curriculum' },
        { to: '/services/books-publications', label: 'Books & Publications' },
        { to: '/services/teacher-training', label: 'Teacher Training' },
        { to: '/services/school-erp', label: 'School ERP Solutions' }
      ];
    }

    if (userRole === 'supplier') {
      return [
        { to: '/legal-complaint', label: 'Support' },
        { to: '/application-review', label: 'Application Review' },
      ];
    }

    return [];
  };

  // Role-specific contact information
  const getContactInfo = () => {
    if (!user) {
      return {
        email: 'info@eduvendorselite.com',
        phone: '+1 234 567 8900',
        address: '123 Education Lane, Knowledge City'
      };
    }

    if (userRole === 'school') {
      return {
        email: 'schools@eduvendorselite.com',
        phone: '+1 234 567 8901',
        address: '123 Education Lane, Knowledge City'
      };
    }

    if (userRole === 'supplier') {
      return {
        email: 'suppliers@eduvendorselite.com',
        phone: '+1 234 567 8902',
        address: '123 Education Lane, Knowledge City'
      };
    }

    return {
      email: 'info@eduvendorselite.com',
      phone: '+1 234 567 8900',
      address: '123 Education Lane, Knowledge City'
    };
  };

  const quickLinks = getQuickLinks();
  const serviceCategories = getServiceCategories();
  const contactInfo = getContactInfo();

  return (
    <footer className="bg-navy text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and description */}
          <div>
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-primary flex items-center justify-center text-white font-playfair text-xl font-bold">
                E
              </div>
              <span className="text-xl font-playfair font-semibold text-white">
                EduVendors<span className="text-gold">Elite</span>
              </span>
            </Link>
            <p className="text-gray-300 mt-4 text-sm leading-relaxed">
              {!user ? (
                "Connecting education institutions with top-quality service providers. Our platform ensures schools find the best partners for their needs."
              ) : userRole === 'school' ? (
                "Access our network of verified suppliers and manage your school's partnerships efficiently."
              ) : (
                "Grow your educational business by connecting with schools and managing your services effectively."
              )}
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-10 md:mt-0">
            <h3 className="text-gold text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-white transition-colors underline-animated inline-block"
                    onClick={(e) => {
                      if (!user && (link.to === '/dashboard' || link.to === '/profile')) {
                        e.preventDefault();
                        navigate('/login');
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="mt-10 lg:mt-0">
            <h3 className="text-gold text-lg font-semibold mb-4">
              {!user || userRole === 'school' ? 'Supplier Categories' : 'Dashboard Tools'}
            </h3>
            <ul className="space-y-2">
              {serviceCategories.map((category) => (
                <li key={category.to}>
                  <Link 
                    to={category.to} 
                    className="text-gray-300 hover:text-white transition-colors underline-animated inline-block"
                    onClick={(e) => {
                      if (!user && category.to.startsWith('/dashboard')) {
                        e.preventDefault();
                        navigate('/login');
                      }
                    }}
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="mt-10 lg:mt-0">
            <h3 className="text-gold text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic">
              <p className="text-gray-300 mb-2 flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {contactInfo.address}
              </p>
              <p className="text-gray-300 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                {contactInfo.phone}
              </p>
              <p className="text-gray-300 flex items-center">
                <svg className="w-5 h-5 mr-2 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                {contactInfo.email}
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} EduVendorsElite. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
