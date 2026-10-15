import { useEffect, useState } from 'react'

const timeFormat = new Intl.DateTimeFormat('pt-PT', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

const dateFormat = new Intl.DateTimeFormat('pt-PT', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="text-center">
      <div className="display-3 fw-semibold font-monospace">
        {timeFormat.format(now)}
      </div>
      <div className="fs-5 text-body-secondary text-capitalize">
        {dateFormat.format(now)}
      </div>
    </div>
  )
}

export default Clock
