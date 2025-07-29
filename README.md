# Verda4Store E-commerce Website

A responsive e-commerce website for game top-ups and virtual items, featuring multiple game options including Mobile Legends, PUBG Mobile, Free Fire, and Grow A Garden.

## Features

- Responsive design for both mobile and desktop
- User authentication system
- Dark mode support
- Multi-language support (Indonesian and English)
- Promo code system
- Transaction history
- Payment method selection
- Review and rating system

## Game Top-Up Options

- **Mobile Legends**: Diamonds top-up
- **PUBG Mobile**: UC top-up
- **Free Fire**: Diamonds top-up
- **Grow A Garden**: Virtual pets and items

## Available Promo Codes

### General Promo Codes (Work on All Games)
- **WELCOME10**: 10% discount, expires July 10, 2025
- **VERDA10**: 10% discount, expires July 10, 2025

### Game-Specific Promo Codes
- **FF10**: 10% discount for Free Fire purchases
- **MLBB10**: 10% discount for Mobile Legends purchases
- **PUBG10**: 10% discount for PUBG Mobile purchases
- **GARDEN10**: 10% discount for Grow A Garden purchases

## Project Structure

```
verda4garden/
├── css/                  # CSS stylesheets
│   ├── style.css         # Main stylesheet
│   ├── auth.css          # Authentication styles
│   ├── mobile.css        # Mobile-specific styles
│   ├── cek-transaksi.css # Transaction check styles
│   └── legal.css         # Legal pages styles
│
├── js/                   # JavaScript files
│   ├── script.js         # Main script
│   ├── auth.js           # Authentication functionality
│   ├── device-selector.js # Device detection and UI adaptation
│   └── cek-transaksi.js  # Transaction checking functionality
│
├── images/               # Image assets
│   ├── logo.jpg
│   ├── payment-icons/    # Payment method icons
│   └── game-icons/       # Game-specific images
│
├── audio/                # Audio files
│   └── add-to-cart.mp3   # Cart interaction sound
│
├── pages/                # HTML pages
│   ├── home.html         # Home page
│   ├── login.html        # Login page
│   ├── register.html     # Registration page
│   ├── mlbb.html         # Mobile Legends page
│   ├── pubg.html         # PUBG Mobile page
│   ├── freefire.html     # Free Fire page
│   ├── garden.html       # Grow A Garden page
│   ├── cek-transaksi.html # Transaction check page
│   ├── hubungi-kami.html # Contact page
│   ├── kebijakan-privasi.html # Privacy policy
│   └── syarat-ketentuan.html # Terms and conditions
│
├── data/                 # Data files
│   └── products.json     # Product information
│
├── index.html            # Main entry point
├── .gitignore            # Git ignore file
└── README.md             # Project documentation
```

## Setup and Installation

1. Clone the repository
2. No build process required - this is a static website
3. Open `index.html` in your browser to view the site

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Font Awesome for icons
- Google Fonts