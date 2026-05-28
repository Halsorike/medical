"use client";

import { type FormEvent, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Address = {
  id: number;
  label: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  default: boolean;
};

type AddressDraft = Omit<Address, "id" | "default">;

const initialAddresses: Address[] = [
  { id: 1, label: "Home", name: "Alex Demo", line1: "1 Health St", line2: "Apt 4B", city: "Boston", state: "MA", zip: "02115", country: "US", default: true },
  { id: 2, label: "Work", name: "Alex Demo", line1: "450 Main St", line2: "", city: "Cambridge", state: "MA", zip: "02139", country: "US", default: false },
];

const emptyDraft: AddressDraft = {
  label: "",
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
};

const fields: Array<{ key: keyof AddressDraft; label: string }> = [
  { key: "label", label: "Label" },
  { key: "name", label: "Full name" },
  { key: "line1", label: "Address line 1" },
  { key: "line2", label: "Address line 2" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "zip", label: "ZIP" },
  { key: "country", label: "Country" },
];

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [draft, setDraft] = useState<AddressDraft>(emptyDraft);

  function startAdd() {
    setDraft(emptyDraft);
    setEditId(null);
    setShowForm(true);
  }

  function startEdit(address: Address) {
    const { id, default: isDefault, ...editable } = address;
    void isDefault;
    setDraft(editable);
    setEditId(id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditId(null);
    setDraft(emptyDraft);
  }

  function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editId) {
      setAddresses((items) => items.map((item) => (item.id === editId ? { ...item, ...draft } : item)));
    } else {
      setAddresses((items) => [...items, { id: Date.now(), ...draft, default: items.length === 0 }]);
    }
    closeForm();
  }

  function deleteAddress(id: number) {
    setAddresses((items) => items.filter((item) => item.id !== id));
  }

  function setDefaultAddress(id: number) {
    setAddresses((items) => items.map((item) => ({ ...item, default: item.id === id })));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Saved Addresses</h1>
        <Button variant="gradient" onClick={startAdd}>
          Add new address
        </Button>
      </div>

      {showForm ? (
        <form onSubmit={saveAddress} className="space-y-4 rounded-lg border bg-white p-5">
          <h2 className="text-lg font-semibold">{editId ? "Edit address" : "Add address"}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input
                  id={field.key}
                  value={draft[field.key]}
                  onChange={(event) => setDraft((current) => ({ ...current, [field.key]: event.target.value }))}
                  required={field.key !== "line2"}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Save
            </Button>
          </div>
        </form>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <div key={address.id} className="rounded-lg border bg-white p-4">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="outline">{address.label}</Badge>
              {address.default ? <Badge variant="success">Default</Badge> : null}
              <div className="flex-1" />
              <Button type="button" size="icon" variant="ghost" onClick={() => startEdit(address)} aria-label={`Edit ${address.label} address`}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost" onClick={() => deleteAddress(address.id)} aria-label={`Delete ${address.label} address`}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{address.name}</p>
              <p>{address.line1}</p>
              {address.line2 ? <p>{address.line2}</p> : null}
              <p>
                {address.city}, {address.state} {address.zip}
              </p>
              <p>{address.country}</p>
            </div>
            {!address.default ? (
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => setDefaultAddress(address.id)}>
                Set as default
              </Button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
