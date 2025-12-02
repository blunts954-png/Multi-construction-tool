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
import type { Project, ProjectFormData } from '@/types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    estimatedBudget: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const data = await apiGet('/api/projects')
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm(formData, {
      name: { required: true, minLength: 2 },
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      await apiPost('/api/projects', formData)
      setShowModal(false)
      setFormData({ name: '', address: '', city: '', state: '', zipCode: '', estimatedBudget: '' })
      loadProjects()
    } catch (error) {
      alert(handleAPIError(error))
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    { key: 'name', label: 'Project Name' },
    { key: 'city', label: 'Location', render: (_: any, row: Project) => `${row.city || ''}, ${row.state || ''}` },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          active: 'success',
          on_hold: 'warning',
          completed: 'info',
          cancelled: 'danger',
        }
        return <Badge variant={variants[value]}>{value.replace('_', ' ')}</Badge>
      }
    },
    { key: 'estimatedBudget', label: 'Budget', render: (value: number) => value ? `$${value.toLocaleString()}` : 'N/A' },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Manage your construction projects</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            Create Project
          </Button>
        </div>

        <Card>
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading projects...</div>
          ) : (
            <Table
              columns={columns}
              data={projects}
              emptyMessage="No projects yet. Create your first project to get started!"
            />
          )}
        </Card>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create New Project"
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Project Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
            />

            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <Input
                label="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                maxLength={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Zip Code"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
              <Input
                label="Estimated Budget"
                type="number"
                value={formData.estimatedBudget}
                onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                helperText="Optional"
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
                Create Project
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
