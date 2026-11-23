# Little Idly - Freelance Redesign Pitch Demo
**100% Pure Vegetarian South Indian Restaurant · Al Karama, Dubai**

A production-grade, bespoke responsive demo website engineered for a freelance redesign pitch to the owners of **Little Idly** (https://www.littleidly.ae/).

---

## 🌟 Live Demo Preview & Architecture
- **Tech Stack**: Vanilla HTML5 + CSS3 + Tailwind CSS + GSAP 3 with ScrollTrigger.
- **Project Structure**: Zero heavy frameworks, pure web standards (`index.html`, `/assets`, `/css`, `/js`).
- **Responsive Viewports**: Mobile-first architecture tested and verified across 1440px Desktop, 768px Tablet, and 390px Mobile (iPhone standard).
- **Design System & Palette**: Extracted directly from Little Idly's official logo and visual identity:
  - Cream: `#FBF8F2`
  - Warm Beige: `#F2EBE2`
  - Dark Leaf Green: `#2C3E2D`
  - Terracotta: `#B85A1F`
  - Vada Orange: `#E08A2E`
  - Logo Brown: `#3A1F14`
  - Turmeric Gold: `#F6C358`
  - Dark Stage: `#101418`

---

## 🚀 How to Run the Project

1. **Navigate to the Project Directory**:
   ```bash
   cd /Users/mac/.gemini/antigravity/scratch/little-idly
   ```

2. **Start Any Local Web Server**:
   Using Python:
   ```bash
   python3 -m http.server 8888
   ```
   Or using Node / npx:
   ```bash
   npx serve .
   ```

3. **Open in Browser**:
   Visit [http://localhost:8888](http://localhost:8888) in Chrome, Safari, or Firefox.

*(Note: The server is already active on port `8888`).*

---

## 📐 Reference Alignment & Section Breakdown

| Section # | Component | Reference Inspiration | Execution Details |
|---|---|---|---|
| **1** | **Opening Curtain Preloader** | *Gourou Indian Food* | Retro halftone collage with CMYK dot screens and terracotta/green blocks. Displays Little Idly logo badge, 3 steaming line icons (idly, dosa, sambar), and italic tagline *"All the way from South India to Dubai"*. Splits and slides left/right. Includes session storage memory and a **"Replay intro"** button in the footer for pitch demos. |
| **2** | **Hero Slider** | *Sambar Cafe* | Full-width `#101418` dark stage with round black arrow buttons. Alternates dish-right/text-left and dish-left/text-right across 4 signature dishes using **pure floating food cutouts** (`dosa_pure_cutout.png`, `podi_pure_cutout.png`, `vada_pure_cutout.png`, `tiffin_pure_cutout.png`) with realistic drop shadows. Uses `PT Sans Narrow` letter-spaced uppercase titles, animated 3px drawing rule, and sharp yellow `"VIEW MENU ›"` button. |
| **3** | **Essentials Strip** | Client UX | Quick-access strip with direct anchor to Menu & AED prices, Google Maps directions, tap-to-call, and **live Dubai time calculation** (`Asia/Dubai`, UTC+4) indicating open/closed status. |
| **4** | **Story Section** | *Mr. Spring (Hero 1)* & *The House of Makeba* | Displays bold *"Welcome Home to Authentic South Indian Flavours!"* with brush script accent and *"Flavors & Stories of Al Karama"*. Includes overlapping scalloped postage-stamp frames with botanical sprig badge showing real restaurant dining photography against a subtle Dubai & temple skyline. |
| **5** | **Made Fresh Daily Band** | *Mr. Spring (Hero 2)* | Dark green `#2C3E2D` band with top architectural sketch reveal (temple gopuram & coconut palms peeking above the torn paper). Two overlapping dish stamps with botanical leaf sprig, plus a **custom green line-art South Indian chef stirring a bubbling pot with a ladle**, right-aligned stacked headline, and dual action buttons. |
| **6** | **See What's Cooking!** | *Mr. Spring (Section 2)* | Sparkle accent mark above brush script title. **3-Column layout**: On the left, a **handcrafted dark green line-art South Indian Uncle illustration** (traditional tiffin & kaapi master with veshti, shoulder towel, and yoke carrier baskets). In the center, a stacked cluster of pure cutouts (podi idly, ghee dosa, medu vada). On the right, category cards with **horizontal leader lines** connecting directly to the dishes. |
| **7** | **Searchable Menu & Order Bag** | Client Business Hub | Real-time search by dish or ingredient, category tabs (`All`, `Idlys`, `Vadas`, `Dosas & Uthappam`, `Tiffin Combos`, `Filter Coffee & Sweets`), 100% pure veg green badges on every item, verified AED prices from Little Idly's official menu cards, and slide-over order drawer with WhatsApp pre-formatted messaging (`+971 4 244 4359`). |
| **8** | **Gather 'round, Family Time!** | *Mr. Spring (Section 3)* | Centered headline with green action button. Features Little Idly's official animated mascot trio at bottom left, floating feast platter at bottom right, and a showcase of kids' zero-spice items (Mini Button Idlis, Crispy Cone Dosa, Pineapple Kesari). |
| **9** | **Latest Updates** | Little Idly Journal | Redesign of Little Idly's blog/updates: 1 large featured card for the viral *Podi Mango Ice Cream* + 2 horizontal cards with tag chips, hover image zoom, and publication dates. |
| **10** | **Social Strip & Stories** | *The House of Makeba* & *Mr. Spring* | Editorial layout: *"Join us on a journey of FLAVORS & STORIES"* with large overlapping tilted Polaroid photo frames showing authentic Karama dining moments and culinary craft, followed by a 4-column community photo grid linking to `@littleidly.ae`. |
| **11** | **Footer & Mobile Action Bar** | Client Conversion UX | Full footer with verified address, Google Maps link, phone, email, hours, and "Replay Intro" button. On mobile (<768px), displays a fixed bottom bar with 4 equal tap targets: Menu, Order (with live badge), Directions, Call. |

---

## 📋 Client Pitch Review & Verification TODOs

During the pitch meeting with the restaurant owner, present these specific verified items and open client action items:

### ✅ Verified Facts (Implemented from Official Sources):
- **Official Address**: Shop no: 5, 6 & 7, Al Blouki Building 105, Plot no: 219-0, 70 4C St, Al Karama, Dubai, UAE (Near ADCB Metro Station, Gate 1).
- **Telephone**: `+971 4 244 4359` / WhatsApp: `+971 4 244 4359`.
- **Email**: `support@littleidly.ae`.
- **Opening Year**: Established 2023.
- **Menu Pricing**: All 34 items mapped directly from official menu cards (e.g. Classic Idly Set 7 AED, Ghee Roast Dosa 9 AED, Mini Tiffin 14 AED, Kumbakonam Coffee 5 AED).
- **Opening Hours**: 7:00 AM – 11:30 PM Daily.

### 📝 Client Action Items (TODOs to Request from Restaurant Owner):
1. **[TODO - Photography] High-Resolution Isolated Filter Coffee**: Little Idly currently uses graphic promo badges for Kumbakonam Degree Filter Kaapi; recommend shooting a dedicated high-res photo of the brass davarah-tumbler with frothy kaapi pour for the hero slider.
2. **[TODO - Photography] Ven Pongal Standalone Close-up**: Pongal is currently photographed as part of the Mini Tiffin platter; recommend a standalone bowl shot.
3. **[TODO - Menu Updates] Seasonal & Special Availability**: Verify whether Afternoon Rice Varieties (Sambar Rice, Puliogare) and 4PM Evening Snacks (Pazham Pori, Ela Ada) should have automated time-of-day availability toggles on the live ordering menu.
4. **[TODO - Catering & Bulk Orders] Party Order WhatsApp Form**: Propose adding a dedicated corporate / family party order inquiry calculator for Karama and Bur Dubai catering.
