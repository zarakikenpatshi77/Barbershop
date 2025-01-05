import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FunnelIcon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const FilterBar = ({
  filters,
  activeFilters,
  onFilterChange,
  sortOptions,
  activeSort,
  onSortChange,
  showClear = true,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const handleFilterChange = (filterId, value) => {
    onFilterChange(filterId, value)
  }

  const handleSortChange = (e) => {
    onSortChange(e.target.value)
  }

  const clearFilters = () => {
    filters.forEach((filter) => {
      if (filter.type === 'select') {
        onFilterChange(filter.id, '')
      } else if (filter.type === 'multi') {
        onFilterChange(filter.id, [])
      } else if (filter.type === 'range') {
        onFilterChange(filter.id, { min: filter.min, max: filter.max })
      }
    })
    onSortChange(sortOptions[0].value)
  }

  const renderFilterInput = (filter) => {
    switch (filter.type) {
      case 'select':
        return (
          <select
            value={activeFilters[filter.id] || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="bg-primary border border-neutral-light/20 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-secondary"
          >
            <option value="">{filter.placeholder || 'All'}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'multi':
        return (
          <div className="flex flex-wrap gap-2">
            {filter.options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  const current = activeFilters[filter.id] || []
                  const newValue = current.includes(option.value)
                    ? current.filter((v) => v !== option.value)
                    : [...current, option.value]
                  handleFilterChange(filter.id, newValue)
                }}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  (activeFilters[filter.id] || []).includes(option.value)
                    ? 'bg-secondary text-primary'
                    : 'bg-neutral-light/10 text-neutral-light hover:bg-neutral-light/20'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )

      case 'range':
        const value = activeFilters[filter.id] || { min: filter.min, max: filter.max }
        return (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={filter.min}
              max={filter.max}
              value={value.min}
              onChange={(e) =>
                handleFilterChange(filter.id, {
                  ...value,
                  min: parseInt(e.target.value),
                })
              }
              className="w-20 bg-primary border border-neutral-light/20 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-secondary"
            />
            <span className="text-neutral-light">to</span>
            <input
              type="number"
              min={filter.min}
              max={filter.max}
              value={value.max}
              onChange={(e) =>
                handleFilterChange(filter.id, {
                  ...value,
                  max: parseInt(e.target.value),
                })
              }
              className="w-20 bg-primary border border-neutral-light/20 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-secondary"
            />
          </div>
        )

      default:
        return null
    }
  }

  const hasActiveFilters = () => {
    return Object.keys(activeFilters).some((key) => {
      const value = activeFilters[key]
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'object') {
        const filter = filters.find((f) => f.id === key)
        return value.min !== filter.min || value.max !== filter.max
      }
      return value !== ''
    })
  }

  return (
    <div className="mb-6">
      {/* Desktop Filters */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {filters.map((filter) => (
              <div key={filter.id} className="flex items-center space-x-2">
                <span className="text-sm text-neutral-light">{filter.label}:</span>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={activeSort}
              onChange={handleSortChange}
              className="bg-primary border border-neutral-light/20 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-secondary"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {showClear && hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="text-sm text-neutral-light hover:text-secondary transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-neutral-light/10 rounded-md hover:bg-neutral-light/20 transition-colors"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>Filters</span>
            {hasActiveFilters() && (
              <span className="bg-secondary text-primary px-2 py-0.5 rounded-full text-xs">
                {Object.keys(activeFilters).length}
              </span>
            )}
          </button>
          <select
            value={activeSort}
            onChange={handleSortChange}
            className="bg-primary border border-neutral-light/20 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-secondary"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-end"
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="w-full bg-neutral-dark rounded-t-xl p-6 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 hover:bg-neutral-light/10 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {filters.map((filter) => (
                    <div key={filter.id}>
                      <label className="block text-sm text-neutral-light mb-2">
                        {filter.label}
                      </label>
                      {renderFilterInput(filter)}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-neutral-light/10">
                  {showClear && hasActiveFilters() && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-neutral-light hover:text-secondary transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="px-4 py-2 bg-secondary text-primary rounded-md hover:bg-secondary/90 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FilterBar
