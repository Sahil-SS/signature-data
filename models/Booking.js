import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    // =========================================================
    // CUSTOMER DETAILS
    // =========================================================
    customer: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      fatherHusbandName: {
        type: String,
        default: "",
        trim: true,
      },

      mobileNumber: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      pan: {
        type: String,
        default: "",
        trim: true,
        uppercase: true,
      },

      aadhar: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        default: "",
        trim: true,
      },

      city: {
        type: String,
        default: "",
        trim: true,
      },

      state: {
        type: String,
        default: "",
        trim: true,
      },
    },

    // =========================================================
    // NOMINEE DETAILS
    // =========================================================
    nominee: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      relationship: {
        type: String,
        required: true,
        trim: true,
      },

      dob: {
        type: Date,
        required: true,
      },

      mobileNumber: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // =========================================================
    // PROPERTY DETAILS
    // =========================================================
    property: {
      projectName: {
        type: String,
        default: "",
        trim: true,
      },
    },

    // =========================================================
    // PAYMENT DETAILS
    // =========================================================
    payment: {
      paymentOption: {
        type: String,
        default: "one-time",
        trim: true,
      },

      totalPropertyValue: {
        type: Number,
        default: 0,
      },

      tokenAdvance: {
        type: Number,
        default: 0,
      },

      remainingBalance: {
        type: Number,
        default: 0,
      },

      bookingAmountPaid: {
        type: Number,
        default: 0,
      },

      // Updated by the payment page
      amountPaid: {
        type: Number,
        default: 0,
      },

      transactionId: {
        type: String,
        default: "",
        trim: true,
      },

      paymentMethod: {
        type: String,
        default: "upi",
        trim: true,
      },

      paymentStatus: {
        type: String,
        enum: ["pending", "success", "failed", "cancelled"],
        default: "pending",
      },

      paymentDate: {
        type: Date,
        default: null,
      },
    },

    // =========================================================
    // TERMS
    // =========================================================
    termsAccepted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
    strict: true,
  },
);

// Prevent Next.js development hot-reload from retaining
// an outdated Booking schema.
if (process.env.NODE_ENV === "development" && mongoose.models.Booking) {
  mongoose.deleteModel("Booking");
}

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

export default Booking;
