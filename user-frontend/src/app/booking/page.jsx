// import { Link } from "react-router-dom";
// import { useMemo, useState } from "react";
// import IconifyIcon from "@/components/wrappers/IconifyIcon";
// import "./Booking.css";

// // const API_BASE_URL = "https://driveledger-backend.onrender.com/api";

// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// const cities = [
//   "Rawalpindi",
//   "Islamabad",
//   "Lahore",
//   "Peshawar",
//   "Murree",
//   "Faisalabad",
//   "Multan",
//   "Sialkot",
//   "Gujranwala",
// ];

// const routeFares = {
//   "rawalpindi-lahore": 28000,
//   "lahore-rawalpindi": 28000,
//   "islamabad-lahore": 30000,
//   "lahore-islamabad": 30000,
//   "rawalpindi-murree": 9000,
//   "murree-rawalpindi": 9000,
//   "islamabad-murree": 8500,
//   "murree-islamabad": 8500,
//   "islamabad-peshawar": 18000,
//   "peshawar-islamabad": 18000,
//   "rawalpindi-peshawar": 17000,
//   "peshawar-rawalpindi": 17000,
//   "lahore-faisalabad": 12000,
//   "faisalabad-lahore": 12000,
//   "lahore-multan": 23000,
//   "multan-lahore": 23000,
//   "lahore-sialkot": 16000,
//   "sialkot-lahore": 16000,
//   "lahore-gujranwala": 10000,
//   "gujranwala-lahore": 10000,
// };

// const vehicleOptions = {
//   economy: {
//     label: "Economy",
//     multiplier: 1,
//   },
//   comfort: {
//     label: "Comfort",
//     multiplier: 1.15,
//   },
//   family: {
//     label: "Family / 7-Seater",
//     multiplier: 1.3,
//   },
//   premium: {
//     label: "Premium",
//     multiplier: 1.5,
//   },
// };

// const tripOptions = {
//   one_way: {
//     label: "One Way",
//     multiplier: 1,
//   },
//   round_trip: {
//     label: "Round Trip",
//     multiplier: 1.8,
//   },
// };

// const initialForm = {
//   fullName: "",
//   phone: "",
//   email: "",
//   fromCity: "",
//   toCity: "",
//   pickupPoint: "",
//   dropoffPoint: "",
//   travelDate: "",
//   pickupTime: "",
//   tripType: "one_way",
//   returnDate: "",
//   vehicleType: "economy",
//   passengers: "1",
//   luggageBags: "0",
//   specialInstructions: "",
// };

// const BookingPage = () => {
//   const [form, setForm] = useState(initialForm);
//   const [submittedRequest, setSubmittedRequest] = useState(null);
//   const [formError, setFormError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const routeKey = useMemo(() => {
//     if (!form.fromCity || !form.toCity) return "";
//     return `${form.fromCity}-${form.toCity}`.toLowerCase().replaceAll(" ", "-");
//   }, [form.fromCity, form.toCity]);

//   const estimate = useMemo(() => {
//     const baseFare = routeFares[routeKey] || 0;
//     const vehicleMeta = vehicleOptions[form.vehicleType] || vehicleOptions.economy;
//     const tripMeta = tripOptions[form.tripType] || tripOptions.one_way;

//     const passengers = Number(form.passengers || 1);
//     const luggageBags = Number(form.luggageBags || 0);

//     let luggageCharge = 0;
//     if (luggageBags >= 5) luggageCharge = 2000;
//     else if (luggageBags >= 3) luggageCharge = 1000;

//     let passengerCharge = 0;
//     if (passengers >= 5 && form.vehicleType !== "family") {
//       passengerCharge = 2000;
//     }

//     let lateNightCharge = 0;
//     if (form.pickupTime) {
//       const hour = Number(form.pickupTime.split(":")[0]);
//       if (hour >= 22 || hour < 6) lateNightCharge = 1500;
//     }

//     const tripFare = baseFare * vehicleMeta.multiplier * tripMeta.multiplier;
//     const extras = luggageCharge + passengerCharge + lateNightCharge;
//     const total = baseFare ? Math.round(tripFare + extras) : 0;

//     return {
//       baseFare,
//       vehicleLabel: vehicleMeta.label,
//       vehicleMultiplier: vehicleMeta.multiplier,
//       tripLabel: tripMeta.label,
//       tripMultiplier: tripMeta.multiplier,
//       luggageCharge,
//       passengerCharge,
//       lateNightCharge,
//       extras,
//       total,
//       customQuoteRequired: Boolean(form.fromCity && form.toCity && !baseFare),
//     };
//   }, [form, routeKey]);

