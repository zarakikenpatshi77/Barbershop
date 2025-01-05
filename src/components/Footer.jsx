import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-neutral-dark text-accent mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-montserrat font-bold text-secondary">LUXE BARBER</h3>
            <p className="text-sm text-neutral-light">
              Elevating the art of grooming with premium service and style.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="hover:text-secondary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-secondary transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-secondary transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-montserrat font-bold mb-4">Hours</h4>
            <ul className="space-y-2 text-sm">
              <li>Monday - Friday: 9AM - 8PM</li>
              <li>Saturday: 9AM - 6PM</li>
              <li>Sunday: 10AM - 4PM</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-montserrat font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>123 Style Street</li>
              <li>New York, NY 10001</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: info@luxebarber.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-light/20 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Luxe Barber. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
