import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const SocialLoginButton = ({ provider, icon, label }) => {
  const { signInWithProvider } = useAuth()

  const handleLogin = async () => {
    try {
      await signInWithProvider(provider.toLowerCase())
    } catch (error) {
      toast.error(`Failed to sign in with ${label}`)
      console.error(error)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLogin}
      className="w-full flex items-center justify-center px-4 py-2 border border-neutral-light/20 rounded-md hover:bg-neutral-light/5 transition-colors space-x-2"
    >
      <img src={icon} alt={label} className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  )
}

export default SocialLoginButton
