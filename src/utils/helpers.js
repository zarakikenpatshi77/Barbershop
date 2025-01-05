import { format, addMinutes, parse } from 'date-fns'

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const formatDateTime = (date, time) => {
  const dateObj = new Date(date)
  const [hours, minutes] = time.split(':')
  dateObj.setHours(parseInt(hours), parseInt(minutes))
  return format(dateObj, 'PPpp')
}

export const generateTimeSlots = (startTime, endTime, duration) => {
  const slots = []
  let currentTime = parse(startTime, 'HH:mm', new Date())
  const end = parse(endTime, 'HH:mm', new Date())

  while (currentTime <= end) {
    slots.push(format(currentTime, 'HH:mm'))
    currentTime = addMinutes(currentTime, duration)
  }

  return slots
}

export const getBookingDuration = (service, package_) => {
  if (service) {
    return service.duration
  }
  if (package_) {
    return package_.services.reduce((total, service) => total + service.duration, 0)
  }
  return 0
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const re = /^\+?[\d\s-]{10,}$/
  return re.test(phone)
}

export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500',
  }
  return colors[status] || 'bg-gray-500'
}

export const calculateAvailability = (bookings, barberSchedule) => {
  // Implementation for checking real-time availability
  // This would need to account for:
  // - Barber's working hours
  // - Existing bookings
  // - Service duration
  // - Buffer time between appointments
}

export const handleApiError = (error) => {
  if (error.message) {
    return error.message
  }
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  return 'An unexpected error occurred'
}
