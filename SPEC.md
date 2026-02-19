# SecureGuard Website - Admin Portal Specification## Project OverviewProject name: SecureGuard CMSAdmin PortalType: Full-stack web applicationCore Functionality: Content management system allowing non-technical users to update website content through an intuitive interface while seeing live previewsDatabase & APIServices:- Services CRUDTestimonials CRUDIndustries CRUDBanner/Hero media managementAbout Us section managementPreview mode showing landing page appearance as edits happen## Technology StackFrontend:- React + Vite (existing)- Axios for API callsBackend:- Node.js + ExpressSQLite via better-sqlite3Simple JWT authentication## Database Schema### Tables#### services```sqlCREATE TABLE services (

id INTEGER PRIMARY KEY AUTOINCREMENT,
icon TEXT NOT NULL,
title TEXT NOT NULL,
description TEXT NOT NULL,
display_order INTEGER DEFAULT 0,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP);```

#### testimonials```sqlCREATE TABLE testimonials (

id INTEGER PRIMARY KEY AUTOINCREMENT,
author TEXT NOT NULL,

I need three core tables storing our main content types—services organized by display order so admins can sequence them visually on the front end; testimonial entries capturing client feedback; industries representing different business sectors we serve.

For industries I'm tracking their type identifier along with descriptive text about what makes each sector unique from competitors.

Hero banners are stored separately—their video source URL gets paired against fallback images used when videos fail or aren't available—and there's also metadata around activation status plus scheduling windows controlling when each banner displays publicly versus being hidden from visitors.

There's also an "about" table holding company information including mission statements alongside team member details like names roles photos bios—all consolidated into single rows per entry rather than separate related tables since it's static organizational data not requiring relational queries across multiple sources.
