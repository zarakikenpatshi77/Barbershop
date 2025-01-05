import { Component } from 'react'
import { motion } from 'framer-motion'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
    // You could also log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-neutral-dark rounded-lg p-8 text-center"
          >
            <h1 className="text-2xl font-montserrat font-bold mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-neutral-light mb-6">
              We apologize for the inconvenience. Please try refreshing the page or contact support if
              the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-secondary text-primary px-6 py-2 rounded-md hover:bg-secondary/90 transition-colors"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 text-left">
                <p className="text-red-500 mb-2">{this.state.error.toString()}</p>
                <pre className="bg-primary p-4 rounded-md overflow-auto text-sm">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
