import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

const Home = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name')
      
      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Error fetching services:', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-montserrat font-bold">
              Experience the Art of
              <span className="text-secondary"> Premium Grooming</span>
            </h1>
            <p className="text-xl text-neutral-light">
              Where traditional craftsmanship meets modern style. Book your transformation today.
            </p>
            <Link
              to="/booking"
              className="inline-block bg-secondary text-primary font-bold py-3 px-8 rounded-md hover:bg-secondary/90 transition-colors"
            >
              Book Appointment
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-montserrat font-bold text-center mb-12">Our Services</h2>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <p className="text-xl font-bold text-primary">${service.price}</p>
                  <Link
                    to="/booking"
                    className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition-colors"
                  >
                    Book Now
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-neutral-dark py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-montserrat font-bold mb-4">Why Choose Us</h2>
            <p className="text-neutral-light max-w-2xl mx-auto">
              Experience the perfect blend of traditional barbering and modern luxury.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '✂️',
                title: 'Expert Barbers',
                description: 'Our team of skilled professionals brings years of experience and passion.',
              },
              {
                icon: '🏆',
                title: 'Premium Products',
                description: 'We use only the finest grooming products for the best results.',
              },
              {
                icon: '🎯',
                title: 'Modern Techniques',
                description: 'Stay current with the latest trends and cutting-edge styling methods.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-secondary text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-montserrat font-bold mb-2">{feature.title}</h3>
                <p className="text-neutral-light">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
