// All editable site content lives here. Update this file to add updates,
// photos, videos, press, or change the donation link. No backend needed.
import withStudents from "@/assets/photos/vyom-with-students.jpg";
import srijanStage from "@/assets/photos/vyom-srijan-stage.jpg";
import jagran from "@/assets/press/dainik-jagran.jpg";
import bundeli from "@/assets/press/bundeli-prahar.jpg";
import sunhara from "@/assets/press/sunhara-sansar.jpg";
import reader from "@/assets/press/reader-times.jpg";
import vidhan from "@/assets/press/vidhan-kesari.jpg";
import upKiBaat from "@/assets/press/up-ki-baat.jpg";

export const EMAIL = "roborootsinitiative@gmail.com";

// Paste a donation page link here (Razorpay Payment Page, PayPal, Zeffy, GoFundMe...).
// While empty, every donate button opens an email to EMAIL instead.
export const DONATE_URL = "";

// Free contact form backend: get an access key at https://web3forms.com (sent to EMAIL)
// and set VITE_WEB3FORMS_KEY. While empty, the form falls back to opening an email.
export const WEB3FORMS_KEY = import.meta.env["VITE_WEB3FORMS_KEY"] ?? "";

// Fundraising progress. Update RAISED_INR as donations come in.
export const GOAL_INR = 200000;
export const RAISED_INR = 0;

export const PHOTOS = {
  withStudents: { src: withStudents, alt: "Vyom working with students on a robotics kit" },
  srijanStage: { src: srijanStage, alt: "Vyom presenting at the Srijan robotics workshop" },
};

export type Press = { outlet: string; date: string; src: string };
export const PRESS: Press[] = [
  { outlet: "Dainik Jagran, Hamirpur", date: "10 July 2026", src: jagran },
  { outlet: "Dainik Bundeli Prahar", date: "July 2026", src: bundeli },
  { outlet: "Reader Times", date: "July 2026", src: reader },
  { outlet: "Vidhan Kesari", date: "July 2026", src: vidhan },
  { outlet: "Sunhara Sansar", date: "July 2026", src: sunhara },
  { outlet: "UP Ki Baat", date: "July 2026", src: upKiBaat },
];

export const HERO_SLIDES = [
  { src: withStudents, cap: "Vyom building with students in India" },
  { src: srijanStage, cap: "Robotics workshop with Srijan Ek Soch" },
  { src: jagran, cap: "Featured in Dainik Jagran", contain: true },
];

export type GalleryCategory = "Workshop" | "Press" | "Zoom sessions" | "Kits and lab";
export const GALLERY_CATEGORIES: GalleryCategory[] = [
  "Workshop",
  "Press",
  "Zoom sessions",
  "Kits and lab",
];
// Easiest: add photos and videos from the /admin page (Google Drive or YouTube links).
// In code: import an image at the top and add { type: "image", src, cap, category },
// or add { type: "video", url, cap, category } with a YouTube or Google Drive link.
export type GalleryItem =
  | { type: "image"; src: string; cap: string; category: GalleryCategory }
  | { type: "video"; url: string; cap: string; category: GalleryCategory };

export const GALLERY: GalleryItem[] = [
  {
    type: "image",
    src: withStudents,
    cap: "Vyom guiding students through a build",
    category: "Workshop",
  },
  {
    type: "image",
    src: srijanStage,
    cap: "Opening the Srijan robotics workshop",
    category: "Workshop",
  },
  ...PRESS.map((p): GalleryItem => ({
    type: "image",
    src: p.src,
    cap: `${p.outlet}, ${p.date}`,
    category: "Press",
  })),
];

export type Update = { date: string; category: string; title: string; body: string };
// Newest first. Add a new object at the top to post an update.
export const UPDATES: Update[] = [
  {
    date: "Coming soon",
    category: "U.S. Fundraising Workshops",
    title: "U.S. Robotics Fundraising Workshop",
    body: "RoboRoots is planning a beginner robotics workshop for younger students in the U.S. Proceeds will support robotics learning access for students in India.",
  },
  {
    date: "Now",
    category: "Lab Fundraising",
    title: "Robotics Mini-Lab Fundraising Begins",
    body: "RoboRoots is raising funds to help create a robotics mini-lab where students can continue practicing with kits, sensors, motors, and structured learning material.",
  },
  {
    date: "Ongoing",
    category: "Online Learning",
    title: "Online Sessions Continue",
    body: "After the India workshop, RoboRoots continued student engagement through Zoom sessions to help reinforce concepts and maintain learning continuity.",
  },
  {
    date: "July 2026",
    category: "Press",
    title: "Covered by Dainik Jagran and five other outlets",
    body: "Local newspapers in Hamirpur, Uttar Pradesh reported on the workshop for 57 students selected through the Gramin Talent Search Exam, and on plans for weekly robotics classes going forward.",
  },
  {
    date: "July 2026",
    category: "India Workshop",
    title: "RoboRoots India Workshop Completed",
    body: "RoboRoots completed a 5-day hands-on robotics and AI workshop with students in India. Students were introduced to basic robotics components, coding logic, AI concepts, and hands-on building.",
  },
];
