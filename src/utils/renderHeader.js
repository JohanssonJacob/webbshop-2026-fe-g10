export function renderHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  header.innerHTML = `
    <nav>
      <a href="../index.html" class="logo">Plot Twist</a>
      
      <button class="menu-toggle" aria-label="Meny">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>

      <ul class="nav-links">
        ${!token ? `
          <li><a href="/pages/register.html">Login</a></li>
        ` : `
          <li><a href="/pages/upload-plant.html">Upload Plant</a></li>
          <li><a href="/pages/profile.html">Profile</a></li>
          
          ${role === "admin" ? `
            <li><a href="/pages/admin-panel.html" style="color: var(--color-accent)">Admin</a></li>
          ` : ""}
          
          <li><a href="#" id="logoutBtn">Logout</a></li>
        `}
      </ul>
    </nav>
  `;

  const menuToggle = header.querySelector(".menu-toggle");
  const navLinks = header.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      menuToggle.classList.toggle("is-active");
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "../index.html";
    });
  }
}