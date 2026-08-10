/**
 * WEDDING INVITATION CONFIGURATION
 * 
 * Centralized configuration file for the wedding invitation application.
 * Update any value in this object to customize the website text, date,
 * event locations, RSVP links, bank details, and images.
 */

const WEDDING_CONFIG = {
  // Couple Information
  couple: {
    groom: {
      name: "Rjay Aranel",
      shortName: "Rjay",
      parents: "Son of Mr. Henry M. Aranel & Mrs. Ma. Salve A. Aranel +",
      social: { platform: "facebook", handle: "@rjay.lenara" },
      image: "assets/images/groom.jpg"
    },
    bride: {
      name: "Jeph Senile Espinosa",
      shortName: "Jeph",
      parents: "Daughter of Mr. Julio F. Espinosa Jr. + & Mrs. Emma L. Espinosa",
      social: { platform: "instagram", handle: "@jphsnlesp" },
      image: "assets/images/bride.jpg"
    },
    thankYou: "Rjay and Jeph"
  },

  // Wedding Party / Entourage
  entourage: {
    parents: {
      groom: "Henry M. Aranel & Ma. Salve A. Aranel +",
      bride: "Julio F. Espinosa Jr. + & Emma L. Espinosa"
    },
    principalSponsors: [
      { wife: "Mrs. Beverly M. Alcantara", husband: "Mr. Zaldy M. Alcantara" },
      { wife: "Mrs. Emerose E. Grefaldeo", husband: "Mr. Edwin J. Grefaldeo" },
      { wife: "Mrs. Donnalyn M. Campos", husband: "Mr. Roberto T. Campos" },
      { wife: "Mrs. Dolores V. Nate", husband: "Mr. Ivan C. Nate" },
      { wife: "Mrs. Sally C. Segui", husband: "Mr. Erwin C. Segui" },
      { wife: "Mrs. Minerva V. Gomez", husband: "Mr. Ariel R. Gomez" },
      { wife: "Mrs. Maria Eloisa M. Calimlim", husband: "Mr. Darwin B. Almilla" },
      { wife: "Mrs. Marie Rose DJ. Loria", husband: "Mr. Rechallan N. Loma" }
    ],
    bestMan: "Julius A. Silerio",
    maidOfHonor: "Jae Serene E. Almodiel",
    secondarySponsors: {
      candles: { wife: "Mary Ruth E. Sevilla", husband: "Russel A. Aranel" },
      cords: { wife: "Mara Cristia R. Yao", husband: "Vergel D. Carreon" },
      veil: { wife: "Rizza Mae R. Sayson", husband: "Ronnel Jensen Calimlim" }
    },
    groomsmen: [
      "Nigel Warner L. Casquejo",
      "Romerick B. Aringo",
      "John Allen M. Ciron",
      "Jemrick Randale C. Gaufo",
      "Dave Toledo"
    ],
    bridesmaids: [
      "Rinnah Chloe Aranel",
      "Katrina B. Santiago",
      "Mary Dianne Stephanie C. Bermundo",
      "Maristella Venise R. Bitabara",
      "Azil Anne J. Nocete"
    ],
    flowerGirls: [
      "Ziyahna M. Alcantara",
      "Raffa Daniela M. Campos",
      "Galatea Gayle E. Almodiel"
    ],
    bibleBearer: "Rhaf Jhon M. Campos",
    ringBearer: "Psalm Oliver A. Oyardo"
  },

  // Wedding Date & Time
  // Format: YYYY-MM-DDTHH:mm:ss (used for the countdown timer)
  weddingDate: "2026-12-19T10:30:00",
  displayDate: "Saturday, December 19, 2026",

  // Events Schedule
  events: {
    ceremony: {
      title: "Holy Matrimony",
      time: "10:30 AM - 11:30 AM",
      venue: "St. Gregory the Great Parish Church",
      address: "Mons. F. Reyes St., Old Albay District, Legazpi City, Albay",
      googleMapsUrl: "https://maps.google.com/?q=St+Gregory+the+Great+Parish+Church+Legazpi+City",
      googleCalendarUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Holy+Matrimony+Rjay+%26+Jeph&dates=20261219T023000Z/20261219T033000Z&details=Wedding+Ceremony&location=St.+Gregory+the+Great+Parish+Church"
    },
    reception: {
      title: "Wedding Reception",
      time: "12:00 PM - 04:00 PM",
      venue: "Casa Lorenzo",
      address: "Purok 1, Tagas Daraga, Albay",
      googleMapsUrl: "https://maps.google.com/?q=Casa+Lorenzo+Tagas+Daraga+Albay",
      googleCalendarUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Reception+Rjay+%26+Jeph&dates=20261219T040000Z/20261219T080000Z&details=Wedding+Reception&location=Casa+Lorenzo"
    }
  },

  // Google Form RSVP Link
  rsvp: {
    googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSe-placeholder/viewform",
    message: "We have reserved a seat for you. Unfortunately due to guest count, we won't be able to extend the invitation to your plus ones. We hope to share this once-in-a-lifetime moment with you. Please reply on or before November 18, 2026."
  },

  // Virtual Gift & Bank Account Details
  gift: {
    title: "Wedding Gift & Digital Angpao",
    description: "With all that we have, we've been truly blessed. Your presence and prayers are all that we requested. But if you desire to give nonetheless, a monetary gift is one we humbly suggest.",
    banks: [
      {
        bankName: "GCash",
        accountNumber: "—",
        accountHolder: "Jeph Espinosa"
      },
      {
        bankName: "BDO",
        accountNumber: "—",
        accountHolder: "Rjay Aranel"
      }
    ],
    qrCodeImage: "assets/images/rsvp-gift.jpg"
  },

  // Photo Gallery Images (sorted by capture date)
  gallery: [
    // Aug 4
    { url: "assets/images/gallery-7.jpg", caption: "Love Laughs" },
    { url: "assets/images/gallery-1.jpg", caption: "The Journey Begins" },
    { url: "assets/images/gallery-3.jpg", caption: "A Lifetime of Love" },
    { url: "assets/images/wd-photo6.jpg", caption: "Wedding Detail" },
    { url: "assets/images/gallery-2.jpg", caption: "Moments to Cherish" },
    // Aug 6
    { url: "assets/images/gallery-5.jpg", caption: "Together Forever" },
    { url: "assets/images/gallery-6.jpg", caption: "Our Happy Place" },
    { url: "assets/images/gallery-4.jpg", caption: "Hand in Hand" },
    { url: "assets/images/gallery-8.jpg", caption: "Written in the Stars" },
    { url: "assets/images/gallery-9.jpg", caption: "Cherished Moments" },
    { url: "assets/images/gallery-10.jpg", caption: "Better Together" },
    { url: "assets/images/gallery-11.jpg", caption: "Always & Forever" },
    { url: "assets/images/gallery-12.jpg", caption: "Meant to Be" },
    { url: "assets/images/gallery-13.jpg", caption: "Endless Love" },
    { url: "assets/images/gallery-14.jpg", caption: "Happily Ever After" },
    { url: "assets/images/gallery-15.jpg", caption: "Two Souls, One Heart" },
    { url: "assets/images/gallery-16.jpg", caption: "Our Love Story" },
    // Aug 9
    { url: "assets/images/gallery-22.jpg", caption: "Sweet Memories" },
    { url: "assets/images/gallery-19.jpg", caption: "Forever Yours" },
    { url: "assets/images/wd-efdeed84-8bc4-4d8c-a546-87086fc985bb.jpg", caption: "Wedding Detail" },
    { url: "assets/images/wd-b687cf03-fe26-4972-92c5-26ff5af2d847.jpg", caption: "Wedding Detail" },
    { url: "assets/images/wd-d6a92739-c71d-4a72-ac78-20641c31387e.jpg", caption: "Wedding Detail" },
    { url: "assets/images/gallery-20.jpg", caption: "Heartfelt Joy" },
    { url: "assets/images/gallery-21.jpg", caption: "Eternal Bliss" },
    { url: "assets/images/wd-ddd984b8-847d-454e-be06-85c2aba8b3fe.jpg", caption: "Wedding Detail" },
    { url: "assets/images/gallery-23.jpg", caption: "Together Always" },
    { url: "assets/images/gallery-25.jpg", caption: "Love Never Fades" },
    { url: "assets/images/gallery-24.jpg", caption: "Our Special Day" },
    { url: "assets/images/wd-de49ec15-e711-49c1-958a-0fa6ca18ec51.jpg", caption: "Wedding Detail" },
    { url: "assets/images/wd-13eca37c-60ea-4e5a-b0af-faf6f85d6a82.jpg", caption: "Wedding Detail" },
    { url: "assets/images/wd-db93ecab-f774-44b1-80f9-53676a2a3485.jpg", caption: "Wedding Detail" },
    { url: "assets/images/gallery-17.jpg", caption: "A Beautiful Moment" },
    { url: "assets/images/gallery-18.jpg", caption: "Love in the Air" },
    { url: "assets/images/wd-adb8ec41-cd67-4507-a7af-bfba2cdff428.jpg", caption: "Wedding Detail" }
  ],

  // Background Audio Configuration
  audio: {
    // URL to ambient background music (MP3)
    src: "assets/audio/wedding-ambient.mp3",
    autoPlayOnOpen: true
  }
};
