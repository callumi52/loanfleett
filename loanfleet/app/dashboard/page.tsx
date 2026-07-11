"use client";

import { Fragment, useMemo, useState, type ChangeEvent, type FormEvent } from "react";

type LoanCarStatus = "Available" | "Booked" | "Returning Today";

type LoanCar = {
  name: string;
  status: LoanCarStatus;
};

type Booking = {
  customerName: string;
  phone: string;
  roNumber: string;
  advisor: string;
  vehicle: string;
  pickupDateTime: string;
  returnDateTime: string;
  notes: string;
};

const initialLoanCars: LoanCar[] = [
  { name: "Mazda 2", status: "Available" },
  { name: "Mazda 3", status: "Booked" },
  { name: "CX-3", status: "Returning Today" },
  { name: "CX-30", status: "Available" },
  { name: "CX-5", status: "Booked" },
  { name: "BT-50", status: "Available" },
  { name: "Demo Vehicle", status: "Booked" },
];

const emptyBookingForm = {
  customerName: "",
  phone: "",
  roNumber: "",
  advisor: "",
  vehicle: initialLoanCars[0]?.name ?? "",
  pickupDateTime: "",
  returnDateTime: "",
  notes: "",
};

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<LoanCar[]>(initialLoanCars);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState(emptyBookingForm);

  const kpis = [
    {
      label: "Available Cars",
      value: String(vehicles.filter((car) => car.status === "Available").length),
      tone: "from-emerald-500/20 to-emerald-600/10",
    },
    {
      label: "Cars Out",
      value: String(vehicles.filter((car) => car.status === "Booked").length),
      tone: "from-rose-500/20 to-rose-600/10",
    },
    {
      label: "Returning Today",
      value: String(vehicles.filter((car) => car.status === "Returning Today").length),
      tone: "from-amber-500/20 to-amber-600/10",
    },
  ];

  const statusStyles = {
    Available: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
    Booked: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30",
    "Returning Today": "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  } as const;

  const bookingByVehicle = useMemo<Record<string, Booking>>(() => {
    return bookings.reduce<Record<string, Booking>>((acc, booking) => {
      acc[booking.vehicle] = booking;
      return acc;
    }, {});
  }, [bookings]);

  const resetBookingForm = (vehicleName?: string) => {
    const nextVehicle = vehicleName ?? vehicles.find((car) => car.status === "Available")?.name ?? "";
    setBookingForm({
      ...emptyBookingForm,
      vehicle: nextVehicle,
    });
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setBookingForm((current) => ({ ...current, [name]: value }));
    if (bookingError) {
      setBookingError(null);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requiredFields = [
      bookingForm.customerName.trim(),
      bookingForm.phone.trim(),
      bookingForm.roNumber.trim(),
      bookingForm.advisor.trim(),
      bookingForm.vehicle.trim(),
      bookingForm.pickupDateTime.trim(),
      bookingForm.returnDateTime.trim(),
      bookingForm.notes.trim(),
    ];

    if (requiredFields.some((value) => value.length === 0)) {
      setBookingError("Please complete all booking fields before saving.");
      return;
    }

    const selectedVehicle = vehicles.find((car) => car.name === bookingForm.vehicle);
    if (!selectedVehicle) {
      setBookingError("Please select a valid vehicle.");
      return;
    }

    if (selectedVehicle.status === "Booked") {
      setBookingError("This vehicle is already booked. Please choose another loan car.");
      return;
    }

    const newBooking: Booking = {
      customerName: bookingForm.customerName.trim(),
      phone: bookingForm.phone.trim(),
      roNumber: bookingForm.roNumber.trim(),
      advisor: bookingForm.advisor.trim(),
      vehicle: selectedVehicle.name,
      pickupDateTime: bookingForm.pickupDateTime,
      returnDateTime: bookingForm.returnDateTime,
      notes: bookingForm.notes.trim(),
    };

    setBookings((current) => [
      ...current.filter((booking) => booking.vehicle !== selectedVehicle.name),
      newBooking,
    ]);
    setVehicles((current) =>
      current.map((car) => (car.name === selectedVehicle.name ? { ...car, status: "Booked" } : car))
    );

    setBookingError(null);
    setIsBookingOpen(false);
    resetBookingForm(vehicles.find((car) => car.status === "Available" && car.name !== selectedVehicle.name)?.name);
  };

  const handleReturnVehicle = (vehicleName: string) => {
    setVehicles((current) =>
      current.map((car) => (car.name === vehicleName ? { ...car, status: "Available" } : car))
    );
    setBookings((current) => current.filter((booking) => booking.vehicle !== vehicleName));
  };

  const openBookingModal = (vehicleName?: string) => {
    const targetVehicle = vehicleName ?? vehicles.find((car) => car.status === "Available")?.name ?? "";
    setBookingForm((current) => ({ ...current, vehicle: targetVehicle }));
    setBookingError(null);
    setIsBookingOpen(true);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-sky-300">LoanFleet</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Dealership Loan Car Overview</h1>
        </div>
        <button
          type="button"
          onClick={() => openBookingModal()}
          className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          New Booking
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {kpis.map((item) => (
          <article
            key={item.label}
            className={`rounded-2xl border border-white/10 bg-gradient-to-br ${item.tone} p-5 shadow-lg shadow-slate-950/30`}
          >
            <p className="text-sm text-slate-300">{item.label}</p>
            <p className="mt-3 text-4xl font-semibold">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 shadow-2xl shadow-slate-950/40 backdrop-blur">
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="text-xl font-semibold">Active Loan Cars</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-800/80 text-slate-300">
              <tr>
                <th className="px-6 py-3 font-medium">Vehicle</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((car) => {
                const booking = bookingByVehicle[car.name];
                return (
                  <Fragment key={car.name}>
                    <tr className="border-t border-white/10 bg-slate-900/40 transition hover:bg-slate-800/60">
                      <td className="px-6 py-4 font-medium text-slate-100">{car.name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[car.status]}`}>
                          {car.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openBookingModal(car.name)}
                            disabled={car.status === "Booked"}
                            className="rounded-full bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Book
                          </button>
                          {car.status === "Booked" ? (
                            <button
                              type="button"
                              onClick={() => handleReturnVehicle(car.name)}
                              className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                            >
                              Return Vehicle
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                    {booking ? (
                      <tr className="border-t border-white/10 bg-slate-950/40">
                        <td colSpan={3} className="px-6 py-3">
                          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm text-slate-300">
                            <p>
                              <span className="font-semibold text-slate-100">Customer Name:</span>{" "}
                              {booking.customerName}
                            </p>
                            <p>
                              <span className="font-semibold text-slate-100">RO Number:</span>{" "}
                              {booking.roNumber}
                            </p>
                            <p>
                              <span className="font-semibold text-slate-100">Return Date & Time:</span>{" "}
                              {booking.returnDateTime}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {isBookingOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-slate-950/50">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-300">New Booking</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Create a loan car booking</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingOpen(false)}
                className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {bookingError ? (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {bookingError}
                </div>
              ) : null}
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Customer Name</span>
                  <input
                    type="text"
                    name="customerName"
                    value={bookingForm.customerName}
                    onChange={handleChange}
                    className="rounded-2xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-sky-500"
                    placeholder="Jordan Lee"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Phone Number</span>
                  <input
                    type="tel"
                    name="phone"
                    value={bookingForm.phone}
                    onChange={handleChange}
                    className="rounded-2xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-sky-500"
                    placeholder="0400 000 000"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>RO Number</span>
                  <input
                    type="text"
                    name="roNumber"
                    value={bookingForm.roNumber}
                    onChange={handleChange}
                    className="rounded-2xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-sky-500"
                    placeholder="RO-1042"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Service Advisor</span>
                  <input
                    type="text"
                    name="advisor"
                    value={bookingForm.advisor}
                    onChange={handleChange}
                    className="rounded-2xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-sky-500"
                    placeholder="Sam Carter"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Loan Car</span>
                  <select
                    name="vehicle"
                    value={bookingForm.vehicle}
                    onChange={handleChange}
                    className="rounded-2xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-sky-500"
                  >
                    {vehicles.map((car) => (
                      <option key={car.name} value={car.name} disabled={car.status === "Booked"}>
                        {car.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Pickup Date & Time</span>
                  <input
                    type="datetime-local"
                    name="pickupDateTime"
                    value={bookingForm.pickupDateTime}
                    onChange={handleChange}
                    className="rounded-2xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-sky-500"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Return Date & Time</span>
                  <input
                    type="datetime-local"
                    name="returnDateTime"
                    value={bookingForm.returnDateTime}
                    onChange={handleChange}
                    className="rounded-2xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-sky-500"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm text-slate-300">
                <span>Notes</span>
                <textarea
                  name="notes"
                  rows={4}
                  value={bookingForm.notes}
                  onChange={handleChange}
                  className="rounded-2xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-sky-500"
                  placeholder="Any delivery or return notes"
                />
              </label>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setBookingError(null);
                    setIsBookingOpen(false);
                  }}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                >
                  Save Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
