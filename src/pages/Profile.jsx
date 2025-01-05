import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { getUserProfile, updateUserProfile } from '../services/supabase'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import {
  UserCircleIcon,
  CalendarIcon,
  StarIcon,
  BellIcon,
  KeyIcon,
} from '@heroicons/react/24/outline'
import { validateEmail, validatePhone } from '../utils/helpers'
import BookingCard from '../components/BookingCard'
import ReviewCard from '../components/ReviewCard'
import NotificationCenter from '../components/NotificationCenter'
import { trackEvent, EVENTS, shareContent } from '../utils/analytics'
import FilterBar from '../components/common/FilterBar'

const Profile = () => {
  const { user, updatePassword } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      sms: true,
      marketing: false,
    },
  })
  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState([])
  const [bookingFilters, setBookingFilters] = useState({
    status: '',
    date: [],
    barber: '',
  })
  const [bookingSort, setBookingSort] = useState('date-desc')
  const [reviewFilters, setReviewFilters] = useState({
    rating: [],
    date: [],
    hasPhotos: '',
  })
  const [reviewSort, setReviewSort] = useState('date-desc')

  const bookingFilterConfig = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    {
      id: 'date',
      label: 'Date',
      type: 'multi',
      options: [
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'past', label: 'Past' },
        { value: 'today', label: 'Today' },
        { value: 'this-week', label: 'This Week' },
        { value: 'this-month', label: 'This Month' },
      ],
    },
    {
      id: 'barber',
      label: 'Barber',
      type: 'select',
      options: [], // Will be populated from data
    },
  ]

  const bookingSortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'price-asc', label: 'Price: Low to High' },
  ]

  const reviewFilterConfig = [
    {
      id: 'rating',
      label: 'Rating',
      type: 'multi',
      options: [
        { value: '5', label: '5 Stars' },
        { value: '4', label: '4 Stars' },
        { value: '3', label: '3 Stars' },
        { value: '2', label: '2 Stars' },
        { value: '1', label: '1 Star' },
      ],
    },
    {
      id: 'date',
      label: 'Date',
      type: 'multi',
      options: [
        { value: 'last-week', label: 'Last Week' },
        { value: 'last-month', label: 'Last Month' },
        { value: 'last-3-months', label: 'Last 3 Months' },
        { value: 'last-year', label: 'Last Year' },
      ],
    },
    {
      id: 'hasPhotos',
      label: 'Photos',
      type: 'select',
      options: [
        { value: 'yes', label: 'With Photos' },
        { value: 'no', label: 'Without Photos' },
      ],
    },
  ]

  const reviewSortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'rating-desc', label: 'Rating: High to Low' },
    { value: 'rating-asc', label: 'Rating: Low to High' },
    { value: 'likes-desc', label: 'Most Liked' },
  ]

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setFormData({
          fullName: profile.full_name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          notifications: {
            email: profile.email_notifications || false,
            sms: profile.sms_notifications || false,
            marketing: profile.marketing_notifications || false,
          },
        })

        // Load bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*, services(name), barbers(name)')
          .eq('user_id', user.id)
          .order('appointment_date', { ascending: false })

        if (bookingsError) throw bookingsError
        setBookings(bookingsData.map(booking => ({
          ...booking,
          service_name: booking.services.name,
          barber_name: booking.barbers.name
        })))

        // Load reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*, services(name), barbers(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (reviewsError) throw reviewsError
        setReviews(reviewsData.map(review => ({
          ...review,
          service_name: review.services.name,
          barber_name: review.barbers.name
        })))

      } catch (error) {
        console.error('Error loading profile:', error)
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadProfile()
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleNotificationChange = (key) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }))
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    
    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    if (!validatePhone(formData.phone)) {
      toast.error('Please enter a valid phone number')
      return
    }

    setSaving(true)
    try {
      await updateUserProfile(user.id, {
        full_name: formData.fullName,
        phone: formData.phone,
        notifications: formData.notifications,
      })
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setSaving(true)
    try {
      await updatePassword(formData.newPassword)
      toast.success('Password updated successfully')
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))
    } catch (error) {
      toast.error('Failed to update password')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (error) throw error

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      )

      toast.success('Booking cancelled successfully')
    } catch (error) {
      console.error('Error cancelling booking:', error)
      toast.error('Failed to cancel booking')
    }
  }

  const handleRescheduleBooking = async (bookingId) => {
    // Navigate to booking page with pre-filled data
    navigate(`/booking?reschedule=${bookingId}`)
  }

  const handleAddReview = async (bookingId) => {
    // Navigate to review form
    navigate(`/review/new?booking=${bookingId}`)
  }

  const handleEditReview = async (reviewId, updatedReview) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          rating: updatedReview.rating,
          comment: updatedReview.comment,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reviewId)

      if (error) throw error

      setReviews((current) =>
        current.map((review) =>
          review.id === reviewId
            ? { ...review, ...updatedReview }
            : review
        )
      )

      toast.success('Review updated successfully')
    } catch (error) {
      console.error('Error updating review:', error)
      toast.error('Failed to update review')
    }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)

      if (error) throw error

      setReviews((current) =>
        current.filter((review) => review.id !== reviewId)
      )

      toast.success('Review deleted successfully')
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error('Failed to delete review')
    }
  }

  const handleBookingFilterChange = (filterId, value) => {
    setBookingFilters((prev) => ({ ...prev, [filterId]: value }))
  }

  const handleBookingSortChange = (value) => {
    setBookingSort(value)
  }

  const handleReviewFilterChange = (filterId, value) => {
    setReviewFilters((prev) => ({ ...prev, [filterId]: value }))
  }

  const handleReviewSortChange = (value) => {
    setReviewSort(value)
  }

  const filterBookings = (bookings) => {
    return bookings.filter((booking) => {
      if (bookingFilters.status && booking.status !== bookingFilters.status) {
        return false
      }

      if (bookingFilters.barber && booking.barber_id !== bookingFilters.barber) {
        return false
      }

      if (bookingFilters.date.length > 0) {
        const date = new Date(booking.appointment_date)
        const today = new Date()
        const isUpcoming = date > today
        const isPast = date < today
        const isToday = date.toDateString() === today.toDateString()
        const isThisWeek = date > subDays(today, 7)
        const isThisMonth = date > subMonths(today, 1)

        return bookingFilters.date.some((filter) => {
          switch (filter) {
            case 'upcoming':
              return isUpcoming
            case 'past':
              return isPast
            case 'today':
              return isToday
            case 'this-week':
              return isThisWeek
            case 'this-month':
              return isThisMonth
            default:
              return true
          }
        })
      }

      return true
    })
  }

  const sortBookings = (bookings) => {
    return [...bookings].sort((a, b) => {
      switch (bookingSort) {
        case 'date-desc':
          return new Date(b.appointment_date) - new Date(a.appointment_date)
        case 'date-asc':
          return new Date(a.appointment_date) - new Date(b.appointment_date)
        case 'price-desc':
          return b.price - a.price
        case 'price-asc':
          return a.price - b.price
        default:
          return 0
      }
    })
  }

  const filterReviews = (reviews) => {
    return reviews.filter((review) => {
      if (reviewFilters.rating.length > 0) {
        if (!reviewFilters.rating.includes(review.rating.toString())) {
          return false
        }
      }

      if (reviewFilters.hasPhotos) {
        const hasPhotos = review.photos && review.photos.length > 0
        if (reviewFilters.hasPhotos === 'yes' && !hasPhotos) {
          return false
        }
        if (reviewFilters.hasPhotos === 'no' && hasPhotos) {
          return false
        }
      }

      if (reviewFilters.date.length > 0) {
        const date = new Date(review.created_at)
        const today = new Date()
        const isLastWeek = date > subDays(today, 7)
        const isLastMonth = date > subMonths(today, 1)
        const isLast3Months = date > subMonths(today, 3)
        const isLastYear = date > subYears(today, 1)

        return reviewFilters.date.some((filter) => {
          switch (filter) {
            case 'last-week':
              return isLastWeek
            case 'last-month':
              return isLastMonth
            case 'last-3-months':
              return isLast3Months
            case 'last-year':
              return isLastYear
            default:
              return true
          }
        })
      }

      return true
    })
  }

  const sortReviews = (reviews) => {
    return [...reviews].sort((a, b) => {
      switch (reviewSort) {
        case 'date-desc':
          return new Date(b.created_at) - new Date(a.created_at)
        case 'date-asc':
          return new Date(a.created_at) - new Date(b.created_at)
        case 'rating-desc':
          return b.rating - a.rating
        case 'rating-asc':
          return a.rating - b.rating
        case 'likes-desc':
          return (b.likes_count || 0) - (a.likes_count || 0)
        default:
          return 0
      }
    })
  }

  const handleLikeReview = async (reviewId) => {
    try {
      const review = reviews.find((r) => r.id === reviewId)
      const isLiked = review.liked_by_user

      const { error } = await supabase
        .from('review_likes')
        [isLiked ? 'delete' : 'insert']([
          {
            review_id: reviewId,
            user_id: user.id,
          },
        ])
        .eq('review_id', reviewId)
        .eq('user_id', user.id)

      if (error) throw error

      setReviews((current) =>
        current.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                liked_by_user: !isLiked,
                likes_count: isLiked ? r.likes_count - 1 : r.likes_count + 1,
              }
            : r
        )
      )

      await trackEvent(EVENTS.REVIEW.LIKE, { reviewId, action: isLiked ? 'unlike' : 'like' })
    } catch (error) {
      console.error('Error liking review:', error)
      toast.error('Failed to like review')
    }
  }

  const handleShareReview = async (reviewId) => {
    const review = reviews.find((r) => r.id === reviewId)
    const success = await shareContent('review', review)
    if (success) {
      toast.success('Review shared successfully')
    } else {
      toast.error('Failed to share review')
    }
  }

  const handleReportReview = async (reviewId) => {
    try {
      const { error } = await supabase.from('review_reports').insert([
        {
          review_id: reviewId,
          user_id: user.id,
          reason: 'inappropriate',
        },
      ])

      if (error) throw error

      toast.success('Review reported successfully')
      await trackEvent(EVENTS.REVIEW.REPORT, { reviewId })
    } catch (error) {
      console.error('Error reporting review:', error)
      toast.error('Failed to report review')
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'bookings', name: 'My Bookings', icon: CalendarIcon },
    { id: 'reviews', name: 'My Reviews', icon: StarIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: KeyIcon },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner fullScreen />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-montserrat font-bold mb-8">My Profile</h1>

        {/* Tabs */}
        <div className="border-b border-neutral-light/10 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-secondary text-secondary'
                      : 'border-transparent text-neutral-light hover:text-secondary hover:border-neutral-light/20'
                  }
                `}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Panels */}
        <div className="space-y-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-primary border border-neutral-light/20 rounded-md px-4 py-2 focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-primary border border-neutral-light/20 rounded-md px-4 py-2 focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-primary border border-neutral-light/20 rounded-md px-4 py-2 focus:outline-none focus:border-secondary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-secondary text-primary font-bold py-3 rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? <LoadingSpinner /> : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium mb-2"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full bg-primary border border-neutral-light/20 rounded-md px-4 py-2 focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full bg-primary border border-neutral-light/20 rounded-md px-4 py-2 focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-2"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-primary border border-neutral-light/20 rounded-md px-4 py-2 focus:outline-none focus:border-secondary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-secondary text-primary font-bold py-3 rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? <LoadingSpinner /> : 'Update Password'}
                </button>
              </form>
            </motion.div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">My Bookings</h2>
                  <p className="text-neutral-light">Manage your appointments</p>
                </div>
                <Link
                  to="/booking"
                  className="px-4 py-2 bg-secondary text-primary rounded-md hover:bg-secondary/90 transition-colors"
                >
                  New Booking
                </Link>
              </div>

              <FilterBar
                filters={bookingFilterConfig}
                sortOptions={bookingSortOptions}
                onFilterChange={handleBookingFilterChange}
                onSortChange={handleBookingSortChange}
              />

              {loading ? (
                <div className="text-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {sortBookings(filterBookings(bookings)).map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onCancel={handleCancelBooking}
                      onReschedule={handleRescheduleBooking}
                      onReview={handleAddReview}
                    />
                  ))}
                </div>
              )}

              {!loading && bookings.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-neutral-light mb-4">No bookings found</p>
                  <Link
                    to="/booking"
                    className="text-secondary hover:text-secondary/80 transition-colors"
                  >
                    Book your first appointment
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">My Reviews</h2>
                  <p className="text-neutral-light">Share your experience</p>
                </div>
              </div>

              <FilterBar
                filters={reviewFilterConfig}
                sortOptions={reviewSortOptions}
                onFilterChange={handleReviewFilterChange}
                onSortChange={handleReviewSortChange}
              />

              {loading ? (
                <div className="text-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-6">
                  {sortReviews(filterReviews(reviews)).map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onEdit={handleEditReview}
                      onDelete={handleDeleteReview}
                      onLike={handleLikeReview}
                      onShare={handleShareReview}
                      onReport={handleReportReview}
                    />
                  ))}
                </div>
              )}

              {!loading && reviews.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-neutral-light">No reviews yet</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Notifications</h2>
                  <p className="text-neutral-light">Manage your alerts and messages</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Notification Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium">Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Email Notifications</h3>
                        <p className="text-sm text-neutral-light">
                          Receive booking confirmations and reminders
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange('email')}
                        className={`
                          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                          ${formData.notifications.email ? 'bg-secondary' : 'bg-neutral-light/20'}
                        `}
                      >
                        <span
                          className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                            ${formData.notifications.email ? 'translate-x-5' : 'translate-x-0'}
                          `}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">SMS Notifications</h3>
                        <p className="text-sm text-neutral-light">
                          Receive booking updates via text message
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange('sms')}
                        className={`
                          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                          ${formData.notifications.sms ? 'bg-secondary' : 'bg-neutral-light/20'}
                        `}
                      >
                        <span
                          className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                            ${formData.notifications.sms ? 'translate-x-5' : 'translate-x-0'}
                          `}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Marketing Emails</h3>
                        <p className="text-sm text-neutral-light">
                          Receive special offers and updates
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange('marketing')}
                        className={`
                          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                          ${formData.notifications.marketing ? 'bg-secondary' : 'bg-neutral-light/20'}
                        `}
                      >
                        <span
                          className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                            ${formData.notifications.marketing ? 'translate-x-5' : 'translate-x-0'}
                          `}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Notifications */}
                <div>
                  <h3 className="font-medium mb-4">Recent Notifications</h3>
                  <NotificationCenter />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
