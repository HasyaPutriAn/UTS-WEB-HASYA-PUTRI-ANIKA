"use strict";

/* ---------- Mode gelap ---------- */
const tombolTema = document.getElementById("tombolTema");

function terapkanTema(tema) {
  document.documentElement.setAttribute("data-bs-theme", tema);
  const gelap = tema === "dark";
  tombolTema.textContent = gelap ? "Mode terang" : "Mode gelap";
  tombolTema.setAttribute("aria-pressed", String(gelap));
}

function ambilTemaTersimpan() {
  try {
    return localStorage.getItem("tema");
  } catch (e) {
    return null;
  }
}

function simpanTema(tema) {
  try {
    localStorage.setItem("tema", tema);
  } catch (e) {
    /* abaikan jika penyimpanan tidak tersedia */
  }
}

function gantiTema() {
  const sekarang = document.documentElement.getAttribute("data-bs-theme");
  const baru = sekarang === "dark" ? "light" : "dark";
  terapkanTema(baru);
  simpanTema(baru);
}

terapkanTema(ambilTemaTersimpan() || "light");
tombolTema.addEventListener("click", gantiTema);