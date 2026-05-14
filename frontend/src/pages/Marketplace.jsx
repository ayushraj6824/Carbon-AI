import { 
  SunIcon, 
  WindIcon, 
  TreeDeciduousIcon, 
  FactoryIcon, 
  CarIcon, 
  FlaskConicalIcon, 
  PackageIcon, 
  CircleDollarSignIcon, 
  GlobeIcon, 
  CheckCircle2Icon,
  ArrowRightIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const LISTINGS = [
  { id: 1, type: 'Solar RECs', amount: '500 credits', price: '$18 / credit', seller: 'SunPower Ltd', sector: 'Energy', badge: <SunIcon className="size-8 text-yellow-400" /> },
  { id: 2, type: 'Wind Energy', amount: '300 credits', price: '$21 / credit', seller: 'AirFlow Corp', sector: 'Energy', badge: <WindIcon className="size-8 text-blue-400" /> },
  { id: 3, type: 'Reforestation', amount: '1200 credits', price: '$14 / credit', seller: 'GreenEarth NGO', sector: 'Agriculture', badge: <TreeDeciduousIcon className="size-8 text-emerald-400" /> },
  { id: 4, type: 'Carbon Capture', amount: '200 credits', price: '$35 / credit', seller: 'CarbonX Tech', sector: 'Technology', badge: <FactoryIcon className="size-8 text-slate-400" /> },
  { id: 5, type: 'EV Fleet Offset', amount: '750 credits', price: '$22 / credit', seller: 'GreenMove Inc', sector: 'Transportation', badge: <CarIcon className="size-8 text-indigo-400" /> },
  { id: 6, type: 'Biogas Credits', amount: '400 credits', price: '$19 / credit', seller: 'BioFuel Co', sector: 'Manufacturing', badge: <FlaskConicalIcon className="size-8 text-orange-400" /> },
]

const STATS = [
  { label: 'Total Volume', value: '3,350 Credits', icon: <PackageIcon className="size-5 text-muted-foreground" /> },
  { label: 'Avg Price', value: '$21.50 / credit', icon: <CircleDollarSignIcon className="size-5 text-muted-foreground" /> },
  { label: 'Sectors', value: '6 Active', icon: <GlobeIcon className="size-5 text-muted-foreground" /> },
  { label: 'Sellers', value: '6 Verified', icon: <CheckCircle2Icon className="size-5 text-muted-foreground" /> },
]

export default function Marketplace() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Carbon Marketplace</h1>
        <p className="text-sm text-muted-foreground">
          Browse and trade verified carbon credits from trusted issuers.
        </p>
      </div>

      {/* Stats bar */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-8">
            {STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                {s.icon}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="font-bold">{s.value}</p>
                </div>
                {i < STATS.length - 1 && (
                  <Separator orientation="vertical" className="ml-8 h-8 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Listings grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {LISTINGS.map(l => (
          <Card key={l.id} className="flex flex-col hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                {l.badge}
                <Badge variant="secondary">{l.sector}</Badge>
              </div>
              <div className="space-y-0.5 pt-1">
                <h3 className="font-bold text-lg leading-tight">{l.type}</h3>
                <p className="text-sm text-muted-foreground">{l.seller}</p>
              </div>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
              <Separator className="mb-4" />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Available</p>
                  <p className="font-semibold text-sm">{l.amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-0.5">Price</p>
                  <p className="font-bold text-sm text-primary">{l.price}</p>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                Purchase Credits <ArrowRightIcon className="size-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Footer note */}
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Verified carbon credit listings for demonstration purposes.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}