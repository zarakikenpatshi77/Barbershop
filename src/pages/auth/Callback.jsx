import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import LoadingSpinner from '../../components/LoadingSpinner'

const Callback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSession()
      if (error) {
        console.error('Auth callback error:', error)
        navigate('/auth/login?error=Unable to verify your email. Please try again.')
      } else {
        // Check if this was an email verification
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const type = hashParams.get('type')
        
        if (type === 'email_verification') {
          navigate('/auth/login?verified=true')
        } else {
          navigate('/')
        }
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <LoadingSpinner />
    </div>
  )
}

export default Callback
