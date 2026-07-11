"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

type VehicleStatus = "Available" | "Booked" | "In Service" | "Maintenance";
type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric";

type Vehicle = {
  id: number;
  model: string;
  registration: string;
  year: number;
  colour: string;
  fuelType: FuelType;
  fuelLevel: number;
  odometer: number;
  status: VehicleStatus;
};

type VehicleFormState = {
  model: string;
  registration: string;
  year: string;
  colour: string;
  fuelType: FuelType;
  fuelLevel: string;
  odometer: string;
  status: VehicleStatus;
};

const initialVehicles: Vehicle[] = [
  {
    id: 1,
    model: "Mazda CX-5",
    registration: "ABC-123",
    year: 2022,
    colour: "Silver",
    fuelType: "Petrol",
    fuelLevel: 78,
    odometer: 12400,
    status: "Available",
  },
  {
    id: 2,
    model: "Toyota Corolla",
    registration: "XYZ-789",
    year: 2021,
    colour: "Blue",
    fuelType: "Hybrid",
    fuelLevel: 45,
    odometer: 19800,
    status: "Booked",
  },
  {
    id: 3,
    model: "Ford Ranger",
    registration: "LMN-456",
    year: 2023,
    colour: "White",
    fuelType: "Diesel",
    fuelLevel: 22,
    odometer: 8600,
    status: "Maintenance",
  },
];

const emptyForm: VehicleFormState = {
  model: "",
  registration: "",
  year: "",
  colour: "",
  fuelType: "Petrol",
  fuelLevel: "",
  odometer: "",
  status: "Available",
};

const statusStyles: Record<VehicleStatus, string> = {
  Available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Booked: "bg-amber-50 text-amber-700 ring-amber-200",
  "In Service": "bg-blue-50 text-blue-700 ring-blue-200",
  Maintenance: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);
  const [form, setForm] = useState<VehicleFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingVehicleId(null);
    setFormError(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicleId(vehicle.id);
    setForm({
      model: vehicle.model,
      registration: vehicle.registration,
      year: String(vehicle.year),
      colour: vehicle.colour,
      fuelType: vehicle.fuelType,
      fuelLevel: String(vehicle.fuelLevel),
      odometer: String(vehicle.odometer),
      status: vehicle.status,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (formError) {
      setFormError(null);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requiredFields = [
      form.model.trim(),
      form.registration.trim(),
      form.year.trim(),
      form.colour.trim(),
      form.fuelType,
      form.fuelLevel.trim(),
      form.odometer.trim(),
      form.status,
    ];

    if (requiredFields.some((value) => value.length === 0)) {
      setFormError("Please complete every field before saving.");
      return;
    }

    const parsedYear = Number(form.year);
    const parsedFuelLevel = Number(form.fuelLevel);
    const parsedOdometer = Number(form.odometer);

    if (!Number.isInteger(parsedYear) || parsedYear < 1900) {
      setFormError("Please enter a valid year.");
      return;
    }

    if (parsedFuelLevel < 0 || parsedFuelLevel > 100) {
      setFormError("Fuel level must be between 0 and 100.");
      return;
    }

    if (parsedOdometer < 0) {
      setFormError("Odometer must be 0 or greater.");
      return;
    }

    const payload: Omit<Vehicle, "id"> = {
      model: form.model.trim(),
      registration: form.registration.trim(),
      year: parsedYear,
      colour: form.colour.trim(),
      fuelType: form.fuelType,
      fuelLevel: parsedFuelLevel,
      odometer: parsedOdometer,
      status: form.status,
    };

    if (editingVehicleId) {
      setVehicles((current) =>
        current.map((vehicle) =>
          vehicle.id === editingVehicleId ? { ...vehicle, ...payload } : vehicle
        )
      );
    } else {
      setVehicles((current) => [
        {
          ...payload,
          id: Date.now(),
        },
        ...current,
      ]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (vehicleId: number) => {
    setVehicles((current) => current.filter((vehicle) => vehicle.id !== vehicleId));
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-blue-600">Fleet</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Fleet Management</h1>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Add Vehicle
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Model</th>
              <th className="px-4 py-3 font-medium">Registration</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Fuel</th>
              <th className="px-4 py-3 font-medium">Odometer</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-t border-slate-200 bg-white text-slate-700">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <div>
                    <p>{vehicle.model}</p>
                    <p className="text-xs text-slate-500">{vehicle.year} • {vehicle.colour}</p>
                  </div>
                </td>
                <td className="px-4 py-3">{vehicle.registration}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyles[vehicle.status]}`}>
                    {vehicle.status}
                  </span>
                </td>
                <td className="px-4 py-3">{vehicle.fuelLevel}% • {vehicle.fuelType}</td>
                <td className="px-4 py-3">{vehicle.odometer.toLocaleString()} km</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(vehicle)}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(vehicle.id)}
                      className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-600">Vehicle</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {editingVehicleId ? "Edit Vehicle" : "Add Vehicle"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {formError}
                </div>
              ) : null}
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  <span>Model</span>
                  <input
                    type="text"
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 focus:border-blue-500"
                    placeholder="Mazda CX-5"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  <span>Registration</span>
                  <input
                    type="text"
                    name="registration"
                    value={form.registration}
                    onChange={handleChange}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 focus:border-blue-500"
                    placeholder="ABC-123"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  <span>Year</span>
                  <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 focus:border-blue-500"
                    placeholder="2022"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  <span>Colour</span>
                  <input
                    type="text"
                    name="colour"
                    value={form.colour}
                    onChange={handleChange}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 focus:border-blue-500"
                    placeholder="Silver"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  <span>Fuel Type</span>
                  <select
                    name="fuelType"
                    value={form.fuelType}
                    onChange={handleChange}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 focus:border-blue-500"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  <span>Current Fuel Level</span>
                  <input
                    type="number"
                    name="fuelLevel"
                    min="0"
                    max="100"
                    value={form.fuelLevel}
                    onChange={handleChange}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 focus:border-blue-500"
                    placeholder="78"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  <span>Current Odometer</span>
                  <input
                    type="number"
                    name="odometer"
                    min="0"
                    value={form.odometer}
                    onChange={handleChange}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 focus:border-blue-500"
                    placeholder="12400"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  <span>Status</span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 focus:border-blue-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="In Service">In Service</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
