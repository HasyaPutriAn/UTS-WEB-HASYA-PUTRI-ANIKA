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

/* ---------- Filter dan pencarian proyek ---------- */
const kolomCari = document.getElementById("cariProyek");
const grupFilter = document.getElementById("filterKategori");
const semuaProyek = document.querySelectorAll(".proyek-item");
const pesanKosong = document.getElementById("pesanKosong");
let kategoriAktif = "semua";

function tampilkanProyek() {
  const kataKunci = kolomCari.value.trim().toLowerCase();
  let jumlahTampil = 0;

  semuaProyek.forEach(function (item) {
    const cocokKategori = kategoriAktif === "semua" || item.dataset.kategori === kategoriAktif;
    const cocokJudul = item.dataset.judul.includes(kataKunci);
    const tampil = cocokKategori && cocokJudul;
    item.classList.toggle("sembunyi", !tampil);
    if (tampil) jumlahTampil++;
  });

  pesanKosong.classList.toggle("d-none", jumlahTampil > 0);
}

grupFilter.addEventListener("click", function (e) {
  const tombol = e.target.closest("button[data-kategori]");
  if (!tombol) return;
  grupFilter.querySelectorAll("button").forEach(function (b) {
    b.classList.remove("active");
  });
  tombol.classList.add("active");
  kategoriAktif = tombol.dataset.kategori;
  tampilkanProyek();
});

kolomCari.addEventListener("input", tampilkanProyek);