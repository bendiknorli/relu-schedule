import { useState, useEffect } from 'react'
import ScheduleGrid from './components/ScheduleGrid'
import { fetchScheduleData } from './api'
import type { ProcessedScheduleEntry } from './types'
import './App.css'

function App() {
  const [scheduleData, setScheduleData] = useState<ProcessedScheduleEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadScheduleData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchScheduleData()
        setScheduleData(data)
      } catch (err) {
        console.error('Failed to load schedule data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load schedule data')
        // Still show mock data on error
        const mockData = await fetchScheduleData()
        setScheduleData(mockData)
      } finally {
        setLoading(false)
      }
    }

    loadScheduleData()
  }, [])

  return (
    <div className="app">
      <ScheduleGrid 
        entries={scheduleData} 
        loading={loading} 
        error={error} 
      />
    </div>
  )
}

export default App
