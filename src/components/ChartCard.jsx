// src/components/ChartCard.jsx
const ChartCard = ({ title, type }) => {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      {type === 'bar' ? (
        <div className="chart-placeholder">
          <span>Interactive Chart Area</span>
        </div>
      ) : (
        <div className="donut-chart"></div>
      )}
    </div>
  )
}

export default ChartCard