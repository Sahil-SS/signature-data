"use client";

import { useState } from "react";
import Image from "next/image";

/* ---------- Design tokens ---------- */
const NAVY = "#0b2447";
const NAVY_DARK = "#071a36";
const GOLD = "#c9a24b";

/* Free Unsplash images (swap the URLs if you like) */
const HERO_IMG =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80";
const SKYLINE_IMG =
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80";

/* ---------- Tiny inline icons ---------- */
const Icon = ({ children, className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

const icons = {
  user: (
    <Icon>
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="currentColor" />
    </Icon>
  ),
  phone: (
    <Icon>
      <path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
        fill="currentColor"
      />
    </Icon>
  ),
  mail: (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor" />
      <path d="m3 7 9 7 9-7" stroke="#fff" />
    </Icon>
  ),
  card: (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 10h4M7 14h10" />
    </Icon>
  ),
  pin: (
    <Icon>
      <path
        d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"
        fill="currentColor"
      />
      <circle cx="12" cy="10" r="2.5" fill="#fff" stroke="none" />
    </Icon>
  ),
  building: (
    <Icon>
      <path d="M4 21V7l8-4 8 4v14M9 21v-5h6v5M8 10h2M14 10h2M8 13h2M14 13h2" />
    </Icon>
  ),
  bank: (
    <Icon>
      <path d="M3 9l9-5 9 5M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18" />
    </Icon>
  ),
  group: (
    <Icon>
      <circle cx="9" cy="8" r="3" fill="currentColor" />
      <circle cx="17" cy="9" r="2.5" fill="currentColor" />
      <path d="M3 20c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5M15 15c3 0 6 1.5 6 5" />
    </Icon>
  ),
  calendar: (
    <Icon>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </Icon>
  ),
  rupee: (
    <Icon>
      <path d="M7 5h10M7 9h10M7 5c6 0 6 8 0 8h-.5L16 20" />
    </Icon>
  ),
  doc: (
    <Icon className="w-9 h-9">
      <path d="M6 3h9l4 4v14H6z" fill="#fff" stroke="none" />
      <path d="M9 14l2 2 4-4" stroke={NAVY} strokeWidth="2.5" />
    </Icon>
  ),
};

/* ---------- Reusable UI pieces ---------- */
function SectionCard({ badge, title, tagline, children }) {
  return (
    <section className="relative rounded-2xl bg-white border border-slate-200 shadow-[0_6px_24px_rgba(11,36,71,0.10)]">
      {/* Navy title bar */}
      <div
        className="relative h-[52px] rounded-t-2xl flex items-center justify-between pl-[104px] pr-6 sm:pr-10"
        style={{
          background: `linear-gradient(90deg, ${NAVY_DARK}, ${NAVY} 60%, ${NAVY_DARK})`,
        }}
      >
        {/* Gold badge */}
        <div
          className="absolute -top-3 left-3 w-[70px] h-[70px] rounded-full flex items-center justify-center text-[#2b2108]"
          style={{
            background: `radial-gradient(circle at 30% 25%, #f3dc93, ${GOLD} 60%, #9a7522)`,
            boxShadow: "0 0 0 3px #fff, 0 4px 10px rgba(0,0,0,0.25)",
          }}
        >
          <span className="[&>svg]:w-8 [&>svg]:h-8">{badge}</span>
        </div>
        <h2
          className="text-white text-[26px] leading-none"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {title}
        </h2>
        <span className="hidden sm:block text-white text-[10px] font-semibold tracking-[0.25em]">
          {tagline}
        </span>
      </div>
      <div className="px-6 sm:px-6 pt-4 pb-6">{children}</div>
    </section>
  );
}

function Label({ children, required, error }) {
  return (
    <label className="block text-[15px] text-slate-800 mb-1.5">
      {children}
      {required && <span className="text-red-600 ml-1.5">*</span>}
      {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
    </label>
  );
}

function IconInput({ icon, invalid, className = "", children }) {
  return (
    <div
      className={`flex items-stretch h-[46px] rounded-md border bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#0b2447]/30 ${
        invalid ? "border-red-500" : "border-slate-300"
      } ${className}`}
    >
      <div className="w-[46px] shrink-0 flex items-center justify-center bg-slate-50 border-r border-slate-300 text-[#0b2447]">
        {icon}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "flex-1 min-w-0 px-3 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-[15px]";

/* ---------- Main component ---------- */
export default function BookingForm() {
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [customerDetails, setCustomerDetails] = useState({
    fullName: "",
    fatherHusbandName: "",
    mobileNumber: "",
    email: "",
    pan: "",
    aadhar: "",
    address: "",
    city: "",
    state: "",
  });

  const [nomineeDetails, setNomineeDetails] = useState({
    fullName: "",
    relationship: "",
    dob: "",
    mobileNumber: "",
  });

  const [payingAmount, setPayingAmount] = useState("");

  const setCustomer = (field, value) =>
    setCustomerDetails((p) => ({ ...p, [field]: value }));
  const setNominee = (field, value) =>
    setNomineeDetails((p) => ({ ...p, [field]: value }));

  /* Validation */
  const validateMobileNumber = (v) => /^[0-9]{10}$/.test(v);
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePAN = (v) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
  const validateAadhar = (v) => /^[0-9]{12}$/.test(v);

  const handleFinalSubmit = async () => {
    if (!termsAccepted) return;

    const amount = Number(payingAmount) || 0;

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: customerDetails,
          nominee: nomineeDetails,
          property: { projectName: "Eco Vista Township" },
          payment: {
            paymentOption: "one-time",
            totalPropertyValue: amount,
            tokenAdvance: amount,
            remainingBalance: 0,
            bookingAmountPaid: amount,
          },
          termsAccepted: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Booking failed");
        return;
      }

      // Mongo returns _id not id
      // eslint-disable-next-line react-hooks/immutability
      window.location.href = `/payment?bookingId=${data._id}`;
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFinalSubmit();
  };

  return (
    <div className="min-h-screen bg-slate-100 sm:py-6">
      <div className="relative max-w-[1020px] mx-auto bg-[#f4f7fb] overflow-hidden sm:rounded-xl shadow-2xl">
        {/* ================= HEADER ================= */}
        <header className="relative h-[270px] bg-white overflow-hidden border-b border-slate-200">
          {/* Building photo: slanted left edge (wide at top, narrow at bottom) */}
          <div
            className="hidden md:block absolute top-0 right-0 h-full w-[44%]"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 46% 100%)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMG}
              alt="Residential towers"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Navy band */}
          <div
            className="hidden md:block absolute top-0 right-0 h-full w-[44%]"
            style={{
              background: NAVY,
              clipPath: "polygon(2.5% 0, 15% 0, 61% 100%, 48.5% 100%)",
            }}
          />
          {/* Gold stripe */}
          <div
            className="hidden md:block absolute top-0 right-0 h-full w-[44%]"
            style={{
              background: GOLD,
              clipPath: "polygon(0 0, 2.5% 0, 48.5% 100%, 46% 100%)",
            }}
          />

          {/* Left content */}
          <div className="relative z-10 pl-6 sm:pl-14 pt-4 md:max-w-[58%]">
            <Image
              src="/logo.jpeg"
              alt="Logo"
              width={220}
              height={110}
              className="h-[100px] w-auto object-contain"
              priority
            />
            <h1
              className="mt-1 text-[22px] sm:text-[28px] md:text-[24px] lg:text-[30px] font-extrabold leading-none tracking-tight whitespace-nowrap"
              style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              <span style={{ color: GOLD }}>ASSOCIATE </span>
              <span style={{ color: NAVY }}>REGISTRATION FORM</span>
            </h1>
            <p className="mt-2 text-[12px] sm:text-[13px] font-medium tracking-[0.35em] text-slate-700">
              GROW TOGETHER &nbsp;|&nbsp; BUILD TOMORROW
            </p>
            <div className="mt-3 space-y-1 text-[11px] sm:text-[12px] text-slate-800">
              <p className="flex items-start gap-1.5">
                <span className="text-red-600 mt-px">
                  <Icon className="w-3.5 h-3.5">
                    <path
                      d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"
                      fill="currentColor"
                    />
                  </Icon>
                </span>
                1st Floor, AH45, Krishna Reddy Industrial Estate, Dooravani Nagar, Bengaluru, Karnataka - 560016
              </p>
              <p className="flex items-start gap-1.5">
                <span style={{ color: NAVY }}>
                  <Icon className="w-3.5 h-3.5">
                    <path d="M4 21V7l8-4 8 4v14M9 21v-5h6v5M8 10h2M14 10h2" />
                  </Icon>
                </span>
                RGB Boulevard, 8th Floor, EP &amp; GP Complex, Salt Lake,
                Kolkata - 700 091
              </p>
            </div>
          </div>
        </header>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-9 pb-0 space-y-9 pt-10">
          {/* ---------- Associate Details ---------- */}
          <SectionCard
            badge={icons.user}
            title="Associate Details"
            tagline="YOUR JOURNEY STARTS HERE"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Left column */}
              <div className="space-y-4">
                <div>
                  <Label required>Full Name</Label>
                  <IconInput icon={icons.user}>
                    <input
                      type="text"
                      required
                      value={customerDetails.fullName}
                      onChange={(e) => setCustomer("fullName", e.target.value)}
                      placeholder="Enter full name"
                      className={inputCls}
                    />
                  </IconInput>
                </div>

                <div>
                  <Label>Father / Husband Name</Label>
                  <IconInput icon={icons.user}>
                    <input
                      type="text"
                      value={customerDetails.fatherHusbandName}
                      onChange={(e) =>
                        setCustomer("fatherHusbandName", e.target.value)
                      }
                      placeholder="Enter father/husband name"
                      className={inputCls}
                    />
                  </IconInput>
                </div>

                <div>
                  <Label
                    required
                    error={
                      customerDetails.mobileNumber &&
                      !validateMobileNumber(customerDetails.mobileNumber) &&
                      "Must be 10 digits"
                    }
                  >
                    Mobile Number
                  </Label>
                  <IconInput
                    icon={icons.phone}
                    invalid={
                      customerDetails.mobileNumber &&
                      !validateMobileNumber(customerDetails.mobileNumber)
                    }
                  >
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={customerDetails.mobileNumber}
                      onChange={(e) =>
                        setCustomer(
                          "mobileNumber",
                          e.target.value.replace(/\D/g, ""),
                        )
                      }
                      placeholder="Enter 10-digit mobile number"
                      className={inputCls}
                    />
                  </IconInput>
                </div>

                <div>
                  <Label
                    required
                    error={
                      customerDetails.email &&
                      !validateEmail(customerDetails.email) &&
                      "Invalid email"
                    }
                  >
                    Email ID
                  </Label>
                  <IconInput
                    icon={icons.mail}
                    invalid={
                      customerDetails.email &&
                      !validateEmail(customerDetails.email)
                    }
                  >
                    <input
                      type="email"
                      required
                      value={customerDetails.email}
                      onChange={(e) => setCustomer("email", e.target.value)}
                      placeholder="Enter email address"
                      className={inputCls}
                    />
                  </IconInput>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                <div>
                  <Label
                    error={
                      customerDetails.pan &&
                      !validatePAN(customerDetails.pan) &&
                      "Invalid PAN format"
                    }
                  >
                    PAN Number
                  </Label>
                  <IconInput
                    icon={icons.card}
                    invalid={
                      customerDetails.pan && !validatePAN(customerDetails.pan)
                    }
                  >
                    <input
                      type="text"
                      maxLength={10}
                      value={customerDetails.pan}
                      onChange={(e) =>
                        setCustomer("pan", e.target.value.toUpperCase())
                      }
                      placeholder="Enter PAN (e.g., ABCDE1234F)"
                      className={inputCls}
                    />
                  </IconInput>
                </div>

                <div>
                  <Label
                    required
                    error={
                      customerDetails.aadhar &&
                      !validateAadhar(customerDetails.aadhar) &&
                      "Must be 12 digits"
                    }
                  >
                    Aadhar Card Number
                  </Label>
                  <IconInput
                    icon={icons.card}
                    invalid={
                      customerDetails.aadhar &&
                      !validateAadhar(customerDetails.aadhar)
                    }
                  >
                    <input
                      type="text"
                      required
                      maxLength={12}
                      value={customerDetails.aadhar}
                      onChange={(e) =>
                        setCustomer("aadhar", e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Enter 12-digit Aadhar number"
                      className={inputCls}
                    />
                  </IconInput>
                </div>

                <div>
                  <Label required>Address</Label>
                  <IconInput icon={icons.pin} className="!h-[58px] items-start">
                    <textarea
                      required
                      rows={2}
                      value={customerDetails.address}
                      onChange={(e) => setCustomer("address", e.target.value)}
                      placeholder="Enter street address"
                      className={`${inputCls} py-2 resize-none h-full`}
                    />
                  </IconInput>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label required>City</Label>
                    <IconInput icon={icons.building}>
                      <input
                        type="text"
                        required
                        value={customerDetails.city}
                        onChange={(e) => setCustomer("city", e.target.value)}
                        placeholder="City"
                        className={inputCls}
                      />
                    </IconInput>
                  </div>
                  <div>
                    <Label required>State</Label>
                    <IconInput icon={icons.bank}>
                      <input
                        type="text"
                        required
                        value={customerDetails.state}
                        onChange={(e) => setCustomer("state", e.target.value)}
                        placeholder="State"
                        className={inputCls}
                      />
                    </IconInput>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ---------- Nominee Details ---------- */}
          <SectionCard
            badge={icons.group}
            title="Nominee Details"
            tagline="FOR A SECURE TOMORROW"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <Label required>Nominee Full Name</Label>
                <IconInput icon={icons.user}>
                  <input
                    type="text"
                    required
                    value={nomineeDetails.fullName}
                    onChange={(e) => setNominee("fullName", e.target.value)}
                    placeholder="Enter nominee full name"
                    className={inputCls}
                  />
                </IconInput>
              </div>

              <div>
                <Label required>Relationship with Applicant</Label>
                <IconInput icon={icons.group}>
                  <select
                    required
                    value={nomineeDetails.relationship}
                    onChange={(e) => setNominee("relationship", e.target.value)}
                    className={`${inputCls} cursor-pointer ${
                      nomineeDetails.relationship
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    <option value="" disabled>
                      Spouse / Son / Daughter / Father / Mother / Other
                    </option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Other">Other</option>
                  </select>
                </IconInput>
              </div>

              <div>
                <Label required>
                  Nominee Date of Birth{" "}
                  <span className="text-[13px]">(DD / MM / YYYY)</span>
                </Label>
                <IconInput icon={icons.calendar}>
                  <input
                    type="date"
                    required
                    value={nomineeDetails.dob}
                    onChange={(e) => setNominee("dob", e.target.value)}
                    className={inputCls}
                  />
                </IconInput>
              </div>

              <div>
                <Label
                  required
                  error={
                    nomineeDetails.mobileNumber &&
                    !validateMobileNumber(nomineeDetails.mobileNumber) &&
                    "Must be 10 digits"
                  }
                >
                  Nominee Mobile Number
                </Label>
                <IconInput
                  icon={icons.phone}
                  invalid={
                    nomineeDetails.mobileNumber &&
                    !validateMobileNumber(nomineeDetails.mobileNumber)
                  }
                >
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={nomineeDetails.mobileNumber}
                    onChange={(e) =>
                      setNominee(
                        "mobileNumber",
                        e.target.value.replace(/\D/g, ""),
                      )
                    }
                    placeholder="Enter 10-digit mobile number"
                    className={inputCls}
                  />
                </IconInput>
              </div>
            </div>
          </SectionCard>

          {/* ---------- Payment Details ---------- */}
          <SectionCard
            badge={icons.rupee}
            title="Payment Details"
            tagline="SIMPLE  •  SECURE  •  ONE TIME PAYMENT"
          >
            <div className="rounded-lg border border-[#e2c466] p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="rounded bg-[#fdf6e7] px-3 py-1.5 text-[15px] text-slate-800 mb-3">
                  Payment Option
                </div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-[30px] h-[30px] rounded-full border-2 border-blue-600 flex items-center justify-center">
                    <span className="w-[16px] h-[16px] rounded-full bg-blue-600" />
                  </span>
                  <span className="font-semibold text-slate-900 text-[15px]">
                    One-Time Payment
                  </span>
                  <span className="rounded-md bg-[#d9f0dd] text-[#2f6b3a] text-[13px] px-2.5 py-0.5">
                    (Full Payment)
                  </span>
                </div>

                <Label required>
                  Paying Amount (<span>₹</span>)
                </Label>
                <IconInput icon={icons.rupee}>
                  <input
                    type="number"
                    min="0"
                    required
                    value={payingAmount}
                    onChange={(e) => setPayingAmount(e.target.value)}
                    placeholder="Enter paying amount"
                    className={inputCls}
                  />
                </IconInput>
              </div>

              <div className="flex items-start">
                <div className="w-full rounded-md bg-[#fdf1d8] py-3 text-center">
                  <p className="text-[17px] font-medium text-slate-900">
                    Amount to Pay
                  </p>
                  <p
                    className="text-[44px] font-extrabold leading-tight text-slate-900"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    ₹{payingAmount || 0}
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ---------- Terms & Conditions ---------- */}
          <SectionCard
            badge={icons.doc}
            title="Terms & Conditions"
            tagline="PLEASE REVIEW BEFORE PROCEEDING"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-slate-400 accent-[#0b2447] cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-[15px] text-slate-800 cursor-pointer"
              >
                I certify that all information provided in this application is
                correct. By submitting this form, I formally accept the terms
                and conditions associated with the Signature.
              </label>
            </div>
          </SectionCard>

          {/* ================= FOOTER ================= */}
          <div className="relative -mx-4 sm:-mx-9 mt-2">
            {/* Proceed button sits on the footer edge */}
            <div className="relative z-20 flex justify-center -mb-4">
              <button
                type="submit"
                disabled={!termsAccepted}
                className={`px-10 py-2 bg-white text-black text-[26px] font-bold transition-opacity ${
                  termsAccepted
                    ? "cursor-pointer hover:bg-slate-50"
                    : "cursor-not-allowed opacity-60"
                }`}
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                Proceed To Pay
              </button>
            </div>

            <div
              className="relative h-[130px] overflow-hidden"
              style={{
                background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`,
              }}
            >
              {/* Gold swoosh */}
              <div
                className="absolute -top-[60px] -left-[10%] w-[120%] h-[110px] rounded-[50%] border-t-[3px]"
                style={{ borderColor: GOLD, background: "#f4f7fb" }}
              />
              {/* Skyline */}
              <div
                className="absolute right-0 bottom-0 h-[80px] w-[32%] opacity-70"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to left, #000 60%, transparent)",
                  maskImage: "linear-gradient(to left, #000 60%, transparent)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={SKYLINE_IMG}
                  alt=""
                  className="w-full h-full object-cover grayscale"
                />
              </div>

              <div className="absolute inset-x-0 bottom-9 flex items-center justify-center gap-4 text-white">
                <span className="hidden sm:block h-px w-20" style={{ background: GOLD }} />
                <span className="text-[13px] tracking-[0.3em] font-medium">
                  TOGETHER FOR A BRIGHTER TOMORROW
                </span>
                <span className="hidden sm:block h-px w-20" style={{ background: GOLD }} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}