export function getBaseUrl() {
  if (window.location.hostname.includes("127.0.0.1") /*&& false*/ ) { // Kommentera ut för att komma åt lokal server igen
    return "http://localhost:3000/";
  }
  return "https://webbshop-2026-be-alpha.vercel.app/"; // Er backend-rotadress
}
