import { motion } from 'framer-motion'
import { format, isAfter, isBefore, addHours } from 'date-fns'
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import { getStatusColor } from '../../utils/helpers'

const BookingCard = ({ booking, onCancel, onReschedule, onReview }) => {
  const now = new Date()
  const appointmentDate = new Date(booking.appointment_date)
  const appointmentDateTime = new Date(`${booking.appointment_date}T${booking.appointment_time}`)
  
  const isUpcoming = isAfter(appointmentDateTime, now)
  const isPending = booking.status === 'pending'
  const isConfirmed = booking.status === 'confirmed'
  const isCancelled = booking.status === 'cancelled'
  const isCompleted = booking.status === 'completed'
  
  const canCancel = (isPending || isConfirmed) && isAfter(appointmentDateTime, addHours(now, 24))
  const canReschedule = (isPending || isConfirmed) && isAfter(appointmentDateTime, addHours(now, 48))
  const canReview = isCompleted && !booking.has_review && isBefore(appointmentDateTime, now)

  const formatDate = (date) => format(new Date(date), 'EEEE, MMMM d, yyyy')
  const formatTime = (time) => format(new Date(`2000-01-01T${time}`), 'h:mm a')

  const getStatusIcon = () => {
    switch (booking.status) {
      case 'completed':
        return <CheckBadgeIcon className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-dark rounded-lg p-6 border border-neutral-light/10 hover:border-secondary/50 transition-colors"
    >
      {/* Status Badge and Booking ID */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-2">
          <span
            className={`${getStatusColor(
              booking.status
            )} px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center space-x-1`}
          >
            {getStatusIcon()}
            <span>{booking.status}</span>
          </span>
          {isUpcoming && (
            <span className="text-xs text-secondary font-medium px-2 py-1 bg-secondary/10 rounded-full">
              Upcoming
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-sm text-neutral-light">Booking #{booking.id.slice(-6)}</span>
          {booking.reference_number && (
            <p className="text-xs text-neutral-light/60">Ref: {booking.reference_number}</p>
          )}
        </div>
      </div>

      {/* Service Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">{booking.service_name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center text-neutral-light">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span>{formatDate(booking.appointment_date)}</span>
            </div>
            <div className="flex items-center text-neutral-light">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span>{formatTime(booking.appointment_time)}</span>
            </div>
            <div className="flex items-center text-neutral-light">
              <UserIcon className="h-5 w-5 mr-2" />
              <span>{booking.barber_name}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center text-neutral-light">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{booking.location || 'Main Location'}</span>
            </div>
            <div className="flex items-center text-neutral-light">
              <CurrencyDollarIcon className="h-5 w-5 mr-2" />
              <span>${booking.price.toFixed(2)}</span>
            </div>
            {booking.additional_services && (
              <div className="flex items-start text-neutral-light">
                <span className="text-xs bg-neutral-light/10 px-2 py-1 rounded">
                  + {booking.additional_services}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes or Special Requests */}
      {booking.notes && (
        <div className="mb-6 p-3 bg-neutral-light/5 rounded-md">
          <p className="text-sm text-neutral-light/80">{booking.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {canCancel && (
          <button
            onClick={() => onCancel(booking.id)}
            className="flex-1 px-4 py-2.5 border border-red-500 text-red-500 rounded-md hover:bg-red-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            Cancel Appointment
          </button>
        )}
        {canReschedule && (
          <button
            onClick={() => onReschedule(booking.id)}
            className="flex-1 px-4 py-2.5 border border-secondary text-secondary rounded-md hover:bg-secondary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/50"
          >
            Reschedule
          </button>
        )}
        {canReview && (
          <button
            onClick={() => onReview(booking.id)}
            className="flex-1 px-4 py-2.5 bg-secondary text-primary rounded-md hover:bg-secondary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/50"
          >
            Leave Review
          </button>
        )}
        {isCancelled && booking.cancellation_reason && (
          <div className="w-full mt-2">
            <p className="text-sm text-neutral-light/60">
              Cancellation reason: {booking.cancellation_reason}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default BookingCard
