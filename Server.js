const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/contactsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create Schema
const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
});

const Contact = mongoose.model("Contact", contactSchema);

// Home Route - Display Contacts
app.get("/", async (req, res) => {
  const contacts = await Contact.find();
  res.render("index", { contacts });
  console.log(contacts);
});

// Add Contact
app.post("/add", async (req, res) => {
  const { name, phone, email } = req.body;
  await Contact.create({ name, phone, email });
  res.redirect("/");
});

// Delete Contact
app.post("/delete/:id", async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// Update Contact - Show Edit Form
app.get("/edit/:id", async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  res.render("edit", { contact });
});

// Update Contact - Handle Edit Form Submission
app.post("/update/:id", async (req, res) => {
  const { name, phone, email } = req.body;
  await Contact.findByIdAndUpdate(req.params.id, { name, phone, email });
  res.redirect("/");
});

// Start Server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
