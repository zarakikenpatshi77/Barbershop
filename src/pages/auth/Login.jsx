import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../services/supabase'
import LoadingSpinner from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('verified') === 'true') {
      toast.success('Email verified successfully! Please log in.')
    }
  }, [location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await signIn(formData.email, formData.password)
      
      if (error) {
        console.error('Login error:', error)
        throw error
      }

      // Check if there's a pending profile to create
      const pendingProfile = localStorage.getItem('pendingProfile')
      if (pendingProfile) {
        try {
          const profileData = JSON.parse(pendingProfile)
          const { error: profileError } = await supabase.from('profiles').insert([profileData])
          
          if (profileError) {
            console.error('Profile creation error:', profileError)
            throw profileError
          }
          
          localStorage.removeItem('pendingProfile')
        } catch (profileError) {
          console.error('Failed to create profile:', profileError)
          // Don't throw here, let the user continue even if profile creation fails
          toast.error('Failed to create profile. Please update your profile later.')
        }
      }

      // Get the return URL from location state or default to home
      const returnTo = location.state?.from?.pathname || '/'
      navigate(returnTo)
      toast.success('Welcome back!')
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'Failed to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
            <h1 className="text-3xl font-montserrat font-bold mb-2">Welcome Back</h1>
            <p className="text-neutral-light">
              Sign in to manage your appointments and preferences
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="rounded border-neutral-light/20 text-secondary focus:ring-secondary"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-secondary hover:text-secondary/80 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-primary font-bold py-3 rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-light">
              Don't have an account?{' '}
              <Link
                to="/auth/register"
                className="text-secondary hover:text-secondary/80 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-light/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-neutral-dark text-neutral-light">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="w-full px-4 py-2 border border-neutral-light/20 rounded-md hover:bg-neutral-light/5 transition-colors flex items-center justify-center"
                onClick={() => {
                  // TODO: Implement Google sign in
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
                  // TODO: Implement Facebook sign in
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

export default Login
