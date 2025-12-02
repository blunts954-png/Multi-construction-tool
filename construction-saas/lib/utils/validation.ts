// Form validation utilities

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  min?: number
  max?: number
  email?: boolean
  custom?: (value: any) => string | undefined
}

export interface ValidationErrors {
  [key: string]: string
}

export function validateField(
  value: any,
  rules: ValidationRule
): string | undefined {
  if (rules.required && (!value || value.toString().trim() === '')) {
    return 'This field is required'
  }

  if (!value) return undefined

  if (rules.email && !isValidEmail(value)) {
    return 'Please enter a valid email address'
  }

  if (rules.minLength && value.length < rules.minLength) {
    return `Must be at least ${rules.minLength} characters`
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return `Must be no more than ${rules.maxLength} characters`
  }

  if (rules.min !== undefined && Number(value) < rules.min) {
    return `Must be at least ${rules.min}`
  }

  if (rules.max !== undefined && Number(value) > rules.max) {
    return `Must be no more than ${rules.max}`
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return 'Invalid format'
  }

  if (rules.custom) {
    return rules.custom(value)
  }

  return undefined
}

export function validateForm(
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): ValidationErrors {
  const errors: ValidationErrors = {}

  for (const [field, fieldRules] of Object.entries(rules)) {
    const error = validateField(data[field], fieldRules)
    if (error) {
      errors[field] = error
    }
  }

  return errors
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\(\)\+]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

export function isValidZipCode(zip: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(zip)
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d)
}
