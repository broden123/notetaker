const notes = require("express").Router();
const uuid = require("../helpers/uuid");
const { readFromFile, readAndAppend } = require("../helpers/fsutils");
const fs = require("fs");

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
      id: uuid(),
    };

    readAndAppend(newNote, "./db/notes.json");
    res.json(`Note added!`);
  } else {
    res.error("Error in adding note!");
  }
});

notes.delete("/:id", (req, res) => {
  fs.readFile("./db/notes.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);

      console.log("req params", req.params.id);
      const itemIndex = parsedNotes.findIndex(({ id }) => id === req.params.id);
      if (itemIndex >= 0) {
        console.log(itemIndex);
        parsedNotes.splice(itemIndex, 1);
      }
      fs.writeFile(
        "./db/notes.json",
        JSON.stringify(parsedNotes, null, 4),
        (writeErr) =>
          writeErr ? console.error(writeErr) : console.info("Notes Updated!")
      );
    }
  });
  res.json("note deleted!");
});

module.exports = notes;
