'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import Input from '@/components/Input'
import Badge from '@/components/Badge'
import { apiGet, apiPost, handleAPIError } from '@/lib/utils/api'
import { validateForm } from '@/lib/utils/validation'
import type { ChangeOrder, Project, ChangeOrderFormData } from '@/types'

export default function ChangeOrdersPage() {
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<ChangeOrderFormData>({
    projectId: '',
    title: '',
    description: '',
    priceImpact: '0',
    scheduleImpact: '0',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [cosData, projectsData] = await Promise.all([
        apiGet('/api/change-orders'),
        apiGet('/api/projects')
      ])
      setChangeOrders(cosData.changeOrders || [])
      setProjects(projectsData.projects || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm(formData, {
      projectId: { required: true },
      title: { required: true, minLength: 5 },
      description: { required: true, minLength: 10 },
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      await apiPost('/api/change-orders', formData)
      setShowModal(false)
      setFormData({ projectId: '', title: '', description: '', priceImpact: '0', scheduleImpact: '0' })
      loadData()
    } catch (error) {
      alert(handleAPIError(error))
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    { key: 'coNumber', label: 'CO #' },
    { key: 'title', label: 'Title' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          draft: 'default',
          pending: 'warning',
          approved: 'success',
          rejected: 'danger',
          completed: 'info',
        }
        return <Badge variant={variants[value]}>{value}</Badge>
      }
    },
    { key: 'priceImpact', label: 'Price Impact', render: (value: number) => `$${value.toLocaleString()}` },
    { key: 'scheduleImpact', label: 'Schedule Impact', render: (value: number) => `${value} days` },
    { key: 'createdAt', label: 'Created', render: (value: Date) => new Date(value).toLocaleDateString() },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Change Orders</h1>
            <p className="text-gray-600 mt-1">Track scope changes and financial impact</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            Create Change Order
          </Button>
        </div>

        <Card>
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading change orders...</div>
          ) : (
            <Table
              columns={columns}
              data={changeOrders}
              emptyMessage="No change orders yet. Create your first change order to get started!"
            />
          )}
        </Card>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create New Change Order"
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                required
              >
                <option value="">Choose a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {errors.projectId && <p className="text-sm text-red-600 mt-1">{errors.projectId}</p>}
            </div>

            <Input
              label="Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={errors.title}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price Impact"
                type="number"
                step="0.01"
                value={formData.priceImpact}
                onChange={(e) => setFormData({ ...formData, priceImpact: e.target.value })}
                helperText="Positive for cost increase"
              />
              <Input
                label="Schedule Impact (days)"
                type="number"
                value={formData.scheduleImpact}
                onChange={(e) => setFormData({ ...formData, scheduleImpact: e.target.value })}
                helperText="Positive for delay"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={submitting}>
                Create Change Order
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
