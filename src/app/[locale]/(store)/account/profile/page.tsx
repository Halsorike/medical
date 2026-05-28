"use client";

import { type FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const notificationRows = [
  { label: "Order updates by email", defaultChecked: true },
  { label: "Promotional offers", defaultChecked: false },
  { label: "SMS notifications", defaultChecked: true },
  { label: "Newsletter", defaultChecked: false },
];

export default function Profile() {
  const [saved, setSaved] = useState(false);

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  }

  function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert("Password updated (mock)");
  }

  function savePreferences(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Profile settings</h1>
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <form onSubmit={saveProfile} className="space-y-4 rounded-lg border bg-white p-6">
            {saved ? (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <span>Profile updated successfully</span>
              </div>
            ) : null}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" defaultValue="Alex" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" defaultValue="Demo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="alex@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue="+1 555 010 1234" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-of-birth">Date of birth</Label>
                <Input id="date-of-birth" type="date" />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select defaultValue="prefer-not">
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={3} placeholder="Tell us a little about yourself" />
            </div>
            <Button type="submit" variant="gradient">
              Save changes
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="security">
          <form onSubmit={updatePassword} className="max-w-xl space-y-4 rounded-lg border bg-white p-6">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button type="submit" variant="gradient">
              Update password
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="notifications">
          <form onSubmit={savePreferences} className="max-w-xl space-y-4 rounded-lg border bg-white p-6">
            <div className="space-y-3">
              {notificationRows.map((row) => (
                <label key={row.label} className="flex items-center justify-between rounded-md border p-3 text-sm">
                  <span>{row.label}</span>
                  <input type="checkbox" defaultChecked={row.defaultChecked} className="h-4 w-4" />
                </label>
              ))}
            </div>
            <Button type="submit" variant="gradient">
              Save preferences
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
