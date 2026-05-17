/* eslint-disable react-refresh/only-export-components */
import {
  ActivityBars,
  DistributionChart,
  FeatureChecklist,
  InsightCards,
  ModernTable,
  PerformanceAreaChart,
  StatGrid,
} from './SharedSections'

function StandardPage({ config }) {
  return (
    <div className="space-y-6">
      <StatGrid stats={config.stats} />
      <div className="grid gap-6 xl:grid-cols-3">
        <PerformanceAreaChart title={config.areaTitle} copy={config.areaCopy} data={config.areaData} />
        <DistributionChart title={config.pieTitle} copy={config.pieCopy} data={config.pieData} />
      </div>
      <InsightCards cards={config.insights} />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ModernTable title={config.tableTitle} copy={config.tableCopy} rows={config.tableRows} />
        <FeatureChecklist title={config.checklistTitle} items={config.checklist} />
      </div>
      <ActivityBars title={config.barTitle} copy={config.barCopy} data={config.barData} />
    </div>
  )
}

export function createStandardPage(config) {
  function WrappedPage() {
    return <StandardPage config={config} />
  }

  return WrappedPage
}
