/* ============================================================
   YOUR COLLAGE
   This is the only file to edit when you add or change tiles.

   Each tile is one line between the square brackets [ ... ].
   Copy an existing line, then change:
     image  – the picture file name (for a still tile), or
     video  – the video name WITHOUT .mp4 (for a moving tile).
              Upload name.mp4, name.webm and name-poster.webp
     play   – add  play: "hover"  to a video tile to make it play only
              when someone hovers over it (it never starts on its own)
     title  – what shows when someone hovers
     client – the company, shown under the title on hover
     link   – the page it opens (leave as "" if it shouldn't link anywhere)
     alt    – a short description of the picture, for screen readers

   Tip: calm, simple crops look best – one headline, one illustration,
   one button – rather than a whole busy screen.

   Tiles flow down the columns in the order listed. You can have as
   many video tiles as you like: only one plays at a time.
   ============================================================ */

window.COLLAGE = [
  { video: "economist", title: "Innovating at The Economist", client: "The Economist", link: "economist.html", alt: "The Economist app, browsing the Weekly edition" },
  { image: "tile-perk.webp", title: "Cutting friction at Perk", client: "Perk", link: "perk.html", alt: "Perk: Control for finance. Simplicity for everyone." },
  { video: "flights-vision", play: "hover", title: "Owning the vision at Booking.com", client: "Booking.com", link: "flights-vision.html", alt: "Slides from the Flights UX Vision 2023 document" },
  { image: "tile-flo.webp", title: "Growing loyalty at Flo", client: "Flo Health", link: "flo.html", alt: "Flo illustration of a woman reading in the bath" },
  { image: "tile-price-alerts.webp", title: "Converting price watchers at Booking.com", client: "Booking.com", link: "price-alerts.html", alt: "Booking.com flight search with price alerts switched on" },
  { image: "tile-eventix.webp", title: "Growing event sign-ups at Eventix", client: "Eventix", link: "eventix.html", alt: "Eventix: Success, your order is confirmed!" },
  { video: "flo", title: "Growing loyalty at Flo", client: "Flo Health", link: "flo.html", alt: "Flo perimenopause onboarding flow" },
];
