import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

// =============================================================
// GET SINGLE BOOKING
// =============================================================

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error: "Invalid booking ID",
        },
        {
          status: 400,
        },
      );
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        {
          error: "Booking not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Get booking error:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to fetch booking",
      },
      {
        status: 500,
      },
    );
  }
}

// =============================================================
// UPDATE PAYMENT
// =============================================================

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error: "Invalid booking ID",
        },
        {
          status: 400,
        },
      );
    }

    const body = await req.json();

    // =========================================================
    // VALIDATION
    // =========================================================

    if (
      body.amountPaid === undefined ||
      body.amountPaid === null ||
      body.amountPaid === ""
    ) {
      return NextResponse.json(
        {
          error: "Amount paid is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!body.transactionId) {
      return NextResponse.json(
        {
          error: "Transaction ID is required",
        },
        {
          status: 400,
        },
      );
    }

    const amountPaid = Number(body.amountPaid);

    if (!Number.isFinite(amountPaid) || amountPaid <= 0) {
      return NextResponse.json(
        {
          error: "Amount paid must be a valid positive number",
        },
        {
          status: 400,
        },
      );
    }

    // =========================================================
    // UPDATE PAYMENT
    // =========================================================

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        $set: {
          "payment.amountPaid": amountPaid,

          "payment.transactionId": String(body.transactionId).trim(),

          "payment.paymentMethod": body.paymentMethod || "upi",

          "payment.paymentStatus": body.paymentStatus || "success",

          "payment.paymentDate": new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedBooking) {
      return NextResponse.json(
        {
          error: "Booking not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Update payment error:", error);

    return NextResponse.json(
      {
        error: error.message || "Payment update failed",
      },
      {
        status: 500,
      },
    );
  }
}

// =============================================================
// DELETE BOOKING
// =============================================================

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error: "Invalid booking ID",
        },
        {
          status: 400,
        },
      );
    }

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return NextResponse.json(
        {
          error: "Booking not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Delete booking error:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to delete booking",
      },
      {
        status: 500,
      },
    );
  }
}
