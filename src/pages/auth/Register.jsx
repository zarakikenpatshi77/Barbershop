import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../services/supabase'
import LoadingSpinner from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { validateEmail, validatePhone } from '../../utils/helpers'

const Register = () => {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    if (!validatePhone(formData.phone)) {
      toast.error('Please enter a valid phone number')
      return
    }
    
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (!formData.acceptTerms) {
      toast.error('Please accept the terms and conditions')
      return
    }

    setLoading(true)

    try {
      // Sign up the user
      const { data, error } = await signUp(formData.email, formData.password)
      
      if (error) {
        console.error('Signup error:', error)
        throw error
      }

      if (!data?.user?.id) {
        throw new Error('No user data returned from signup')
      }

      // Store the profile data in localStorage to create after email verification
      localStorage.setItem('pendingProfile', JSON.stringify({
        id: data.user.id,
        full_name: formData.fullName,
        phone: formData.phone,
        role: 'customer',
      }))

      toast.success('Registration successful! Please check your email to verify your account.')
      navigate('/auth/login')
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-neutral-dark rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-montserrat font-bold mb-2">Create Account</h1>
            <p className="text-neutral-light">
              Join us for a premium grooming experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                required
                className="w-full bg-primary border border-neutral-light/20 rounded-md px-4 py-2 focus:outline-none focus:border-secondary"
                placeholder="John Doe"
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
                required
                className="w-full bg-primary border border-neutral-light/20 rounded-md px-4 py-2 focus:outline-none focus:border-secondary"
                placeholder="your@email.com"
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
                required
                className="w-full bg-primary border border-neutral-light/20 rounded-md px-4 py-2 focus:outline-none focus:border-secondary"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-primary border border-neutral-light/20 rounded-md px-4 py-2 focus:outline-none focus:border-secondary"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-primary border border-neutral-light/20 rounded-md px-4 py-2 focus:outline-none focus:border-secondary"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="rounded border-neutral-light/20 text-secondary focus:ring-secondary"
                />
                <span className="ml-2 text-sm">
                  I accept the{' '}
                  <Link
                    to="/terms"
                    className="text-secondary hover:text-secondary/80 transition-colors"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    className="text-secondary hover:text-secondary/80 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-primary font-bold py-3 rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-light">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-secondary hover:text-secondary/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Social Registration */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-light/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-neutral-dark text-neutral-light">
                  Or register with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="w-full px-4 py-2 border border-neutral-light/20 rounded-md hover:bg-neutral-light/5 transition-colors flex items-center justify-center"
                onClick={() => {
                  // TODO: Implement Google sign up
                }}
              >
                <img
                  src="/src/assets/images/google.svg"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Google
              </button>
              <button
                type="button"
                className="w-full px-4 py-2 border border-neutral-light/20 rounded-md hover:bg-neutral-light/5 transition-colors flex items-center justify-center"
                onClick={() => {
                  // TODO: Implement Facebook sign up
                }}
              >
                <img
                  src="/src/assets/images/facebook.svg"
                  alt="Facebook"
                  className="w-5 h-5 mr-2"
                />
                Facebook
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
