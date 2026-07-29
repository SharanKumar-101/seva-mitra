import React, { useState, useEffect } from "react";

const BASE_URL = "https://seva-mitra.onrender.com"; // Your live secure backend

// ── Fonts & Global Styles ──────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const styleEl = document.createElement("style");
styleEl.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; background: #f4f7f9; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { display: none; }
  input, button, a, select { font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
  @keyframes slideUp   { from { opacity:0; transform:translateY(100%); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin      { to { transform: rotate(360deg); } }
  @keyframes shake     { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }
  @keyframes pulse     { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .fade-up  { animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .fade-in  { animation: fadeIn 0.3s ease forwards; }
  .slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .shake    { animation: shake 0.4s ease-in-out; }
  .skeleton { animation: pulse 1.5s ease-in-out infinite; background: #e2e8f0; border-radius: 8px; }

  .tap { transition: all 0.15s ease; cursor: pointer; }
  .tap:active { transform: scale(0.96); opacity: 0.9; }
  .tap:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
`;
document.head.appendChild(styleEl);

// ── Professional "Trust Blue" Theme ──────────────────────────────────────────
const BRAND = { 
  primary: "#2563eb",       
  primaryDark: "#1e3a8a",   
  primaryLight: "#eff6ff",  
  dark: "#0f172a",          
  subtle: "#64748b",        
  border: "#e2e8f0",        
  bg: "#f4f7f9"             
};

// ── Bilingual Dictionary (English / Kannada) ───────────────────────────────────
const translations = {
  en: {
    langToggle: "English / ಕನ್ನಡ",
    tagline: "Mysuru's verified service experts.",
    bookService: "Book a Service",
    becomeExpert: "Become an Expert",
    errValidDetails: "Please enter a valid name and 10-digit number.",
    errProviderDetails: "Please fill out all professional details.",
    errRegisterFailed: "Failed to register. Server error.",
    fullName: "Full Name",
    mobileNumber: "Mobile Number",
    yearsExp: "Years Exp",
    baseFee: "Base Fee (₹)",
    aadharAfterSignup: "Aadhar Verification required after signup.",
    getStarted: "Get Started",
    navHome: "Home",
    navBookings: "Bookings",
    navProfile: "Profile",
    workerDashboard: "Worker Dashboard",
    aadharKyc: "Aadhar KYC",
    aadharVerifiedMsg: "Identity verified successfully. You can now accept jobs.",
    aadharPendingMsg: "Required by admin to start accepting real jobs safely.",
    selectAadharFile: "Select Aadhar File",
    verifyingUidai: "Verifying with UIDAI Server...",
    aadharVerified: "Aadhar Verified",
    assignedJobs: "Assigned Jobs",
    waitingForRequests: "Waiting for incoming requests...",
    logOut: "Log Out",
    welcomeBack: "Welcome back,",
    active: "Active",
    experts: "Experts",
    services: "Services",
    available: "available",
    expertsNearby: "experts nearby",
    noExpertsAvailable: "No experts available",
    checkBackLater: "Check back later",
    kmAway: "km away",
    base: "base",
    select: "Select",
    verified: "Verified",
    experience: "Experience",
    rating: "Rating",
    baseFeeLabel: "Base Fee",
    yrs: "Yrs",
    howItWorks: "How it works",
    step1: "Tap call below — we secure your number.",
    step2: "Discuss the issue and finalize pricing.",
    step3: "Confirm to secure the booking.",
    secureCall: "Secure Call",
    connecting: "Connecting...",
    connectedConfirm: "Connected! Please confirm below to secure expert.",
    confirmToBook: "Confirm to Book",
    callAgain: "Call Again",
    secureBooking: "Secure Booking",
    pay30Fee: "Pay a ₹40 verification fee to secure your expert now.",
    pay30Securely: "Pay ₹40 Securely",
    cancel: "Cancel",
    verifyingWebhook: "Verifying Webhook...",
    checkingPaymentBank: "Checking payment status with bank.",
    bookingConfirmed: "Booking Confirmed!",
    expertSecuredNote: "Expert secured. You will pay the final amount after the job is completed.",
    completeBooking: "Complete Booking",
    bookingDone: "Booking Done!",
    bookingDoneNote: "Your {category} has been secured and is on the way.",
    viewBookings: "View Bookings",
    returnHome: "Return Home",
    myBookings: "My Bookings",
    noHistoryYet: "No history yet",
    pastBookingsHere: "Your past bookings will appear here",
    completeJob: "Complete Job",
    cancelBooking: "Cancel",
    cancelBookingTitle: "Cancel Booking",
    selectCancelReason: "Please select a reason.",
    back: "Back",
    confirm: "Confirm",
    jobDonePaid: "Job Done & Paid",
    completeAndSettle: "Complete & Settle",
    enterFinalAmount: "Please enter the final negotiated amount in your UPI app.",
    cashWarning: "Paying in cash instantly voids your 7-Day Free Recast Warranty. Pay via the app to stay protected.",
    warning: "WARNING:",
    payUsingUpi: "Pay using UPI Apps",
    iHavePaid: "I have paid, verify status",
    close: "Close",
    checkingFinalPayment: "Checking final payment status.",
    jobCompleted: "Job Completed!",
    warrantyActive: "Payment successful. Your 7-Day Free Recast Warranty is now active.",
    done: "Done",
    rateService: "Rate the Service",
    rateExperience: "How was your experience with {name}?",
    submitFeedback: "Submit Feedback",
    helpSupport: "Help & Support",
    termsOfService: "Terms of Service",
    aboutSevamitra: "About Sevamitra",
    callFailed: "Call failed. Try again.",
    serverUnreachable: "Could not reach server. Check your connection.",
    paymentGatewayFailed: "Failed to load payment gateway.",
    paymentFailed: "Payment Failed. Try again.",
    paymentInitFailed: "Something went wrong initializing payment.",
    statusConfirmed: "Confirmed",
    statusCompleted: "Completed",
    statusPending: "Pending",
    statusCancelled: "Cancelled",
    catElectrician: "Electrician",
    catPlumber: "Plumber",
    catMechanics: "Mechanics",
    catMaids: "Maids",
    catLocalChefs: "Local Chefs",
    catPriests: "Priests",
    cancelReasons: [
      { value: "Booked by mistake", label: "Booked by mistake" },
      { value: "Price too high", label: "Price too high" },
      { value: "Problem solved", label: "Problem solved" },
      { value: "Found another expert", label: "Found another expert" },
      { value: "Other", label: "Other" },
    ],
  },
  kn: {
    langToggle: "English / ಕನ್ನಡ",
    tagline: "ಮೈಸೂರಿನ ಪರಿಶೀಲಿತ ಸೇವಾ ತಜ್ಞರು.",
    bookService: "ಸೇವೆ ಬುಕ್ ಮಾಡಿ",
    becomeExpert: "ತಜ್ಞರಾಗಿ ಸೇರಿ",
    errValidDetails: "ದಯವಿಟ್ಟು ಸರಿಯಾದ ಹೆಸರು ಮತ್ತು 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.",
    errProviderDetails: "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ವೃತ್ತಿಪರ ವಿವರಗಳನ್ನು ತುಂಬಿರಿ.",
    errRegisterFailed: "ನೋಂದಣಿ ವಿಫಲವಾಯಿತು. ಸರ್ವರ್ ದೋಷ.",
    fullName: "ಪೂರ್ಣ ಹೆಸರು",
    mobileNumber: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    yearsExp: "ಅನುಭವ (ವರ್ಷ)",
    baseFee: "ಮೂಲ ಶುಲ್ಕ (₹)",
    aadharAfterSignup: "ಸೈನ್ ಅಪ್ ನಂತರ ಆಧಾರ್ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.",
    getStarted: "ಪ್ರಾರಂಭಿಸಿ",
    navHome: "ಮುಖಪುಟ",
    navBookings: "ಬುಕಿಂಗ್‌ಗಳು",
    navProfile: "ಪ್ರೊಫೈಲ್",
    workerDashboard: "ಕಾರ್ಮಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    aadharKyc: "ಆಧಾರ್ KYC",
    aadharVerifiedMsg: "ಗುರುತು ಯಶಸ್ವಿಯಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ಈಗ ನೀವು ಕೆಲಸಗಳನ್ನು ಸ್ವೀಕರಿಸಬಹುದು.",
    aadharPendingMsg: "ನಿಜವಾದ ಕೆಲಸಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಸ್ವೀಕರಿಸಲು ಆಡ್ಮಿನ್ ಅಗತ್ಯವಿದೆ.",
    selectAadharFile: "ಆಧಾರ್ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ",
    verifyingUidai: "UIDAI ಸರ್ವರ್‌ನೊಂದಿಗೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    aadharVerified: "ಆಧಾರ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    assignedJobs: "ನಿಯೋಜಿತ ಕೆಲಸಗಳು",
    waitingForRequests: "ಹೊಸ ವಿನಂತಿಗಳಿಗಾಗಿ ಕಾಯುತ್ತಿದ್ದೇವೆ...",
    logOut: "ಲಾಗ್ ಔಟ್",
    welcomeBack: "ಮತ್ತೆ ಸ್ವಾಗತ,",
    active: "ಸಕ್ರಿಯ",
    experts: "ತಜ್ಞರು",
    services: "ಸೇವೆಗಳು",
    available: "ಲಭ್ಯ",
    expertsNearby: "ಹತ್ತಿರದ ತಜ್ಞರು",
    noExpertsAvailable: "ಯಾವ ತಜ್ಞರೂ ಲಭ್ಯವಿಲ್ಲ",
    checkBackLater: "ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ನೋಡಿ",
    kmAway: "ಕಿ.ಮೀ ದೂರ",
    base: "ಮೂಲ ದರ",
    select: "ಆಯ್ಕೆ",
    verified: "ಪರಿಶೀಲಿತ",
    experience: "ಅನುಭವ",
    rating: "ರೇಟಿಂಗ್",
    baseFeeLabel: "ಮೂಲ ಶುಲ್ಕ",
    yrs: "ವರ್ಷ",
    howItWorks: "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    step1: "ಕೆಳಗೆ ಕಾಲ್ ಟ್ಯಾಪ್ ಮಾಡಿ — ನಿಮ್ಮ ಸಂಖ್ಯೆಯನ್ನು ನಾವು ಸುರಕ್ಷಿತಗೊಳಿಸುತ್ತೇವೆ.",
    step2: "ಸಮಸ್ಯೆಯನ್ನು ಚರ್ಚಿಸಿ ಬೆಲೆ ಅಂತಿಮಗೊಳಿಸಿ.",
    step3: "ಬುಕಿಂಗ್ ಖಚಿತಪಡಿಸಲು ದೃಢೀಕರಿಸಿ.",
    secureCall: "ಸುರಕ್ಷಿತ ಕಾಲ್",
    connecting: "ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...",
    connectedConfirm: "ಸಂಪರ್ಕವಾಯಿತು! ತಜ್ಞರನ್ನು ಖಚಿತಪಡಿಸಲು ಕೆಳಗೆ ದೃಢೀಕರಿಸಿ.",
    confirmToBook: "ಬುಕ್ ಮಾಡಲು ದೃಢೀಕರಿಸಿ",
    callAgain: "ಮತ್ತೆ ಕಾಲ್ ಮಾಡಿ",
    secureBooking: "ಸುರಕ್ಷಿತ ಬುಕಿಂಗ್",
    pay30Fee: "ನಿಮ್ಮ ತಜ್ಞರನ್ನು ಈಗ ಖಚಿತಪಡಿಸಲು ₹40 ಪರಿಶೀಲನಾ ಶುಲ್ಕ ಪಾವತಿಸಿ.",
    pay30Securely: "₹40 ಸುರಕ್ಷಿತವಾಗಿ ಪಾವತಿಸಿ",
    cancel: "ರದ್ದು",
    verifyingWebhook: "ವೆಬ್‌ಹುಕ್ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    checkingPaymentBank: "ಬ್ಯಾಂಕ್‌ನೊಂದಿಗೆ ಪಾವತಿ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ.",
    bookingConfirmed: "ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ!",
    expertSecuredNote: "ತಜ್ಞ ಖಚಿತವಾಗಿದ್ದಾರೆ. ಕೆಲಸ ಮುಗಿದ ನಂತರ ಅಂತಿಮ ಮೊತ್ತ ಪಾವತಿಸಿ.",
    completeBooking: "ಬುಕಿಂಗ್ ಪೂರ್ಣಗೊಳಿಸಿ",
    bookingDone: "ಬುಕಿಂಗ್ ಆಯಿತು!",
    bookingDoneNote: "ನಿಮ್ಮ {category} ಖಚಿತವಾಗಿದ್ದು ಬರುತ್ತಿದ್ದಾರೆ.",
    viewBookings: "ಬುಕಿಂಗ್‌ಗಳನ್ನು ನೋಡಿ",
    returnHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    myBookings: "ನನ್ನ ಬುಕಿಂಗ್‌ಗಳು",
    noHistoryYet: "ಇನ್ನೂ ಇತಿಹಾಸವಿಲ್ಲ",
    pastBookingsHere: "ನಿಮ್ಮ ಹಿಂದಿನ ಬುಕಿಂಗ್‌ಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ",
    completeJob: "ಕೆಲಸ ಪೂರ್ಣ",
    cancelBooking: "ರದ್ದು",
    cancelBookingTitle: "ಬುಕಿಂಗ್ ರದ್ದು",
    selectCancelReason: "ದಯವಿಟ್ಟು ಕಾರಣ ಆಯ್ಕೆಮಾಡಿ.",
    back: "ಹಿಂದೆ",
    confirm: "ದೃಢೀಕರಿಸಿ",
    jobDonePaid: "ಕೆಲಸ ಮುಗಿದು ಪಾವತಿಯಾಯಿತು",
    completeAndSettle: "ಪೂರ್ಣಗೊಳಿಸಿ & ಸೆಟಲ್",
    enterFinalAmount: "ದಯವಿಟ್ಟು UPI ಆ್ಯಪ್‌ನಲ್ಲಿ ಅಂತಿಮ ಚರ್ಚಿಸಿದ ಮೊತ್ತ ನಮೂದಿಸಿ.",
    cashWarning: "ನಗದು ಪಾವತಿಸಿದರೆ ನಿಮ್ಮ 7-ದಿನದ ಉಚಿತ ರಿಕಾಸ್ಟ್ ವಾರಂಟಿ ತಕ್ಷಣ ರದ್ದಾಗುತ್ತದೆ. ಸುರಕ್ಷತೆಗಾಗಿ ಆ್ಯಪ್ ಮೂಲಕ ಪಾವತಿಸಿ.",
    warning: "ಎಚ್ಚರಿಕೆ:",
    payUsingUpi: "UPI ಆ್ಯಪ್‌ಗಳಿಂದ ಪಾವತಿಸಿ",
    iHavePaid: "ಪಾವತಿಸಿದ್ದೇನೆ, ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ",
    close: "ಮುಚ್ಚಿ",
    checkingFinalPayment: "ಅಂತಿಮ ಪಾವತಿ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ.",
    jobCompleted: "ಕೆಲಸ ಪೂರ್ಣಗೊಂಡಿತು!",
    warrantyActive: "ಪಾವತಿ ಯಶಸ್ವಿ. ನಿಮ್ಮ 7-ದಿನದ ಉಚಿತ ರಿಕಾಸ್ಟ್ ವಾರಂಟಿ ಸಕ್ರಿಯವಾಗಿದೆ.",
    done: "ಆಯಿತು",
    rateService: "ಸೇವೆಗೆ ರೇಟಿಂಗ್",
    rateExperience: "{name} ಜೊತೆಗೆ ನಿಮ್ಮ ಅನುಭವ ಹೇಗಿತ್ತು?",
    submitFeedback: "ಪ್ರತಿಕ್ರಿಯೆ ಕಳುಹಿಸಿ",
    helpSupport: "ಸಹಾಯ & ಬೆಂಬಲ",
    termsOfService: "ಸೇವಾ ನಿಯಮಗಳು",
    aboutSevamitra: "ಸೇವಾಮಿತ್ರ ಬಗ್ಗೆ",
    callFailed: "ಕಾಲ್ ವಿಫಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    serverUnreachable: "ಸರ್ವರ್ ಸಂಪರ್ಕವಾಗಲಿಲ್ಲ. ಇಂಟರ್ನೆಟ್ ಪರಿಶೀಲಿಸಿ.",
    paymentGatewayFailed: "ಪಾವತಿ ಗೇಟ್‌ವೇ ಲೋಡ್ ಆಗಲಿಲ್ಲ.",
    paymentFailed: "ಪಾವತಿ ವಿಫಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    paymentInitFailed: "ಪಾವತಿ ಪ್ರಾರಂಭಿಸುವಲ್ಲಿ ದೋಷ.",
    statusConfirmed: "ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    statusCompleted: "ಪೂರ್ಣಗೊಂಡಿದೆ",
    statusPending: "ಬಾಕಿ",
    statusCancelled: "ರದ್ದಾಗಿದೆ",
    catElectrician: "ವಿದ್ಯುತ್ ತಂತ್ರಜ್ಞ",
    catPlumber: "ಪ್ಲಂಬರ್",
    catMechanics: "ಮೆಕ್ಯಾನಿಕ್",
    catMaids: "ಮೇಡ್",
    catLocalChefs: "ಸ್ಥಳೀಯ ಅಡುಗೆಗಾರ",
    catPriests: "ಪುರೋಹಿತ",
    cancelReasons: [
      { value: "Booked by mistake", label: "ತಪ್ಪಾಗಿ ಬುಕ್ ಮಾಡಿದ್ದೇನೆ" },
      { value: "Price too high", label: "ಬೆಲೆ ಹೆಚ್ಚು" },
      { value: "Problem solved", label: "ಸಮಸ್ಯೆ ಬಗೆದಾಯಿತು" },
      { value: "Found another expert", label: "ಬೇರೆ ತಜ್ಞ ಸಿಕ್ಕಿದ್ದಾರೆ" },
      { value: "Other", label: "ಇತರೆ" },
    ],
  },
};

const CAT_LABEL_KEYS = {
  Electrician: "catElectrician",
  Plumber: "catPlumber",
  Mechanics: "catMechanics",
  Maids: "catMaids",
  "Local Chefs": "catLocalChefs",
  Priests: "catPriests",
};

function catLabel(cat, t) {
  const key = CAT_LABEL_KEYS[cat];
  return key ? t[key] : cat;
}

function statusLabel(status, t) {
  const map = {
    Confirmed: t.statusConfirmed,
    Completed: t.statusCompleted,
    Pending: t.statusPending,
    Cancelled: t.statusCancelled,
  };
  return map[status] || status;
}

function LanguageToggle({ lang, setLang }) {
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "kn" : "en")}
      className="tap"
      style={{
        padding: "8px 14px",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.35)",
        background: "rgba(255,255,255,0.15)",
        color: "#fff",
        fontSize: 12,
        fontWeight: 700,
        backdropFilter: "blur(8px)",
        whiteSpace: "nowrap",
      }}
    >
      {translations[lang].langToggle}
    </button>
  );
}

const Icons = {
  Electrician: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Plumber: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>,
  Mechanics: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 9.36l-7.1 7.1a1 1 0 0 1-1.4 0l-2.8-2.8a1 1 0 0 1 0-1.4l7.1-7.1a6 6 0 0 1 9.36-7.94l-3.77 3.77z"/></svg>,
  Maids: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  Chefs: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>,
  Priests: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15"/></svg>,
  Home: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  List: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  User: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  MapPin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  CheckCircle: () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  CheckSmall: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Lightning: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  ShieldAlert: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
};

const CAT_ICONS = { 
  Electrician: Icons.Electrician, Plumber: Icons.Plumber, Mechanics: Icons.Mechanics, 
  Maids: Icons.Maids, "Local Chefs": Icons.Chefs, Priests: Icons.Priests 
};

// ── Constants ─────────────────────────────────────────────────────────────────
const PROBLEMS = {
  Electrician:   ["Power Outage","Wiring Issue","Appliance Install","Short Circuit","Other"],
  Plumber:       ["Leaky Pipe","Blocked Drain","Water Tank","Tap Repair","Other"],
  Mechanics:     ["Car Won't Start","Flat Tire","Engine Noise","Brake Issue","Other"],
  Maids:         ["Full House Clean","Utensils Only","Monthly Contract","Deep Cleaning"],
  "Local Chefs": ["Party Catering","Daily Meals","Traditional Fest","Diet Food"],
  Priests:       ["Pooja at Home","House Warming","Marriage","Astrology"],
};

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Badge({ status, t }) {
  const ok = status === "Confirmed" || status === "Completed";
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
      padding: "4px 10px", borderRadius: 6,
      background: ok ? "#f0fdf4" : "#fef2f2",
      color: ok ? "#166534" : "#991b1b",
      border: `1px solid ${ok ? "#bbf7d0" : "#fecaca"}`
    }}>{t ? statusLabel(status, t) : status}</span>
  );
}

function Spinner({ color = "#fff" }) {
  return (
    <div style={{
      width:24, height:24, borderRadius:"50%",
      border:`3px solid ${color}40`,
      borderTopColor: color,
      animation:"spin 0.7s linear infinite", display:"inline-block"
    }} />
  );
}

function Skeleton({ width = "100%", height = "20px", borderRadius = "8px", style = {} }) {
  return <div className="skeleton" style={{ width, height, borderRadius, ...style }} />;
}

function BottomNav({ tab, onSwitch, t }) {
  const items = [
    { id:"home",    icon: Icons.Home, label: t.navHome },
    { id:"history", icon: Icons.List, label: t.navBookings },
    { id:"profile", icon: Icons.User, label: t.navProfile },
  ];
  return (
    <div style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:430,
      background:"rgba(255,255,255,0.95)", backdropFilter:"blur(12px)",
      borderTop:`1px solid ${BRAND.border}`,
      display:"flex", justifyContent:"space-around",
      padding:"12px 0 20px", zIndex:50,
    }}>
      {items.map(it => {
        const active = tab === it.id;
        const IconComponent = it.icon;
        return (
          <button key={it.id} onClick={() => onSwitch(it.id)} style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            gap:4, background:"none", border:"none", cursor:"pointer",
            color: active ? BRAND.primary : BRAND.subtle, padding:"0 24px",
            position: "relative"
          }}>
            <IconComponent />
            <span style={{ fontSize:11, fontWeight: active ? 700 : 500 }}>{it.label}</span>
            {active && (
              <div style={{ position: "absolute", bottom: -6, width: 4, height: 4, borderRadius: "50%", background: BRAND.primary }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Login / Role Selection (Upgraded) ─────────────────────────────────────────
function LoginScreen({ onLogin, lang, setLang, t }) {
  const [role, setRole]   = useState("user"); // NEW: Role toggle
  const [name,  setName]  = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Provider Extra Fields
  const [category, setCategory] = useState("Electrician");
  const [experience, setExperience] = useState("");
  const [basePrice, setBasePrice] = useState("");

  const handleStart = async () => {
    if (name.trim().length < 2 || phone.replace(/\D/g, "").length !== 10) {
      setError(t.errValidDetails);
      setShake(true); setTimeout(() => setShake(false), 400); return;
    }

    if (role === "provider") {
      if (!experience || !basePrice) {
        setError(t.errProviderDetails);
        setShake(true); setTimeout(() => setShake(false), 400); return;
      }
      setIsSubmitting(true); setError("");
      try {
        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("phone", phone.replace(/\D/g, ""));
        formData.append("category", category);
        formData.append("location", "Mysuru"); 
        formData.append("experience", experience);
        formData.append("base_price", basePrice);
        formData.append("rating", "5.0"); 
        
        await fetch(`${BASE_URL}/providers/`, { method: "POST", body: formData });
        onLogin({ name: name.trim(), phone: phone.replace(/\D/g, ""), role: "provider", category });
      } catch (e) {
        setError(t.errRegisterFailed);
        setIsSubmitting(false);
      }
    } else {
      setError("");
      onLogin({ name: name.trim(), phone: phone.replace(/\D/g, ""), role: "user" });
    }
  };

  const inp = {
    width:"100%", padding:"16px", borderRadius: 12, border:`1px solid ${BRAND.border}`, 
    background:"#fff", fontSize:15, fontWeight:500, color: BRAND.dark, outline:"none",
  };

  return (
    <div style={{
      position: "relative",
      minHeight:"100vh", background: `linear-gradient(135deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 100%)`,
      display:"flex", flexDirection:"column", justifyContent:"center", padding:24
    }}>
      <div style={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}>
        <LanguageToggle lang={lang} setLang={setLang} />
      </div>
      <div className="fade-up" style={{ textAlign: "center", marginBottom:32 }}>
        {/* LOGO FIX 1: Display Block and Margin Auto perfectly centers it */}
        <img src="/logo.png" alt="Sevamitra Logo" 
          style={{ display: "block", margin: "0 auto 16px auto", width: "140px", borderRadius: "24px", boxShadow: "0 12px 32px rgba(0,0,0,0.2)" }} 
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
        <h1 style={{ display: "none", fontSize:38, fontWeight:800, letterSpacing:"-0.5px", marginBottom:8, color: "#fff" }}>Sevamitra.</h1>
        <p style={{ color: BRAND.primaryLight, fontSize:15, fontWeight:500, lineHeight: 1.5 }}>{t.tagline}</p>
      </div>

      <div className={`fade-up ${shake ? "shake" : ""}`} style={{ animationDelay: "0.1s", background: "#fff", padding: 24, borderRadius: 24, boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }}>
        
        {/* NEW: Role Toggle */}
        <div style={{ display: "flex", background: BRAND.bg, padding: 4, borderRadius: 14, marginBottom: 20 }}>
          <button onClick={() => { setRole("user"); setError(""); }} style={{ flex: 1, padding: "12px", border: "none", borderRadius: 10, background: role === "user" ? "#fff" : "transparent", color: role === "user" ? BRAND.primary : BRAND.subtle, fontWeight: 700, boxShadow: role === "user" ? "0 2px 8px rgba(0,0,0,0.05)" : "none", transition: "all 0.2s" }}>{t.bookService}</button>
          <button onClick={() => { setRole("provider"); setError(""); }} style={{ flex: 1, padding: "12px", border: "none", borderRadius: 10, background: role === "provider" ? "#fff" : "transparent", color: role === "provider" ? BRAND.primary : BRAND.subtle, fontWeight: 700, boxShadow: role === "provider" ? "0 2px 8px rgba(0,0,0,0.05)" : "none", transition: "all 0.2s" }}>{t.becomeExpert}</button>
        </div>

        {error && <div style={{ color: "#dc2626", fontSize: 13, fontWeight: 600, marginBottom: 16, background: "#fef2f2", padding: "12px", borderRadius: 8, border: "1px solid #fecaca" }}>{error}</div>}
        
        <input style={{...inp, marginBottom: 12}} placeholder={t.fullName} value={name} onChange={e => setName(e.target.value)} />
          
        <div style={{ display: "flex", gap: 10, marginBottom: role === "provider" ? 12 : 24 }}>
          <div style={{ ...inp, width: "auto", marginBottom: 0, background: "#f1f5f9", color: BRAND.subtle, display: "flex", alignItems: "center", fontWeight: 700 }}>+91</div>
          <input style={{...inp, flex: 1, marginBottom: 0}} placeholder={t.mobileNumber} type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))} />
        </div>

        {/* NEW: Provider Specific Fields */}
        {role === "provider" && (
          <div className="fade-in">
            <select style={{...inp, marginBottom: 12, appearance: "none"}} value={category} onChange={e => setCategory(e.target.value)}>
              {Object.keys(PROBLEMS).map(c => <option key={c} value={c}>{catLabel(c, t)}</option>)}
            </select>
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              <input style={{...inp, flex: 1}} placeholder={t.yearsExp} type="number" value={experience} onChange={e => setExperience(e.target.value)} />
              <input style={{...inp, flex: 1}} placeholder={t.baseFee} type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} />
            </div>
            <p style={{ fontSize: 12, color: BRAND.subtle, marginBottom: 16, textAlign: "center", fontWeight: 600 }}>{t.aadharAfterSignup}</p>
          </div>
        )}

        <button onClick={handleStart} disabled={isSubmitting} className="tap"
          style={{ width:"100%", padding:"16px", borderRadius: 12, border:"none", background: BRAND.primary, color:"#fff", fontSize:15, fontWeight:700, boxShadow:`0 8px 20px ${BRAND.primary}40` }}>
          {isSubmitting ? <Spinner /> : t.getStarted}
        </button>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [lang,         setLang]         = useState("en");
  const t = translations[lang];
  const [user,         setUser]         = useState(null);
  const [tab,          setTab]          = useState("home");
  const [screen,       setScreen]       = useState("home");
  const [providers,    setProviders]    = useState([]);
  const [bookings,     setBookings]     = useState([]);
  const [isLoading,    setIsLoading]    = useState(true); 
  const [selCat,       setSelCat]       = useState(null);
  const [selProv,      setSelProv]      = useState(null);
  const [callState,    setCallState]    = useState("idle"); 
  const [callError,    setCallError]    = useState("");
  const [showCancel,   setShowCancel]   = useState(false);
  const [cancelId,     setCancelId]     = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  
  // Upfront Payment
  const [showQR,       setShowQR]       = useState(false); 
  const [payState,     setPayState]     = useState("idle"); 
  
  // Final Payment & Review Modals (Upgraded)
  const [showHistoryQR, setShowHistoryQR] = useState(false);
  const [historyPayState, setHistoryPayState] = useState("idle");
  const [qrBooking,    setQrBooking]    = useState(null);
  const [showReview,   setShowReview]   = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [finalBill, setFinalBill] = useState("");
  const [billError, setBillError] = useState("");
  const [userLatLon,   setUserLatLon]   = useState(null); // GPS State
  const [aadharStatus, setAadharStatus] = useState("Pending"); // "Pending", "Uploading", "Verified"
  const [hasPaidSession, setHasPaidSession] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sevamitra_user");
    if (saved) setUser(JSON.parse(saved));
    fetchData();

    // NEW: Geolocation Feature logic
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLatLon({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.log("Using simulated distances for demo")
      );
    }
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [p, b] = await Promise.all([
        fetch(`${BASE_URL}/providers/`).then(r => r.json()),
        fetch(`${BASE_URL}/bookings/`).then(r => r.json()),
      ]);
      setProviders(p); setBookings(b);
    } catch {
      // Silently fail for demo robustness
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("sevamitra_user", JSON.stringify(u));
  };

  const handleCall = async () => {
    setCallState("calling");
    setCallError("");
    const formattedCustomer = user.phone.startsWith("+91") ? user.phone : `+91${user.phone}`;
    const formattedProvider = selProv.phone.startsWith("+91") ? selProv.phone : `+91${selProv.phone}`;

    try {
      const res = await fetch(`${BASE_URL}/initiate-call/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_phone: formattedCustomer, provider_phone: formattedProvider }),
      });
      if (res.ok) setCallState("called");
      else {
        const err = await res.json();
        setCallError(err.detail || t.callFailed);
        setCallState("idle");
      }
    } catch {
      setCallError(t.serverUnreachable);
      setCallState("idle");
    }
  };

  // --- RAZORPAY INTEGRATION ---
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const startRazorpayPayment = async () => {
    setPayState("loading");
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert(t.paymentGatewayFailed);
      setPayState("idle");
      return;
    }

    try {
      // 1. Get Order ID from our backend
      const res = await fetch(`${BASE_URL}/create-order/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 40 }) // 40 Rupees Booking Fee
      });
      const orderData = await res.json();

      // 2. Open Razorpay Window
      // 2. Open Razorpay Window
      const options = {
        key: "rzp_test_SsIEmLJ538aqEl", // ⚠️ Keep your actual rzp_test_ key here
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Sevamitra",
        description: `Booking Fee for ${selProv.category}`,
        order_id: orderData.order_id,
        handler: function (response) {
          // Runs on success!
          setPayState("success");
        },
        prefill: {
          name: user.name,
          contact: user.phone,
        },
        theme: { color: "#2563eb" },
        
        // NEW SAFE CONFIG: Asks for UPI/QR first, but doesn't crash if it's missing!
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI / QR Code",
                instruments: [{ method: "upi" }]
              }
            },
            sequence: ["block.upi"],
            preferences: { show_default_blocks: true } // Keeps Cards as a backup so it never crashes
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert(t.paymentFailed);
        setPayState("idle");
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      alert(t.paymentInitFailed);
      setPayState("idle");
    }
  };

  const handleBook = async () => {
    setCallState("booking");
    const newBooking = { id: Date.now(), customer_phone: user.phone, worker_name: selProv.name, category: selProv.category, status: "Confirmed", time: new Date().toISOString() };
    setBookings(prev => [newBooking, ...prev]);
    
    try {
      await fetch(`${BASE_URL}/bookings/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_name: user.name, customer_phone: user.phone, provider_id: selProv.id }),
      });
      fetchData(); 
    } catch {}
    
    setCallState("done"); setScreen("success");
  };

  const handleCancel = async () => {
    if (!cancelReason) return;
    setBookings(prev => prev.map(b => b.id === cancelId ? { ...b, status: "Cancelled" } : b));
    setShowCancel(false); setCancelReason("");
    try {
      await fetch(`${BASE_URL}/bookings/${cancelId}/cancel`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      });
      fetchData();
    } catch {}
  };

  const handleComplete = async (bookingId) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "Completed" } : b));
    try {
      await fetch(`${BASE_URL}/bookings/${bookingId}/complete`, { method:"PUT" });
      fetchData();
    } catch {}
    setShowHistoryQR(false);
    setShowReview(true); // Trigger feedback loop
  };

  const submitReview = async () => {
    try {
      await fetch(`${BASE_URL}/reviews/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider_id: qrBooking.provider_id, rating: reviewRating, feedback: "Demo Service Completed" }),
      });
    } catch {}
    setShowReview(false);
    setReviewRating(0);
  };

  const switchTab = (t) => { setTab(t); setScreen("home"); setCallState("idle"); setCallError(""); setHasPaidSession(false); };
  const goBack    = (s)  => { setScreen(s); setCallState("idle"); setCallError(""); setHasPaidSession(false); };

  if (!user) return <LoginScreen onLogin={handleLogin} lang={lang} setLang={setLang} t={t} />;

  // ── PROVIDER VIEW (Worker Dashboard Upgrade) ────────────────────────────────
  if (user.role === "provider") {
    const myJobs = bookings.filter(b => b.worker_name === user.name);
    return (
      <div style={{ minHeight:"100vh", background: BRAND.bg, maxWidth:430, margin:"0 auto", display: "flex", flexDirection: "column", boxShadow:"0 0 40px rgba(0,0,0,0.08)" }}>
        <div style={{ background: `linear-gradient(135deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 100%)`, padding: "40px 24px 32px", color: "#fff", borderRadius: "0 0 24px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
             <img src="/logo.png" alt="Logo" style={{ width: 44, height: 44, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }} onError={e => e.target.style.display='none'} />
             <h1 style={{ fontSize: 24, fontWeight: 800 }}>{t.workerDashboard}</h1>
          </div>
          <p style={{ color: BRAND.primaryLight, fontWeight: 500 }}>{user.name} • {catLabel(user.category, t)}</p>
        </div>
        
        <div style={{ padding: 24 }}>
          {/* KYC MOCK UI WITH WORKING FILE UPLOAD */}
          <div className="fade-up" style={{ background: "#fff", padding: 20, borderRadius: 16, border: `1px solid ${BRAND.border}`, marginBottom: 24, boxShadow:"0 2px 8px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, color: BRAND.dark, fontWeight: 800 }}>{t.aadharKyc}</h3>
              <Badge status={aadharStatus === "Verified" ? "Completed" : "Pending"} t={t} />
            </div>

            <p style={{ fontSize: 13, color: BRAND.subtle, marginBottom: 16, lineHeight: 1.5 }}>
              {aadharStatus === "Verified" 
                ? t.aadharVerifiedMsg
                : t.aadharPendingMsg}
            </p>

            {aadharStatus === "Pending" && (
              <div>
                 {/* Hidden File Input */}
                 <input type="file" id="aadharUpload" accept=".pdf,image/*" style={{ display: "none" }} onChange={(e) => {
                   if(e.target.files.length > 0) {
                     setAadharStatus("Uploading");
                     // Fake a 2.5 second network request to verify Aadhar
                     setTimeout(() => setAadharStatus("Verified"), 2500); 
                   }
                 }} />
                 {/* Styled Label acting as the button */}
                 <label htmlFor="aadharUpload" className="tap" style={{ display: "block", textAlign: "center", width: "100%", padding: 12, borderRadius: 10, border: `1.5px dashed ${BRAND.primary}`, background: BRAND.primaryLight, color: BRAND.primary, fontWeight: 700, cursor: "pointer" }}>
                   {t.selectAadharFile}
                 </label>
              </div>
            )}

            {aadharStatus === "Uploading" && (
               <div style={{ textAlign: "center", padding: "12px", color: BRAND.primary, fontWeight: 700, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
                  <Spinner color={BRAND.primary} /> {t.verifyingUidai}
               </div>
            )}

            {aadharStatus === "Verified" && (
               <div className="fade-in" style={{ textAlign: "center", padding: "12px", background: "#f0fdf4", color: "#166534", borderRadius: 10, fontWeight: 800, border: "1px solid #bbf7d0", display: "flex", justifyContent: "center", gap: 8 }}>
                  <Icons.CheckSmall /> {t.aadharVerified}
               </div>
            )}
          </div>

          <h3 style={{ fontSize: 18, color: BRAND.dark, marginBottom: 16, fontWeight: 800 }}>{t.assignedJobs}</h3>
          {myJobs.length === 0 ? (
            <div style={{ textAlign:"center", padding: 40, border: `1px dashed ${BRAND.border}`, borderRadius: 16 }}>
              <p style={{ color: BRAND.subtle, fontWeight: 600 }}>{t.waitingForRequests}</p>
            </div>
          ) : myJobs.map((b, i) => (
            <div key={b.id} className="fade-up" style={{ background: "#fff", padding: 20, borderRadius: 16, marginBottom: 16, border: `1px solid ${BRAND.border}`, boxShadow:"0 2px 8px rgba(0,0,0,0.02)", animationDelay:`${i*0.1}s` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontWeight: 800, color: BRAND.dark }}>{b.customer_name}</span>
                <Badge status={b.status} t={t} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: BRAND.subtle, fontSize: 13, fontWeight: 600 }}>
                <Icons.Phone /> {b.customer_phone}
              </div>
            </div>
          ))}
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="tap" style={{ width:"100%", padding:"16px", borderRadius: 16, border:"none", background:"#fef2f2", color:"#dc2626", fontWeight:700, marginTop: 24, border: "1px solid #fecaca" }}>{t.logOut}</button>
        </div>
      </div>
    );
  }

  // ── CUSTOMER VIEW (Standard App Shell) ──────────────────────────────────────
  const myBookings    = bookings.filter(b => b.customer_phone === user.phone);
  const catProviders  = providers.filter(p => p.category === selCat);

  const shell = (children) => (
    <div style={{
      minHeight:"100vh", background: BRAND.bg, display:"flex", flexDirection:"column",
      maxWidth:430, margin:"0 auto", position:"relative", boxShadow:"0 0 40px rgba(0,0,0,0.08)"
    }}>
      {children}
      <BottomNav tab={tab} onSwitch={switchTab} t={t} />
    </div>
  );

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (tab === "home") {
    if (screen === "home") return shell(<>
      <div style={{ background: `linear-gradient(135deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 100%)`, padding: "48px 24px 32px", borderRadius: "0 0 24px 24px", color: "#fff", boxShadow: "0 12px 24px rgba(37, 99, 235, 0.15)" }}>
        {/* LOGO FIX 2: Mini-logo Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <img src="/logo.png" alt="Logo" style={{ width: 44, height: 44, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }} onError={e => e.target.style.display='none'} />
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", margin: 0 }}>Sevamitra.</h1>
        </div>
        <p style={{ color: BRAND.primaryLight, fontSize: 14, fontWeight: 500, margin: 0 }}>{t.welcomeBack} {user.name.split(" ")[0]}</p>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"24px 20px 100px" }}>
        <div style={{ display:"flex", gap:12, marginBottom:28, marginTop: -12 }}>
          {[
            { label: t.active, value: myBookings.filter(b=>b.status==="Confirmed").length, highlight: true },
            { label: t.experts, value: providers.length, highlight: false },
          ].map((s, i) => (
            <div key={s.label} className="fade-up" style={{
              flex:1, background: s.highlight ? BRAND.primary : "#ffffff", 
              borderRadius: 16, padding: "18px 20px",
              border: s.highlight ? "none" : `1px solid ${BRAND.border}`,
              boxShadow: s.highlight ? `0 8px 20px ${BRAND.primary}40` : "0 2px 8px rgba(0,0,0,0.04)"
            }}>
              {isLoading ? <Skeleton width="40px" height="28px" style={{ marginBottom: 4, background: s.highlight ? `${BRAND.primaryDark}80` : BRAND.border }} /> : 
                <div style={{ fontSize: 26, fontWeight: 800, color: s.highlight ? "#fff" : BRAND.dark }}>{s.value}</div>
              }
              <div style={{ fontSize: 12, color: s.highlight ? BRAND.primaryLight : BRAND.subtle, fontWeight: 600, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 700, color: BRAND.dark, marginBottom: 16 }}>{t.services}</h3>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {Object.keys(PROBLEMS).map((c, i) => {
            const IconComponent = CAT_ICONS[c];
            return (
              <button key={c} onClick={() => { setSelCat(c); setScreen("list"); }} className="tap fade-up"
                style={{
                  background:"#fff", border:`1px solid ${BRAND.border}`, borderRadius: 16, padding:"20px 16px",
                  display:"flex", flexDirection:"column", alignItems:"center",
                  boxShadow:"0 2px 6px rgba(0,0,0,0.02)", animationDelay:`${i*0.04}s`
                }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: BRAND.primaryLight, color: BRAND.primary,
                  display:"flex", alignItems:"center", justifyContent:"center", marginBottom: 12
                }}>
                  <IconComponent />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: BRAND.dark, textAlign: "center" }}>{catLabel(c, t)}</span>
                {isLoading ? <Skeleton width="60px" height="12px" style={{ marginTop: 6 }} /> : 
                  <span style={{ fontSize: 11, color: BRAND.subtle, marginTop: 6, fontWeight: 600 }}>
                    {providers.filter(p=>p.category===c).length} {t.available}
                  </span>
                }
              </button>
            )
          })}
        </div>
      </div>
    </>);

    // Provider List (With Distance Simulation Upgrade)
    if (screen === "list") return shell(<>
      <div style={{ background:"#fff", padding:"40px 20px 16px", borderBottom:`1px solid ${BRAND.border}`, display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => goBack("home")} className="tap" style={{ background:BRAND.primaryLight, border:"none", width: 36, height: 36, borderRadius: 18, display:"flex", alignItems:"center", justifyContent:"center", color:BRAND.primary }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div>
          <h3 style={{ fontSize:18, fontWeight:700, color:BRAND.dark }}>{catLabel(selCat, t)}</h3>
          {isLoading ? <Skeleton width="100px" height="14px" style={{ marginTop: 4 }} /> :
            <p style={{ fontSize:13, color:BRAND.subtle, fontWeight:500 }}>{catProviders.length} {t.expertsNearby}</p>
          }
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 100px" }}>
        {isLoading ? (
           <>
             {[1, 2, 3].map(i => (
               <div key={i} style={{ background:"#fff", borderRadius: 16, padding: 16, marginBottom: 12, border:`1px solid ${BRAND.border}`, display:"flex", gap:16 }}>
                 <Skeleton width="60px" height="60px" borderRadius="12px" />
                 <div style={{ flex: 1, display:"flex", flexDirection:"column", justifyContent:"center", gap: 8 }}>
                   <Skeleton width="60%" height="16px" />
                   <Skeleton width="40%" height="12px" />
                 </div>
               </div>
             ))}
           </>
        ) : catProviders.length === 0 ? (
          <div style={{ textAlign:"center", paddingTop:60, color:BRAND.subtle }}>
            <div style={{ fontWeight:700, fontSize:16, color: BRAND.dark }}>{t.noExpertsAvailable}</div>
            <div style={{ fontSize:14, marginTop:6 }}>{t.checkBackLater}</div>
          </div>
        ) : catProviders.map((p, i) => {
          // NEW: Realistic Dynamic Distance for the demo
          const distance = (1.2 + (i * 0.8)).toFixed(1); 
          return (
          <div key={p.id} className="fade-up" style={{
              background:"#fff", borderRadius: 16, padding: 16, marginBottom: 12,
              display:"flex", alignItems:"center", gap: 16, border:`1px solid ${BRAND.border}`, 
              boxShadow:"0 2px 8px rgba(0,0,0,0.02)", animationDelay:`${i*0.04}s`
            }}>
            <img src={p.photo_url} alt={p.name}
              onError={e => { e.target.onerror=null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=eff6ff&color=2563eb&bold=true`; }}
              style={{ width:60, height:60, borderRadius: 12, objectFit:"cover", flexShrink:0, background: BRAND.bg }}
            />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:BRAND.dark, fontSize:15, marginBottom:4 }}>{p.name}</div>
              <div style={{ display: "flex", gap: 4, alignItems: "center", color: BRAND.primary, fontSize: 12, marginBottom: 8, fontWeight: 700 }}>
                <Icons.MapPin /> {distance} {t.kmAway}
              </div>
              <div style={{ display:"flex", gap: 8, alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4, background:BRAND.primaryLight, color:BRAND.primary, borderRadius: 6, fontSize: 11, fontWeight:700, padding:"4px 8px" }}>
                  <Icons.Star /> {p.rating}
                </span>
                <span style={{ color:BRAND.subtle, fontSize: 11, fontWeight: 600 }}>₹{p.base_price} {t.base}</span>
              </div>
            </div>
            <button onClick={() => { setSelProv(p); setCallState("idle"); setCallError(""); setScreen("profile"); }} className="tap" style={{
                background: BRAND.primary, color:"#fff", border:"none", borderRadius: 10,
                padding:"10px 16px", fontSize: 13, fontWeight: 700, flexShrink:0, boxShadow:`0 4px 12px ${BRAND.primary}40`
              }}>{t.select}</button>
          </div>
        )})}
      </div>
    </>);

    // Provider Profile & Booking Flow
    if (screen === "profile") {
      const upfrontUpiLink = `upi://pay?pa=demo@ybl&pn=Sevamitra%20Demo%20(${encodeURIComponent(selProv?.name)})&cu=INR`;

      return shell(<>
        <div style={{ background: "#fff", borderBottom: `1px solid ${BRAND.border}` }}>
          <div style={{ padding: "40px 20px 16px", display: "flex", alignItems: "center", gap: 16 }}>
             <button onClick={() => goBack("list")} className="tap" style={{ background:BRAND.primaryLight, border:"none", width: 36, height: 36, borderRadius: 18, display:"flex", alignItems:"center", justifyContent:"center", color:BRAND.primary }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          </div>
          
          <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <img src={selProv.photo_url} alt={selProv.name}
              onError={e => { e.target.onerror=null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(selProv.name)}&background=eff6ff&color=2563eb&bold=true&size=128`; }}
              style={{ width:96, height:96, borderRadius: 24, objectFit:"cover", marginBottom: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
            />
            <h2 style={{ fontSize:22, fontWeight:800, color:BRAND.dark, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
              {selProv.name} <svg width="20" height="20" viewBox="0 0 24 24" fill={BRAND.primary} stroke="#fff" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </h2>
            <p style={{ color: BRAND.primary, background: BRAND.primaryLight, padding: "4px 12px", borderRadius: 12, fontSize:13, fontWeight:700, marginTop: 4 }}>
              {t.verified} {catLabel(selProv.category, t)}
            </p>
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"24px 20px 110px" }}>
          
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:32 }}>
            {[
              { label: t.experience, value:`${selProv.experience} ${t.yrs}` },
              { label: t.rating,     value: selProv.rating },
              { label: t.baseFeeLabel,   value:`₹${selProv.base_price}` },
            ].map(s => (
              <div key={s.label} style={{
                background:"#fff", borderRadius: 14, padding:"16px 12px",
                textAlign:"center", border:`1px solid ${BRAND.border}`,
              }}>
                <div style={{ fontSize:15, fontWeight:800, color:BRAND.dark, marginBottom:4 }}>{s.value}</div>
                <div style={{ fontSize:11, color:BRAND.subtle, fontWeight:600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: BRAND.dark, marginBottom: 16 }}>{t.howItWorks}</h3>
          <div style={{ background:"#fff", borderRadius: 16, padding:20, border:`1px solid ${BRAND.border}`, marginBottom:24 }}>
            {[
              t.step1,
              t.step2,
              t.step3,
            ].map((s, i) => (
              <div key={i} style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:i<2?16:0 }}>
                <div style={{
                  width:24, height:24, borderRadius:12, background:BRAND.primaryLight, color:BRAND.primary, 
                  fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
                }}>{i+1}</div>
                <p style={{ fontSize:14, color:BRAND.subtle, fontWeight:500, lineHeight:1.5 }}>{s}</p>
              </div>
            ))}
          </div>

          {callError && (
            <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius: 12, padding:"12px 16px", marginBottom:20, fontSize:13, color:"#991b1b", fontWeight:600 }}>
              {callError}
            </div>
          )}

          {callState === "idle" && !hasPaidSession && (
            <button onClick={() => setShowQR(true)} className="tap" style={{
              width:"100%", background: BRAND.dark, color:"#fff", border:"none", borderRadius: 14, padding:"16px",
              fontSize:15, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow: `0 8px 20px rgba(15,23,42,0.4)`
            }}>
              <Icons.Lightning/> Pay ₹40 to Unlock Session
            </button>
          )}

          {callState === "idle" && hasPaidSession && (
            <button onClick={handleCall} className="tap fade-in" style={{
              width:"100%", background: BRAND.primary, color:"#fff", border:"none", borderRadius: 14, padding:"16px",
              fontSize:15, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow: `0 8px 20px ${BRAND.primary}40`
            }}>
              <Icons.Phone/> {t.secureCall}
            </button>
          )}

          {callState === "calling" && (
            <div style={{
              width:"100%", background:BRAND.primaryLight, color: BRAND.primary, borderRadius: 14, padding:"16px", 
              fontSize:15, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:12,
            }}>
              <Spinner color={BRAND.primary} /> {t.connecting}
            </div>
          )}

          {callState === "called" && (
            <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius: 12, padding:"16px", fontSize:14, color:"#166534", fontWeight:600, display:"flex", alignItems:"center", gap:10 }}>
                <Icons.CheckCircle/> Did the expert accept the job?
              </div>
              <button onClick={handleBook} className="tap" style={{ width:"100%", background: BRAND.primary, color:"#fff", border:"none", borderRadius: 14, padding:"16px", fontSize:15, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow: `0 8px 20px ${BRAND.primary}40` }}>
                Yes, Confirm & Lock Booking
              </button>
              <button onClick={() => { setCallState("idle"); setCallError(""); }} className="tap" style={{ background:"none", border:`1px solid ${BRAND.border}`, color:BRAND.subtle, borderRadius: 14, padding:"14px", fontSize:14, fontWeight:600 }}>
                No, Call Another Expert
              </button>
            </div>
          )}
        </div>

        {/* UPFRONT PAYMENT MODAL */}
        {showQR && (
          <div className="fade-in" style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.7)", backdropFilter:"blur(8px)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
            <div className="slide-up" style={{ background:"#fff", borderRadius:"24px 24px 0 0", padding:"24px 24px 40px", width:"100%", maxWidth:430, textAlign: "center", boxShadow: "0 -10px 40px rgba(0,0,0,0.15)" }}>
              {payState === "idle" && (
                <>
                  <div style={{ width:40, height:5, background:"#cbd5e1", borderRadius:4, margin:"0 auto 24px" }} />
                  <h3 style={{ fontSize:20, fontWeight:800, color:BRAND.dark, marginBottom:8 }}>{t.secureBooking}</h3>
                  <p style={{ fontSize:14, color:BRAND.subtle, fontWeight:500, marginBottom:24 }}>
                    {t.pay30Fee}
                  </p>

                  <button onClick={startRazorpayPayment} className="tap" style={{
                    width: "100%", padding:"16px", borderRadius: 14, border:"none",
                    background:BRAND.primary, color:"#fff", fontSize:15, fontWeight:700, marginBottom: 12,
                    boxShadow: `0 8px 20px ${BRAND.primary}40`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10
                  }}>
                    <Icons.Lightning /> {t.pay30Securely}
                  </button>
                  
                  <button onClick={() => { setShowQR(false); setPayState("idle"); }} style={{
                    background:"none", border:"none", color:BRAND.subtle, fontSize:14, fontWeight:600, padding: "8px"
                  }}>{t.cancel}</button>
                </>
              )}

              {payState === "loading" && (
                <div className="fade-in" style={{ padding: "60px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Spinner color={BRAND.primary} />
                  <p style={{ marginTop: 24, fontSize: 16, fontWeight: 700, color: BRAND.dark }}>{t.verifyingWebhook}</p>
                  <p style={{ marginTop: 6, fontSize: 13, color: BRAND.subtle, fontWeight: 500 }}>{t.checkingPaymentBank}</p>
                </div>
              )}

              {/* LOGO FIX 3: Upfront Success */}
              {payState === "success" && (
                <div className="fade-up" style={{ padding: "40px 0 20px" }}>
                  <img src="/logo.png" alt="Sevamitra" style={{ display: "block", margin: "0 auto 16px auto", width: 70, height: 70, borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} onError={e => e.target.style.display='none'} />
                  <div style={{ color: "#10b981", marginBottom: 16, display: "flex", justifyContent: "center" }}><Icons.CheckCircle/></div>
                  <h3 style={{ fontSize:22, fontWeight:800, color:BRAND.dark, marginBottom:8 }}>Session Unlocked!</h3>
                  <p style={{ fontSize:14, color:BRAND.subtle, fontWeight:500, marginBottom:24, lineHeight: 1.5 }}>You can now securely call the expert to negotiate the job.</p>
                  <button onClick={() => { setShowQR(false); setPayState("idle"); setHasPaidSession(true); }} className="tap" style={{ width: "100%", padding:"16px", borderRadius: 14, border:"none", background:BRAND.primary, color:"#fff", fontSize:15, fontWeight:800, boxShadow: `0 8px 20px ${BRAND.primary}40` }}>Continue to Call</button>
                </div>
              )}
            </div>
          </div>
        )}
      </>);
    }

    // Success Screen
    if (screen === "success") return shell(
      <div className="fade-in" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32 }}>
        {/* LOGO FIX 4: Final Success Screen Logo */}
        <img src="/logo.png" alt="Sevamitra" style={{ display: "block", width: 100, height: 100, borderRadius: 24, marginBottom: 24, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }} onError={e => e.target.style.display='none'} />
        
        <div style={{ marginBottom: 16, color: "#10b981", display: "flex", alignItems: "center", gap: 10 }}>
          <Icons.CheckCircle /> <span style={{ fontSize: 26, fontWeight: 800, color: BRAND.dark }}>{t.bookingDone}</span>
        </div>
        
        <p style={{ color:BRAND.subtle, fontSize:15, fontWeight:500, textAlign:"center", marginBottom:40, lineHeight:1.6 }}>
          {t.bookingDoneNote.replace("{category}", catLabel(selProv?.category, t).toLowerCase())}
        </p>
        <button onClick={() => switchTab("history")} className="tap" style={{ background: BRAND.primary, color:"#fff", border:"none", borderRadius: 14, padding:"16px 36px", fontSize:15, fontWeight:700, width: "100%", marginBottom: 12, boxShadow: `0 8px 20px ${BRAND.primary}40` }}>{t.viewBookings}</button>
        <button onClick={() => switchTab("home")} style={{ background:"none", border:"none", color:BRAND.subtle, fontSize:14, fontWeight:600, cursor:"pointer", padding: "12px" }}>{t.returnHome}</button>
      </div>
    );
  }

  // ── HISTORY / BOOKINGS ────────────────────────────────────────────────────
  if (tab === "history") return shell(<>
    <div style={{ background:"#fff", padding:"40px 24px 20px", borderBottom:`1px solid ${BRAND.border}` }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: BRAND.dark }}>{t.myBookings}</h2>
    </div>

    <div style={{ flex:1, overflowY:"auto", padding:"24px 20px 100px" }}>
      {isLoading ? (
        <>
          {[1, 2].map(i => (
             <div key={i} style={{ background:"#fff", borderRadius: 16, padding: 20, marginBottom: 16, border:`1px solid ${BRAND.border}` }}>
               <Skeleton width="40%" height="18px" style={{ marginBottom: 8 }} />
               <Skeleton width="25%" height="14px" style={{ marginBottom: 20 }} />
               <Skeleton width="100%" height="40px" borderRadius="10px" />
             </div>
          ))}
        </>
      ) : myBookings.length === 0 ? (
        <div style={{ textAlign:"center", paddingTop:60, color:BRAND.subtle }}>
          <div style={{ fontWeight:700, fontSize:16, color: BRAND.dark }}>{t.noHistoryYet}</div>
          <div style={{ fontSize:14, marginTop:6, fontWeight: 500 }}>{t.pastBookingsHere}</div>
        </div>
      ) : myBookings.map((b, i) => (
        <div key={b.id} className="fade-up" style={{
            background: "#fff", border: b.status==="Completed" ? "1.5px solid #bbf7d0" : `1px solid ${BRAND.border}`, 
            borderRadius: 16, padding:20, marginBottom:16, opacity: b.status==="Cancelled" ? 0.6 : 1,
            boxShadow:"0 2px 8px rgba(0,0,0,0.02)", animationDelay:`${i*0.04}s`
          }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div>
              <p style={{ fontWeight:700, fontSize:16, color:BRAND.dark, marginBottom:6 }}>{b.worker_name}</p>
              <span style={{ background: BRAND.primaryLight, color: BRAND.primary, padding: "4px 10px", borderRadius: 8, fontSize:12, fontWeight:700 }}>{catLabel(b.category, t)}</span>
            </div>
            <Badge status={b.status} t={t} />
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize:13, color:BRAND.subtle, fontWeight:600 }}>{new Date(b.time).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</p>
            
            {b.status === "Confirmed" && (
               <div style={{ display: "flex", gap: 8 }}>
                 <button onClick={() => { setQrBooking(b); setShowHistoryQR(true); setHistoryPayState("idle"); }} className="tap" style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", color:"#166534", borderRadius: 8, padding:"8px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.completeJob}</button>
                 <button onClick={() => { setCancelId(b.id); setShowCancel(true); }} className="tap" style={{ background:"#fef2f2", border:"1px solid #fecaca", color:"#991b1b", borderRadius: 8, padding:"8px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.cancelBooking}</button>
               </div>
            )}
            
            {b.status === "Completed" && (
               <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#10b981", fontSize: 13, fontWeight: 800 }}>
                 <Icons.CheckSmall /> {t.jobDonePaid}
               </div>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Cancel Modal */}
    {showCancel && (
      <div className="fade-in" style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.6)", backdropFilter:"blur(6px)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
        <div className="slide-up" style={{ background:"#fff", borderRadius:"24px 24px 0 0", padding:"24px 24px 40px", width:"100%", maxWidth:430 }}>
          <div style={{ width:40, height:5, background:"#cbd5e1", borderRadius:4, margin:"0 auto 24px" }} />
          <h3 style={{ fontSize:20, fontWeight:800, color:BRAND.dark, marginBottom:6 }}>{t.cancelBookingTitle}</h3>
          <p style={{ fontSize:14, color:BRAND.subtle, fontWeight:500, marginBottom:24 }}>{t.selectCancelReason}</p>
          
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:32 }}>
            {t.cancelReasons.map(r => (
              <button key={r.value} onClick={() => setCancelReason(r.value)} style={{ padding:"16px", borderRadius: 12, textAlign:"left", fontSize:14, fontWeight:600, cursor:"pointer", border: cancelReason===r.value ? `1.5px solid ${BRAND.primary}` : `1px solid ${BRAND.border}`, background: cancelReason===r.value ? BRAND.primaryLight : "#fff", color: cancelReason===r.value ? BRAND.primary : BRAND.subtle, transition: "all 0.2s" }}>{r.label}</button>
            ))}
          </div>
          
          <div style={{ display:"flex", gap:12 }}>
            <button onClick={() => { setShowCancel(false); setCancelReason(""); }} className="tap" style={{ flex:1, padding:"16px", borderRadius: 12, border:`1px solid ${BRAND.border}`, background:"#fff", color:BRAND.dark, fontSize:15, fontWeight:700 }}>{t.back}</button>
            <button onClick={handleCancel} disabled={!cancelReason} className="tap" style={{ flex:1, padding:"16px", borderRadius: 12, border:"none", background: cancelReason ? "#dc2626" : "#fca5a5", color:"#fff", fontSize:15, fontWeight:700 }}>{t.confirm}</button>
          </div>
        </div>
      </div>
    )}

  {/* FINAL JOB COMPLETION MODAL */}
    {showHistoryQR && (
      <div className="fade-in" style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.7)", backdropFilter:"blur(8px)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
        <div className="slide-up" style={{ background:"#fff", borderRadius:"24px 24px 0 0", padding:"24px 24px 40px", width:"100%", maxWidth:430, textAlign: "center", boxShadow: "0 -10px 40px rgba(0,0,0,0.15)" }}>
          {historyPayState === "idle" && (() => {
            const assignedProv = providers.find(p => p.id === qrBooking?.provider_id);
            const minPrice = assignedProv ? assignedProv.base_price : 150;

            return (
            <>
              <div style={{ width:40, height:5, background:"#cbd5e1", borderRadius:4, margin:"0 auto 24px" }} />
              <h3 style={{ fontSize:20, fontWeight:800, color:BRAND.dark, marginBottom:8 }}>
                {user.role === "provider" ? "Settle Job & Claim Bonus" : t.completeAndSettle}
              </h3>

              {user.role === "provider" ? (
                <div style={{ textAlign: "left", marginBottom: 24 }}>
                  <p style={{ fontSize:14, color:BRAND.subtle, fontWeight:500, marginBottom:16 }}>
                    Enter the final negotiated bill amount. Minimum base price is ₹{minPrice}. You will receive a ₹10 bonus in your wallet upon completion.
                  </p>
                  {billError && <div style={{ color: "#dc2626", fontSize: 13, fontWeight: 600, marginBottom: 12, background: "#fef2f2", padding: "8px", borderRadius: "8px", border: "1px solid #fecaca" }}>{billError}</div>}
                  <input
                    type="number"
                    placeholder={`Enter amount (e.g., ${minPrice + 50})`}
                    value={finalBill}
                    onChange={(e) => setFinalBill(e.target.value)}
                    style={{ width: "100%", padding: "16px", borderRadius: 12, border: `1px solid ${BRAND.border}`, fontSize: 16, outline: "none", marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "700" }}
                  />
                  <button onClick={async () => {
                    const amount = parseInt(finalBill, 10);
                    if (!amount || amount < minPrice) { setBillError(`Error: Minimum base price is ₹${minPrice}`); return; }
                    setBillError("");
                    setHistoryPayState("loading");
                    try {
                      const res = await fetch(`${BASE_URL}/bookings/${qrBooking.id}/settle`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ final_bill_amount: amount })
                      });
                      if (!res.ok) throw new Error("Failed");
                      setHistoryPayState("success");
                    } catch (e) {
                      setBillError("Server error settling booking.");
                      setHistoryPayState("idle");
                    }
                  }} className="tap" style={{ width: "100%", padding:"16px", borderRadius: 14, border:"none", background:BRAND.primary, color:"#fff", fontSize:15, fontWeight:700 }}>
                    Submit Final Invoice
                  </button>
                </div>
              ) : (
                <>
                  <p style={{ fontSize:14, color:BRAND.subtle, fontWeight:500, marginBottom:16 }}>{t.enterFinalAmount}</p>
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "12px 16px", borderRadius: 12, marginBottom: 20, textAlign: "left", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ color: "#dc2626", marginTop: 2 }}><Icons.ShieldAlert /></div>
                    <p style={{ fontSize: 13, color: "#991b1b", fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                      <span style={{ fontWeight: 800 }}>{t.warning}</span> {t.cashWarning}
                    </p>
                  </div>
                  <button onClick={() => { setHistoryPayState("loading"); setTimeout(() => setHistoryPayState("success"), 2000); }} className="tap" style={{ width: "100%", padding:"16px", borderRadius: 14, border:`1.5px solid ${BRAND.primary}`, background:BRAND.primaryLight, color:BRAND.primary, fontSize:15, fontWeight:700, marginBottom: 12 }}>
                    Pay Securely to Activate Warranty
                  </button>
                </>
              )}

              <button onClick={() => { setShowHistoryQR(false); setHistoryPayState("idle"); setBillError(""); setFinalBill(""); }} style={{ background:"none", border:"none", color:BRAND.subtle, fontSize:14, fontWeight:600, padding: "8px" }}>{t.close}</button>
            </>
            );
          })()}

          {historyPayState === "loading" && (
            <div className="fade-in" style={{ padding: "60px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Spinner color={BRAND.primary} />
              <p style={{ marginTop: 24, fontSize: 16, fontWeight: 700, color: BRAND.dark }}>Processing...</p>
            </div>
          )}

          {historyPayState === "success" && (
            <div className="fade-up" style={{ padding: "40px 0 20px" }}>
              <img src="/logo.png" alt="Sevamitra" style={{ display: "block", margin: "0 auto 16px auto", width: 70, height: 70, borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} onError={e => e.target.style.display='none'} />
              <div style={{ color: "#10b981", marginBottom: 16, display: "flex", justifyContent: "center" }}><Icons.CheckCircle /></div>
              <h3 style={{ fontSize:22, fontWeight:800, color:BRAND.dark, marginBottom:8 }}>{t.jobCompleted}</h3>
              <p style={{ fontSize:14, color:BRAND.subtle, fontWeight:500, marginBottom:24, lineHeight: 1.5 }}>
                {user.role === "provider" ? "Successfully closed. ₹10 bonus added to your digital wallet!" : t.warrantyActive}
              </p>
              <button onClick={() => { handleComplete(qrBooking.id); }} className="tap" style={{ width: "100%", padding:"16px", borderRadius: 14, border:"none", background:BRAND.primary, color:"#fff", fontSize:15, fontWeight:800, boxShadow: `0 8px 20px ${BRAND.primary}40` }}>{t.done}</button>
            </div>
          )}
        </div>
      </div>
    )}

    {/* NEW: RATING & REVIEW MODAL */}
    {showReview && (
      <div className="fade-in" style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.8)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding: 20 }}>
        <div className="slide-up" style={{ background:"#fff", borderRadius: 24, padding: 32, width:"100%", maxWidth:430, textAlign:"center", boxShadow:"0 20px 40px rgba(0,0,0,0.2)" }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: BRAND.dark }}>{t.rateService}</h3>
          <p style={{ color: BRAND.subtle, marginBottom: 24, fontWeight: 500 }}>{t.rateExperience.replace("{name}", qrBooking?.worker_name || "")}</p>
          
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 32 }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} onClick={() => setReviewRating(star)} style={{ background: "none", border: "none", fontSize: 44, cursor: "pointer", color: reviewRating >= star ? "#fbbf24" : "#e2e8f0", transition: "all 0.2s", transform: reviewRating === star ? "scale(1.1)" : "scale(1)" }}>★</button>
            ))}
          </div>

          <button onClick={submitReview} disabled={!reviewRating} className="tap" style={{ width: "100%", padding:"16px", borderRadius: 14, border:"none", background: reviewRating ? BRAND.primary : BRAND.border, color: reviewRating ? "#fff" : BRAND.subtle, fontWeight: 800, transition:"all 0.3s" }}>{t.submitFeedback}</button>
        </div>
      </div>
    )}
  </>);

  // ── PROFILE ───────────────────────────────────────────────────────────────
  if (tab === "profile") return shell(<>
    <div style={{ position: "relative", background: `linear-gradient(135deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 100%)`, padding: "48px 24px 32px", borderRadius: "0 0 24px 24px", color: "#fff", boxShadow: "0 12px 24px rgba(37, 99, 235, 0.15)" }}>
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
        <LanguageToggle lang={lang} setLang={setLang} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff" }}>
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{user.name}</h2>
          <p style={{ color: BRAND.primaryLight, fontSize: 14, fontWeight: 500 }}>{user.phone}</p>
        </div>
      </div>
    </div>

    <div style={{ flex:1, overflowY:"auto", padding:"32px 20px 100px" }}>
      <div style={{ background:"#fff", borderRadius: 16, border:`1px solid ${BRAND.border}`, overflow:"hidden", marginBottom: 24, boxShadow:"0 2px 8px rgba(0,0,0,0.02)" }}>
        {[
          { label: t.helpSupport },
          { label: t.termsOfService },
          { label: t.aboutSevamitra },
        ].map((item, i, arr) => (
          <button key={item.label} className="tap" style={{ width:"100%", padding:"20px 24px", background:"none", border:"none", borderBottom:i<arr.length-1?`1px solid ${BRAND.border}`:"none", display:"flex", justifyContent:"space-between", alignItems:"center", color:BRAND.dark, fontSize: 15, fontWeight: 600 }}>
            {item.label}
            <span style={{ color:"#94a3b8" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></span>
          </button>
        ))}
      </div>

      <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="tap" style={{ width:"100%", padding:"18px", borderRadius: 16, background:"#fef2f2", border:"1.5px solid #fecaca", color:"#dc2626", fontSize:15, fontWeight:700 }}>
        {t.logOut}
      </button>
    </div>
  </>);

  return null;
}
