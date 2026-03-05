# Database-Project-Comic-Bookstore
Application that manages a comic bookstore database using SQLite.

# Tates Trading Post – Comic Book CMS

## Overview

Tates Trading Post is a comic book store web application built using **Next.js** and **PayloadCMS**. The system allows administrators to manage comic book products, store events, and website content through a content management system while providing a modern interactive storefront for users.

This project was originally developed as part of a **collaborative university database project**. Due to the original repository is private, this repository is included in my portfolio to demonstrate my contributions to the system.

## Technologies Used

* Next.js
* React
* TypeScript
* PayloadCMS
* Tailwind CSS
* SQLite

## Project Structure

```
Database-Project/
├── tates-trading-post/          # Main Next.js + PayloadCMS application
│   ├── src/                     # Source code
│   │   ├── app/                 # Next.js App Router
│   │   ├── blocks/              # Custom page builder blocks
│   │   ├── heros/               # Hero section variants
│   │   ├── collections/         # PayloadCMS collections
│   │   ├── components/          # React components
│   │   └── globals/             # Site-wide settings
│   ├── public/                  # Static assets
│   ├── cms.db                   # PayloadCMS content database
│   ├── business.db              # Business logic database
│   └── package.json             # Dependencies
├── docs/                        # Project documentation
│   ├── templates/               # Original HTML/CSS/JS templates
│   └── *.md                     # Implementation guides
├── DATABASE-ARCHITECTURE.md     # Database architecture guide
└── TATES-TEMPLATE-INTEGRATION.md # Template integration reference
```

## Key Features

- **Dynamic Page Builder**: Custom blocks for bento grids, events, and vintage sections
- **Comic Product Management**: Enhanced with badges, grading, and categorization
- **Event Management**: Display upcoming comic shop events
- **Interactive UI**: Kinetic typography, custom cursor, FPS monitor
- **Glassmorphism Design**: Modern aesthetic with backdrop blur effects
- **Dual Database Setup**: Separate CMS and business logic databases

## My Contributions

During this group project I contributed to:

* Assisting with database design and data organization
* Implementing and testing application features
* Debugging and improving functionality within the project
* Collaborating on system design and integration

## Running the Project

Install dependencies:

npm install

Start the development server:

npm run dev

Then open:

http://localhost:3000

Admin dashboard:

http://localhost:3000/admin

## Database Architecture

The application uses two SQLite databases:

* **cms.db** – Content management data handled by PayloadCMS
* **business.db** – Business logic and application data

## Academic Project Note

This repository contains a version of a collaborative academic project and is provided for portfolio purposes to demonstrate experience with full-stack web development, CMS integration, and database-backed web applications.
