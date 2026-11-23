const MENU_ITEMS = [
  // --- IDLYS ---
  {
    id: "idly-set",
    name: "Classic Idly Set (3 pcs)",
    category: "idlys",
    price: 7,
    isVeg: true,
    tag: "Popular",
    description: "Three pillow-soft, naturally fermented steamed rice cakes. Served with piping hot sambar, coconut chutney, tomato chutney & coriander chutney.",
    image: "assets/dishes/idly_set.jpg"
  },
  {
    id: "sambar-idly",
    name: "Sambar Idly (2 pcs)",
    category: "idlys",
    price: 9,
    isVeg: true,
    tag: "Comfort",
    description: "Two fluffy steamed idlis submerged in a deep bowl of aromatic lentil sambar, garnished with fresh cilantro and a dollop of ghee.",
    image: "assets/dishes/little_idly_mini.jpg"
  },
  {
    id: "little-idly-mini",
    name: "Little Idly Signature (14 pcs)",
    category: "idlys",
    price: 9,
    isVeg: true,
    tag: "Kids Favorite",
    description: "Fourteen bite-sized mini idlis generously swimming in golden sambar, infused with ghee and paired with freshly grated coconut chutney.",
    image: "assets/dishes/little_idly_mini.jpg"
  },
  {
    id: "guntur-podi-idly",
    name: "Guntur Podi Idly (2 pcs)",
    category: "idlys",
    price: 10,
    isVeg: true,
    tag: "Spicy 🌶️",
    description: "Two steamed idlis generously tossed in fiery Andhra Guntur chili podi and pure melted ghee. Bold, fragrant, and unforgettable.",
    image: "assets/dishes/guntur_podi_idly.jpg"
  },
  {
    id: "plain-thatte-idly",
    name: "Plain Thatte Idly (1 pc)",
    category: "idlys",
    price: 7,
    isVeg: true,
    tag: "Karnataka Style",
    description: "Traditional plate-sized Thatte idly, exceptionally soft, thick and spongy. Perfect comfort food served with sambar & assorted chutneys.",
    image: "assets/dishes/plain_thatte_idly.jpg"
  },
  {
    id: "ghee-podi-thatte-idly",
    name: "Ghee Podi Thatte Idly (1 pc)",
    category: "idlys",
    price: 10,
    isVeg: true,
    tag: "Must Try ❤️",
    description: "Warm plate idly coated with house-roasted spiced gunpowder podi and a generous pour of pure desi ghee.",
    image: "assets/dishes/ghee_podi_thatte_idly.jpg"
  },
  {
    id: "mix-n-match-podi",
    name: "Mix n' Match Podi Idly (2 pcs)",
    category: "idlys",
    price: 16,
    isVeg: true,
    tag: "Customizable",
    description: "Choose your favorite podi combination: Classic Gunpowder, Karivepillai (Curry Leaf), or Roasted Garlic Podi.",
    image: "assets/dishes/mix_n_match_podi.jpg"
  },
  {
    id: "little-idly-kondattam",
    name: "Little Idly Kondattam (14 pcs)",
    category: "idlys",
    price: 14,
    isVeg: true,
    tag: "Snack Favorite",
    description: "Fourteen crispy-tossed mini idlis spiced with your choice of Classic Gunpowder, Curry Leaf, or Garlic Podi.",
    image: "assets/dishes/little_idly_kondattam.jpg"
  },

  // --- VADAS ---
  {
    id: "medu-vada",
    name: "Medu Vada (2 pcs)",
    category: "vadas",
    price: 6.5,
    isVeg: true,
    tag: "Crispy",
    description: "Golden fried urad dal donuts, extraordinarily crunchy on the outside and cloud-soft inside, seasoned with crushed peppercorns & curry leaves.",
    image: "assets/dishes/idly_vada_set.jpg"
  },
  {
    id: "sambar-vada",
    name: "Sambar Vada (2 pcs)",
    category: "vadas",
    price: 9,
    isVeg: true,
    tag: "Traditional",
    description: "Crispy medu vadas allowed to soak in aromatic drumstick sambar until tender and brimming with rich flavors.",
    image: "assets/dishes/idly_vada_set.jpg"
  },
  {
    id: "rasa-vada",
    name: "Rasa Vada (2 pcs)",
    category: "vadas",
    price: 9,
    isVeg: true,
    tag: "Zesty 🌶️",
    description: "Two crispy lentil vadas submerged in fiery, pepper-laced heirloom tomato rasam for an invigorating experience.",
    image: "assets/dishes/idly_vada_set.jpg"
  },
  {
    id: "parippu-vada",
    name: "Parippu Vada (2 pcs)",
    category: "vadas",
    price: 6.5,
    isVeg: true,
    tag: "Tea-Time Classic",
    description: "Authentic crunchy chana dal patties infused with shallots, ginger, green chilies, and hand-torn curry leaves.",
    image: "assets/dishes/idly_vada_set.jpg"
  },
  {
    id: "dahi-vada",
    name: "Dahi Vada (2 pcs)",
    category: "vadas",
    price: 10,
    isVeg: true,
    tag: "Cooling",
    description: "Delicate lentil dumplings soaked in creamy, lightly tempered curd topped with roasted cumin and fresh coriander.",
    image: "assets/dishes/idly_vada_set.jpg"
  },

  // --- DOSAS & UTHAPPAM ---
  {
    id: "ghee-roast-dosa",
    name: "Pure Ghee Roast Dosa",
    category: "dosas",
    price: 9,
    isVeg: true,
    tag: "Dubai's Favorite ❤️",
    description: "Wafer-thin, golden-crusted artisanal crepe roasted to perfection in 100% pure desi ghee. Served with sambar & three chutneys.",
    image: "assets/dishes/ghee_roast_dosa.jpg"
  },
  {
    id: "masala-dosa",
    name: "Classic Masala Dosa",
    category: "dosas",
    price: 8.5,
    isVeg: true,
    tag: "All-Time Best",
    description: "Crispy tawa crepe rolled around a comforting spiced potato and onion bhaji tempered with mustard seeds & curry leaves.",
    image: "assets/dishes/masala_dosa.jpg"
  },
  {
    id: "mysore-masala-dosa",
    name: "Mysore Masala Dosa",
    category: "dosas",
    price: 14,
    isVeg: true,
    tag: "Signature 🌶️",
    description: "Crisp dosa lined with spicy, tangy Mysore garlic red chili chutney paste, layered with spiced potato mash.",
    image: "assets/dishes/mysore_masala_dosa.jpg"
  },
  {
    id: "ghee-mysore-masala-dosa",
    name: "Ghee Mysore Masala Dosa",
    category: "dosas",
    price: 16,
    isVeg: true,
    tag: "Chef's Special",
    description: "The royal Mysore masala dosa roasted in pure desi ghee for an irresistible crunch and richness.",
    image: "assets/dishes/mysore_masala_dosa.jpg"
  },
  {
    id: "ghee-podi-dosa",
    name: "Ghee Podi Dosa",
    category: "dosas",
    price: 12.5,
    isVeg: true,
    tag: "Crispy Podi",
    description: "Golden crepe generously dusted with house gun-powder and drenched in fragrant ghee for an aromatic crunch.",
    image: "assets/dishes/ghee_roast_dosa.jpg"
  },
  {
    id: "rava-masala-dosa",
    name: "Rava Masala Dosa",
    category: "dosas",
    price: 15,
    isVeg: true,
    tag: "Lacy & Crisp",
    description: "Intricately netted semolina crepe studded with crushed black pepper, ginger, and cumin seeds, stuffed with spiced potato.",
    image: "assets/dishes/rava_masala_dosa.jpg"
  },
  {
    id: "beetroot-dosa",
    name: "Healthy Beetroot Dosa",
    category: "dosas",
    price: 14,
    isVeg: true,
    tag: "Nutritious",
    description: "Vibrant natural pink dosa made from fermented batter infused with pure beetroot extract, roasted with mild spices.",
    image: "assets/dishes/beetroot_dosa.jpg"
  },
  {
    id: "ragi-dosa",
    name: "Ragi Millet Dosa",
    category: "dosas",
    price: 12.5,
    isVeg: true,
    tag: "Ancient Grain",
    description: "Wholesome finger millet crepe, high in fiber and calcium, roasted with mild seasonings for a nourishing meal.",
    image: "assets/dishes/ragi_dosa.jpg"
  },
  {
    id: "onion-uthappam",
    name: "Caramelized Onion Uthappam",
    category: "dosas",
    price: 10,
    isVeg: true,
    tag: "Thick & Soft",
    description: "Thick fermented pancake loaded with caramelized onions, finely chopped green chilies, and fresh coriander.",
    image: "assets/dishes/uthappam.jpg"
  },

  // --- TIFFIN COMBOS ---
  {
    id: "mini-tiffin",
    name: "Little Idly Mini Tiffin",
    category: "combos",
    price: 14,
    isVeg: true,
    tag: "Best Value 🌟",
    description: "The grand sampler: 5 Mini Idlys + 1 Mini Medu Vada + 1 Mini Masala Dosa + Ven Pongal or Upma + Daily Sweet + Sambar & Chutneys.",
    image: "assets/dishes/mini_tiffin.jpg"
  },
  {
    id: "mini-tiffin-coffee",
    name: "Mini Tiffin + Filter Coffee Combo",
    category: "combos",
    price: 16,
    isVeg: true,
    tag: "Top Seller",
    description: "Our complete 5-item Mini Tiffin served alongside a steaming cup of authentic Kumbakonam degree filter coffee.",
    image: "assets/dishes/mini_tiffin.jpg"
  },
  {
    id: "mega-tiffin-coffee",
    name: "MEGA Tiffin + Filter Coffee",
    category: "combos",
    price: 20,
    isVeg: true,
    tag: "Feast Platter",
    description: "The ultimate feast: 5 Mini Idlys, 2 Fluffy Pooris, 1 Medu Vada, 1 Mini Masala Dosa, Pongal, Sweet & Kumbakonam Coffee.",
    image: "assets/dishes/mini_tiffin.jpg"
  },
  {
    id: "idly-vada-set",
    name: "Idly & Vada Combo (2 Idly + 2 Vada)",
    category: "combos",
    price: 12,
    isVeg: true,
    tag: "The Classic Pair",
    description: "Two steamed pillow idlis paired with two crispy golden medu vadas, served with hot sambar and trio of chutneys.",
    image: "assets/dishes/idly_vada_set.jpg"
  },
  {
    id: "panchathanthiram-dosa",
    name: "Panchathanthiram Mini Dosa Set (5 pcs)",
    category: "combos",
    price: 15,
    isVeg: true,
    tag: "Chef's Creation",
    description: "Platter of five distinct miniature specialty dosas celebrating regional South Indian styles and podis.",
    image: "assets/dishes/panchathanthiram_dosa.jpg"
  },
  {
    id: "ven-pongal-vada",
    name: "Ghee Ven Pongal with Medu Vada",
    category: "combos",
    price: 10.5,
    isVeg: true,
    tag: "Morning Soul Food",
    description: "Silky rice and moong dal tempered with whole cashews, black peppercorns, cumin & pure desi ghee, served with crunchy medu vada.",
    image: "assets/dishes/mini_tiffin.jpg"
  },
  {
    id: "poori-masala",
    name: "Poori Masala (3 pcs)",
    category: "combos",
    price: 8,
    isVeg: true,
    tag: "Hot & Puffed",
    description: "Three hot, puffed whole-wheat pooris served with comforting South Indian potato bhaji and coconut chutney.",
    image: "assets/dishes/poori_masala.jpg"
  },
  {
    id: "idiyappam-curry",
    name: "Idiyappam with Kadala Curry (3 pcs)",
    category: "combos",
    price: 10,
    isVeg: true,
    tag: "Kerala Classic",
    description: "Delicate steamed rice string hoppers paired with a richly spiced coconut black chickpea gravy.",
    image: "assets/dishes/idiyappam.jpg"
  },
  {
    id: "lemon-sevai",
    name: "Lemon Sevai",
    category: "combos",
    price: 11,
    isVeg: true,
    tag: "Tangy & Fresh",
    description: "Steamed rice vermicelli tempered with mustard seeds, crunchy roasted peanuts, fresh ginger and lemon juice.",
    image: "assets/dishes/lemon_sevai.jpg"
  },
  {
    id: "coconut-sevai",
    name: "Coconut Sevai",
    category: "combos",
    price: 12,
    isVeg: true,
    tag: "Fragrant",
    description: "Delicate rice noodles tossed with freshly grated coconut, cashews, and aromatic curry leaves.",
    image: "assets/dishes/coconut_sevai.jpg"
  },
  {
    id: "tomato-sevai",
    name: "Tomato Sevai",
    category: "combos",
    price: 12,
    isVeg: true,
    tag: "Spiced & Zesty",
    description: "Rice vermicelli tossed in homestyle spiced tomato and onion masala.",
    image: "assets/dishes/tomato_sevai.jpg"
  },

  // --- FILTER COFFEE & SWEETS ---
  {
    id: "degree-filter-coffee",
    name: "Kumbakonam Degree Filter Kaapi",
    category: "coffee",
    price: 5,
    isVeg: true,
    tag: "Iconic Drink ☕",
    description: "Authentic chicory-infused South Indian filter coffee slow-dripped in brass filters and frothed with boiled full-cream milk.",
    image: "assets/dishes/filter_coffee.jpg"
  },
  {
    id: "cold-filter-kaapi",
    name: "Artisanal Cold Filter Kaapi",
    category: "coffee",
    price: 10,
    isVeg: true,
    tag: "Chilled Refreshment",
    description: "Double-strength Kumbakonam coffee decoction shaken over ice with sweetened rich milk. Bold, smooth and refreshing.",
    image: "assets/dishes/filter_coffee.jpg"
  },
  {
    id: "filter-kaapi-softy",
    name: "Filter Kaapi Softy Ice Cream",
    category: "coffee",
    price: 8,
    isVeg: true,
    tag: "#1 Trending Dessert 🔥",
    description: "Dubai's viral South Indian dessert — creamy artisanal soft-serve ice cream infused with real Kumbakonam filter coffee decoction.",
    image: "assets/updates/podi_mango_icecream.webp"
  },
  {
    id: "kesari-bath",
    name: "Pineapple & Saffron Kesari Bath",
    category: "coffee",
    price: 9,
    isVeg: true,
    tag: "Royal Sweet",
    description: "Melt-in-your-mouth roasted semolina pudding swimming in desi ghee, infused with saffron strands and roasted whole cashews.",
    image: "assets/dishes/mini_tiffin.jpg"
  },
  {
    id: "gulab-jamun",
    name: "Hot Gulab Jamun (2 pcs)",
    category: "coffee",
    price: 6,
    isVeg: true,
    tag: "Sweet Classic",
    description: "Golden fried khoya dumplings soaked in warm rosewater and green cardamom infused sugar syrup.",
    image: "assets/updates/podi_mango_icecream.webp"
  }
];

if (typeof window !== 'undefined') {
  window.MENU_ITEMS = MENU_ITEMS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MENU_ITEMS;
}