//   const updateField = (field, value) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     setFormError("");
//     setSubmittedRequest(null);
//   };

//   const formatAmount = (value) => {
//     return `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;
//   };

//   const buildBookingPayload = () => {
//     return {
//       customer_name: form.fullName.trim(),
//       phone: form.phone.trim(),
//       email: form.email.trim() || null,

//       from_city: form.fromCity,
//       to_city: form.toCity,
//       pickup_point: form.pickupPoint.trim(),
//       dropoff_point: form.dropoffPoint.trim(),

//       travel_date: form.travelDate,
//       pickup_time: form.pickupTime,

//       trip_type: form.tripType,
//       return_date: form.tripType === "round_trip" ? form.returnDate : null,

//       vehicle_type: form.vehicleType,
//       passengers: Number(form.passengers || 1),
//       luggage_bags: Number(form.luggageBags || 0),
//       special_instructions: form.specialInstructions.trim() || null,

//       estimated_fare: estimate.total || 0,
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       !form.fullName.trim() ||
//       !form.phone.trim() ||
//       !form.fromCity ||
//       !form.toCity ||
//       !form.pickupPoint.trim() ||
//       !form.dropoffPoint.trim() ||
//       !form.travelDate ||
//       !form.pickupTime
//     ) {
//       setFormError("Please fill all required booking details.");
//       return;
//     }

//     if (form.fromCity === form.toCity) {
//       setFormError("From City and To City cannot be the same.");
//       return;
//     }

//     if (form.tripType === "round_trip" && !form.returnDate) {
//       setFormError("Please select a return date for round trip booking.");
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       setFormError("");
//       setSubmittedRequest(null);

//       const response = await fetch(`${API_BASE_URL}/city-bookings/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(buildBookingPayload()),
//       });

//       const data = await response.json().catch(() => null);

//       if (!response.ok) {
//         console.error("Booking API error:", data);
//         throw new Error("Booking request could not be submitted.");
//       }

//       setSubmittedRequest({
//         reference: data?.booking_reference || "Submitted",
//         total: data?.estimated_fare || estimate.total,
//         customQuoteRequired: estimate.customQuoteRequired,
//       });

//       setForm(initialForm);

//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     } catch (error) {
//       console.error("Booking submit failed:", error);
//       setFormError(
//         "Booking request failed. Please check your internet/backend server and try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <main className="booking-page">
//       <section className="booking-hero">
//         <div className="booking-bg booking-bg-one" />
//         <div className="booking-bg booking-bg-two" />

//         <div className="booking-shell">
//           <div className="booking-hero-content booking-reveal">
//             <Link to="/" className="booking-back-link">
//               <IconifyIcon icon="mdi:arrow-left" />
//               Back to DriveEase Home
//             </Link>

//             <div className="booking-kicker">
//               <span />
//               City-to-City Booking
//             </div>

//             <h1>
//               Book a DriveEase car for your <span>intercity trip</span>
//             </h1>

//             <p>
//               Select your route, vehicle preference, travel time, passengers,
//               and luggage details. The system will show an instant estimated
//               trip cost before you submit your request.
//             </p>

//             {submittedRequest && (
//               <div className="booking-success-card">
//                 <div className="booking-success-icon">
//                   <IconifyIcon icon="mdi:check-decagram-outline" />
//                 </div>

//                 <div>
//                   <strong>Booking request submitted</strong>
//                   <p>
//                     Reference: <b>{submittedRequest.reference}</b>
//                   </p>

//                   {submittedRequest.customQuoteRequired ? (
//                     <small>
//                       Custom route quote required. DriveEase team will contact
//                       you shortly.
//                     </small>
//                   ) : (
//                     <small>
//                       Estimated fare: <b>{formatAmount(submittedRequest.total)}</b>.
//                       Final confirmation depends on vehicle availability.
//                     </small>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="booking-layout">
//             <form
//               className="booking-form-card booking-reveal booking-delay-1"
//               onSubmit={handleSubmit}
//             >
//               <div className="booking-card-head">
//                 <div>
//                   <h2>Booking Request</h2>
//                   <p>Fill the details below to calculate your trip estimate.</p>
//                 </div>

//                 <div className="booking-card-icon">
//                   <IconifyIcon icon="mdi:calendar-check-outline" />
//                 </div>
//               </div>

