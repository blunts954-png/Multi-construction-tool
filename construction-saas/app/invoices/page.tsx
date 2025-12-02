'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import Badge from '@/components/Badge'
import { apiGet, uploadFile, handleAPIError } from '@/lib/utils/api'
import type { Invoice, Project } from '@/types'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedProject, setSelectedProject] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [invoicesData, projectsData] = await Promise.all([
        apiGet('/api/invoices'),
        apiGet('/api/projects')
      ])
      setInvoices(invoicesData.invoices || [])
      setProjects(projectsData.projects || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !selectedProject) {
      alert('Please select a file and project')
      return
    }

    setUploading(true)
    try {
      await uploadFile('/api/invoices/upload', selectedFile, { projectId: selectedProject })
      setShowModal(false)
      setSelectedFile(null)
      setSelectedProject('')
      loadData()
      alert('Invoice uploaded and processed successfully!')
    } catch (error) {
      alert(handleAPIError(error))
    } finally {
      setUploading(false)
    }
  }

  const columns = [
    { key: 'invoiceNumber', label: 'Invoice #', render: (value: string) => value || 'Pending' },
    { key: 'invoiceDate', label: 'Date', render: (value: Date) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { key: 'total', label: 'Amount', render: (value: number) => `$${value.toFixed(2)}` },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          pending: 'warning',
          approved: 'info',
          paid: 'success',
          disputed: 'danger',
        }
        return <Badge variant={variants[value]}>{value}</Badge>
      }
    },
    { key: 'aiExtracted', label: 'AI Extracted', render: (value: boolean) => value ? '✓ Yes' : 'Manual' },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-1">AI-powered invoice processing</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            Upload Invoice
          </Button>
        </div>

        <Card>
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading invoices...</div>
          ) : (
            <Table
              columns={columns}
              data={invoices}
              emptyMessage="No invoices yet. Upload your first invoice to get started!"
            />
          )}
        </Card>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Upload Invoice"
        >
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Project <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                required
              >
                <option value="">Choose a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice File <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: JPG, PNG, PDF
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                AI will automatically extract vendor, amounts, line items, and categories from your invoice.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={uploading}>
                Upload & Process
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
