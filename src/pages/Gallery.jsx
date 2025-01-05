import { useState } from 'react'
import { motion } from 'framer-motion'

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'haircuts', name: 'Haircuts' },
    { id: 'beards', name: 'Beards' },
    { id: 'styling', name: 'Styling' },
  ]

  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory)

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">
            Our Gallery
          </h1>
          <p className="text-neutral-light max-w-2xl mx-auto">
            Explore our collection of premium haircuts and styles crafted by our expert barbers.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex justify-center space-x-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-md transition-colors ${
                selectedCategory === category.id
                  ? 'bg-secondary text-primary'
                  : 'text-neutral-light hover:text-secondary'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-bold">{image.title}</h3>
                    <p className="text-sm text-neutral-light">{image.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto rounded-lg"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold">{selectedImage.title}</h3>
                <p className="text-neutral-light mt-2">{selectedImage.description}</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

// Sample gallery data
const galleryImages = [
  {
    id: 1,
    title: 'Classic Fade',
    description: 'Modern take on a timeless style',
    category: 'haircuts',
    url: '/src/assets/images/gallery/classic-fade.jpg',
  },
  {
    id: 2,
    title: 'Luxury Beard Grooming',
    description: 'Precision beard trimming and styling',
    category: 'beards',
    url: '/src/assets/images/gallery/beard-grooming.jpg',
  },
  {
    id: 3,
    title: 'Modern Pompadour',
    description: 'Contemporary styling with classic influence',
    category: 'styling',
    url: '/src/assets/images/gallery/pompadour.jpg',
  },
  {
    id: 4,
    title: 'Textured Crop',
    description: 'Short textured cut with natural finish',
    category: 'haircuts',
    url: '/src/assets/images/gallery/textured-crop.jpg',
  },
  {
    id: 5,
    title: 'Full Beard Sculpting',
    description: 'Expertly shaped full beard',
    category: 'beards',
    url: '/src/assets/images/gallery/beard-sculpting.jpg',
  },
  {
    id: 6,
    title: 'Slick Back',
    description: 'Classic slick back with modern edge',
    category: 'styling',
    url: '/src/assets/images/gallery/slick-back.jpg',
  },
  {
    id: 7,
    title: 'Skin Fade',
    description: 'Clean skin fade with textured top',
    category: 'haircuts',
    url: '/src/assets/images/gallery/skin-fade.jpg',
  },
  {
    id: 8,
    title: 'Beard Line-up',
    description: 'Sharp and precise beard lines',
    category: 'beards',
    url: '/src/assets/images/gallery/beard-lineup.jpg',
  },
  {
    id: 9,
    title: 'Quiff Styling',
    description: 'Volume and texture for the perfect quiff',
    category: 'styling',
    url: '/src/assets/images/gallery/quiff.jpg',
  },
]

export default Gallery
