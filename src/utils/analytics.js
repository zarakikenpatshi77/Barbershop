import { supabase } from '../services/supabase'

export const trackEvent = async (eventName, properties = {}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('analytics_events').insert([{
      user_id: user.id,
      event_name: eventName,
      properties,
      timestamp: new Date().toISOString(),
    }])
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}

export const EVENTS = {
  BOOKING: {
    CREATE: 'booking_created',
    CANCEL: 'booking_cancelled',
    RESCHEDULE: 'booking_rescheduled',
    VIEW: 'booking_viewed',
  },
  REVIEW: {
    CREATE: 'review_created',
    EDIT: 'review_edited',
    DELETE: 'review_deleted',
    LIKE: 'review_liked',
    SHARE: 'review_shared',
    REPORT: 'review_reported',
    PHOTO_UPLOAD: 'review_photo_uploaded',
  },
  PROFILE: {
    UPDATE: 'profile_updated',
    SETTINGS_CHANGED: 'settings_changed',
  },
  NOTIFICATION: {
    VIEW: 'notification_viewed',
    CLICK: 'notification_clicked',
    SETTINGS_CHANGED: 'notification_settings_changed',
  },
}

export const shareContent = async (type, content, platform = 'default') => {
  const shareData = {
    booking: {
      title: 'My Booking at Luxe Barber',
      text: `Check out my appointment with ${content.barber_name} for ${content.service_name}`,
      url: `${window.location.origin}/booking/${content.id}`,
    },
    review: {
      title: `${content.user_name}'s Review of Luxe Barber`,
      text: `${content.rating}★ "${content.comment.slice(0, 100)}${content.comment.length > 100 ? '...' : ''}"`,
      url: `${window.location.origin}/review/${content.id}`,
    },
  }[type]

  try {
    if (navigator.share && platform === 'default') {
      await navigator.share(shareData)
    } else {
      const urls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`,
      }

      const width = 600
      const height = 400
      const left = window.innerWidth / 2 - width / 2
      const top = window.innerHeight / 2 - height / 2

      window.open(
        urls[platform],
        'share',
        `width=${width},height=${height},left=${left},top=${top}`
      )
    }

    await trackEvent(EVENTS.REVIEW.SHARE, { type, platform })
    return true
  } catch (error) {
    console.error('Error sharing content:', error)
    return false
  }
}
