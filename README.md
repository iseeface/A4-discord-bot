<p align="center">
    <a href="https://github.com/iseeface/A4-discord-bot/">
        <img src="https://raw.githubusercontent.com/iseeface/A4-discord-bot/dev/.github/assets/a4logo.png" alt="A4 Logo"/>
    </a>
</p>

<p align="center">
    <a href="https://github.com/iseeface">
        <img src="https://img.shields.io/badge/GitHub-%23000000.svg?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Badge"/>
    </a>
    <a href="https://discord.gg/yePzcmdPKs">
        <img src="https://img.shields.io/badge/Join%20Server-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white" alt="Join Server"/>
    </a>
    <a href="https://github.com/discordjs/discord.js/">
        <img src="https://img.shields.io/badge/Discord.js-Docs-blue?style=for-the-badge&logo=discord&logoColor=white" alt="Join Server"/>
    </a>
    <a href="https://nodejs.org/id/blog/release/v20.9.0">
       <img src="https://img.shields.io/badge/Node.js-20%2B-green?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Version"/>
    <a href="https://github.com/iseeface/A4-discord-bot?tab=MIT-1-ov-file">
       <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License"/>
</p>

<p align="center">
		<a href="https://sillydev.co.uk/"><img src="https://raw.githubusercontent.com/iseeface/A4-discord-bot/dev/.github/assets/poweredbysillydev.png" alt="Silly Dev" height="64"/></a>
</p>

## 📋 Table of Contents
- [Features](#%EF%B8%8F-features)
- [System Requirements](#-system-requirements)
- [Installation](#-installation)
- [Important Commands](#-important-commands)
- [Dependencies](#-dependencies)
- [Contribution](#-contribution)
- [License](#-license)

---

## ⚙️ Features
A4 Discord Bot is a multifunctional bot with powerful features like **moderation, automatic link embedding, bot status management, Quote of the Day (QOTD), and more**.

### **General Commands:**
- `adzan` - View prayer times for a specific location worldwide.
- `help` - Display a list of all commands.
- `info` - Show information about this bot.
- `ping` - Display bot latency and Discord API response time.
- `qotd` - Request a Quote of the Day (QOTD) from the bot.
- `say` - Send a custom message through the bot.

### **Moderation Commands:**
- `ban` - Ban a user from the server.
- `kick` - Remove a user from the server.
- `mute` - Mute a user.
- `purge` - Delete a specified number of messages in the current channel.
- `purge after` - Delete messages after a specific message.
- `restart` - Restart the bot.
- `set status` - Change the bot's status.
- `set activity` - Change the bot's activity.
- `timeout` - Temporarily restrict a user's interaction.
- `toggle embed` - Enable or disable automatic embed detection.
- `toggle ai` - Enable or disable the AI feature.
- `unban` - Remove a ban from a specific user.
- `unmute` - Remove mute from a user.
- `untimeout` - Remove timeout from a user.

### **Automated Features:**
- Automatic embedding for links from supported platforms such as Instagram, TikTok, X, Reddit, and more.
- Scheduled automatic QOTD (Quote of the Day) posting.

---

## 🛠 System Requirements
- **Node.js:** v18 or newer
- **NPM:** v9 or newer

---

## 🛠 Installation

1. **Clone this repository:**
   ```bash
   git clone https://github.com/iseeface/personal-bot-discord.git
   cd personal-bot-discord
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Fill in the `.env` file according to the instructions provided in `.env.txt`.
   - Rename `.env.txt` to `.env` after filling in the required values.

4. **Run the bot:**
   ```bash
   node bot.js
   ```

---

## 📌 Important Commands

- **Register Slash Commands to Discord:**
  Run the following command to register slash commands with Discord:
  ```bash
  node registerCommands.js
  ```

- **Delete All Slash Commands from Discord:**
  If needed, you can remove all registered commands:
  ```bash
  node deleteCommands.js
  ```

---

## 📦 Dependencies
- `discord.js` - Main library for interacting with the Discord API.
- `axios` - Used for fetching data from APIs.
- `dotenv` - For managing environment variables.
- `moment-timezone` - Handles timezone adjustments for QOTD scheduling.
- `ms` - Converts time duration into human-readable format.
- `node-cron` - Schedules automated tasks.

---

## 🤝 Contribution
Contributions are welcome! If you'd like to improve the bot, feel free to submit a pull request or open an issue to report bugs.

1. Fork this repository.
2. Create a new branch for your changes.
3. Push your changes to your branch.
4. Submit a pull request to the main repository.

---

## 📜 License
This repository is licensed under the [MIT License](LICENSE).