//               {formError && (
//                 <div className="booking-error-card">
//                   <IconifyIcon icon="mdi:alert-circle-outline" />
//                   {formError}
//                 </div>
//               )}

//               <div className="booking-form-grid">
//                 <Field label="Full Name *">
//                   <input
//                     type="text"
//                     value={form.fullName}
//                     onChange={(e) => updateField("fullName", e.target.value)}
//                     placeholder="Enter your full name"
//                   />
//                 </Field>

//                 <Field label="Phone Number *">
//                   <input
//                     type="tel"
//                     value={form.phone}
//                     onChange={(e) => updateField("phone", e.target.value)}
//                     placeholder="03XX XXXXXXX"
//                   />
//                 </Field>

//                 <Field label="Email Optional" full>
//                   <input
//                     type="email"
//                     value={form.email}
//                     onChange={(e) => updateField("email", e.target.value)}
//                     placeholder="example@email.com"
//                   />
//                 </Field>

//                 <Field label="From City *">
//                   <select
//                     value={form.fromCity}
//                     onChange={(e) => updateField("fromCity", e.target.value)}
//                   >
//                     <option value="">Select city</option>
//                     {cities.map((city) => (
//                       <option key={city} value={city}>
//                         {city}
//                       </option>
//                     ))}
//                   </select>
//                 </Field>

//                 <Field label="To City *">
//                   <select
//                     value={form.toCity}
//                     onChange={(e) => updateField("toCity", e.target.value)}
//                   >
//                     <option value="">Select city</option>
//                     {cities.map((city) => (
//                       <option key={city} value={city}>
//                         {city}
//                       </option>
//                     ))}
//                   </select>
//                 </Field>

//                 <Field label="Pickup Point *">
//                   <input
//                     type="text"
//                     value={form.pickupPoint}
//                     onChange={(e) => updateField("pickupPoint", e.target.value)}
//                     placeholder="Pickup address or landmark"
//                   />
//                 </Field>

//                 <Field label="Drop-off Point *">
//                   <input
//                     type="text"
//                     value={form.dropoffPoint}
//                     onChange={(e) => updateField("dropoffPoint", e.target.value)}
//                     placeholder="Drop-off address or landmark"
//                   />
//                 </Field>

//                 <Field label="Travel Date *">
//                   <input
//                     type="date"
//                     value={form.travelDate}
//                     onChange={(e) => updateField("travelDate", e.target.value)}
//                   />
//                 </Field>

//                 <Field label="Pickup Time *">
//                   <input
//                     type="time"
//                     value={form.pickupTime}
//                     onChange={(e) => updateField("pickupTime", e.target.value)}
//                   />
//                 </Field>

//                 <Field label="Trip Type">
//                   <select
//                     value={form.tripType}
//                     onChange={(e) => updateField("tripType", e.target.value)}
//                   >
//                     <option value="one_way">One Way</option>
//                     <option value="round_trip">Round Trip</option>
//                   </select>
//                 </Field>

//                 {form.tripType === "round_trip" && (
//                   <Field label="Return Date *">
//                     <input
//                       type="date"
//                       value={form.returnDate}
//                       onChange={(e) => updateField("returnDate", e.target.value)}
//                     />
//                   </Field>
//                 )}

//                 <Field label="Vehicle Preference">
//                   <select
//                     value={form.vehicleType}
//                     onChange={(e) => updateField("vehicleType", e.target.value)}
//                   >
//                     {Object.entries(vehicleOptions).map(([key, option]) => (
//                       <option key={key} value={key}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                 </Field>

//                 <Field label="Passengers">
//                   <input
//                     type="number"
//                     min="1"
//                     max="8"
//                     value={form.passengers}
//                     onChange={(e) => updateField("passengers", e.target.value)}
//                   />
//                 </Field>

//                 <Field label="Luggage Bags">
//                   <input
//                     type="number"
//                     min="0"
//                     max="10"
//                     value={form.luggageBags}
//                     onChange={(e) => updateField("luggageBags", e.target.value)}
//                   />
//                 </Field>

//                 <Field label="Special Instructions Optional" full>
//                   <textarea
//                     rows="4"
//                     value={form.specialInstructions}
//                     onChange={(e) =>
//                       updateField("specialInstructions", e.target.value)
//                     }
//                     placeholder="Write pickup notes, family request, waiting time, etc."
//                   />
//                 </Field>
//               </div>

