export function getBaseUrl() {
  if (window.location.hostname.includes("127.0.0.1") && false ) { // Kommentera ut "false" för lokal backend
    return "http://localhost:3000/";
  }
  return "https://webbshop-2026-be-rho.vercel.app/"; // Er backend-rotadress
}
