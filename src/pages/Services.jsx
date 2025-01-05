import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Services = () => {
  return (
    <div className="py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">
          Our Premium Services
        </h1>
        <p className="text-neutral-light max-w-2xl mx-auto">
          Choose from our range of premium grooming services, each delivered with expertise and attention to detail.
        </p>
      </motion.div>

      {/* Services Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-neutral-dark rounded-lg overflow-hidden group"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-montserrat font-bold">{service.name}</h3>
                  <span className="text-secondary font-bold">${service.price}</span>
                </div>
                <p className="text-neutral-light mb-4">{service.description}</p>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-light">
                    <span className="text-secondary">⏱</span> Duration: {service.duration}
                  </p>
                  {service.includes && (
                    <ul className="text-sm text-neutral-light space-y-1">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-center">
                          <span className="text-secondary mr-2">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <Link
                  to={`/booking?service=${encodeURIComponent(service.name)}`}
                  className="mt-6 inline-block w-full bg-secondary text-primary text-center font-bold py-3 rounded-md hover:bg-secondary/90 transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Packages Section */}
      <section className="mt-20 bg-neutral-dark py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-montserrat font-bold mb-4">Special Packages</h2>
            <p className="text-neutral-light max-w-2xl mx-auto">
              Save more with our carefully curated service packages
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-primary rounded-lg p-6 border border-secondary/20"
              >
                <h3 className="text-xl font-montserrat font-bold mb-2">{pkg.name}</h3>
                <p className="text-2xl font-bold text-secondary mb-4">${pkg.price}</p>
                <ul className="space-y-2 mb-6">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-center text-neutral-light">
                      <span className="text-secondary mr-2">✓</span> {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/booking?package=${encodeURIComponent(pkg.name)}`}
                  className="inline-block w-full bg-secondary text-primary text-center font-bold py-3 rounded-md hover:bg-secondary/90 transition-colors"
                >
                  Book Package
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const services = [
  {
    name: 'Classic Haircut',
    price: 35,
    duration: '45 mins',
    description: 'Precision cut tailored to your style and face shape.',
    image: '/src/assets/images/classic-haircut.jpg',
    includes: [
      'Consultation',
      'Shampoo & Conditioning',
      'Precision Cut',
      'Styling',
    ],
  },
  {
    name: 'Luxury Shave',
    price: 45,
    duration: '45 mins',
    description: 'Traditional hot towel treatment with straight razor shave.',
    image: '/src/assets/images/luxury-shave.jpg',
    includes: [
      'Hot Towel Treatment',
      'Pre-shave Oil',
      'Straight Razor Shave',
      'After-shave Care',
    ],
  },
  {
    name: 'Beard Grooming',
    price: 25,
    duration: '30 mins',
    description: 'Expert trimming and styling for the perfect beard.',
    image: '/src/assets/images/beard-grooming.jpg',
    includes: [
      'Beard Wash',
      'Trim & Shape',
      'Oil Treatment',
      'Styling',
    ],
  },
  {
    name: 'Hair Color',
    price: 65,
    duration: '90 mins',
    description: 'Professional color treatment for a fresh new look.',
    image: '/src/assets/images/hair-color.jpg',
    includes: [
      'Color Consultation',
      'Professional Color',
      'Processing Time',
      'Style Finish',
    ],
  },
  {
    name: 'Kids Haircut',
    price: 25,
    duration: '30 mins',
    description: 'Gentle and patient service for our younger clients.',
    image: '/src/assets/images/kids-haircut.jpg',
    includes: [
      'Child-friendly Environment',
      'Precision Cut',
      'Light Styling',
      'Fun Experience',
    ],
  },
  {
    name: 'Head Massage',
    price: 30,
    duration: '30 mins',
    description: 'Relaxing scalp massage with premium oils.',
    image: '/src/assets/images/head-massage.jpg',
    includes: [
      'Scalp Assessment',
      'Oil Selection',
      'Pressure Point Massage',
      'Relaxation Time',
    ],
  },
]

const packages = [
  {
    name: 'The Complete Package',
    price: 89,
    includes: [
      'Classic Haircut',
      'Luxury Shave',
      'Head Massage',
      'Complimentary Beverage',
    ],
  },
  {
    name: 'Beard King',
    price: 65,
    includes: [
      'Beard Grooming',
      'Luxury Shave',
      'Face Treatment',
      'Beard Oil Kit',
    ],
  },
  {
    name: 'Fresh Start',
    price: 55,
    includes: [
      'Classic Haircut',
      'Basic Beard Trim',
      'Face Cleansing',
      'Style Consultation',
    ],
  },
]

export default Services
