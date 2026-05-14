import { useNavigate } from "react-router-dom"
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Cell,
} from "recharts"

import {
  MicroscopeIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  TargetIcon,
  ClipboardListIcon,
  LightbulbIcon,
  BarChart3Icon,
  SearchIcon,
  RotateCcwIcon,
  HistoryIcon,
  ArrowLeftIcon,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

import { useAuth } from "../context/AuthContext"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const MetricCard = ({
  icon,
  label,
  value,
  sub,
  color,
}) => (
  <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
    <CardContent className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="text-muted-foreground">{icon}</div>

        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
      </div>

      <div
        className="text-3xl font-bold tracking-tight"
        style={{ color }}
      >
        {value}
      </div>

      {sub && (
        <p className="mt-2 text-xs text-muted-foreground">
          {sub}
        </p>
      )}
    </CardContent>
  </Card>
)

export default function ValidationResult() {
  const { lastResult } = useAuth()
  const navigate = useNavigate()

  if (!lastResult) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-in fade-in-0">
        <div className="mb-5 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <MicroscopeIcon className="size-12 text-muted-foreground" />
        </div>

        <h2 className="text-3xl font-bold tracking-tight">
          No Result Yet
        </h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Submit a claim from the dashboard first.
        </p>

        <Button
          className="mt-6 gap-2"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeftIcon className="size-4" />
          Go to Dashboard
        </Button>
      </div>
    )
  }

  const {
    predictedEmission,
    anomalyScore,
    confidenceScore,
    fraudRiskLevel,
    status,
    form,
  } = lastResult

  const isVerified = status === "VERIFIED"

  const accentColor = isVerified
    ? "hsl(142 76% 55%)"
    : "hsl(0 84% 67%)"

  const emissionData = [
    {
      name: "Claimed",
      value: parseFloat(form?.claimedEmission) || 0,
      fill: "hsl(var(--chart-1))",
    },
    {
      name: "Predicted",
      value: parseFloat(predictedEmission) || 0,
      fill: "hsl(var(--chart-2))",
    },
  ]

  const barChartConfig = {
    Claimed: {
      label: "Claimed",
      color: "hsl(var(--chart-1))",
    },
    Predicted: {
      label: "Predicted",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Validation Result
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            AI-powered anomaly detection analysis
          </p>
        </div>
      </div>

      {/* Status */}
      <Card
        className={`border transition-colors ${isVerified
          ? "border-green-500/30 bg-green-500/10"
          : "border-red-500/30 bg-red-500/10"
          }`}
      >
        <CardContent className="flex flex-col gap-6 p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <div className="mt-1">
              {isVerified ? (
                <CheckCircle2Icon className="size-12 text-green-400" />
              ) : (
                <AlertCircleIcon className="size-12 text-red-400" />
              )}
            </div>

            <div>
              <div
                className="mb-2 text-xs font-bold uppercase tracking-[0.18em]"
                style={{ color: accentColor }}
              >
                Claim Status
              </div>

              <div
                className="text-4xl font-black tracking-tight"
                style={{ color: accentColor }}
              >
                {status}
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {isVerified
                  ? "Claim is consistent with predicted emissions and falls within the expected operational range."
                  : "Anomaly detected. Submitted claim deviates significantly from the machine learning prediction."}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Fraud Risk Level
            </p>

            <div
              className={`inline-flex items-center rounded-xl border px-4 py-2 text-lg font-bold ${fraudRiskLevel === "Low"
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : fraudRiskLevel === "Medium"
                    ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                    : "border-red-500/30 bg-red-500/10 text-red-400"
                }`}
            >
              {fraudRiskLevel} Risk
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<TargetIcon className="size-5" />}
          label="Predicted Emission"
          value={`${(
            parseFloat(predictedEmission) || 0
          ).toFixed(2)} tCO₂e`}
          sub="ML Regression"
          color="hsl(var(--primary))"
        />

        <MetricCard
          icon={<ClipboardListIcon className="size-5" />}
          label="Claimed Emission"
          value={`${(
            parseFloat(form?.claimedEmission) || 0
          ).toFixed(2)} tCO₂e`}
          sub="Company reported"
          color="hsl(var(--primary))"
        />

        <MetricCard
          icon={<MicroscopeIcon className="size-5" />}
          label="Anomaly Score"
          value={`${(
            (parseFloat(anomalyScore) || 0) * 100
          ).toFixed(1)}%`}
          sub="Isolation Forest"
          color="hsl(var(--primary))"
        />

        <MetricCard
          icon={<LightbulbIcon className="size-5" />}
          label="Confidence Score"
          value={`${(
            parseFloat(confidenceScore) || 0
          ).toFixed(1)}%`}
          sub="Model confidence"
          color="hsl(var(--primary))"
        />
      </div>

      {/* Chart */}
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <BarChart3Icon className="size-5" />
            Claimed vs Predicted Emission
          </CardTitle>

          <CardDescription className="text-center">
            Comparison between submitted and ML-predicted values
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ChartContainer
            config={barChartConfig}
            className="h-[320px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={emissionData}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />

              <Bar
                dataKey="value"
                radius={10}
              >
                {emissionData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.fill}
                  />
                ))}
              </Bar>
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SearchIcon className="size-5" />
            Submission Details
          </CardTitle>

          <CardDescription>
            Operational and emission-related metadata
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-xl border border-border/50">
            <Table>
              <TableBody>
                {[
                  ["Sector", form?.sector],
                  ["Industry", form?.industrySector || "—"],
                  ["Transport Mode", form?.transportMode],
                  [
                    "Transport Distance",
                    `${parseFloat(
                      form?.transportDistance
                    )?.toLocaleString()} km`,
                  ],
                  [
                    "Process Efficiency",
                    `${form?.processEfficiency}%`,
                  ],
                  [
                    "Strategy",
                    form?.carbonReductionStrategy,
                  ],
                ].map(([key, value]) => (
                  <TableRow
                    key={key}
                    className="hover:bg-muted/20"
                  >
                    <TableCell className="w-[35%] bg-muted/20 font-medium text-muted-foreground">
                      {key}
                    </TableCell>

                    <TableCell className="font-medium">
                      {value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap gap-3 pt-6">
            <Button
              className="gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <RotateCcwIcon className="size-4" />
              New Claim
            </Button>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate("/history")}
            >
              <HistoryIcon className="size-4" />
              View History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}