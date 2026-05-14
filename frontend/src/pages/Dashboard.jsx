import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

import { validateClaim } from "../services/api"
import { useAuth } from "../context/AuthContext"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  BotIcon, 
  LeafIcon, 
  RadioIcon, 
  FileTextIcon, 
  Loader2Icon, 
  ZapIcon, 
  BarChart3Icon 
} from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const SECTORS = [
  "Manufacturing",
  "Energy",
  "Transportation",
  "Agriculture",
  "Construction",
  "Technology",
  "Logistics",
  "Retail",
]

const SUB_SECTORS = {
  Manufacturing: [
    "Steel Manufacturing",
    "Cement",
    "Textile",
    "Automotive",
    "Electronics",
  ],
  Energy: ["Solar", "Wind", "Thermal", "Hydro", "Nuclear"],
  Transportation: ["Logistics", "EV Fleet", "Aviation", "Maritime"],
  Agriculture: [
    "Crop Farming",
    "Livestock",
    "Forestry",
    "Fertilizer Production",
  ],
  Construction: [
    "Residential",
    "Commercial",
    "Infrastructure",
    "Material Production",
  ],
  Technology: [
    "Data Centers",
    "Software Services",
    "Hardware Manufacturing",
    "Telecom",
  ],
  Logistics: [
    "Warehousing",
    "Freight Forwarding",
    "Last-mile Delivery",
    "Cold Chain",
  ],
  Retail: [
    "E-commerce",
    "Supermarkets",
    "Apparel",
    "Electronics Retail",
  ],
}

const MODES = ["Truck", "Air", "Ship", "Rail"]

const STRATEGIES = [
  "Energy Efficiency",
  "Renewable Switch",
  "Carbon Offset",
  "Process Reengineering",
  "Efficiency Upgrade",
  "Carbon Tax Compliance",
]

const INIT = {
  sector: "Manufacturing",
  industrySector: SUB_SECTORS["Manufacturing"][0],
  energyConsumption: "",
  renewableEnergy: "",
  nonRenewableEnergy: "",
  productionOutput: "",
  rawMaterialUsage: "",
  transportDistance: "",
  transportMode: "Truck",
  processEfficiency: "",
  carbonReductionStrategy: "Energy Efficiency",
  claimedEmission: "",
}

