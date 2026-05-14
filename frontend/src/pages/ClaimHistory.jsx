"use client"

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Legend,
  BarChart, Bar, CartesianGrid, XAxis,
} from 'recharts'
import {
  PackageIcon, CheckCircle2Icon, AlertCircleIcon,
  GlobeIcon, ClipboardListIcon, Loader2Icon,
  AlertTriangleIcon, InboxIcon, Trash2Icon, BarChart3Icon,
  TrendingUpIcon,
} from 'lucide-react'
import { getHistory, deleteClaim } from '../services/api'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

const fmt = (n) => (n == null ? '—' : Number(n).toFixed(4))
const fmtPct = (n) => (n == null ? '—' : Number(n).toFixed(1) + '%')

const statusVariant = (status) => {
  if (status === 'VERIFIED') return 'default'
  if (status === 'SUSPICIOUS') return 'destructive'
  return 'secondary'
}

const HOVER_CARD = "transition-all duration-200 hover:bg-muted/50 hover:shadow-md hover:ring-1 hover:ring-border"

const barChartConfig = {
  Claimed: { label: 'Claimed', color: 'hsl(var(--chart-3))' },
  Predicted: { label: 'Predicted', color: 'hsl(var(--chart-1))' },
}

export default function ClaimHistory() {
  const navigate = useNavigate()
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchHistory() }, [])

  const fetchHistory = () => {
    setLoading(true)
    getHistory()
      .then(({ data }) => setClaims(data))
      .catch(() => setError('Failed to load history.'))
      .finally(() => setLoading(false))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this claim?')) return
    try {
      await deleteClaim(id)
      setClaims(claims.filter(c => c._id !== id))
    } catch {
      alert('Failed to delete claim')
    }
  }

  const recentCompareData = claims.slice(0, 5).map((c, i) => ({
    name: new Date(c.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) + (i > 0 ? ` (${i})` : ''),
    Claimed: c.claimedEmission || 0,
    Predicted: c.predictedEmission || 0,
  })).reverse()

  const sectorData = Object.entries(
    claims.reduce((acc, c) => {
      acc[c.sector] = (acc[c.sector] || 0) + (c.claimedEmission || 0)
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))

  const stats = {
    total: claims.length,
    verified: claims.filter(c => c.status === 'VERIFIED').length,
    suspicious: claims.filter(c => c.status === 'SUSPICIOUS').length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Claim History</h1>
        <p className="text-sm text-muted-foreground">
          All your submitted carbon credit claims and their validation results.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <PackageIcon className="size-4 text-emerald-400" />, label: 'Total Claims', value: stats.total, valueClass: 'text-emerald-400' },
          { icon: <CheckCircle2Icon className="size-4 text-green-400" />, label: 'Verified', value: stats.verified, valueClass: 'text-green-400' },
          { icon: <AlertCircleIcon className="size-4 text-red-400" />, label: 'Suspicious', value: stats.suspicious, valueClass: 'text-red-400' },
        ].map(s => (
          <Card key={s.label} className={HOVER_CARD}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                {s.icon}
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </span>
              </div>
              <p className={`text-4xl font-extrabold ${s.valueClass}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pie + Table row */}
      <div className={`grid gap-6 ${sectorData.length ? 'grid-cols-1 lg:grid-cols-[320px_1fr]' : 'grid-cols-1'}`}>
        {sectorData.length > 0 && (
          <Card className={HOVER_CARD}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <GlobeIcon className="size-4" /> Sector-wise Emissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[280px] w-full">
                <PieChart>
                  <Pie
                    data={sectorData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    outerRadius={90} innerRadius={50}
                    paddingAngle={3}
                  >
                    {sectorData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={(v) => [`${v} tCO₂e`]} />}
                  />
                  <Legend
                    formatter={(v) => (
                      <span className="text-xs text-muted-foreground">{v}</span>
                    )}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Claims table */}
        <Card className={HOVER_CARD}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardListIcon className="size-4" /> Claims Table
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
                <Loader2Icon className="size-6 animate-spin" />
                <span className="text-sm">Loading history…</span>
              </div>
            )}
            {error && (
              <div className="flex flex-col items-center gap-2 py-8 text-destructive">
                <AlertTriangleIcon className="size-6" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            {!loading && !error && claims.length === 0 && (
              <div className="flex flex-col items-center py-12 text-muted-foreground">
                <InboxIcon className="size-12 mb-3" />
                <p className="text-sm mb-4">No claims submitted yet.</p>
                <Button onClick={() => navigate('/dashboard')}>Submit First Claim</Button>
              </div>
            )}
            {!loading && claims.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Claimed (tCO₂e)</TableHead>
                      <TableHead>Predicted (tCO₂e)</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claims.map(c => (
                      <TableRow key={c._id}>
                        <TableCell className="text-sm">
                          {new Date(c.createdAt).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell className="text-sm">{c.sector}</TableCell>
                        <TableCell className="text-sm font-mono">{fmt(c.claimedEmission)}</TableCell>
                        <TableCell className="text-sm font-mono">{fmt(c.predictedEmission)}</TableCell>
                        <TableCell className="text-sm font-mono">{fmtPct(c.confidenceScore)}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(c.status)} className="text-xs">
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(c._id)}
                            title="Delete Claim"
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bar chart */}
      {claims.length > 0 && (
        <Card className={HOVER_CARD}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3Icon className="size-4" /> Claimed vs Predicted
            </CardTitle>
            <CardDescription>Latest 5 claims comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={recentCompareData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.split(' ')[0]}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="Claimed" fill="var(--color-Claimed)" radius={4} />
                <Bar dataKey="Predicted" fill="var(--color-Predicted)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              Emissions comparison across recent submissions
              <TrendingUpIcon className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing the last 5 submitted claims
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}