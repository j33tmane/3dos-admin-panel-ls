"use client"

import * as React from "react"
import { SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AccountPage() {
  const [isSavingProfile, setIsSavingProfile] = React.useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false)

  return (
    <SidebarInset>
      <DashboardHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-8">
          <h1 className="text-2xl font-bold mb-6">Account</h1>

          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {/* Username */}
            <Card>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setIsSavingProfile(true)
                  const timeout = setTimeout(() => setIsSavingProfile(false), 900)
                  // Note: UI only. Replace with real submit call.
                  return () => clearTimeout(timeout)
                }}
              >
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Update your username.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" placeholder="Enter username" autoComplete="username" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSavingProfile} className="mt-2">
                    {isSavingProfile ? "Saving..." : "Save changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Password */}
            <Card>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setIsUpdatingPassword(true)
                  const timeout = setTimeout(() => setIsUpdatingPassword(false), 900)
                  // Note: UI only. Replace with real submit call.
                  return () => clearTimeout(timeout)
                }}
              >
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your account password.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" placeholder="••••••••" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" placeholder="••••••••" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm new password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" placeholder="••••••••" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isUpdatingPassword} className="mt-2">
                    {isUpdatingPassword ? "Updating..." : "Update password"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}