import { format } from 'date-fns'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const BookingCard = ({ booking, onCancel }) => {
  const formatDate = (date) => {
    return format(new Date(date), 'MMMM d, yyyy')
  }

  const formatTime = (time) => {
    return format(new Date(`2000-01-01T${time}`), 'h:mm a')
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || colors.pending
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-md p-6 mb-4"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{booking.service_name}</h3>
          <p className="text-gray-600">
            {formatDate(booking.date)} at {formatTime(booking.time)}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            booking.status
          )}`}
        >
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Barber</p>
            <p className="font-medium">{booking.barber_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Price</p>
            <p className="font-medium">${booking.price}</p>
          </div>
        </div>
      </div>

      {booking.status === 'pending' || booking.status === 'confirmed' ? (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <button
            onClick={() => onCancel(booking.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
          >
            Cancel Booking
          </button>
        </div>
      ) : null}
    </motion.div>
  )
}

BookingCard.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.string.isRequired,
    service_name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['pending', 'confirmed', 'cancelled', 'completed']).isRequired,
    barber_name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired
  }).isRequired,
  onCancel: PropTypes.func.isRequired
}

export default BookingCard
