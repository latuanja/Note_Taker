const express = require("express");
const path = require("path");
const notes = require("./db/db.json");
const fs = require("fs");

// Express and PORT create

const app = express();
var PORT = process.env.PORT || 3300;

// Express setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Create array
function readNotes() {
  var noteData = fs.readFileSync(path.join(__dirname, "./db/db.json"));
  var parsedNoteData = JSON.parse(noteData);
  return parsedNoteData;
}

// Route to Request functions
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);
app.get("/api/notes", (req, res) => {
  res.json(readNotes());
});
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// Posts for saving notes
app.post("/api/notes", (req, res) => {
  req.body.id = Math.floor(Math.random() * 100000000);
  let newNote = req.body;

  let noteData = JSON.parse(fs.readFileSync("./db/db.json"));
    noteData.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(noteData));
    res.json(noteData);
});

// Posts for deleting notes
app.delete("/api/notes/:id", (req, res) => {
  let id = parseInt(req.params.id);
  console.log(id);

  // Sved notes to be returned
  let noteData = JSON.parse(fs.readFileSync("./db/db.json"));
  console.log(noteData);

  // Show saved notes after delete
  const notes = noteData.filter((note) => note.id !== id);
  console.log(notes);
  fs.writeFileSync("./db/db.json", JSON.stringify(notes));
  res.json(notes);
});

// Start server to listen to requests.

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));