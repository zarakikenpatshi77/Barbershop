import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  CalendarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Close menus when route changes
  useEffect(() => {
    setIsOpen(false)
    setShowProfileMenu(false)
  }, [location.pathname])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      navigate('/')
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ]

  const profileMenu = [
    { name: 'My Profile', href: '/profile', icon: UserCircleIcon },
    { name: 'My Bookings', href: '/profile/bookings', icon: CalendarIcon },
    user?.role === 'admin' && { name: 'Admin Dashboard', href: '/admin', icon: CogIcon },
  ].filter(Boolean)

  return (
    <nav className="bg-primary border-b border-neutral-light/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              className="h-8 w-auto"
              src="/src/assets/images/logo.svg"
              alt="Luxe Barber"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-secondary'
                    : 'text-neutral-light hover:text-secondary'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 text-sm font-medium text-neutral-light hover:text-secondary transition-colors"
                >
                  <UserCircleIcon className="h-6 w-6" />
                  <span>{user.email}</span>
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-neutral-dark ring-1 ring-black ring-opacity-5"
                    >
                      <div className="py-1">
                        {profileMenu.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="flex items-center px-4 py-2 text-sm text-neutral-light hover:bg-primary/50"
                          >
                            <item.icon className="h-5 w-5 mr-3" />
                            {item.name}
                          </Link>
                        ))}
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center px-4 py-2 text-sm text-neutral-light hover:bg-primary/50"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/login"
                  className="text-sm font-medium text-neutral-light hover:text-secondary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="text-sm font-medium px-4 py-2 rounded-md bg-secondary text-primary hover:bg-secondary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-light hover:text-secondary focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-neutral-dark">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.href
                      ? 'text-secondary bg-primary/50'
                      : 'text-neutral-light hover:text-secondary hover:bg-primary/30'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {user ? (
                <>
                  {profileMenu.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-neutral-light hover:text-secondary hover:bg-primary/30"
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-neutral-light hover:text-secondary hover:bg-primary/30"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="space-y-2 px-3 py-2">
                  <Link
                    to="/auth/login"
                    className="block text-base font-medium text-neutral-light hover:text-secondary"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="block text-base font-medium px-4 py-2 rounded-md bg-secondary text-primary hover:bg-secondary/90 transition-colors text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
