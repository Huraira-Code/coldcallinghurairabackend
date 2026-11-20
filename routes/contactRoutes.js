
import express from "express";
import {
    createContact,
    createNote,
    deleteNote,
    getContacts,
    getNextContact,
    getNextUncalledContact,
    getUpdatedContacts,
    markContactAsCalled,
    updateContact,
    updateNote
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContact);
router.get("/", getContacts);
router.patch("/:id/call", markContactAsCalled);
router.post("/:contactId/notes", createNote);
router.put("/:contactId/notes/:noteId", updateNote);
router.delete("/:contactId/notes/:noteId", deleteNote);
router.get("/next-to-call", getNextContact);
router.patch("/:id", updateContact);
router.get("/next-uncalled", getNextUncalledContact);
router.get("/sync", getUpdatedContacts);
export default router;
