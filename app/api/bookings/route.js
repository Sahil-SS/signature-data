import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // =========================================================
    // BASIC VALIDATION
    // =========================================================

    if (!body.customer) {
      return NextResponse.json(
        {
          error: "Customer details are required",
        },
        {
          status: 400,
        },
      );
    }

    if (!body.nominee) {
      return NextResponse.json(
        {
          error: "Nominee details are required",
        },
        {
          status: 400,
        },
      );
    }

    if (!body.payment) {
      return NextResponse.json(
        {
          error: "Payment details are required",
        },
        {
          status: 400,
        },
      );
    }

    if (!body.termsAccepted) {
      return NextResponse.json(
        {
          error: "You must accept the terms and conditions",
        },
        {
          status: 400,
        },
      );
    }

    // =========================================================
    // CREATE BOOKING
    // =========================================================

    const booking = await Booking.create({
      // -------------------------------------------------------
      // CUSTOMER
      // -------------------------------------------------------
      customer: {
        fullName: body.customer.fullName,

        fatherHusbandName: body.customer.fatherHusbandName || "",

        mobileNumber: body.customer.mobileNumber,

        email: body.customer.email,

        pan: body.customer.pan || "",

        aadhar: body.customer.aadhar,

        address: body.customer.address || "",

        city: body.customer.city || "",

        state: body.customer.state || "",
      },

      // -------------------------------------------------------
      // NOMINEE
      // -------------------------------------------------------
      nominee: {
        fullName: body.nominee.fullName,

        relationship: body.nominee.relationship,

        dob: body.nominee.dob,

        mobileNumber: body.nominee.mobileNumber,
      },

      // -------------------------------------------------------
      // PROPERTY
      // -------------------------------------------------------
      property: {
        projectName: body.property?.projectName || "",
      },

      // -------------------------------------------------------
      // PAYMENT
      // -------------------------------------------------------
      payment: {
        paymentOption: body.payment?.paymentOption || "one-time",

        totalPropertyValue: Number(body.payment?.totalPropertyValue) || 0,

        tokenAdvance: Number(body.payment?.tokenAdvance) || 0,

        remainingBalance: Number(body.payment?.remainingBalance) || 0,

        bookingAmountPaid: Number(body.payment?.bookingAmountPaid) || 0,

        // Payment page will update this later
        amountPaid: 0,

        transactionId: "",

        paymentMethod: "upi",

        paymentStatus: "pending",

        paymentDate: null,
      },

      // -------------------------------------------------------
      // TERMS
      // -------------------------------------------------------
      termsAccepted: true,
    });

    return NextResponse.json(booking, {
      status: 201,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to create booking",
      },
      {
        status: 500,
      },
    );
  }
}

// =============================================================
// GET ALL BOOKINGS
// =============================================================

export async function GET() {
  try {
    await connectDB();

    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to fetch bookings",
      },
      {
        status: 500,
      },
    );
  }
}
