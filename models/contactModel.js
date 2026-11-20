
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            default: Date.now,
        },
        text: {
            type: String,
            required: true,
        },
    },
    { _id: true }
);

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        website: {
            type: String,
            default: "",
        },

        phone: {
            type: String,
            required: true,
            unique: true

        },

        // Calling State
        state: {
            type: String,
            enum: ["Called", "Not Called"],
            default: "Not Called",
        },

        // Call Response
        response: {
            type: String,
            enum: [
                "Pickup",
                "Number Busy",
                "Not Responding",
            ],
            default: null,
        },

        // Call Result
        result: {
            type: String,
            enum: [
                "Not Interested",
                "Meeting Book",
                "Follow Up Required",
                "Call back again",
                "Number is not related"
            ],
            default: null,
        },

        // Follow-up Schedule
        followUpDate: {
            type: Date,
            default: null,
        },

        // Contact Notes
        notes: {
            type: [noteSchema],
            default: [],
        },


        ContactOfDate: {
            type: Date,
            default: null,
        },

        dateUploaded: {
            type: Date,
            default: Date.now,
        },

        categoryID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
        campaignID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
