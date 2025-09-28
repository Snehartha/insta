import React from 'react'

// Simple grouped bar chart without external deps
function BarChart({ series, labels, colors = ['#2563eb', '#f59e0b'] }) {
  const width = 800
  const height = 220
  const padding = 36
  const n = Math.max(0, series[0]?.length || series[1]?.length || 0)
  const allValues = series.flat()
  const maxVal = Math.max(1, ...allValues)

  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2
  const groupWidth = n ? innerWidth / n : 0
  const barGap = 6
  const barWidth = Math.max(6, (groupWidth - barGap) / series.length - barGap)

  const scaleY = (v) => innerHeight - (v * innerHeight) / maxVal

  const yTicks = 4
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((i * maxVal) / yTicks))

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart">
      <g transform={`translate(${padding}, ${padding})`}>
        {/* grid */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={0} y1={scaleY(t)} x2={innerWidth} y2={scaleY(t)} stroke="#e5e7eb" strokeWidth="1" />
            <text x={-28} y={scaleY(t) + 4} fontSize="10" fill="#6b7280">{t.toLocaleString()}</text>
          </g>
        ))}

        {/* bars */}
        {Array.from({ length: n }, (_, i) => (
          <g key={i} transform={`translate(${i * groupWidth}, 0)`}>
            {series.map((arr, idx) => {
              const v = arr[i] || 0
              const x = idx * (barWidth + barGap)
              const y = scaleY(v)
              const h = innerHeight - y
              return <rect key={idx} x={x} y={y} width={barWidth} height={h} fill={colors[idx % colors.length]} rx="2" />
            })}
          </g>
        ))}

        {/* legend */}
        <g transform={`translate(0, -14)`}>
          {labels.map((l, idx) => (
            <g key={idx} transform={`translate(${idx * 120}, 0)`}>
              <rect width="12" height="12" fill={colors[idx % colors.length]} rx="2" />
              <text x="16" y="10" fontSize="12" fill="#374151">{l}</text>
            </g>
          ))}
        </g>
      </g>
    </svg>
  )
}

export default function Analytics({ engagementSeries }) {
  const likes = engagementSeries.likes || []
  const comments = engagementSeries.comments || []
  if (!likes.length && !comments.length) return null

  return (
    <section>
      <h2>Engagement Breakdown</h2>
      <BarChart series={[likes, comments]} labels={["Likes", "Comments"]} />
    </section>
  )
}

