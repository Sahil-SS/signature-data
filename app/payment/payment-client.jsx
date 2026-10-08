"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

import { motion, AnimatePresence } from "framer-motion";

import Image from "next/image";

import { useRouter, useSearchParams } from "next/navigation";

import {
  CreditCard,
  Info,
  ReceiptText,
  IndianRupee,
  ArrowRight,
  CheckCircle2,
  ArrowLeftRight,
  Phone,
  Mail,
  Download,
  QrCode,
  ShieldCheck,
} from "lucide-react";

import MoneyReceiptTemplate from "@/components/MoneyReceiptTemplate";

// import { toWords } from "number-to-words";

export default function PaymentClient() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId");

  const [showReceipt, setShowReceipt] = useState(false);

  const [bookingDetails, setBookingDetails] = useState({
    bookingId: bookingId || "BK" + Math.floor(Math.random() * 10000),

    propertyType: "",

    projectName: "",

    totalAmount: "",

    advanceAmount: "",

    fullBookingData: null,
  });

  const [paymentForm, setPaymentForm] = useState({
    amountPaid: "",

    transactionId: "",

    paymentMethod: "upi",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [popup, setPopup] = useState(null);

  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  // Confetti plays once, then the layer is removed
  const [showConfetti, setShowConfetti] = useState(false);

  const confettiPieces = useMemo(() => {
    return Array.from({ length: 85 }, (_, index) => ({
      id: index,

      left: Math.random() * 100,

      delay: Math.random() * 1.5,

      duration: 3 + Math.random() * 3,

      rotation: Math.random() * 360,

      size: 5 + Math.random() * 7,

      shape: index % 3,
    }));
  }, []);

  useEffect(() => {
    if (!isPaymentSuccess) return;

    setShowConfetti(true);

    // longest piece: 1.5s max delay + 6s max duration = 7.5s
    const timer = setTimeout(() => setShowConfetti(false), 8000);

    return () => clearTimeout(timer);
  }, [isPaymentSuccess]);

  const generatePDF = useCallback(async () => {
    const element = document.getElementById("receipt");

    if (!element) {
      console.error("Receipt element not found");
      return;
    }

    try {
      /*
       * Give React/browser one frame to finish rendering
       * the receipt before html2canvas measures it.
       */
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });

      /*
       * Wait for fonts.
       */
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      /*
       * Wait for receipt images.
       */
      await Promise.all(
        Array.from(element.querySelectorAll("img")).map((img) => {
          if (img.complete) {
            return Promise.resolve();
          }

          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }),
      );

      /*
       * Small additional delay to make sure layout has
       * completely settled before html2canvas starts.
       */
      await new Promise((resolve) => setTimeout(resolve, 100));

      const html2pdf = (await import("html2pdf.js")).default;

      const transactionId = paymentForm.transactionId?.trim() || "receipt";

      const filename = `Payment_Receipt_${transactionId}.pdf`;

      await html2pdf()
        .set({
          margin: 0,

          filename,

          image: {
            type: "jpeg",
            quality: 1,
          },

          html2canvas: {
            scale: 2,
            useCORS: true,

            backgroundColor: "#ffffff",

            logging: false,

            scrollX: 0,
            scrollY: 0,

            /*
             * Make sure the exact receipt dimensions are captured.
             */
            width: element.scrollWidth,
            height: element.scrollHeight,

            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
          },

          jsPDF: {
            unit: "mm",

            format: [280, 140],

            orientation: "landscape",

            compress: true,
          },

          pagebreak: {
            mode: ["avoid-all"],
          },
        })
        .from(element)
        .save();
    } catch (error) {
      console.error("Receipt generation error:", error);
    }
  }, [paymentForm.transactionId]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) return;

      try {
        const res = await fetch(`/api/bookings/${bookingId}`);

        const data = await res.json();

        if (!res.ok) {
          console.error(data.error);

          return;
        }

        setBookingDetails({
          bookingId: data._id,

          propertyType: data.property?.propertyType || "",

          projectName: data.property?.projectName || "",

          totalAmount: data.payment?.totalPropertyValue || "",

          advanceAmount: data.payment?.tokenAdvance || "",

          fullBookingData: data,
        });

        if (data.payment?.tokenAdvance) {
          setPaymentForm((prev) => ({
            ...prev,

            amountPaid: data.payment.tokenAdvance,
          }));
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setPaymentForm((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookingId) {
      alert("Invalid booking. Please start again.");

      return;
    }

    if (!paymentForm.amountPaid || !paymentForm.transactionId) {
      alert("Please enter amount paid and transaction ID.");

      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          amountPaid: Number(paymentForm.amountPaid),

          transactionId: paymentForm.transactionId,

          paymentMethod: paymentForm.paymentMethod,

          paymentStatus: "success",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment update failed");
      }

      setBookingDetails((prev) => ({
        ...prev,

        fullBookingData: data,
      }));

      setShowReceipt(true);

      setIsPaymentSuccess(true);

      setPopup({
        type: "success",

        message:
          `Payment Successful!\n\n` +
          `Receipt Downloaded\n` +
          `Amount: ₹${Number(paymentForm.amountPaid).toLocaleString(
            "en-IN",
          )}\n` +
          `Transaction ID: ${paymentForm.transactionId}\n` +
          `Booking ID: ${bookingId}\n\n` +
          `Our team will contact you within 24 hours.\n` +
          `Keep the receipt for future reference.`,
      });
    } catch (error) {
      console.error("Payment error:", error);

      setPopup({
        type: "error",

        message:
          "Payment update failed. Please contact support.\nError: " +
          error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const amountPaid = Number(paymentForm.amountPaid || 0);

  const totalValue = Number(
    bookingDetails.fullBookingData?.payment?.totalPropertyValue ||
      bookingDetails.totalAmount ||
      0,
  );

  const advancePaid = Number(
    bookingDetails.fullBookingData?.payment?.tokenAdvance ||
      bookingDetails.advanceAmount ||
      paymentForm.amountPaid ||
      0,
  );

  const customerName =
    bookingDetails.fullBookingData?.customer?.fullName || "Customer";

  return (
    <div className="min-h-screen bg-[#f3f8fc] text-[#10213f] overflow-x-hidden">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;

          background: #f3f8fc;
        }

        .payment-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .payment-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .payment-scrollbar::-webkit-scrollbar-thumb {
          background: #dcae35;

          border-radius: 999px;
        }

        .confetti-piece {
          position: absolute;

          top: -30px;

          animation-name: confettiFall;

          animation-timing-function: linear;

          animation-iteration-count: 1;

          animation-fill-mode: forwards;

          pointer-events: none;
        }

        @keyframes confettiFall {
          0% {
            transform: translate3d(0, -30px, 0) rotate(0deg);

            opacity: 0;
          }

          8% {
            opacity: 1;
          }

          85% {
            opacity: 1;
          }

          100% {
            transform: translate3d(80px, 115vh, 0) rotate(720deg);

            opacity: 0;
          }
        }

        .gold-wave {
          position: absolute;

          bottom: 0;

          left: -5%;

          width: 110%;

          height: 130px;

          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0) 0%,

            #e7bd50 48%,

            #d7a52f 100%
          );

          clip-path: polygon(
            0 55%,

            10% 32%,

            20% 50%,

            31% 30%,

            42% 52%,

            53% 25%,

            65% 50%,

            77% 28%,

            89% 50%,

            100% 30%,

            100% 100%,

            0 100%
          );

          opacity: 0.95;
        }

        .navy-wave {
          position: absolute;

          bottom: 0;

          left: -5%;

          width: 110%;

          height: 105px;

          background: #062b4d;

          clip-path: polygon(
            0 48%,

            12% 28%,

            23% 47%,

            36% 25%,

            49% 48%,

            62% 30%,

            75% 52%,

            87% 32%,

            100% 48%,

            100% 100%,

            0 100%
          );
        }

        .soft-shadow {
          box-shadow:
            0 20px 55px rgba(16, 33, 63, 0.1),
            0 4px 16px rgba(16, 33, 63, 0.05);
        }
      `}</style>

      {!isPaymentSuccess ? (
        <main className="min-h-screen px-3 py-3 md:px-4 md:py-4 lg:px-4.5">
          <div className="mx-auto max-w-380">
            {/* ================= TOP TITLE ================= */}

            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="soft-shadow mb-4 rounded-2xl border border-[#dfe7ef] bg-white px-4 py-4 md:px-8 md:py-5"
            >
              <h1 className="text-center text-[24px] font-extrabold tracking-tight text-[#0d1d3a] md:text-[32px] lg:text-[36px]">
                COMPLETE YOUR ASSOCIATION MEMBERSHIP
              </h1>
            </motion.div>

            {/* ================= MAIN PAYMENT CARD ================= */}

            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="soft-shadow overflow-hidden rounded-[18px] border border-[#dce5ee] bg-white"
            >
              {/* ================= PAYMENT HEADER ================= */}

              <div className="relative overflow-hidden bg-[#082d4a]">
                <div className="absolute -right-10 -top-16.25 h-45 w-[48%] rotate-[9deg] rounded-[80px] border-b-18 border-[#f4c541]" />

                <div className="relative flex min-h-18 items-center px-4 py-2 md:px-7">
                  {/* Icon */}

                  <div className="mr-4 flex h-15 w-15 shrink-0 items-center justify-center rounded-full border-[3px] border-white bg-[#f5c343] shadow-lg md:h-17 md:w-17">
                    <CreditCard
                      size={32}
                      strokeWidth={2.2}
                      className="text-[#102d48]"
                    />
                  </div>

                  {/* Heading */}

                  <h2 className="text-[24px] font-semibold text-white md:text-[30px]">
                    Payment Details
                  </h2>

                  {/* Right heading */}

                  <div className="ml-auto hidden items-center gap-5 pr-2 text-[16px] font-medium tracking-[0.16em] text-white md:flex lg:text-[18px]">
                    <span>SECURE</span>

                    <span className="text-[#f5c343]">•</span>

                    <span>SIMPLE</span>

                    <span className="text-[#f5c343]">•</span>

                    <span>ONE TIME PAYMENT</span>
                  </div>
                </div>

                {/* Gold bottom line */}

                <div className="absolute bottom-0 left-0 h-2 w-full bg-[#f4c541]" />
              </div>

              {/* ================= CONTENT ================= */}

              <div className="px-4 py-4 md:px-7 md:py-5 lg:px-[34px]">
                {/* ================= INFORMATION ALERT ================= */}

                <div className="mb-4 flex items-center gap-3 rounded-[12px] border border-[#c8e4f8] bg-[#eef8ff] px-4 py-3">
                  <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#1674d1] text-white">
                    <Info size={20} strokeWidth={3} />
                  </div>

                  <p className="text-[14px] leading-5 text-[#344762] md:text-[16px]">
                    You have already made the payment. Please enter the
                    Transaction ID / UTR number below to confirm your payment.
                  </p>
                </div>

                {/* ================= QR PAYMENT SECTION (kept from original, currently disabled) ================= */}

                {/* <div className="mb-4 rounded-[14px] border border-[#dce7ef] bg-[#f8fbfe] p-3 md:p-4">
                  <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff2ca] text-[#0a3150]">
                        <QrCode size={28} strokeWidth={2.1} />
                      </div>

                      <div>
                        <h3 className="text-[18px] font-bold text-[#10213f]">
                          Scan & Pay
                        </h3>

                        <p className="mt-1 text-[14px] text-[#65748a] md:text-[15px]">
                          Scan the QR code using any UPI application.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                      <div className="rounded-[13px] border border-[#dce5ed] bg-white p-2 shadow-sm">
                        <Image
                          src="/qr.jpg"
                          alt="Payment QR Code"
                          width={185}
                          height={185}
                          className="h-[185px] w-[185px] max-w-full rounded-[8px] object-contain"
                        />
                      </div>

                      <div className="max-w-[270px] text-center sm:text-left">
                        <p className="text-[14px] leading-6 text-[#596a80]">
                          Once payment is completed, enter the UTR / reference
                          number below.
                        </p>

                        <div className="mt-3 flex items-center justify-center gap-2 text-[13px] font-semibold text-[#0c3151] sm:justify-start">
                          <ShieldCheck size={17} />
                          Secure UPI payment
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* ================= PAYMENT INPUTS ================= */}

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Amount Paid */}

                    <div>
                      <label className="mb-2 block text-[16px] font-semibold text-[#10213f]">
                        Amount Paid (₹){" "}
                        <span className="text-[#df2525]">*</span>
                      </label>

                      <div className="flex h-[56px] overflow-hidden rounded-[11px] border border-[#cfd6de] bg-[#f0f1f3]">
                        <div className="flex w-[74px] items-center justify-center border-r border-[#d8dce1] text-[#4d5866]">
                          <IndianRupee size={29} strokeWidth={2.2} />
                        </div>

                        <input
                          type="number"
                          name="amountPaid"
                          value={paymentForm.amountPaid}
                          onChange={handleInputChange}
                          placeholder="Enter amount paid"
                          readOnly={Boolean(bookingDetails.advanceAmount)}
                          className="min-w-0 flex-1 bg-transparent px-5 text-[21px] font-bold text-[#141a22] outline-none"
                          required
                        />
                      </div>

                      <p className="mt-2 text-[13px] text-[#69788d]">
                        This amount is automatically filled from your
                        registration details.
                      </p>
                    </div>

                    {/* Transaction ID */}

                    <div>
                      <label className="mb-2 block text-[16px] font-semibold text-[#10213f]">
                        Transaction ID / UTR Number{" "}
                        <span className="text-[#df2525]">*</span>
                      </label>

                      <div className="flex h-[56px] overflow-hidden rounded-[11px] border border-[#cfd6de] bg-white focus-within:border-[#0b3553] focus-within:ring-2 focus-within:ring-[#0b3553]/10">
                        <div className="flex w-[74px] items-center justify-center border-r border-[#d8dce1] text-[#20354e]">
                          <CreditCard size={28} strokeWidth={2} />
                        </div>

                        <input
                          type="text"
                          name="transactionId"
                          value={paymentForm.transactionId}
                          onChange={handleInputChange}
                          placeholder="Enter UTR / Reference number"
                          className="min-w-0 flex-1 bg-transparent px-5 text-[17px] text-[#18263c] outline-none placeholder:text-[#9aa4b2]"
                          required
                        />
                      </div>

                      <p className="mt-2 text-[13px] text-[#69788d]">
                        Enter the UTR number / Reference number of your payment.
                      </p>
                    </div>
                  </div>

                  {/* ================= BOOKING SUMMARY ================= */}

                  {bookingDetails.fullBookingData && (
                    <div className="mt-4 overflow-hidden rounded-[14px] border border-[#f0d57d] bg-[#fffaf0]">
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]">
                        {/* Left */}

                        <div className="flex items-center gap-4 px-5 py-4 md:px-6">
                          <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#ffefc6]">
                            <ReceiptText
                              size={38}
                              strokeWidth={2}
                              className="text-[#153c61]"
                            />
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-[20px] font-bold text-[#103b91]">
                              Booking Summary
                            </h3>

                            <div className="text-[15px] text-[#17233a]">
                              <span>Customer Name</span>

                              <span className="mx-5">:</span>

                              <strong className="font-bold">
                                {customerName}
                              </strong>
                            </div>

                            <div className="text-[15px] text-[#17233a]">
                              <span>Advance Paid</span>

                              <span className="mx-5">:</span>

                              <strong className="font-bold">
                                ₹{advancePaid.toLocaleString("en-IN")}
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* Divider */}

                        <div className="hidden items-center md:flex">
                          <div className="h-[82%] w-[2px] bg-[#f0d57d]" />
                        </div>

                        {/* Right */}

                        <div className="flex items-center px-6 py-7 md:px-8">
                          <div className="text-[19px] text-[#17233a]">
                            <span>Total Value</span>

                            <span className="mx-5">:</span>

                            <strong className="text-[24px] font-extrabold text-[#0d1729]">
                              ₹{totalValue.toLocaleString("en-IN")}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ================= SUBMIT ================= */}

                  <div className="flex justify-center pt-4">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.985 } : {}}
                      className={`flex min-h-[56px] w-full max-w-[650px] items-center justify-center gap-5 rounded-[13px] bg-gradient-to-r from-[#eac052] to-[#dba52f] px-8 text-[18px] font-extrabold text-[#080f1d] shadow-[0_8px_20px_rgba(190,143,34,0.22)] transition ${
                        isSubmitting
                          ? "cursor-not-allowed opacity-60"
                          : "hover:brightness-[1.03]"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#13253d]/30 border-t-[#13253d]" />
                          PROCESSING PAYMENT...
                        </>
                      ) : (
                        <>
                          SUBMIT PAYMENT DETAILS
                          <ArrowRight size={24} strokeWidth={2.7} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.section>
          </div>
        </main>
      ) : (
        <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#eef5fb] via-white to-[#f5f9fc] px-3 py-3 md:px-5 md:py-4">
          {/* ================= CONFETTI (plays once) ================= */}

          {showConfetti && (
            <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
              {confettiPieces.map((piece) => {
                const shapeClass =
                  piece.shape === 0
                    ? "rounded-[1px]"
                    : piece.shape === 1
                      ? "rounded-full"
                      : "rotate-45 rounded-[1px]";

                const confettiColors = [
                  "#e8b532",

                  "#0c3153",

                  "#19b95b",

                  "#e35c78",

                  "#3d82d7",
                ];

                return (
                  <span
                    key={piece.id}
                    className={`confetti-piece ${shapeClass}`}
                    style={{
                      left: `${piece.left}%`,

                      width: `${piece.size}px`,

                      height: `${piece.size * 1.5}px`,

                      background:
                        confettiColors[piece.id % confettiColors.length],

                      animationDelay: `${piece.delay}s`,

                      animationDuration: `${piece.duration}s`,

                      transform: `rotate(${piece.rotation}deg)`,
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* ================= DECORATIVE BACKGROUND ================= */}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[260px] overflow-hidden">
            <div className="gold-wave" />

            <div className="navy-wave" />
          </div>

          {/* ================= SUCCESS CARD ================= */}

          <div className="relative z-10 mx-auto max-w-[1080px]">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.65,

                ease: "easeOut",
              }}
              className="overflow-hidden rounded-[22px] border border-[#d8e2eb] bg-white/95 shadow-[0_20px_70px_rgba(15,45,73,0.13)] backdrop-blur"
            >
              {/* ================= SUCCESS HERO ================= */}

              <div className="relative px-5 pb-4 pt-4 text-center md:px-8 md:pt-5">
                {/* Success badge */}

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.25,

                    duration: 0.55,

                    type: "spring",

                    stiffness: 170,
                  }}
                  className="relative mx-auto flex h-[105px] w-[105px] items-center justify-center"
                >
                  {/* Outer gold circle */}

                  <div className="absolute inset-0 rounded-full border-[6px] border-[#e5b536] bg-[#fff9e9] shadow-[0_5px_20px_rgba(213,166,48,0.28)]" />

                  {/* Green circle */}

                  <div className="relative flex h-[78px] w-[78px] items-center justify-center rounded-full border-[4px] border-[#72df98] bg-gradient-to-br from-[#0fd363] to-[#079d47] shadow-inner">
                    <CheckCircle2
                      size={72}
                      strokeWidth={2.5}
                      className="text-white"
                    />
                  </div>
                </motion.div>

                {/* Gold banner */}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="relative mx-auto -mt-1 mb-3 flex max-w-[360px] items-center justify-center"
                >
                  <div className="absolute h-[40px] w-full bg-[#e6ae2e] shadow-md [clip-path:polygon(0_0,100%_0,93%_50%,100%_100%,0_100%,7%_50%)]" />

                  <span className="relative z-10 px-8 py-2 text-[17px] font-bold text-[#14243b]">
                    Payment Successful
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="font-serif text-[38px] font-bold leading-none text-[#09284d] md:text-[46px]"
                >
                  Thank You!
                </motion.h1>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                  className="mt-3 text-[19px] font-bold text-[#102f54] md:text-[23px]"
                >
                  Your Association Membership Registration
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.75 }}
                  className="mt-1 text-[16px] font-semibold text-[#102f54] md:text-[19px]"
                >
                  has been completed successfully.
                </motion.p>
              </div>

              {/* ================= RECEIPT DETAILS ================= */}

              <div className="px-4 pb-3 md:px-10">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="overflow-hidden rounded-[18px] border border-[#d5e1ec] bg-white"
                >
                  {/* Receipt */}

                  <div className="flex items-center gap-4 border-b border-[#e1e7ed] px-5 py-3 md:px-6">
                    <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#e9edff] text-[#164995]">
                      <ReceiptText size={25} strokeWidth={2} />
                    </div>

                    <div>
                      <h3 className="text-[17px] font-bold text-[#102746] md:text-[19px]">
                        Receipt Downloaded
                      </h3>

                      <p className="mt-1 text-[13px] text-[#65758c]">
                        A copy of your payment receipt has been saved.
                      </p>
                    </div>
                  </div>

                  {/* Amount */}

                  <div className="flex items-center gap-4 border-b border-[#e1e7ed] px-5 py-3 md:px-6">
                    <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#fff1cf] text-[#d59c18]">
                      <IndianRupee size={31} strokeWidth={2.4} />
                    </div>

                    <div className="grid flex-1 grid-cols-[1fr_auto] items-center gap-4">
                      <span className="text-[15px] font-semibold text-[#102746] md:text-[17px]">
                        Amount Paid
                      </span>

                      <strong className="text-[20px] font-bold text-[#102746] md:text-[23px]">
                        ₹{amountPaid.toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  {/* Transaction */}

                  <div className="flex items-center gap-4 border-b border-[#e1e7ed] px-5 py-3 md:px-6">
                    <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#e6f0ff] text-[#2764ad]">
                      <ArrowLeftRight size={31} strokeWidth={2.2} />
                    </div>

                    <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-[1fr_auto] md:items-center md:gap-4">
                      <span className="text-[15px] font-semibold text-[#102746] md:text-[17px]">
                        Transaction ID / UTR Number
                      </span>

                      <strong className="break-all text-[15px] font-bold text-[#102746] md:text-[18px]">
                        {paymentForm.transactionId}
                      </strong>
                    </div>
                  </div>

                  {/* Booking ID */}

                  <div className="flex items-center gap-4 px-5 py-3 md:px-6">
                    <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#ffe7ee] text-[#d62966]">
                      <Phone size={29} strokeWidth={2.2} />
                    </div>

                    <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-[1fr_auto] md:items-center md:gap-4">
                      <span className="text-[15px] font-semibold text-[#102746] md:text-[17px]">
                        Booking / Registration ID
                      </span>

                      <strong className="break-all text-[14px] font-bold text-[#102746] md:text-[17px]">
                        {bookingDetails.bookingId || bookingId}
                      </strong>
                    </div>
                  </div>
                </motion.div>

                {/* ================= SUPPORT MESSAGE ================= */}

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95 }}
                  className="mt-3 flex items-center gap-4 rounded-[14px] border border-[#cdeee0] bg-[#edfcf5] px-5 py-3 md:px-6"
                >
                  <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#baf3d4] text-[#087346]">
                    <Mail size={31} strokeWidth={2.2} />
                  </div>

                  <div>
                    <h3 className="text-[15px] font-bold text-[#102746] md:text-[17px]">
                      Our team will contact you within 24 hours for further
                      assistance.
                    </h3>

                    <p className="mt-1 text-[16px] text-[#344e6c] md:text-[18px]">
                      Please keep the receipt and transaction details for future
                      reference.
                    </p>
                  </div>
                </motion.div>

                {/* ================= DOWNLOAD BUTTON ================= */}

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.05 }}
                  className="flex flex-col items-center justify-center gap-3 py-3 md:flex-row"
                >
                  <button
                    type="button"
                    onClick={generatePDF}
                    className="flex min-h-[50px] min-w-[300px] items-center justify-center gap-4 rounded-[13px] bg-gradient-to-r from-[#efc452] to-[#dca52c] px-8 text-[20px] font-bold text-[#10213c] shadow-[0_8px_20px_rgba(204,156,42,0.25)] transition hover:brightness-105 active:scale-[0.99]"
                  >
                    <Download size={23} strokeWidth={2.4} />
                    Download Receipt
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="min-h-[50px] rounded-[13px] border border-[#cfd9e3] bg-white px-7 text-[16px] font-semibold text-[#163453] transition hover:bg-[#f6f9fc]"
                  >
                    Return to Home
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </main>
      )}

      {/* ================= ERROR / STATUS POPUP ================= */}

      <AnimatePresence>
        {popup && popup.type === "error" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-5"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-md rounded-[20px] bg-white p-7 text-center shadow-2xl"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Info size={32} className="text-red-600" />
              </div>

              <h3 className="mb-3 text-2xl font-bold text-[#10213f]">
                Payment Update Failed
              </h3>

              <p className="whitespace-pre-line text-[15px] leading-6 text-gray-600">
                {popup.message}
              </p>

              <button
                type="button"
                onClick={() => setPopup(null)}
                className="mt-6 rounded-lg bg-[#0b3151] px-6 py-3 font-semibold text-white transition hover:bg-[#08263d]"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= HIDDEN RECEIPT (required by PDF functionality) ================= */}

      <div
        style={{
          position: "fixed",
          left: "-10000px",
          top: 0,
          width: "280mm",
          height: "140mm",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {showReceipt && bookingDetails.fullBookingData && (
          <MoneyReceiptTemplate
            data={{
              name:
                bookingDetails.fullBookingData.customer?.fullName ||
                customerName,

              amount: paymentForm.amountPaid,

              projectName:
                bookingDetails.fullBookingData.property?.projectName || "",

              transactionId: paymentForm.transactionId,

              paymentMode: paymentForm.paymentMethod?.toUpperCase() || "UPI",

              paymentDate: new Date().toLocaleDateString("en-IN"),

              receiptNo: paymentForm.transactionId,

              date: new Date().toLocaleDateString("en-IN"),
            }}
          />
        )}
      </div>
    </div>
  );
}
