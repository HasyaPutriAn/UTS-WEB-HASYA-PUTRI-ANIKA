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

/* ---------- Kalkulator estimasi biaya ---------- */
const formEstimasi = document.getElementById("formEstimasi");
const inputHalaman = document.getElementById("jumlahHalaman");
const hasilTotal = document.getElementById("hasilTotal");
const hasilRincian = document.getElementById("hasilRincian");
const BIAYA_PER_HALAMAN = 150000;

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);
}

function tambahBaris(teks) {
  const li = document.createElement("li");
  li.textContent = teks;
  hasilRincian.appendChild(li);
}

function hitungEstimasi(event) {
  event.preventDefault();

  const halaman = parseInt(inputHalaman.value, 10);
  if (isNaN(halaman) || halaman < 1 || halaman > 50) {
    inputHalaman.classList.add("is-invalid");
    hasilTotal.textContent = formatRupiah(0);
    hasilRincian.innerHTML = "";
    tambahBaris("Perbaiki jumlah halaman dulu.");
    return;
  }
  inputHalaman.classList.remove("is-invalid");

  const pilihJenis = document.getElementById("jenisProyek");
  const biayaDasar = Number(pilihJenis.value);
  const namaJenis = pilihJenis.options[pilihJenis.selectedIndex].text;
  const biayaHalaman = halaman * BIAYA_PER_HALAMAN;

  let biayaFitur = 0;
  const namaFitur = [];
  document.querySelectorAll(".fitur:checked").forEach(function (cek) {
    biayaFitur += Number(cek.value);
    namaFitur.push(cek.nextElementSibling.textContent.split(" (")[0]);
  });

  const total = biayaDasar + biayaHalaman + biayaFitur;

  hasilTotal.textContent = formatRupiah(total);
  hasilRincian.innerHTML = "";
  tambahBaris(namaJenis + ": " + formatRupiah(biayaDasar));
  tambahBaris(halaman + " halaman: " + formatRupiah(biayaHalaman));
  tambahBaris(
    namaFitur.length > 0
      ? "Fitur (" + namaFitur.join(", ") + "): " + formatRupiah(biayaFitur)
      : "Tanpa fitur tambahan"
  );
}

formEstimasi.addEventListener("submit", hitungEstimasi);

/* ---------- Validasi form kontak ---------- */
const formKontak = document.getElementById("formKontak");
const notifKontak = document.getElementById("notifKontak");

function tandai(input, valid) {
  input.classList.toggle("is-invalid", !valid);
  input.classList.toggle("is-valid", valid);
  return valid;
}

function validasiKontak(event) {
  event.preventDefault();

  const nama = document.getElementById("nama");
  const email = document.getElementById("email");
  const pesan = document.getElementById("pesan");
  const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const okNama = tandai(nama, nama.value.trim().length >= 3);
  const okEmail = tandai(email, polaEmail.test(email.value.trim()));
  const okPesan = tandai(pesan, pesan.value.trim().length >= 10);

  if (okNama && okEmail && okPesan) {
    notifKontak.className = "mt-3 alert alert-success";
    notifKontak.textContent = "Terima kasih, " + nama.value.trim() + ". Pesanmu sudah lolos validasi.";
    formKontak.reset();
    [nama, email, pesan].forEach(function (el) {
      el.classList.remove("is-valid");
    });
  } else {
    notifKontak.className = "mt-3 alert alert-danger";
    notifKontak.textContent = "Masih ada isian yang belum benar. Cek kolom yang bertanda merah.";
  }
}

formKontak.addEventListener("submit", validasiKontak);