"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function AuthModal() {
    const { isAuthModalOpen, setAuthModalOpen, login, register } = useStore()
    const [activeTab, setActiveTab] = useState<"login" | "register">("login")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    })

    const [registerData, setRegisterData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        full_name: "",
        role: "client" as "client" | "coach",
    })

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            await login(loginData.email, loginData.password)
            // Modal will close automatically via store
            setLoginData({ email: "", password: "" })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validation
        if (registerData.password !== registerData.confirmPassword) {
            setError("Passwords don't match")
            return
        }

        if (registerData.password.length < 8) {
            setError("Password must be at least 8 characters with uppercase, lowercase, and number")
            return
        }

        setIsLoading(true)

        try {
            await register({
                email: registerData.email,
                username: registerData.username,
                password: registerData.password,
                full_name: registerData.full_name || undefined,
                role: registerData.role,
            })
            // Modal will close automatically via store
            setRegisterData({
                email: "",
                username: "",
                password: "",
                confirmPassword: "",
                full_name: "",
                role: "client",
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setAuthModalOpen(false)
        setError(null)
        setActiveTab("login")
    }

    return (
        <Dialog open={isAuthModalOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Welcome to GymFuel</DialogTitle>
                    <DialogDescription>
                        Sign in to sync your meals and track your gains.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Sign In</TabsTrigger>
                        <TabsTrigger value="register">Sign Up</TabsTrigger>
                    </TabsList>

                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input
                                    id="login-email"
                                    type="email"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    placeholder="you@example.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="login-password">Password</Label>
                                <Input
                                    id="login-password"
                                    type="password"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>

                            <p className="text-sm text-gray-600 text-center">
                                Sync your data across devices.
                            </p>
                        </form>
                    </TabsContent>

                    <TabsContent value="register">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="register-email">Email</Label>
                                <Input
                                    id="register-email"
                                    type="email"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                    placeholder="you@example.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="register-username">Username</Label>
                                <Input
                                    id="register-username"
                                    type="text"
                                    value={registerData.username}
                                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                                    placeholder="johndoe"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="register-fullname">Full Name (optional)</Label>
                                <Input
                                    id="register-fullname"
                                    type="text"
                                    value={registerData.full_name}
                                    onChange={(e) => setRegisterData({ ...registerData, full_name: e.target.value })}
                                    placeholder="John Doe"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>I am a...</Label>
                                <RadioGroup
                                    value={registerData.role}
                                    onValueChange={(val) => setRegisterData({ ...registerData, role: val as "client" | "coach" })}
                                    className="flex space-x-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="client" id="role-client" />
                                        <Label htmlFor="role-client">Client</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="coach" id="role-coach" />
                                        <Label htmlFor="role-coach">Coach</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="register-password">Password</Label>
                                <Input
                                    id="register-password"
                                    type="password"
                                    value={registerData.password}
                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="register-confirm">Confirm Password</Label>
                                <Input
                                    id="register-confirm"
                                    type="password"
                                    value={registerData.confirmPassword}
                                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Account
                            </Button>

                            <p className="text-sm text-gray-600 text-center">
                                Existing meals will be synced.
                            </p>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
