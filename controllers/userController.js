
import User from "../models/userModel.js";

// Create User
export const createUser = async (req, res) => {
    try {
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: "Name and code are required"
            });
        }

        const existingUser = await User.findOne({
            code: code.trim()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this code already exists"
            });
        }

        const user = await User.create({
            name: name.trim(),
            code: code.trim()
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        });

    } catch (error) {
        console.error("Create User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Check User by Code
export const checkUser = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "User code is required"
            });
        }

        const user = await User.findOne({
            code: code.trim()
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User found successfully",
            user
        });

    } catch (error) {
        console.error("Check User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
