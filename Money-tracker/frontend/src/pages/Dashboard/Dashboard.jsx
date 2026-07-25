import { useEffect, useState } from 'react'
import CanvasJSReact from '@canvasjs/react-charts'
import './Dashboard.css'

const CanvasJSChart = CanvasJSReact.CanvasJSChart

function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const getTransactions = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/transaction_list`
        const response = await fetch(url, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data = await response.json()
        setTransactions(data)
        
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          console.error('Unable to load dashboard data:', requestError)
          setError('Unable to load dashboard data. Please try again later.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    getTransactions()

    return () => controller.abort()
  }, [])

  const expenses = transactions.filter(transaction => transaction.price < 0)
  const dataPoints = expenses.map((expense, index) => ({
    label: expense.desc || `Expense ${index + 1}`,
    y: Math.abs(expense.price),
  }))

  const monthlyBalanceMap = transactions.reduce((months, transaction) => {
    const transactionDate = new Date(transaction.date)
    const price = Number(transaction.price)

    if (Number.isNaN(transactionDate.getTime()) || Number.isNaN(price)) {
      return months
    }

    const year = transactionDate.getFullYear()
    const month = transactionDate.getMonth()
    const key = `${year}-${month}`
    const currentMonth = months.get(key) || {
      x: new Date(year, month, 1),
      y: 0,
    }

    currentMonth.y += price
    months.set(key, currentMonth)
    return months
  }, new Map())

  const monthlyBalances = [...monthlyBalanceMap.values()]
    .sort((first, second) => first.x - second.x)
    .map(month => ({
      ...month,
      color: month.y >= 0 ? '#2ecc71' : '#e74c3c',
    }))

  const expenseChartOptions = {
    animationEnabled: true,
    backgroundColor: 'transparent',
    theme: 'dark2',
    title: {
      text: 'All Expenses',
      fontColor: '#ffffff',
      fontSize: 34,
      fontWeight: 'bold',
      margin: 16,
    },
    subtitles: [{
      text: `${expenses.length} expense${expenses.length === 1 ? '' : 's'}`,
      fontColor: '#dddddd',
      fontSize: 18,
    }],
    legend: {
      fontColor: '#dddddd',
      fontSize: 16,
      verticalAlign: 'bottom',
      horizontalAlign: 'center',
    },
    data: [{
      type: 'pie',
      radius: '75%',
      showInLegend: true,
      legendText: '{label}',
      indexLabel: '{label}: RM {y}',
      indexLabelFontSize: 16,
      indexLabelFontColor: '#ffffff',
      yValueFormatString: '#,##0.00',
      toolTipContent: '{label}: RM {y}',
      dataPoints,
    }],
  }

  const balanceChartOptions = {
    animationEnabled: true,
    backgroundColor: 'transparent',
    theme: 'dark2',
    title: {
      text: 'Monthly Balance',
      fontColor: '#ffffff',
      fontSize: 34,
      fontWeight: 'bold',
      margin: 16,
    },
    subtitles: [{
      text: 'Income minus expenses for each month',
      fontColor: '#dddddd',
      fontSize: 18,
    }],
    axisX: {
      intervalType: 'month',
      valueFormatString: 'MMM YYYY',
      labelFontColor: '#dddddd',
      labelFontSize: 14,
      labelAngle: -35,
    },
    axisY: {
      prefix: 'RM ',
      includeZero: true,
      gridColor: '#555663',
      labelFontColor: '#dddddd',
      labelFontSize: 14,
    },
    toolTip: {
      shared: false,
    },
    data: [{
      type: 'column',
      yValueFormatString: 'RM #,##0.00',
      toolTipContent: '{x}: {y}',
      dataPoints: monthlyBalances,
    }],
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-charts">
      <section className="chart-card" aria-label="Expense breakdown">
        {isLoading && <p className="dashboard-message">Loading expenses...</p>}
        {error && <p className="dashboard-message dashboard-error">{error}</p>}
        {!isLoading && !error && expenses.length === 0 && (
          <p className="dashboard-message">No expenses have been recorded yet.</p>
        )}
        {!isLoading && !error && expenses.length > 0 && (
          <CanvasJSChart
            options={expenseChartOptions}
            containerProps={{ width: '100%', height: '500px' }}
          />
        )}
      </section>

      <section className="chart-card" aria-label="Monthly balance">
        {isLoading && <p className="dashboard-message">Loading monthly balances...</p>}
        {error && <p className="dashboard-message dashboard-error">{error}</p>}
        {!isLoading && !error && monthlyBalances.length === 0 && (
          <p className="dashboard-message">No transactions have been recorded yet.</p>
        )}
        {!isLoading && !error && monthlyBalances.length > 0 && (
          <CanvasJSChart
            options={balanceChartOptions}
            containerProps={{ width: '100%', height: '500px' }}
          />
        )}
      </section>
      </div>
    </main>
  )
}

export default Dashboard
