
import Contact from "../models/contactModel.js";

// Create Contact
export const createContact = async (req, res) => {
    try {
        const {
            name,
            website,
            phone,
            categoryID,
            campaignID
        } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name and phone are required"
            });
        }

        // Check if phone number already exists
        const existingContact = await Contact.findOne({ phone });

        if (existingContact) {
            return res.status(200).json({
                success: true,
                skipped: true,
                message: "Contact already exists. Skipped.",
                data: existingContact
            });
        }
        // Create new contact
        const contact = await Contact.create({
            name,
            website: website || "",
            phone,
            categoryID: categoryID || null,
            campaignID: campaignID || null
        });
        return res.status(201).json({
            success: true,
            skipped: false,
            message: "Contact created successfully",
            data: contact
        });

    } catch (error) {
        console.error("Create Contact Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create contact",
            error: error.message
        });
    }
};


// Get Contacts by Campaign and Category
export const getContacts = async (req, res) => {
    try {
        const { campaignID, categoryID } = req.query;

        const filter = {};

        if (campaignID) {
            filter.campaignID = campaignID;
        }

        if (categoryID) {
            filter.categoryID = categoryID;
        }

        const contacts = await Contact.find(filter)
            .populate("categoryID", "name")
            .populate("campaignID", "name")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            total: contacts.length,
            data: contacts
        });

    } catch (error) {
        console.error("Get Contacts Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch contacts",
            error: error.message
        });
    }
};



export const markContactAsCalled = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.params)
        const contact = await Contact.findByIdAndUpdate(
            id,
            {
                state: "Called",
                ContactOfDate: new Date(),
            },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Contact marked as Called successfully",
            data: contact,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// CREATE NOTE
export const createNote = async (req, res) => {
    try {
        const { contactId } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Note text is required",
            });
        }

        const contact = await Contact.findById(contactId);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        contact.notes.push({ text });
        await contact.save();

        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: contact.notes[contact.notes.length - 1],
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// UPDATE NOTE
export const updateNote = async (req, res) => {
    try {
        const { contactId, noteId } = req.params;
        const { text } = req.body;

        const contact = await Contact.findById(contactId);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        const note = contact.notes.id(noteId);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        note.text = text;
        await contact.save();

        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: note,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// DELETE NOTE
export const deleteNote = async (req, res) => {
    try {
        const { contactId, noteId } = req.params;

        const contact = await Contact.findById(contactId);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        const note = contact.notes.id(noteId);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        note.deleteOne();
        await contact.save();

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const updateContact = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            response,
            result,
            followUpDate,
            notes
        } = req.body;
        console.log(req.body)
        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        contact.response = response || null;
        contact.result = response === "Pickup" ? result || null : null;

        contact.followUpDate =
            result === "Follow Up Required" && followUpDate
                ? new Date(followUpDate)
                : null;

        if (Array.isArray(notes)) {
            contact.notes = notes.map(note => ({
                _id: note._id,
                date: note.date ? new Date(note.date) : new Date(),
                text: String(note.text || "")
            }));
        }

        await contact.save();

        return res.status(200).json({
            success: true,
            message: "Contact updated successfully",
            data: contact
        });

    } catch (error) {
        console.error("Update Contact Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getNextContact = async (req, res) => {
    try {
        const { campaignID, categoryID } = req.query;

        if (!campaignID) {
            return res.status(400).json({
                success: false,
                message: "Campaign ID is required"
            });
        }

        const filter = {
            campaignID,
            state: "Not Called"
        };

        if (categoryID) {
            filter.categoryID = categoryID;
        }

        // Find the first uncontacted contact across ALL pages
        const contact = await Contact.findOne(filter)
            .sort({ createdAt: 1, _id: 1 });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "All contacts have been contacted."
            });
        }

        return res.status(200).json({
            success: true,
            data: contact
        });

    } catch (error) {
        console.error("Get Next Contact Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to find next contact"
        });
    }
};



export const getNextUncalledContact = async (req, res) => {
    try {
        const { campaignID, categoryID, currentContactID } = req.query;
        console.log(req.query)
        if (!campaignID || !currentContactID) {
            return res.status(400).json({
                message: "Campaign ID and Current Contact ID are required"
            });
        }

        // Find current contact to determine its position
        const currentContact = await Contact.findOne({
            _id: currentContactID,
            campaignID
        });

        if (!currentContact) {
            return res.status(404).json({
                message: "Current contact not found"
            });
        }

        // Find contacts after the current contact
        const filter = {
            campaignID,
            state: "Not Called",
            $or: [
                { createdAt: { $gt: currentContact.createdAt } },
                {
                    createdAt: currentContact.createdAt,
                    _id: { $gt: currentContact._id }
                }
            ]
        };

        if (categoryID) {
            filter.categoryID = categoryID;
        }

        const nextContact = await Contact.findOne(filter)
            .sort({ createdAt: 1, _id: 1 });

        if (!nextContact) {
            return res.status(404).json({
                message: "No more uncalled contacts available"
            });
        }

        return res.status(200).json({
            message: "Next uncalled contact found",
            contact: nextContact
        });

    } catch (error) {
        console.error("Next contact error:", error);

        return res.status(500).json({
            message: "Error fetching next contact",
            error: error.message
        });
    }
};


export const getUpdatedContacts = async (req, res) => {
    try {
        const { campaignID, categoryID, lastSync } = req.query;
        console.log(req.query)
        const filter = {
            campaignID,
            categoryID
        };

        if (lastSync) {
            console.log("A")
            filter.updatedAt = {
                $gt: new Date(lastSync)
            };
        }

        const contacts = await Contact.find(filter)
            .sort({ updatedAt: 1 });
        return res.status(200).json({
            success: true,
            data: contacts,
            count: contacts.length,
            serverTime: new Date().toISOString()
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};