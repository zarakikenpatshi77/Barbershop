import { motion } from 'framer-motion'

const LoadingSpinner = ({ fullScreen }) => {
  const spinner = (
    <motion.div
      className="inline-block"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full" />
    </motion.div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-primary/80 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center"
        >
          {spinner}
          <p className="mt-4 text-neutral-light">Loading...</p>
        </motion.div>
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner
