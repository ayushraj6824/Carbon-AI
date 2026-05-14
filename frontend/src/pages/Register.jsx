import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { registerUser } from "../services/api"
import { useAuth } from "../context/AuthContext"

import {
  LeafIcon,
  AlertTriangleIcon,
  Loader2Icon,
  RocketIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters")
    }

    setLoading(true)

    try {
      const { data } = await registerUser(form)
      login(data.token, data.user)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/50 shadow-xl pb-4">
        <CardHeader className="space-y-4 text-center">
          <Link
            to="/"
            className="mx-auto flex size-14 items-center justify-center rounded-2xl text-white shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #00d4aa 0%, #00b896 100%)",
            }}
          >
            <LeafIcon className="size-7" />
          </Link>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Create Account
            </h1>

            <p className="text-sm text-muted-foreground">
              Join Carbon AI Validation System
            </p>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-5">
              <AlertTriangleIcon className="size-4" />

              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="reg-name">
                Full Name
              </Label>

              <Input
                id="reg-name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email">
                Email Address
              </Label>

              <Input
                id="reg-email"
                type="email"
                name="email"
                placeholder="company@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password">
                Password
              </Label>

              <div className="relative">
                <Input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <RocketIcon className="mr-2 size-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
