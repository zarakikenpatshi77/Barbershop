import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format, addDays, startOfDay, getHours } from 'date-fns'
import toast from 'react-hot-toast'

const Booking = () => {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(searchParams.get('service') || '')
  const [selectedPackage, setSelectedPackage] = useState(searchParams.get('package') || '')
  const [selectedBarber, setSelectedBarber] = useState('')
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()))
  const [selectedTime, setSelectedTime] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedService || selectedPackage) {
      setStep(2)
    }
  }, [selectedService, selectedPackage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Implement booking submission to Supabase
      toast.success('Booking submitted successfully!')
      // Reset form or redirect
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getAvailableTimeSlots = () => {
    // TODO: Implement real-time availability check from Supabase
    const slots = []
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00`)
      if (hour !== 17) slots.push(`${hour}:30`)
    }
    return slots
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3].map((number) => (
            <div
              key={number}
              className="flex items-center"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= number ? 'bg-secondary text-primary' : 'bg-neutral-dark text-neutral-light'
                }`}
              >
                {number}
              </div>
              {number < 3 && (
                <div
                  className={`w-full h-1 mx-2 ${
                    step > number ? 'bg-secondary' : 'bg-neutral-dark'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-neutral-dark rounded-lg p-8"
        >
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-montserrat font-bold mb-6">Select Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => {
                      setSelectedService(service.name)
                      setSelectedPackage('')
                      setStep(2)
                    }}
                    className={`p-4 rounded-lg border ${
                      selectedService === service.name
                        ? 'border-secondary bg-secondary/10'
                        : 'border-neutral-light/20 hover:border-secondary/50'
                    } text-left transition-colors`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold">{service.name}</h3>
                      <span className="text-secondary">${service.price}</span>
                    </div>
                    <p className="text-sm text-neutral-light mt-2">{service.duration}</p>
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-montserrat font-bold mb-4">Special Packages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.name}
                      onClick={() => {
                        setSelectedPackage(pkg.name)
                        setSelectedService('')
                        setStep(2)
                      }}
                      className={`p-4 rounded-lg border ${
                        selectedPackage === pkg.name
                          ? 'border-secondary bg-secondary/10'
                          : 'border-neutral-light/20 hover:border-secondary/50'
                      } text-left transition-colors`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold">{pkg.name}</h3>
                        <span className="text-secondary">${pkg.price}</span>
                      </div>
                      <ul className="text-sm text-neutral-light mt-2">
                        {pkg.includes.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-montserrat font-bold mb-6">Choose Your Barber</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {barbers.map((barber) => (
                  <button
                    key={barber.name}
                    onClick={() => {
                      setSelectedBarber(barber.name)
                      setStep(3)
                    }}
                    className={`p-4 rounded-lg border ${
                      selectedBarber === barber.name
                        ? 'border-secondary bg-secondary/10'
                        : 'border-neutral-light/20 hover:border-secondary/50'
                    } text-left transition-colors`}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={barber.image}
                        alt={barber.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold">{barber.name}</h3>
                        <p className="text-sm text-neutral-light">{barber.specialty}</p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < barber.rating ? 'text-secondary' : 'text-neutral-light'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-montserrat font-bold mb-6">Select Date & Time</h2>
              
              {/* Date Selection */}
              <div className="grid grid-cols-4 gap-4">
                {[...Array(7)].map((_, index) => {
                  const date = addDays(new Date(), index)
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 rounded-lg border ${
                        selectedDate.getTime() === startOfDay(date).getTime()
                          ? 'border-secondary bg-secondary/10'
                          : 'border-neutral-light/20 hover:border-secondary/50'
                      } text-center transition-colors`}
                    >
                      <div className="text-sm font-bold">
                        {format(date, 'EEE')}
                      </div>
                      <div className="text-lg">
                        {format(date, 'd')}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-4 gap-4">
                {getAvailableTimeSlots().map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-lg border ${
                      selectedTime === time
                        ? 'border-secondary bg-secondary/10'
                        : 'border-neutral-light/20 hover:border-secondary/50'
                    } transition-colors`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!selectedTime || loading}
                className="w-full bg-secondary text-primary font-bold py-3 rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-6 text-neutral-light hover:text-secondary transition-colors"
            >
              ← Back
            </button>
          )}
        </motion.div>
      </div>
    </div>
  )
}

// Sample data (move to a separate file in a real application)
const services = [
  {
    name: 'Classic Haircut',
    price: 35,
    duration: '45 mins',
  },
  {
    name: 'Luxury Shave',
    price: 45,
    duration: '45 mins',
  },
  {
    name: 'Beard Grooming',
    price: 25,
    duration: '30 mins',
  },
  {
    name: 'Hair Color',
    price: 65,
    duration: '90 mins',
  },
]

const packages = [
  {
    name: 'The Complete Package',
    price: 89,
    includes: ['Classic Haircut', 'Luxury Shave', 'Head Massage'],
  },
  {
    name: 'Beard King',
    price: 65,
    includes: ['Beard Grooming', 'Luxury Shave', 'Face Treatment'],
  },
]

const barbers = [
  {
    name: 'John Smith',
    specialty: 'Classic Cuts & Styling',
    rating: 5,
    image: '/src/assets/images/barber1.jpg',
  },
  {
    name: 'Mike Johnson',
    specialty: 'Beard Grooming Expert',
    rating: 4,
    image: '/src/assets/images/barber2.jpg',
  },
  {
    name: 'David Wilson',
    specialty: 'Color Specialist',
    rating: 5,
    image: '/src/assets/images/barber3.jpg',
  },
]

export default Booking