//               <button
//                 type="submit"
//                 className="booking-submit-btn"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Submitting Request..." : "Submit Booking Request"}
//                 <IconifyIcon
//                   icon={isSubmitting ? "mdi:loading" : "mdi:arrow-right"}
//                 />
//               </button>
//             </form>

//             <aside className="booking-estimate-card booking-reveal booking-delay-2">
//               <div className="booking-estimate-head">
//                 <div>
//                   <span>Live Fare Calculator</span>
//                   <h3>Estimated Trip Cost</h3>
//                 </div>

//                 <div className="booking-estimate-icon">
//                   <IconifyIcon icon="mdi:calculator-variant-outline" />
//                 </div>
//               </div>

//               <div className="booking-route-box">
//                 <small>Selected Route</small>
//                 <strong>
//                   {form.fromCity || "From City"} → {form.toCity || "To City"}
//                 </strong>
//               </div>

//               {estimate.customQuoteRequired ? (
//                 <div className="booking-custom-quote">
//                   <IconifyIcon icon="mdi:file-document-alert-outline" />
//                   <strong>Custom Quote Required</strong>
//                   <p>
//                     This route is not available in the instant fare table. Submit
//                     your request and DriveEase team will contact you.
//                   </p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="booking-breakdown-list">
//                     <PriceRow
//                       label="Base Route Fare"
//                       value={formatAmount(estimate.baseFare)}
//                     />
//                     <PriceRow
//                       label={`Vehicle (${estimate.vehicleLabel})`}
//                       value={`× ${estimate.vehicleMultiplier}`}
//                     />
//                     <PriceRow
//                       label={`Trip Type (${estimate.tripLabel})`}
//                       value={`× ${estimate.tripMultiplier}`}
//                     />
//                     <PriceRow
//                       label="Luggage Charge"
//                       value={formatAmount(estimate.luggageCharge)}
//                     />
//                     <PriceRow
//                       label="Passenger Adjustment"
//                       value={formatAmount(estimate.passengerCharge)}
//                     />
//                     <PriceRow
//                       label="Late Night Charge"
//                       value={formatAmount(estimate.lateNightCharge)}
//                     />
//                   </div>

//                   <div className="booking-total-box">
//                     <span>Estimated Total</span>
//                     <strong>
//                       {estimate.total ? formatAmount(estimate.total) : "Select route"}
//                     </strong>
//                   </div>
//                 </>
//               )}

//               <div className="booking-note">
//                 <IconifyIcon icon="mdi:information-outline" />
//                 This is an estimated fare. Final confirmation depends on vehicle
//                 availability, route conditions, and DriveEase approval.
//               </div>

//               <div className="booking-benefits">
//                 <h4>Why book with DriveEase?</h4>

//                 <Benefit
//                   icon="mdi:shield-check-outline"
//                   text="Managed and verified fleet"
//                 />
//                 <Benefit
//                   icon="mdi:account-tie-outline"
//                   text="Driver coordination by team"
//                 />
//                 <Benefit
//                   icon="mdi:map-marker-path"
//                   text="City-to-city travel support"
//                 />
//                 <Benefit
//                   icon="mdi:cash-check"
//                   text="Instant estimated trip cost"
//                 />
//               </div>
//             </aside>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// };

// const Field = ({ label, full = false, children }) => (
//   <div className={`booking-field ${full ? "booking-field-full" : ""}`}>
//     <label>{label}</label>
//     {children}
//   </div>
// );

// const PriceRow = ({ label, value }) => (
//   <div className="booking-price-row">
//     <span>{label}</span>
//     <strong>{value}</strong>
//   </div>
// );

// const Benefit = ({ icon, text }) => (
//   <div className="booking-benefit-row">
//     <IconifyIcon icon={icon} />
//     <span>{text}</span>
//   </div>
// );

// export default BookingPage;

import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import "./Booking.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const cities = [
  "Rawalpindi",
  "Islamabad",
  "Lahore",
  "Peshawar",
  "Murree",
  "Faisalabad",
  "Multan",
  "Sialkot",
  "Gujranwala",
];

const routeFares = {
  "rawalpindi-lahore": 28000,
  "lahore-rawalpindi": 28000,
  "islamabad-lahore": 30000,
  "lahore-islamabad": 30000,
  "rawalpindi-murree": 9000,
  "murree-rawalpindi": 9000,
  "islamabad-murree": 8500,
  "murree-islamabad": 8500,
  "islamabad-peshawar": 18000,
  "peshawar-islamabad": 18000,
  "rawalpindi-peshawar": 17000,
  "peshawar-rawalpindi": 17000,
  "lahore-faisalabad": 12000,
  "faisalabad-lahore": 12000,
  "lahore-multan": 23000,
  "multan-lahore": 23000,
  "lahore-sialkot": 16000,
  "sialkot-lahore": 16000,
  "lahore-gujranwala": 10000,
  "gujranwala-lahore": 10000,
};

