
import { mongoose } from "mongoose";
import Campaign from "../models/campaignModel.js";
import Category from "../models/categoryModel.js";
export const createCampaign = async (req, res) => {
    try {
        const { name, categoryId } = req.body;

        if (!name || !name.trim() || !categoryId) {
            return res.status(400).json({
                success: false,
                message: "Campaign name and category are required",
            });
        }

        // Validate category ID
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID",
            });
        }

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        const campaign = await Campaign.create({
            name: name.trim(),
            categoryId,
        });

        return res.status(201).json({
            success: true,
            message: "Campaign created successfully",
            campaign,
        });

    } catch (error) {
        console.error("Create Campaign error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find()
            .populate("categoryId", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Campaigns retrieved successfully",
            count: campaigns.length,
            campaigns,
        });

    } catch (error) {
        console.error("Get Campaigns error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
