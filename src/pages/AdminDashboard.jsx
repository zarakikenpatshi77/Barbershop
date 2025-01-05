import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'
import {
  CalendarIcon,
  UsersIcon,
  ScissorsIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeBarbers: 0,
    averageRating: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      checkAdminAccess()
      fetchDashboardData()
    }
  }, [user])

  const checkAdminAccess = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error) throw error
      if (data.role !== 'admin') {
        window.location.href = '/'
      }
    } catch (error) {
      toast.error('Access denied')
      window.location.href = '/'
    }
  }

  const fetchDashboardData = async () => {
    try {
      // Fetch overview statistics
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('total_price, status')
        .order('created_at', { ascending: false })

      const { data: barbersData } = await supabase
        .from('barbers')
        .select('id')
        .eq('is_active', true)

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('rating')

      // Calculate statistics
      const totalRevenue = bookingsData
        .filter(b => b.status === 'completed')
        .reduce((sum, booking) => sum + booking.total_price, 0)

      const averageRating = reviewsData.length
        ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length
        : 0

      setStats({
        totalBookings: bookingsData.length,
        totalRevenue,
        activeBarbers: barbersData.length,
        averageRating,
      })

      // Fetch recent bookings with details
      const { data: recentBookingsData } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          appointment_date,
          appointment_time,
          total_price,
          profiles:user_id (full_name),
          barbers:barber_id (name),
          services:service_id (name)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      setRecentBookings(recentBookingsData)
    } catch (error) {
      toast.error('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-500',
      confirmed: 'text-blue-500',
      completed: 'text-green-500',
      cancelled: 'text-red-500',
    }
    return colors[status] || 'text-neutral-light'
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-montserrat font-bold">Admin Dashboard</h1>
            <button
              onClick={fetchDashboardData}
              className="bg-secondary text-primary px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
            >
              Refresh Data
            </button>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-neutral-dark p-6 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-light">Total Bookings</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalBookings}</h3>
                </div>
                <CalendarIcon className="w-8 h-8 text-secondary" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-neutral-dark p-6 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-light">Revenue</p>
                  <h3 className="text-2xl font-bold mt-1">
                    ${stats.totalRevenue.toFixed(2)}
                  </h3>
                </div>
                <CurrencyDollarIcon className="w-8 h-8 text-secondary" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-neutral-dark p-6 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-light">Active Barbers</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.activeBarbers}</h3>
                </div>
                <ScissorsIcon className="w-8 h-8 text-secondary" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-neutral-dark p-6 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-light">Average Rating</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.averageRating.toFixed(1)} ⭐
                  </h3>
                </div>
                <ChartBarIcon className="w-8 h-8 text-secondary" />
              </div>
            </motion.div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-neutral-dark rounded-lg p-6">
            <h2 className="text-xl font-montserrat font-bold mb-6">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-neutral-light/20">
                    <th className="pb-4 font-medium">Customer</th>
                    <th className="pb-4 font-medium">Service</th>
                    <th className="pb-4 font-medium">Barber</th>
                    <th className="pb-4 font-medium">Date & Time</th>
                    <th className="pb-4 font-medium">Price</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-neutral-light/10">
                      <td className="py-4">{booking.profiles?.full_name}</td>
                      <td className="py-4">{booking.services?.name}</td>
                      <td className="py-4">{booking.barbers?.name}</td>
                      <td className="py-4">
                        {new Date(booking.appointment_date).toLocaleDateString()}{' '}
                        {booking.appointment_time}
                      </td>
                      <td className="py-4">${booking.total_price}</td>
                      <td className={`py-4 ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