export default function Dashboard() {
  const { user, saveResult } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(INIT)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [chartData, setChartData] = useState(null)

  const updateField = (name, value) => {
    if (name === "sector") {
      setForm((prev) => ({
        ...prev,
        sector: value,
        industrySector: SUB_SECTORS[value][0],
      }))
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setLoading(true)

    try {
      const { data } = await validateClaim(form)

      saveResult({ ...data, form })

      setChartData({
        energy: [
          {
            name: "Renewable",
            value: parseFloat(form.renewableEnergy) || 0,
          },
          {
            name: "Non-Renewable",
            value: parseFloat(form.nonRenewableEnergy) || 0,
          },
        ],
        emission: [
          {
            name: "Claimed",
            value: parseFloat(form.claimedEmission) || 0,
          },
          {
            name: "Predicted",
            value: parseFloat(data.predictedEmission) || 0,
          },
        ],
      })

      navigate("/result")
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Validation failed. Check that all services are running."
      )
    } finally {
      setLoading(false)
    }
  }

  const energyChartConfig = {
    Renewable: { label: 'Renewable', color: 'hsl(var(--chart-1))' },
    NonRenewable: { label: 'Non-Renewable', color: 'hsl(var(--chart-2))' },
  }

  const emissionChartConfig = {
    Claimed: { label: 'Claimed', color: 'hsl(var(--chart-1))' },
    Predicted: { label: 'Predicted', color: 'hsl(var(--chart-2))' },
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Carbon Claim Dashboard
        </h1>

        <p className="text-muted-foreground mt-2">
          Welcome,{" "}
          <span className="font-medium text-primary">
            {user?.name}
          </span>{" "}
          — submit operational data to validate your carbon credit claim.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: <BotIcon className="size-6 text-primary" />,
            label: "AI Model",
            value: "Active",
            sub: "Isolation Forest",
          },
          {
            icon: <LeafIcon className="size-6 text-primary" />,
            label: "Algorithm",
            value: "IsoForest",
            sub: "Anomaly Detection",
          },
          {
            icon: <RadioIcon className="size-6 text-primary" />,
            label: "ML Status",
            value: "Online",
            sub: "Flask :5001",
          },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                {item.icon}

                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </p>

                  <CardTitle className="text-lg">
                    {item.value}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-primary">{item.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="size-5" /> Carbon Credit Claim Form
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Sector */}
              <div className="space-y-2">
                <Label>Sector</Label>

                <Select
                  value={form.sector}
                  onValueChange={(value) =>
                    updateField("sector", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {SECTORS.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sub Sector */}
              <div className="space-y-2">
                <Label>Industry Sub-Sector</Label>

                <Select
                  value={form.industrySector}
                  onValueChange={(value) =>
                    updateField("industrySector", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {SUB_SECTORS[form.sector]?.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Inputs */}
              {[
                {
                  label: "Total Energy Consumed (kWh)",
                  name: "energyConsumption",
                  placeholder: "150000",
                },
                {
                  label: "Renewable Energy (kWh)",
                  name: "renewableEnergy",
                  placeholder: "60000",
                },
                {
                  label: "Non-Renewable Energy (kWh)",
                  name: "nonRenewableEnergy",
                  placeholder: "90000",
                },
                {
                  label: "Production Output (units)",
                  name: "productionOutput",
                  placeholder: "5000",
                },
                {
                  label: "Raw Material Usage (kg)",
                  name: "rawMaterialUsage",
                  placeholder: "45000",
                },
                {
                  label: "Transport Distance (km)",
                  name: "transportDistance",
                  placeholder: "2500",
                },
                {
                  label: "Process Efficiency (%)",
                  name: "processEfficiency",
                  placeholder: "78",
                },
                {
                  label: "Claimed Emissions (tCO2e)",
                  name: "claimedEmission",
                  placeholder: "28.5",
                  step: "0.01",
                },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label>{field.label}</Label>

                  <Input
                    type="number"
                    name={field.name}
                    value={form[field.name]}
                    placeholder={field.placeholder}
                    onChange={(e) =>
                      updateField(field.name, e.target.value)
                    }
                    min="0"
                    step={field.step || "1"}
                    required
                  />
                </div>
              ))}

              {/* Transport Mode */}
              <div className="space-y-2">
                <Label>Transport Mode</Label>

                <Select
                  value={form.transportMode}
                  onValueChange={(value) =>
                    updateField("transportMode", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {MODES.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Strategy */}
              <div className="space-y-2">
                <Label>Carbon Reduction Strategy</Label>

                <Select
                  value={form.carbonReductionStrategy}
                  onValueChange={(value) =>
                    updateField(
                      "carbonReductionStrategy",
                      value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {STRATEGIES.map((strategy) => (
                      <SelectItem
                        key={strategy}
                        value={strategy}
                      >
                        {strategy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Running AI Validation...
                </>
              ) : (
                <>
                  <BotIcon className="mr-2 h-4 w-4" />
                  Validate Carbon Credit Claim
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Charts */}
      {chartData && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Energy Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ZapIcon className="size-5" /> Energy Breakdown
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ChartContainer config={energyChartConfig} className="h-[250px] w-full">
                <BarChart accessibilityLayer data={chartData.energy}>
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
                    defaultIndex={1}
                  />
                  <Bar dataKey="value" radius={8}>
                    <Cell fill="hsl(var(--chart-1))" />
                    <Cell fill="hsl(var(--chart-2))" />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Emission Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3Icon className="size-5" /> Emission Comparison
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ChartContainer config={emissionChartConfig} className="h-[250px] w-full">
                <BarChart accessibilityLayer data={chartData.emission}>
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
                    defaultIndex={1}
                  />
                  <Bar dataKey="value" radius={8}>
                    <Cell fill="hsl(var(--chart-1))" />
                    <Cell fill="hsl(var(--chart-2))" />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}