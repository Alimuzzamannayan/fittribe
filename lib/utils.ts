import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmt(n: number, decimals = 1) {
  return Number(n.toFixed(decimals))
}

export function nextMeasurementDate(recordedAt: Date): Date {
  const d = new Date(recordedAt)
  d.setDate(d.getDate() + 30)
  return d
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

export function countdown(target: Date): {
  days: number; hours: number; minutes: number; seconds: number
} {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor(diff % 86400000 / 3600000),
    minutes: Math.floor(diff % 3600000  / 60000),
    seconds: Math.floor(diff % 60000    / 1000),
  }
}