const vehicleOptions = {
  economy: {
    label: "Economy",
    multiplier: 1,
  },
  comfort: {
    label: "Comfort",
    multiplier: 1.15,
  },
  family: {
    label: "Family / 7-Seater",
    multiplier: 1.3,
  },
  premium: {
    label: "Premium",
    multiplier: 1.5,
  },
};

const tripOptions = {
  one_way: {
    label: "One Way",
    multiplier: 1,
  },
  round_trip: {
    label: "Round Trip",
    multiplier: 1.8,
  },
};

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  fromCity: "",
  toCity: "",
  pickupPoint: "",
  dropoffPoint: "",
  travelDate: "",
  pickupTime: "",
  tripType: "one_way",
  returnDate: "",
  vehicleType: "economy",
  passengers: "1",
  luggageBags: "0",
  specialInstructions: "",
};

const BookingPage = () => {
  const [form, setForm] = useState(initialForm);
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayDate = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const routeKey = useMemo(() => {
    if (!form.fromCity || !form.toCity) return "";
    return `${form.fromCity}-${form.toCity}`.toLowerCase().replaceAll(" ", "-");
  }, [form.fromCity, form.toCity]);

  const estimate = useMemo(() => {
    const baseFare = routeFares[routeKey] || 0;
    const vehicleMeta = vehicleOptions[form.vehicleType] || vehicleOptions.economy;
    const tripMeta = tripOptions[form.tripType] || tripOptions.one_way;

    const passengers = Number(form.passengers || 1);
    const luggageBags = Number(form.luggageBags || 0);

    let luggageCharge = 0;
    if (luggageBags >= 5) luggageCharge = 2000;
    else if (luggageBags >= 3) luggageCharge = 1000;

    let passengerCharge = 0;
    if (passengers >= 5 && form.vehicleType !== "family") {
      passengerCharge = 2000;
    }

    let lateNightCharge = 0;
    if (form.pickupTime) {
      const hour = Number(form.pickupTime.split(":")[0]);
      if (hour >= 22 || hour < 6) lateNightCharge = 1500;
    }

    const tripFare = baseFare * vehicleMeta.multiplier * tripMeta.multiplier;
    const extras = luggageCharge + passengerCharge + lateNightCharge;
    const total = baseFare ? Math.round(tripFare + extras) : 0;

    return {
      baseFare,
      vehicleLabel: vehicleMeta.label,
      vehicleMultiplier: vehicleMeta.multiplier,
      tripLabel: tripMeta.label,
      tripMultiplier: tripMeta.multiplier,
      luggageCharge,
      passengerCharge,
      lateNightCharge,
      extras,
      total,
      customQuoteRequired: Boolean(form.fromCity && form.toCity && !baseFare),
    };
  }, [form, routeKey]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormError("");
    setSubmittedRequest(null);
  };

  const formatAmount = (value) => {
    return `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;
  };

  const validateBookingForm = () => {
    const fullName = form.fullName.trim();
    const phone = form.phone.trim();
    const cleanPhone = phone.replace(/\s/g, "").replace(/-/g, "");
    const email = form.email.trim();
    const pickupPoint = form.pickupPoint.trim();
    const dropoffPoint = form.dropoffPoint.trim();
    const passengers = Number(form.passengers);
    const luggageBags = Number(form.luggageBags);

    if (!fullName) {
      return "Customer name is required. Please enter your full name.";
    }

    if (fullName.length < 2) {
      return "Customer name must be at least 2 characters long.";
    }

    if (!phone) {
      return "Phone number is required. Please enter your phone number.";
    }

    if (!/^\+?\d{10,15}$/.test(cleanPhone)) {
      return "Phone number must contain 10 to 15 digits.";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Email is invalid. Please enter a valid email address.";
    }

    if (!form.fromCity) {
      return "From city is required. Please select from city.";
    }

    if (!form.toCity) {
      return "To city is required. Please select to city.";
    }

    if (form.fromCity === form.toCity) {
      return "From city and to city cannot be the same.";
    }

    if (!pickupPoint) {
      return "Pickup point is required. Please enter pickup point.";
    }

    if (pickupPoint.length < 3) {
      return "Pickup point must be at least 3 characters long.";
    }

    if (!dropoffPoint) {
      return "Drop-off point is required. Please enter drop-off point.";
    }

    if (dropoffPoint.length < 3) {
      return "Drop-off point must be at least 3 characters long.";
    }

    if (!form.travelDate) {
      return "Travel date is required. Please select travel date.";
    }

    if (form.travelDate < todayDate) {
      return "Travel date cannot be in the past.";
    }

    if (!form.pickupTime) {
      return "Pickup time is required. Please select pickup time.";
    }

    if (!tripOptions[form.tripType]) {
      return "Trip type is invalid. Please select one way or round trip.";
    }

    if (form.tripType === "round_trip") {
      if (!form.returnDate) {
        return "Return date is required for round trip booking.";
      }

      if (form.returnDate < form.travelDate) {
        return "Return date cannot be before travel date.";
      }
    }

    if (!vehicleOptions[form.vehicleType]) {
      return "Vehicle preference is invalid. Please select a valid vehicle.";
    }

    if (form.passengers === "" || Number.isNaN(passengers)) {
      return "Number of passengers is required.";
    }

    if (passengers < 1) {
      return "At least 1 passenger is required.";
    }

    if (passengers > 8) {
      return "Passengers cannot be more than 8 for online booking.";
    }

    if (form.luggageBags === "" || Number.isNaN(luggageBags)) {
      return "Luggage bags value is required.";
    }

    if (luggageBags < 0) {
      return "Luggage bags cannot be negative.";
    }

    if (luggageBags > 10) {
      return "Luggage bags cannot be more than 10 for online booking.";
    }

    return "";
  };

  const getBookingErrorMessage = (data) => {
    const text = data ? JSON.stringify(data).toLowerCase() : "";

    if (
      text.includes("already exists") ||
      text.includes("duplicate") ||
      text.includes("same phone") ||
      text.includes("non_field_errors")
    ) {
      return "This booking request already exists for the same phone, cities, date, and pickup time.";
    }

    if (text.includes("customer_name") || text.includes("customer name")) {
      return "Customer name is required and must be at least 2 characters long.";
    }

    if (text.includes("phone")) {
      return "Phone number is invalid. It must contain 10 to 15 digits.";
    }

    if (text.includes("email")) {
      return "Email is invalid. Please enter a valid email address.";
    }

    if (text.includes("from_city") || text.includes("from city")) {
      return "From city is invalid or required. Please select from city.";
    }

    if (text.includes("to_city") || text.includes("to city")) {
      return "To city is invalid or from city and to city are the same.";
    }

    if (text.includes("pickup_point") || text.includes("pickup point")) {
      return "Pickup point is required and must be at least 3 characters long.";
    }

    if (text.includes("dropoff_point") || text.includes("drop-off")) {
      return "Drop-off point is required and must be at least 3 characters long.";
    }

    if (text.includes("travel_date") || text.includes("travel date")) {
      return "Travel date is invalid. Travel date cannot be in the past.";
    }

    if (text.includes("pickup_time") || text.includes("pickup time")) {
      return "Pickup time is required. Please select pickup time.";
    }

    if (text.includes("return_date") || text.includes("return date")) {
      return "Return date is required for round trip and cannot be before travel date.";
    }

    if (text.includes("passengers")) {
      return "Passengers value is invalid. Please enter a valid number of passengers.";
    }

    if (text.includes("luggage")) {
      return "Luggage bags value is invalid. Luggage cannot be negative.";
    }

    if (text.includes("estimated_fare") || text.includes("estimated fare")) {
      return "Estimated fare is invalid. Please check the selected route.";
    }

    return "Booking request failed. Please check the entered details and try again.";
  };

  const buildBookingPayload = () => {
    return {
      customer_name: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,

      from_city: form.fromCity,
      to_city: form.toCity,
      pickup_point: form.pickupPoint.trim(),
      dropoff_point: form.dropoffPoint.trim(),

      travel_date: form.travelDate,
      pickup_time: form.pickupTime,

      trip_type: form.tripType,
      return_date: form.tripType === "round_trip" ? form.returnDate : null,

      vehicle_type: form.vehicleType,
      passengers: Number(form.passengers || 1),
      luggage_bags: Number(form.luggageBags || 0),
      special_instructions: form.specialInstructions.trim() || null,

      estimated_fare: estimate.total || 0,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateBookingForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");
      setSubmittedRequest(null);

      const response = await fetch(`${API_BASE_URL}/city-bookings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildBookingPayload()),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Booking API error:", data);
        setFormError(getBookingErrorMessage(data));
        return;
      }

      setSubmittedRequest({
        reference: data?.booking_reference || "Submitted",
        total: data?.estimated_fare || estimate.total,
        customQuoteRequired: estimate.customQuoteRequired,
      });

      setForm(initialForm);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Booking submit failed:", error);

      setFormError(
        "Booking request failed. Please make sure backend is running and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="booking-page">
      <section className="booking-hero">
        <div className="booking-bg booking-bg-one" />
        <div className="booking-bg booking-bg-two" />

        <div className="booking-shell">
          <div className="booking-hero-content booking-reveal">
            <Link to="/" className="booking-back-link">
              <IconifyIcon icon="mdi:arrow-left" />
              Back to DriveLedger Home
            </Link>

            <div className="booking-kicker">
              <span />
              City-to-City Booking
            </div>

            <h1>
              Book a DriveLedger car for your <span>intercity trip</span>
            </h1>

            <p>
              Select your route, vehicle preference, travel time, passengers,
              and luggage details. The system will show an instant estimated
              trip cost before you submit your request.
            </p>

            {submittedRequest && (
              <div className="booking-success-card">
                <div className="booking-success-icon">
                  <IconifyIcon icon="mdi:check-decagram-outline" />
                </div>

                <div>
                  <strong>Booking request submitted</strong>
                  <p>
                    Reference: <b>{submittedRequest.reference}</b>
                  </p>

                  {submittedRequest.customQuoteRequired ? (
                    <small>
                      Custom route quote required. DriveLedger team will contact
                      you shortly.
                    </small>
                  ) : (
                    <small>
                      Estimated fare: <b>{formatAmount(submittedRequest.total)}</b>.
                      Final confirmation depends on vehicle availability.
                    </small>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="booking-layout">
            <form
              className="booking-form-card booking-reveal booking-delay-1"
              onSubmit={handleSubmit}
            >
              <div className="booking-card-head">
                <div>
                  <h2>Booking Request</h2>
                  <p>Fill the details below to calculate your trip estimate.</p>
                </div>

                <div className="booking-card-icon">
                  <IconifyIcon icon="mdi:calendar-check-outline" />
                </div>
              </div>

              {formError && (
                <div className="booking-error-card">
                  <IconifyIcon icon="mdi:alert-circle-outline" />
                  {formError}
                </div>
              )}

              <div className="booking-form-grid">
                <Field label="Full Name *">
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </Field>

                <Field label="Phone Number *">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="03XX XXXXXXX"
                  />
                </Field>

                <Field label="Email Optional" full>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="example@email.com"
                  />
                </Field>

                <Field label="From City *">
                  <select
                    value={form.fromCity}
                    onChange={(e) => updateField("fromCity", e.target.value)}
                  >
                    <option value="">Select city</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="To City *">
                  <select
                    value={form.toCity}
                    onChange={(e) => updateField("toCity", e.target.value)}
                  >
                    <option value="">Select city</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Pickup Point *">
                  <input
                    type="text"
                    value={form.pickupPoint}
                    onChange={(e) => updateField("pickupPoint", e.target.value)}
                    placeholder="Pickup address or landmark"
                  />
                </Field>

                <Field label="Drop-off Point *">
                  <input
                    type="text"
                    value={form.dropoffPoint}
                    onChange={(e) => updateField("dropoffPoint", e.target.value)}
                    placeholder="Drop-off address or landmark"
                  />
                </Field>

                <Field label="Travel Date *">
                  <input
                    type="date"
                    min={todayDate}
                    value={form.travelDate}
                    onChange={(e) => updateField("travelDate", e.target.value)}
                  />
                </Field>

                <Field label="Pickup Time *">
                  <input
                    type="time"
                    value={form.pickupTime}
                    onChange={(e) => updateField("pickupTime", e.target.value)}
                  />
                </Field>

                <Field label="Trip Type">
                  <select
                    value={form.tripType}
                    onChange={(e) => updateField("tripType", e.target.value)}
                  >
                    <option value="one_way">One Way</option>
                    <option value="round_trip">Round Trip</option>
                  </select>
                </Field>

                {form.tripType === "round_trip" && (
                  <Field label="Return Date *">
                    <input
                      type="date"
                      min={form.travelDate || todayDate}
                      value={form.returnDate}
                      onChange={(e) => updateField("returnDate", e.target.value)}
                    />
                  </Field>
                )}

                <Field label="Vehicle Preference">
                  <select
                    value={form.vehicleType}
                    onChange={(e) => updateField("vehicleType", e.target.value)}
                  >
                    {Object.entries(vehicleOptions).map(([key, option]) => (
                      <option key={key} value={key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Passengers">
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={form.passengers}
                    onChange={(e) => updateField("passengers", e.target.value)}
                  />
                </Field>

                <Field label="Luggage Bags">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={form.luggageBags}
                    onChange={(e) => updateField("luggageBags", e.target.value)}
                  />
                </Field>

                <Field label="Special Instructions Optional" full>
                  <textarea
                    rows="4"
                    value={form.specialInstructions}
                    onChange={(e) =>
                      updateField("specialInstructions", e.target.value)
                    }
                    placeholder="Write pickup notes, family request, waiting time, etc."
                  />
                </Field>
              </div>

              <button
                type="submit"
                className="booking-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting Request..." : "Submit Booking Request"}
                <IconifyIcon
                  icon={isSubmitting ? "mdi:loading" : "mdi:arrow-right"}
                />
              </button>
            </form>

            <aside className="booking-estimate-card booking-reveal booking-delay-2">
              <div className="booking-estimate-head">
                <div>
                  <span>Live Fare Calculator</span>
                  <h3>Estimated Trip Cost</h3>
                </div>

                <div className="booking-estimate-icon">
                  <IconifyIcon icon="mdi:calculator-variant-outline" />
                </div>
              </div>

              <div className="booking-route-box">
                <small>Selected Route</small>
                <strong>
                  {form.fromCity || "From City"} → {form.toCity || "To City"}
                </strong>
              </div>

              {estimate.customQuoteRequired ? (
                <div className="booking-custom-quote">
                  <IconifyIcon icon="mdi:file-document-alert-outline" />
                  <strong>Custom Quote Required</strong>
                  <p>
                    This route is not available in the instant fare table. Submit
                    your request and DriveLedger team will contact you.
                  </p>
                </div>
              ) : (
                <>
                  <div className="booking-breakdown-list">
                    <PriceRow
                      label="Base Route Fare"
                      value={formatAmount(estimate.baseFare)}
                    />
                    <PriceRow
                      label={`Vehicle (${estimate.vehicleLabel})`}
                      value={`× ${estimate.vehicleMultiplier}`}
                    />
                    <PriceRow
                      label={`Trip Type (${estimate.tripLabel})`}
                      value={`× ${estimate.tripMultiplier}`}
                    />
                    <PriceRow
                      label="Luggage Charge"
                      value={formatAmount(estimate.luggageCharge)}
                    />
                    <PriceRow
                      label="Passenger Adjustment"
                      value={formatAmount(estimate.passengerCharge)}
                    />
                    <PriceRow
                      label="Late Night Charge"
                      value={formatAmount(estimate.lateNightCharge)}
                    />
                  </div>

                  <div className="booking-total-box">
                    <span>Estimated Total</span>
                    <strong>
                      {estimate.total ? formatAmount(estimate.total) : "Select route"}
                    </strong>
                  </div>
                </>
              )}

              <div className="booking-note">
                <IconifyIcon icon="mdi:information-outline" />
                This is an estimated fare. Final confirmation depends on vehicle
                availability, route conditions, and DriveLedger approval.
              </div>

              <div className="booking-benefits">
                <h4>Why book with DriveLedger?</h4>

                <Benefit
                  icon="mdi:shield-check-outline"
                  text="Managed and verified fleet"
                />
                <Benefit
                  icon="mdi:account-tie-outline"
                  text="Driver coordination by team"
                />
                <Benefit
                  icon="mdi:map-marker-path"
                  text="City-to-city travel support"
                />
                <Benefit
                  icon="mdi:cash-check"
                  text="Instant estimated trip cost"
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

const Field = ({ label, full = false, children }) => (
  <div className={`booking-field ${full ? "booking-field-full" : ""}`}>
    <label>{label}</label>
    {children}
  </div>
);

const PriceRow = ({ label, value }) => (
  <div className="booking-price-row">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const Benefit = ({ icon, text }) => (
  <div className="booking-benefit-row">
    <IconifyIcon icon={icon} />
    <span>{text}</span>
  </div>
);

export default BookingPage;