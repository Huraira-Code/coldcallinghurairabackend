
import Category from "../models/categoryModel.js";

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }

        // Create Category
        const category = await Category.create({
            name: name.trim(),
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category,
        });
    } catch (error) {
        console.error("Create Category error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Categories retrieved successfully",
            count: categories.length,
            categories,
        });
    } catch (error) {
        console.error("Get all Categories error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
