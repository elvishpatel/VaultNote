const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema
const noteSchema = new mongoose.Schema({
  title: String,
  encryptedText: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema);

// Encryption Helpers
const algorithm = 'aes-256-cbc';
const key = crypto.createHash('sha256').update(String(process.env.SECRET_KEY)).digest('base64').substr(0, 32);
const iv = crypto.randomBytes(16);

// Encrypt
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(data) {
  let parts = data.split(':');
  let iv = Buffer.from(parts[0], 'hex');
  let encryptedText = parts[1];
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8');
  return decrypted;
}

// Routes
app.post('/add', async (req, res) => {
  const { title, text, tags } = req.body;
  const encryptedText = encrypt(text);
  const note = new Note({ title, encryptedText, tags });
  await note.save();
  res.json({ success: true });
});

app.get('/notes', async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  const decryptedNotes = notes.map(n => ({
    id: n.id,
    title: n.title,
    text: decrypt(n.encryptedText),
    tags: n.tags,
    createdAt: n.createdAt
  }));
  res.json(decryptedNotes);
});

app.get('/search', async (req, res) => {
  const { q } = req.query;
  const notes = await Note.find({
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } }
    ]
  }).sort({ createdAt: -1 });

  const decryptedNotes = notes.map(n => ({
    id: n.id,
    title: n.title,
    text: decrypt(n.encryptedText),
    tags: n.tags,
    createdAt: n.createdAt
  }));
  res.json(decryptedNotes);
});


// DELETE Note by ID
app.delete('/notes/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// UPDATE Note by ID
app.put('/notes/:id', async (req, res) => {
  try {
    const { title, text, tags } = req.body;
    if (!title || !text) {
      return res.status(400).json({ success: false, message: 'Title and text are required' });
    }

    const encryptedText = encrypt(text);
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, encryptedText, tags },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.json({ success: true, message: 'Note updated successfully', note: updatedNote });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});



app.listen(3000, () => console.log("VaultNote backend running on port 3000"));