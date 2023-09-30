const notes = require("express").Router();
const uuid = require("../helpers/uuid");
const { readFromFile, readAndAppend } = require("../helpers/fsutils");

// GET request for notes
notes.get("/", (req, res) => {
  console.info(`${req.method} request received to get notes`);
  readFromFile("./db/notes.json").then((data) => res.json(JSON.parse(data)));
});

// POST request to add notes
notes.post("/", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    readAndAppend(newNote, "./db/notes.json");
    res.json(`Note added!`);
  } else {
    res.error("Error in adding note!");
  }
});

module.exports = notes;
