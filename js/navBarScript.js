const mobileBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileIcon = document.getElementById("mobileMenuIcon");

mobileBtn.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  mobileBtn.setAttribute("aria-expanded", isOpen);
  mobileIcon.classList.toggle("fa-bars", !isOpen);
  mobileIcon.classList.toggle("fa-xmark", isOpen);
});

// סגירה אוטומטית בלחיצה על לינק עם data-close
document.querySelectorAll("#mobileMenu a[data-close]").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    mobileBtn.setAttribute("aria-expanded", false);
    mobileIcon.classList.add("fa-bars");
    mobileIcon.classList.remove("fa-xmark");
  });
});
