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
import type { RFI, Project, RFIFormData } from '@/types'

export default function RFIsPage() {
  const [rfis, setRfis] = useState<RFI[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<RFIFormData>({
    projectId: '',
    subject: '',
    question: '',
    priority: 'normal',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [rfisData, projectsData] = await Promise.all([
        apiGet('/api/rfis'),
        apiGet('/api/projects')
      ])
      setRfis(rfisData.rfis || [])
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
      subject: { required: true, minLength: 5 },
      question: { required: true, minLength: 10 },
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      await apiPost('/api/rfis', formData)
      setShowModal(false)
      setFormData({ projectId: '', subject: '', question: '', priority: 'normal' })
      loadData()
    } catch (error) {
      alert(handleAPIError(error))
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    { key: 'rfiNumber', label: 'RFI #' },
    { key: 'subject', label: 'Subject' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          draft: 'default',
          sent: 'info',
          responded: 'warning',
          closed: 'success',
        }
        return <Badge variant={variants[value]}>{value}</Badge>
      }
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value: string) => {
        const variants: Record<string, any> = {
          low: 'default',
          normal: 'info',
          high: 'warning',
          urgent: 'danger',
        }
        return <Badge variant={variants[value]}>{value}</Badge>
      }
    },
    { key: 'createdAt', label: 'Created', render: (value: Date) => new Date(value).toLocaleDateString() },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">RFIs</h1>
            <p className="text-gray-600 mt-1">Request for Information management</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            Create RFI
          </Button>
        </div>

        <Card>
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading RFIs...</div>
          ) : (
            <Table
              columns={columns}
              data={rfis}
              emptyMessage="No RFIs yet. Create your first RFI to get started!"
            />
          )}
        </Card>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create New RFI"
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
              label="Subject"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              error={errors.subject}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
              />
              {errors.question && <p className="text-sm text-red-600 mt-1">{errors.question}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
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
                Create RFI
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
