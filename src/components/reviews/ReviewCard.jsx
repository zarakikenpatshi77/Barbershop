import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, formatDistanceToNow } from 'date-fns'
import {
  StarIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  PhotoIcon,
  HeartIcon,
  ShareIcon,
  FlagIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useAuth } from '../../hooks/useAuth'

const ReviewCard = ({ review, onEdit, onDelete, onLike, onReport, onShare }) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [editedReview, setEditedReview] = useState({
    rating: review.rating,
    comment: review.comment,
    photos: review.photos || [],
  })
  const [selectedImage, setSelectedImage] = useState(null)

  const handleSave = () => {
    onEdit(review.id, editedReview)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedReview({
      rating: review.rating,
      comment: review.comment,
      photos: review.photos || [],
    })
    setIsEditing(false)
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedReview((prev) => ({
          ...prev,
          photos: [...prev.photos, reader.result],
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteImage = (index) => {
    setEditedReview((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const renderStars = (rating, interactive = false) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1
      if (interactive) {
        return (
          <button
            key={index}
            onClick={() => setEditedReview({ ...editedReview, rating: starValue })}
            className="focus:outline-none"
          >
            {starValue <= editedReview.rating ? (
              <StarIconSolid className="h-5 w-5 text-yellow-500" />
            ) : (
              <StarIcon className="h-5 w-5 text-yellow-500" />
            )}
          </button>
        )
      }
      return starValue <= rating ? (
        <StarIconSolid key={index} className="h-5 w-5 text-yellow-500" />
      ) : (
        <StarIcon key={index} className="h-5 w-5 text-yellow-500" />
      )
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-dark rounded-lg p-6 border border-neutral-light/10 hover:border-secondary/50 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            {review.user_avatar ? (
              <img
                src={review.user_avatar}
                alt={review.user_name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-neutral-light/10 flex items-center justify-center">
                <span className="text-lg font-bold">{review.user_name[0]}</span>
              </div>
            )}
            <div>
              <h3 className="font-bold">{review.user_name}</h3>
              <p className="text-sm text-neutral-light">
                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">{renderStars(review.rating)}</div>
            <span className="text-sm text-neutral-light">· {review.service_name}</span>
          </div>
        </div>
        {!isEditing && user?.id === review.user_id && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 hover:text-secondary transition-colors rounded-full hover:bg-secondary/10"
              title="Edit review"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-1.5 hover:text-red-500 transition-colors rounded-full hover:bg-red-500/10"
              title="Delete review"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="flex space-x-1">{renderStars(review.rating, true)}</div>
          <textarea
            value={editedReview.comment}
            onChange={(e) =>
              setEditedReview({ ...editedReview, comment: e.target.value })
            }
            className="w-full bg-primary border border-neutral-light/20 rounded-md px-4 py-2 focus:outline-none focus:border-secondary resize-none"
            rows={4}
            placeholder="Share your experience..."
          />
          
          {/* Photo Upload */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {editedReview.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Review photo ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {editedReview.photos.length < 5 && (
                <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-neutral-light/20 rounded-md cursor-pointer hover:border-secondary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <PhotoIcon className="h-6 w-6 text-neutral-light" />
                </label>
              )}
            </div>
            <p className="text-xs text-neutral-light">
              Add up to 5 photos to your review
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 rounded-md hover:bg-neutral-light/10 transition-colors"
            >
              <XMarkIcon className="h-5 w-5 mr-1" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-secondary text-primary rounded-md hover:bg-secondary/90 transition-colors"
            >
              <CheckIcon className="h-5 w-5 mr-1" />
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-neutral-light mb-4">{review.comment}</p>
          
          {/* Review Photos */}
          {review.photos && review.photos.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {review.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Review photo ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedImage(photo)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Barber Reply */}
          {review.barber_reply && (
            <div className="mt-4 pl-4 border-l-2 border-secondary">
              <div className="flex items-center space-x-2 mb-2">
                {review.barber_avatar ? (
                  <img
                    src={review.barber_avatar}
                    alt={review.barber_name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-secondary">
                      {review.barber_name[0]}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{review.barber_name}</p>
                  <p className="text-xs text-neutral-light">
                    {formatDistanceToNow(new Date(review.reply_date), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-neutral-light">{review.barber_reply}</p>
            </div>
          )}

          {/* Review Actions */}
          <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-neutral-light/10">
            <button
              onClick={() => onLike(review.id)}
              className={`flex items-center space-x-1 text-sm ${
                review.liked_by_user ? 'text-red-500' : 'text-neutral-light hover:text-red-500'
              } transition-colors`}
            >
              {review.liked_by_user ? (
                <HeartIconSolid className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              <span>{review.likes_count || 0}</span>
            </button>
            <button
              onClick={() => onShare(review.id)}
              className="flex items-center space-x-1 text-sm text-neutral-light hover:text-secondary transition-colors"
            >
              <ShareIcon className="h-5 w-5" />
              <span>Share</span>
            </button>
            <button
              onClick={() => onReport(review.id)}
              className="flex items-center space-x-1 text-sm text-neutral-light hover:text-red-500 transition-colors"
            >
              <FlagIcon className="h-5 w-5" />
              <span>Report</span>
            </button>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-neutral-dark p-6 rounded-lg max-w-sm w-full mx-4"
            >
              <h3 className="text-lg font-bold mb-2">Delete Review</h3>
              <p className="text-neutral-light mb-4">
                Are you sure you want to delete this review? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 text-neutral-light hover:bg-neutral-light/10 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete(review.id)
                    setShowConfirmDelete(false)
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={selectedImage}
              alt="Review photo"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ReviewCard
