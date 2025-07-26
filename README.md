# 🔐 VaultNote – Encrypted Voice & Text Note-Taking App

**VaultNote** is a secure, full-stack web application that lets users create and manage **public notes** using **text or voice input**. Built with **MongoDB**, **Node.js**, and **vanilla JS**, it features end-to-end encryption, tag-based filtering, and a sleek light/dark theme toggle.

---

## ✨ Features

- 🔐 **AES-256 End-to-End Encryption** for note content (client ↔ server)
- 🎙️ **Speech-to-text input** using Web Speech API
- 🖋️ **In-place editing** with auto-save on blur
- 🗂️ **Tag filtering** and search functionality
- 🗑️ **Instant delete** for any note
- 🌗 **Dark/light mode toggle** with preference saved locally
- 🌍 All notes are **public** – great for announcements and shared logs

---

## 🧱 Tech Stack

### Frontend
- HTML, CSS, JavaScript
- Web Speech API
- Fetch API for backend communication
- GSAP for subtle animations

### Backend
- Node.js + Express
- MongoDB + Mongoose
- AES-256-CBC encryption via Node.js Crypto API
- Hosted on [Render](https://render.com/)

---

## 🔐 Security

All note contents are encrypted using **AES-256** before being stored in MongoDB.  
The encryption happens **server-side** after receiving raw content.  
Decryption occurs only when serving notes back to the client, ensuring data privacy.

---

## 📄 License

**This project is licensed under the MIT License — feel free to use and modify.**

---

> Made with 💙 by [Elvish Patel](https://github.com/elvishpatel)

---
