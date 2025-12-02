'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import Input from '@/components/Input'
import { apiGet, apiPost, uploadFile, handleAPIError } from '@/lib/utils/api'
import { validateForm } from '@/lib/utils/validation'
import type { DailyReport, Project, DailyReportFormData } from '@/types'

export default function DailyReportsPage() {
  const [reports, setReports] = useState<DailyReport[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [useVoice, setUseVoice] = useState(false)
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null)
  const [formData, setFormData] = useState<DailyReportFormData>({
    projectId: '',
    reportDate: new Date().toISOString().split('T')[0],
    workPerformed: '',
    weatherAM: '',
    weatherPM: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [reportsData, projectsData] = await Promise.all([
        apiGet('/api/daily-reports'),
        apiGet('/api/projects')
      ])
      setReports(reportsData.dailyReports || [])
      setProjects(projectsData.projects || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (useVoice && selectedAudio) {
      if (!formData.projectId) {
        alert('Please select a project')
        return
      }

      setSubmitting(true)
      try {
        await uploadFile('/api/daily-reports/voice', selectedAudio, { projectId: formData.projectId })
        setShowModal(false)
        resetForm()
        loadData()
        alert('Voice report processed successfully!')
      } catch (error) {
        alert(handleAPIError(error))
      } finally {
        setSubmitting(false)
      }
    } else {
      const validationErrors = validateForm(formData, {
        projectId: { required: true },
        reportDate: { required: true },
        workPerformed: { required: true, minLength: 10 },
      })

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      setSubmitting(true)
      try {
        await apiPost('/api/daily-reports', formData)
        setShowModal(false)
        resetForm()
        loadData()
      } catch (error) {
        alert(handleAPIError(error))
      } finally {
        setSubmitting(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      projectId: '',
      reportDate: new Date().toISOString().split('T')[0],
      workPerformed: '',
      weatherAM: '',
      weatherPM: '',
    })
    setSelectedAudio(null)
    setUseVoice(false)
  }

  const columns = [
    { key: 'reportDate', label: 'Date', render: (value: Date) => new Date(value).toLocaleDateString() },
    { key: 'projectId', label: 'Project' },
    { key: 'workPerformed', label: 'Work Performed', render: (value: string) => value?.substring(0, 50) + '...' || 'N/A' },
    { key: 'voiceRecorded', label: 'Voice', render: (value: boolean) => value ? '🎤 Yes' : 'Text' },
    { key: 'createdAt', label: 'Created', render: (value: Date) => new Date(value).toLocaleDateString() },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Daily Reports</h1>
            <p className="text-gray-600 mt-1">Track daily field activities</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            Create Report
          </Button>
        </div>

        <Card>
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading reports...</div>
          ) : (
            <Table
              columns={columns}
              data={reports}
              emptyMessage="No reports yet. Create your first daily report to get started!"
            />
          )}
        </Card>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create Daily Report"
          size="lg"
        >
          <div className="mb-4">
            <div className="flex gap-2 mb-4">
              <Button
                type="button"
                variant={!useVoice ? 'primary' : 'ghost'}
                onClick={() => setUseVoice(false)}
                size="sm"
              >
                Text Entry
              </Button>
              <Button
                type="button"
                variant={useVoice ? 'primary' : 'ghost'}
                onClick={() => setUseVoice(true)}
                size="sm"
              >
                Voice Recording
              </Button>
            </div>
          </div>

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
            </div>

            {useVoice ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Voice Recording <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setSelectedAudio(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload an audio recording. AI will transcribe and structure the report.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Speak naturally about work performed, weather conditions, crew details, and any issues.
                    AI will automatically organize the information.
                  </p>
                </div>
              </>
            ) : (
              <>
                <Input
                  label="Report Date"
                  type="date"
                  required
                  value={formData.reportDate}
                  onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
                  error={errors.reportDate}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Weather AM"
                    value={formData.weatherAM}
                    onChange={(e) => setFormData({ ...formData, weatherAM: e.target.value })}
                  />
                  <Input
                    label="Weather PM"
                    value={formData.weatherPM}
                    onChange={(e) => setFormData({ ...formData, weatherPM: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Performed <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    value={formData.workPerformed}
                    onChange={(e) => setFormData({ ...formData, workPerformed: e.target.value })}
                    required
                  />
                  {errors.workPerformed && <p className="text-sm text-red-600 mt-1">{errors.workPerformed}</p>}
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={submitting}>
                {useVoice ? 'Upload & Process' : 'Create Report'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
