// ============================================
// KP MANAGEMENT TANJUNG PANDAN
// app.js
// ============================================

// ============================================
// STORAGE KEY
// ============================================
const STORAGE_KEY = "kp_requests_tanjungpandan";

// ============================================
// MASTER DATA (hardcoded sesuai Project Instructions)
// ============================================

const MASTER_TEACHERS = [
  { nama: "Achmad Abdussalam", email: "abdussalamachmad3@gmail.com", noWa: "6283175623433" },
  { nama: "Addela Amelia", email: "addelaameliajob@gmail.com", noWa: "6281995401403" },
  { nama: "ANISAH", email: "anisahhnf@gmail.com", noWa: "6281311023710" },
  { nama: "Annida Naufallina", email: "dainnaafaun@gmail.com", noWa: "6281214458037" },
  { nama: "Cherin", email: "cherinerin1312@gmail.com", noWa: "6283179135146" },
  { nama: "Delila", email: "azizahrizkidelila@gmail.com", noWa: "6287708299334" },
  { nama: "Della Gustia", email: "dellagstia@gmail.com", noWa: "6287893762232" },
  { nama: "Dian Haryati", email: "dianharyati.ar@gmail.com", noWa: "6287896437160" },
  { nama: "Dimas Dwi Goestoro", email: "dimasdwigoestoro@gmail.com", noWa: "6281367588176" },
  { nama: "ELIA SANTO EKAWALTA PERANGIN ANGIN", email: "eliaperanginangin21@guru.sma.belajar.id", noWa: "6281367230157" },
  { nama: "Erieka Rahmah", email: "eriekarahm23@gmail.com", noWa: "6285172392302" },
  { nama: "Felicia Prassilia", email: "feliciaaprssl12.pel@gmail.com", noWa: "628381245975" },
  { nama: "Ferdiyanto", email: "ferdiyanto6q@gmail.com", noWa: "6287713426806" },
  { nama: "Indah Amalia Putri", email: "indahamaliap2121@gmail.com", noWa: "6281477182894" },
  { nama: "Maharizky Aji Luhur", email: "ajiluhur0813@gmail.com", noWa: "6281943293338" },
  { nama: "Misfah Nur Rohmah", email: "ppg.misfahrohmah01128@program.belajar.id", noWa: "6285526313756" },
  { nama: "Monica Putri Ramadan", email: "monica.putri2080@guru.sd.belajar.id", noWa: "6287802550723" },
  { nama: "Nadyla", email: "nadyla014@gmail.com", noWa: "6287882433092" },
  { nama: "NOVRIAN TANOKI PUTERA", email: "novrian.tanoki2@guru.smp.belajar.id", noWa: "6285945533434" },
  { nama: "Nur Izza Arifah", email: "nurizzaarifah10@gmail.com", noWa: "6281949059996" },
  { nama: "Primanisa Nurgravisi", email: "prinurgravisi@gmail.com", noWa: "6283175353388" },
  { nama: "Princessa Dinda Oktaviana", email: "incess2210@gmail.com", noWa: "6282134489158" },
  { nama: "Revnika Fethya", email: "revibastian5@gmail.com", noWa: "6283183488192" },
  { nama: "Riska Istiqomah", email: "riskaaisti@gmail.com", noWa: "6283175085547" },
  { nama: "Safua Nur Habibah", email: "safuanurhabibah24@gmail.com", noWa: "6282246340534" },
  { nama: "Sheila", email: "sheilafanesia22@gmail.com", noWa: "62859110220208" },
  { nama: "Sonny Kosasi", email: "sonnykosasi16@gmail.com", noWa: "6281949582772" },
  { nama: "SUCI UTAMI PUTRI", email: "suciputri82@guru.sma.belajar.id", noWa: "628176052264" },
  { nama: "Tiara Juniarti", email: "tiarajuniarti76@gmail.com", noWa: "6283803581626" },
  { nama: "Widya Patricia nauli", email: "patnaul89@gmail.com", noWa: "6281367530324" },
  { nama: "Yulis Suharti", email: "ysuharti21@gmail.com", noWa: "6285664249067" }
];

const MASTER_AGENTS = [
  "Jimmy Jupri",
  "Hana Hutasoit",
  "Panji Raymond",
  "Richardo Putra",
  "Ghea Aprilia"
];

const MASTER_ROOMS = [
  { full: "101 Lantai 1", short: "101" },
  { full: "102 Lantai 1", short: "102" },
  { full: "103 Lantai 1", short: "103" },
  { full: "104 Lantai 1", short: "104" },
  { full: "201 Lantai 2", short: "201" },
  { full: "202 Lantai 2", short: "202" },
  { full: "203 Lantai 2", short: "203" },
  { full: "204 Lantai 2", short: "204" },
  { full: "Office Lantai 2", short: "Office" }
];

const MASTER_MAPEL = [
  "Matematika",
  "IPA",
  "IPAS",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Biologi",
  "Fisika",
  "Kimia",
  "IPS",
  "Ekonomi",
  "Geografi",
  "Sosiologi",
  "Sejarah",
  "Informatika",
  "Lainnya"
];

const MASTER_KELAS = [
  "5 SD", "6 SD",
  "7 SMP", "8 SMP", "9 SMP",
  "10 SMA", "11 SMA", "12 SMA"
];

// ============================================
// STORAGE HELPERS (LocalStorage)
// ============================================

function getAllRequests() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Gagal membaca data dari LocalStorage:", e);
    return [];
  }
}

function saveAllRequests(requests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

function generateId() {
  return "REQ-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);
}

// ============================================
// NAVIGASI SIDEBAR
// ============================================

function switchToPage(pageId) {
  const navItems = document.querySelectorAll(".nav-item");
  const pages = document.querySelectorAll(".page");

  navItems.forEach(function (nav) {
    nav.classList.remove("active");
  });
  pages.forEach(function (page) {
    page.classList.remove("active");
  });

  const targetNav = document.querySelector('.nav-item[data-page="' + pageId + '"]');
  const targetPage = document.getElementById(pageId);

  if (targetNav) targetNav.classList.add("active");
  if (targetPage) targetPage.classList.add("active");

  // Refresh statistik & daftar setiap kali masuk ke halaman Dashboard
  if (pageId === "dashboard") {
    renderDashboard();
  }

  // Refresh tabel setiap kali masuk ke halaman Histori agar data selalu terbaru
  if (pageId === "histori") {
    renderHistoriTable();
  }

  // Refresh tabel setiap kali masuk ke halaman Broadcast agar data selalu terbaru
  if (pageId === "broadcast") {
    renderBroadcastTable();
  }

  // Refresh info jumlah data setiap kali masuk ke halaman Backup Data
  if (pageId === "backup-data") {
    renderBackupInfo();
  }
}

function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach(function (item) {
    item.addEventListener("click", function () {
      const targetPage = item.getAttribute("data-page");
      switchToPage(targetPage);

      // Jika user mengklik menu "Buat Request KP" secara manual,
      // pastikan form kembali ke mode "tambah baru" (bukan mode edit)
      if (targetPage === "buat-request") {
        resetFormToCreateMode();
      }
    });
  });
}

// ============================================
// POPULATE DROPDOWN MASTER DATA
// ============================================

function populateSelect(selectEl, options) {
  options.forEach(function (opt) {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    selectEl.appendChild(option);
  });
}

function initDropdowns() {
  const saAgentEl = document.getElementById("saAgent");
  const masterTeacherEl = document.getElementById("masterTeacher");
  const ruanganEl = document.getElementById("ruangan");
  const mapelEl = document.getElementById("mapel");
  const kelasOptionsEl = document.getElementById("kelasOptions");

  if (saAgentEl) {
    populateSelect(saAgentEl, MASTER_AGENTS);
  }

  if (masterTeacherEl) {
    populateSelect(masterTeacherEl, MASTER_TEACHERS.map(function (mt) { return mt.nama; }));
  }

  if (ruanganEl) {
    MASTER_ROOMS.forEach(function (room) {
      const option = document.createElement("option");
      option.value = room.full;
      option.textContent = room.full;
      ruanganEl.appendChild(option);
    });
  }

  if (mapelEl) {
    populateSelect(mapelEl, MASTER_MAPEL);
  }

  if (kelasOptionsEl) {
    MASTER_KELAS.forEach(function (kelas) {
      const option = document.createElement("option");
      option.value = kelas;
      kelasOptionsEl.appendChild(option);
    });
  }
}

// ============================================
// TAMPILKAN / SEMBUNYIKAN INPUT MAPEL CUSTOM
// ============================================

function initMapelCustomToggle() {
  const mapelEl = document.getElementById("mapel");
  const mapelCustomGroup = document.getElementById("mapelCustomGroup");
  const mapelCustomEl = document.getElementById("mapelCustom");

  if (!mapelEl) return;

  mapelEl.addEventListener("change", function () {
    if (mapelEl.value === "Lainnya") {
      mapelCustomGroup.style.display = "flex";
    } else {
      mapelCustomGroup.style.display = "none";
      mapelCustomEl.value = "";
    }
  });
}

// ============================================
// TOAST NOTIFICATION
// ============================================

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}

// ============================================
// VALIDASI FORM
// ============================================

function validateForm(data) {
  const errors = [];

  if (!data.namaSiswa) errors.push("Nama Siswa wajib diisi.");
  if (!data.saAgent) errors.push("Nama SA/Agent wajib dipilih.");
  if (!data.tanggal) errors.push("Tanggal wajib diisi.");
  if (!data.jamMulai) errors.push("Jam Mulai wajib diisi.");
  if (!data.jamSelesai) errors.push("Jam Selesai wajib diisi.");
  if (!data.mapel) errors.push("Mata Pelajaran wajib diisi.");
  if (!data.kelas) errors.push("Kelas wajib diisi.");
  if (!data.masterTeacher) errors.push("Nama Master Teacher wajib dipilih.");

  if (data.jamMulai && data.jamSelesai && data.jamSelesai < data.jamMulai) {
    errors.push("Jam Selesai tidak boleh lebih awal dari Jam Mulai.");
  }

  return errors;
}

function showFormErrors(errors) {
  const errorBox = document.getElementById("formError");
  if (!errorBox) return;

  if (errors.length === 0) {
    errorBox.style.display = "none";
    errorBox.innerHTML = "";
    return;
  }

  let html = "<strong>Data belum bisa disimpan:</strong><ul>";
  errors.forEach(function (err) {
    html += "<li>" + err + "</li>";
  });
  html += "</ul>";

  errorBox.innerHTML = html;
  errorBox.style.display = "block";
}

// ============================================
// RESET FORM KE MODE "TAMBAH BARU"
// ============================================

function resetFormToCreateMode() {
  const form = document.getElementById("requestForm");
  if (!form) return;

  form.reset();
  document.getElementById("editingId").value = "";
  document.getElementById("mapelCustomGroup").style.display = "none";

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = "Simpan Request";

  showFormErrors([]);
}

// ============================================
// FORM BUAT / EDIT REQUEST KP
// ============================================

function initRequestForm() {
  const form = document.getElementById("requestForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const mapelSelected = document.getElementById("mapel").value;
    const mapelCustom = document.getElementById("mapelCustom").value.trim();
    const mapelFinal = mapelSelected === "Lainnya" ? mapelCustom : mapelSelected;

    const data = {
      namaSiswa: document.getElementById("namaSiswa").value.trim(),
      saAgent: document.getElementById("saAgent").value,
      tanggal: document.getElementById("tanggal").value,
      jamMulai: document.getElementById("jamMulai").value,
      jamSelesai: document.getElementById("jamSelesai").value,
      mapel: mapelFinal,
      kelas: document.getElementById("kelas").value.trim(),
      masterTeacher: document.getElementById("masterTeacher").value,
      ruangan: document.getElementById("ruangan").value,
      tipeKp: document.getElementById("tipeKp").value,
      topik: document.getElementById("topik").value.trim()
    };

    const errors = validateForm(data);

    if (errors.length > 0) {
      showFormErrors(errors);
      return;
    }

    showFormErrors([]);

    const editingId = document.getElementById("editingId").value;
    const allRequests = getAllRequests();

    if (editingId) {
      // MODE EDIT: perbarui record yang sudah ada
      const idx = allRequests.findIndex(function (r) {
        return r.id === editingId;
      });

      if (idx !== -1) {
        allRequests[idx] = Object.assign({}, allRequests[idx], data, {
          updatedAt: new Date().toISOString()
        });
        saveAllRequests(allRequests);
      }

      showToast("Request KP berhasil diperbarui.");
      resetFormToCreateMode();
      switchToPage("histori");
    } else {
      // MODE TAMBAH BARU
      const newRequest = Object.assign(
        {
          id: generateId(),
          createdAt: new Date().toISOString()
        },
        data
      );

      allRequests.push(newRequest);
      saveAllRequests(allRequests);

      showToast("Request KP berhasil disimpan.");
      resetFormToCreateMode();
    }
  });
}

// ============================================
// EDIT REQUEST (buka data ke form)
// ============================================

function editRequest(id) {
  const requests = getAllRequests();
  const req = requests.find(function (r) {
    return r.id === id;
  });

  if (!req) return;

  document.getElementById("namaSiswa").value = req.namaSiswa || "";
  document.getElementById("saAgent").value = req.saAgent || "";
  document.getElementById("tanggal").value = req.tanggal || "";
  document.getElementById("jamMulai").value = req.jamMulai || "";
  document.getElementById("jamSelesai").value = req.jamSelesai || "";
  document.getElementById("kelas").value = req.kelas || "";
  document.getElementById("masterTeacher").value = req.masterTeacher || "";
  document.getElementById("ruangan").value = req.ruangan || "";
  document.getElementById("tipeKp").value = req.tipeKp || "Klinik PR";
  document.getElementById("topik").value = req.topik || "";

  // Tangani mapel: jika bukan bagian dari master list, gunakan mode custom "Lainnya"
  const mapelSelect = document.getElementById("mapel");
  const mapelCustomGroup = document.getElementById("mapelCustomGroup");
  const mapelCustomEl = document.getElementById("mapelCustom");

  if (req.mapel && MASTER_MAPEL.indexOf(req.mapel) !== -1 && req.mapel !== "Lainnya") {
    mapelSelect.value = req.mapel;
    mapelCustomGroup.style.display = "none";
    mapelCustomEl.value = "";
  } else {
    mapelSelect.value = "Lainnya";
    mapelCustomGroup.style.display = "flex";
    mapelCustomEl.value = req.mapel || "";
  }

  document.getElementById("editingId").value = req.id;

  const submitBtn = document.querySelector('#requestForm button[type="submit"]');
  if (submitBtn) submitBtn.textContent = "Update Request";

  showFormErrors([]);
  switchToPage("buat-request");
}

// ============================================
// DELETE REQUEST (dengan konfirmasi)
// ============================================

function deleteRequest(id) {
  const confirmed = window.confirm(
    "Apakah Anda yakin ingin menghapus request ini? Data yang dihapus tidak dapat dikembalikan."
  );

  if (!confirmed) return;

  let requests = getAllRequests();
  requests = requests.filter(function (r) {
    return r.id !== id;
  });

  saveAllRequests(requests);
  showToast("Request KP berhasil dihapus.");
  renderHistoriTable();
}

// ============================================
// HISTORI: HELPER FORMAT
// ============================================

function getHariFromTanggal(tanggal) {
  if (!tanggal) return "-";
  const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const d = new Date(tanggal + "T00:00:00");
  if (isNaN(d.getTime())) return "-";
  return DAY_NAMES[d.getDay()];
}

function formatTanggalDisplay(tanggal) {
  if (!tanggal) return "-";
  const parts = tanggal.split("-"); // format asal: YYYY-MM-DD
  if (parts.length !== 3) return tanggal;
  return parts[2] + "/" + parts[1] + "/" + parts[0];
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ============================================
// HISTORI: FILTER DROPDOWN (dinamis dari data)
// ============================================

function getUniqueValues(requests, field) {
  const values = requests
    .map(function (r) {
      return r[field];
    })
    .filter(Boolean);
  return Array.from(new Set(values)).sort(function (a, b) {
    return a.localeCompare(b);
  });
}

function populateFilterSelect(selectId, values) {
  const selectEl = document.getElementById(selectId);
  if (!selectEl) return;

  const currentValue = selectEl.value;
  selectEl.innerHTML = '<option value="">Semua</option>';

  values.forEach(function (val) {
    const option = document.createElement("option");
    option.value = val;
    option.textContent = val;
    selectEl.appendChild(option);
  });

  if (values.indexOf(currentValue) !== -1) {
    selectEl.value = currentValue;
  }
}

function populateHistoriFilters() {
  const requests = getAllRequests();
  populateFilterSelect("filterAgent", getUniqueValues(requests, "saAgent"));
  populateFilterSelect("filterMT", getUniqueValues(requests, "masterTeacher"));
  populateFilterSelect("filterMapel", getUniqueValues(requests, "mapel"));
  populateFilterSelect("filterKelas", getUniqueValues(requests, "kelas"));
}

// ============================================
// HISTORI: FILTER + SEARCH + SORT
// ============================================

function getFilteredSortedRequests() {
  const requests = getAllRequests();

  const searchTerm = (document.getElementById("historiSearch").value || "").toLowerCase().trim();
  const filterTanggal = document.getElementById("filterTanggal").value;
  const filterAgent = document.getElementById("filterAgent").value;
  const filterMT = document.getElementById("filterMT").value;
  const filterMapel = document.getElementById("filterMapel").value;
  const filterKelas = document.getElementById("filterKelas").value;

  const filtered = requests.filter(function (r) {
    if (searchTerm && (!r.namaSiswa || r.namaSiswa.toLowerCase().indexOf(searchTerm) === -1)) {
      return false;
    }
    if (filterTanggal && r.tanggal !== filterTanggal) return false;
    if (filterAgent && r.saAgent !== filterAgent) return false;
    if (filterMT && r.masterTeacher !== filterMT) return false;
    if (filterMapel && r.mapel !== filterMapel) return false;
    if (filterKelas && r.kelas !== filterKelas) return false;
    return true;
  });

  // Urutkan berdasarkan tanggal terbaru, lalu jam mulai terbaru
  filtered.sort(function (a, b) {
    const dateCompare = (b.tanggal || "").localeCompare(a.tanggal || "");
    if (dateCompare !== 0) return dateCompare;
    return (b.jamMulai || "").localeCompare(a.jamMulai || "");
  });

  return filtered;
}

// ============================================
// HISTORI: RENDER TABEL
// ============================================

function renderHistoriTable() {
  const tbody = document.getElementById("historiTableBody");
  if (!tbody) return;

  populateHistoriFilters();

  const data = getFilteredSortedRequests();

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" class="empty-state">Tidak ada data request KP yang cocok.</td></tr>';
    return;
  }

  let html = "";

  data.forEach(function (r, index) {
    html += "<tr>";
    html += "<td>" + (index + 1) + "</td>";
    html += "<td>" + escapeHtml(r.namaSiswa) + "</td>";
    html += "<td>" + escapeHtml(r.saAgent) + "</td>";
    html += "<td>" + getHariFromTanggal(r.tanggal) + "</td>";
    html += "<td>" + formatTanggalDisplay(r.tanggal) + "</td>";
    html += "<td>" + (r.jamMulai || "-") + " - " + (r.jamSelesai || "-") + "</td>";
    html += "<td>" + escapeHtml(r.mapel) + "</td>";
    html += "<td>" + escapeHtml(r.kelas) + "</td>";
    html += "<td>" + escapeHtml(r.masterTeacher) + "</td>";
    html += '<td class="action-cell">';
    html += '<button type="button" class="btn-icon btn-edit" data-action="edit" data-id="' + r.id + '">Edit</button>';
    html += '<button type="button" class="btn-icon btn-delete" data-action="delete" data-id="' + r.id + '">Hapus</button>';
    html += "</td>";
    html += "</tr>";
  });

  tbody.innerHTML = html;
}

// ============================================
// HISTORI: EVENT LISTENERS (filter, search, aksi)
// ============================================

function initHistoriFilters() {
  const ids = ["historiSearch", "filterTanggal", "filterAgent", "filterMT", "filterMapel", "filterKelas"];

  ids.forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", renderHistoriTable);
    el.addEventListener("change", renderHistoriTable);
  });

  const resetBtn = document.getElementById("resetFilterBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      document.getElementById("historiSearch").value = "";
      document.getElementById("filterTanggal").value = "";
      document.getElementById("filterAgent").value = "";
      document.getElementById("filterMT").value = "";
      document.getElementById("filterMapel").value = "";
      document.getElementById("filterKelas").value = "";
      renderHistoriTable();
    });
  }
}

function initHistoriActions() {
  const tbody = document.getElementById("historiTableBody");
  if (!tbody) return;

  tbody.addEventListener("click", function (e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = btn.getAttribute("data-id");
    const action = btn.getAttribute("data-action");

    if (action === "edit") {
      editRequest(id);
    } else if (action === "delete") {
      deleteRequest(id);
    }
  });
}

// ============================================
// BROADCAST: STATE SELEKSI
// ============================================

const selectedBroadcastIds = new Set();

function updateSelectedCountLabel() {
  const label = document.getElementById("selectedCountLabel");
  if (!label) return;
  label.textContent = selectedBroadcastIds.size + " request dipilih";
}

// ============================================
// BROADCAST: FORMAT HELPER
// ============================================

function formatBroadcastDate(tanggal) {
  if (!tanggal) return "-";

  const DAY_NAMES = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
  const MONTH_NAMES = [
    "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
    "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
  ];

  const d = new Date(tanggal + "T00:00:00");
  if (isNaN(d.getTime())) return "-";

  const hari = DAY_NAMES[d.getDay()];
  const tgl = d.getDate();
  const bulan = MONTH_NAMES[d.getMonth()];
  const tahun = d.getFullYear();

  return hari + ", " + tgl + " " + bulan + " " + tahun;
}

function formatJamBroadcast(jam) {
  if (!jam) return "-";
  return jam.replace(":", ".");
}

function timeToMinutes(jam) {
  if (!jam) return 0;
  const parts = jam.split(":");
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

function calculateSesiKp(jamMulai, jamSelesai) {
  if (!jamMulai || !jamSelesai) return 1;
  const durasiMenit = timeToMinutes(jamSelesai) - timeToMinutes(jamMulai);
  const sesi = Math.round(durasiMenit / 45);
  return sesi > 0 ? sesi : 1;
}

function getMTShortName(fullName) {
  if (!fullName) return "-";
  const firstName = fullName.trim().split(" ")[0];
  return "Kak " + firstName;
}

function getRuanganShort(ruanganFull) {
  const found = MASTER_ROOMS.find(function (r) {
    return r.full === ruanganFull;
  });
  return found ? found.short : (ruanganFull || "-");
}

// ============================================
// BROADCAST: GENERATE TEXT
// ============================================

function generateBroadcastText(selectedRequests) {
  // Urutkan berdasarkan jam mulai sesuai spesifikasi
  const sorted = selectedRequests.slice().sort(function (a, b) {
    return (a.jamMulai || "").localeCompare(b.jamMulai || "");
  });

  // Tanggal broadcast diambil dari request yang dipilih
  const uniqueDates = Array.from(
    new Set(selectedRequests.map(function (r) { return r.tanggal; }))
  ).sort();
  const headerDateRaw = uniqueDates[0] || "";

  const lines = [];
  lines.push("REKAP FINAL KLINIK PR / KELAS PRIVATE");
  lines.push("📝 " + formatBroadcastDate(headerDateRaw));

  sorted.forEach(function (r) {
    lines.push("============================");
    lines.push("🏫 KELAS: " + r.kelas);

    const namaTampil = r.namaSiswa + (r.tipeKp === "Private" ? " (private)" : "");
    lines.push("🧑‍🎓 Siswa: " + namaTampil);

    const sesi = calculateSesiKp(r.jamMulai, r.jamSelesai);
    lines.push(
      "🕟 Jam: " + formatJamBroadcast(r.jamMulai) + " - " + formatJamBroadcast(r.jamSelesai) +
      " [" + sesi + " SESI KP]"
    );

    lines.push("📝 Mapel: " + r.mapel);
    lines.push("👩‍🏫 Master Teacher: " + getMTShortName(r.masterTeacher));
    lines.push("📚 Ruangan: " + getRuanganShort(r.ruangan));
    lines.push("📝 Topik: " + (r.topik || "-"));
  });

  return {
    text: lines.join("\n\n"),
    multipleDates: uniqueDates.length > 1
  };
}

// ============================================
// BROADCAST: RENDER TABEL PEMILIHAN REQUEST
// ============================================

function renderBroadcastTable() {
  const tbody = document.getElementById("broadcastTableBody");
  if (!tbody) return;

  const requests = getAllRequests().slice().sort(function (a, b) {
    const dateCompare = (a.tanggal || "").localeCompare(b.tanggal || "");
    if (dateCompare !== 0) return dateCompare;
    return (a.jamMulai || "").localeCompare(b.jamMulai || "");
  });

  if (requests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="empty-state">Belum ada data request KP.</td></tr>';
    updateSelectedCountLabel();
    return;
  }

  let html = "";

  requests.forEach(function (r) {
    const checked = selectedBroadcastIds.has(r.id) ? "checked" : "";
    html += "<tr>";
    html += '<td class="checkbox-col"><input type="checkbox" data-id="' + r.id + '" ' + checked + "></td>";
    html += "<td>" + formatTanggalDisplay(r.tanggal) + "</td>";
    html += "<td>" + (r.jamMulai || "-") + " - " + (r.jamSelesai || "-") + "</td>";
    html += "<td>" + escapeHtml(r.namaSiswa) + "</td>";
    html += "<td>" + escapeHtml(r.kelas) + "</td>";
    html += "<td>" + escapeHtml(r.mapel) + "</td>";
    html += "<td>" + escapeHtml(r.masterTeacher) + "</td>";
    html += "<td>" + getRuanganShort(r.ruangan) + "</td>";
    html += "<td>" + escapeHtml(r.tipeKp) + "</td>";
    html += "</tr>";
  });

  tbody.innerHTML = html;
  updateSelectedCountLabel();
}

// ============================================
// BROADCAST: EVENT LISTENERS
// ============================================

function initBroadcastActions() {
  const tbody = document.getElementById("broadcastTableBody");
  const selectByDateBtn = document.getElementById("selectByDateBtn");
  const selectAllBtn = document.getElementById("selectAllBtn");
  const deselectAllBtn = document.getElementById("deselectAllBtn");
  const generateBtn = document.getElementById("generateBroadcastBtn");
  const clearBtn = document.getElementById("clearBroadcastBtn");
  const copyBtn = document.getElementById("copyBroadcastBtn");

  // Checkbox per baris (event delegation)
  if (tbody) {
    tbody.addEventListener("change", function (e) {
      const checkbox = e.target;
      if (checkbox.type !== "checkbox") return;

      const id = checkbox.getAttribute("data-id");
      if (checkbox.checked) {
        selectedBroadcastIds.add(id);
      } else {
        selectedBroadcastIds.delete(id);
      }
      updateSelectedCountLabel();
    });
  }

  // Pilih berdasarkan tanggal
  if (selectByDateBtn) {
    selectByDateBtn.addEventListener("click", function () {
      const tanggal = document.getElementById("broadcastDateFilter").value;
      if (!tanggal) {
        showToast("Pilih tanggal terlebih dahulu.");
        return;
      }

      const requests = getAllRequests();
      const matching = requests.filter(function (r) {
        return r.tanggal === tanggal;
      });

      if (matching.length === 0) {
        showToast("Tidak ada request pada tanggal tersebut.");
        return;
      }

      matching.forEach(function (r) {
        selectedBroadcastIds.add(r.id);
      });

      renderBroadcastTable();
    });
  }

  // Pilih semua
  if (selectAllBtn) {
    selectAllBtn.addEventListener("click", function () {
      const requests = getAllRequests();
      requests.forEach(function (r) {
        selectedBroadcastIds.add(r.id);
      });
      renderBroadcastTable();
    });
  }

  // Batalkan semua pilihan
  if (deselectAllBtn) {
    deselectAllBtn.addEventListener("click", function () {
      selectedBroadcastIds.clear();
      renderBroadcastTable();
    });
  }

  // Generate Broadcast
  if (generateBtn) {
    generateBtn.addEventListener("click", function () {
      if (selectedBroadcastIds.size === 0) {
        showToast("Pilih minimal satu request terlebih dahulu.");
        return;
      }

      const requests = getAllRequests();
      const selected = requests.filter(function (r) {
        return selectedBroadcastIds.has(r.id);
      });

      const result = generateBroadcastText(selected);
      document.getElementById("broadcastOutput").value = result.text;

      if (result.multipleDates) {
        showToast("Perhatian: request yang dipilih berasal dari tanggal berbeda.");
      } else {
        showToast("Broadcast berhasil dibuat.");
      }
    });
  }

  // Clear
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      document.getElementById("broadcastOutput").value = "";
      selectedBroadcastIds.clear();
      renderBroadcastTable();
    });
  }

  // Copy Text
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      copyBroadcastText();
    });
  }
}

// ============================================
// BROADCAST: COPY TO CLIPBOARD
// ============================================

function copyBroadcastText() {
  const output = document.getElementById("broadcastOutput");
  const text = output.value;

  if (!text.trim()) {
    showToast("Belum ada text broadcast untuk disalin.");
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(function () {
        showToast("Text broadcast berhasil disalin ke clipboard.");
      })
      .catch(function () {
        fallbackCopyText(output);
      });
  } else {
    fallbackCopyText(output);
  }
}

function fallbackCopyText(textareaEl) {
  textareaEl.select();
  textareaEl.setSelectionRange(0, 999999);

  try {
    document.execCommand("copy");
    showToast("Text broadcast berhasil disalin ke clipboard.");
  } catch (e) {
    showToast("Gagal menyalin otomatis. Silakan salin manual.");
  }

  textareaEl.blur();
}

// ============================================
// DASHBOARD: HELPER TANGGAL HARI INI
// ============================================

function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}

function getTodayDateString() {
  const d = new Date();
  return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
}

// ============================================
// DASHBOARD: RENDER STATISTIK & DAFTAR
// ============================================

function renderDashboard() {
  const requests = getAllRequests();
  const today = getTodayDateString();
  const currentYearMonth = today.substring(0, 7); // format "YYYY-MM"

  // ---- Hitung statistik ----
  const totalRequest = requests.length;

  const kpBulanIni = requests.filter(function (r) {
    return (r.tanggal || "").substring(0, 7) === currentYearMonth;
  }).length;

  const kpHariIniArr = requests.filter(function (r) {
    return r.tanggal === today;
  });

  const totalSiswa = new Set(
    requests
      .map(function (r) { return (r.namaSiswa || "").trim().toLowerCase(); })
      .filter(Boolean)
  ).size;

  const totalMT = new Set(
    requests
      .map(function (r) { return r.masterTeacher; })
      .filter(Boolean)
  ).size;

  // ---- Tampilkan ke card ----
  document.getElementById("statTotalRequest").textContent = totalRequest;
  document.getElementById("statKpBulanIni").textContent = kpBulanIni;
  document.getElementById("statKpHariIni").textContent = kpHariIniArr.length;
  document.getElementById("statTotalSiswa").textContent = totalSiswa;
  document.getElementById("statTotalMT").textContent = totalMT;

  // ---- Render daftar ----
  renderKpHariIniList(kpHariIniArr);
  renderRequestTerbaru(requests);
}

function renderKpHariIniList(kpHariIniArr) {
  const tbody = document.getElementById("kpHariIniBody");
  if (!tbody) return;

  const sorted = kpHariIniArr.slice().sort(function (a, b) {
    return (a.jamMulai || "").localeCompare(b.jamMulai || "");
  });

  if (sorted.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Tidak ada request KP untuk hari ini.</td></tr>';
    return;
  }

  let html = "";
  sorted.forEach(function (r) {
    html += "<tr>";
    html += "<td>" + (r.jamMulai || "-") + " - " + (r.jamSelesai || "-") + "</td>";
    html += "<td>" + escapeHtml(r.namaSiswa) + "</td>";
    html += "<td>" + escapeHtml(r.mapel) + "</td>";
    html += "<td>" + escapeHtml(r.kelas) + "</td>";
    html += "<td>" + escapeHtml(r.masterTeacher) + "</td>";
    html += "<td>" + escapeHtml(r.ruangan) + "</td>";
    html += "</tr>";
  });

  tbody.innerHTML = html;
}

function renderRequestTerbaru(requests) {
  const tbody = document.getElementById("requestTerbaruBody");
  if (!tbody) return;

  const sorted = requests.slice().sort(function (a, b) {
    return (b.createdAt || "").localeCompare(a.createdAt || "");
  });

  const latest = sorted.slice(0, 5);

  if (latest.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Belum ada request KP.</td></tr>';
    return;
  }

  let html = "";
  latest.forEach(function (r) {
    html += "<tr>";
    html += "<td>" + escapeHtml(r.namaSiswa) + "</td>";
    html += "<td>" + formatTanggalDisplay(r.tanggal) + "</td>";
    html += "<td>" + (r.jamMulai || "-") + " - " + (r.jamSelesai || "-") + "</td>";
    html += "<td>" + escapeHtml(r.mapel) + "</td>";
    html += "<td>" + escapeHtml(r.masterTeacher) + "</td>";
    html += "</tr>";
  });

  tbody.innerHTML = html;
}

// ============================================
// BACKUP DATA: INFO JUMLAH DATA
// ============================================

function renderBackupInfo() {
  const countEl = document.getElementById("backupDataCount");
  if (!countEl) return;
  countEl.textContent = getAllRequests().length;
}

// ============================================
// BACKUP DATA: EXPORT
// ============================================

function exportBackupData() {
  const requests = getAllRequests();

  const backupObject = {
    appName: "KP Management Tanjung Pandan",
    version: 1,
    exportedAt: new Date().toISOString(),
    totalData: requests.length,
    requests: requests
  };

  const jsonStr = JSON.stringify(backupObject, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const filename = "KP-Backup-" + getTodayDateString() + ".json";

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast("Backup berhasil diexport (" + requests.length + " data).");
}

// ============================================
// BACKUP DATA: IMPORT + VALIDASI + KONFIRMASI
// ============================================

function processImportFile(file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    let parsed;

    try {
      parsed = JSON.parse(e.target.result);
    } catch (err) {
      showToast("File tidak valid: bukan format JSON yang benar.");
      resetImportInput();
      return;
    }

    // Terima 2 kemungkinan struktur: { requests: [...] } atau array langsung
    let importedRequests = null;

    if (Array.isArray(parsed)) {
      importedRequests = parsed;
    } else if (parsed && Array.isArray(parsed.requests)) {
      importedRequests = parsed.requests;
    }

    if (!importedRequests) {
      showToast("Struktur file backup tidak dikenali. Import dibatalkan.");
      resetImportInput();
      return;
    }

    // Validasi minimal: setiap item harus object dan punya field inti request KP
    const isValidStructure = importedRequests.every(function (item) {
      return (
        item &&
        typeof item === "object" &&
        typeof item.namaSiswa !== "undefined" &&
        typeof item.tanggal !== "undefined"
      );
    });

    if (!isValidStructure) {
      showToast("Sebagian data pada file tidak memiliki struktur request yang valid. Import dibatalkan.");
      resetImportInput();
      return;
    }

    // Pastikan setiap item punya id (jaga-jaga file backup lama)
    const normalized = importedRequests.map(function (item) {
      if (!item.id) {
        item.id = generateId();
      }
      return item;
    });

    const currentCount = getAllRequests().length;
    const confirmed = window.confirm(
      "File backup berisi " + normalized.length + " data request.\n" +
      "Data yang tersimpan saat ini (" + currentCount + " data) akan DITIMPA sepenuhnya.\n\n" +
      "Lanjutkan import?"
    );

    if (!confirmed) {
      showToast("Import dibatalkan.");
      resetImportInput();
      return;
    }

    saveAllRequests(normalized);
    showToast("Import berhasil. " + normalized.length + " data telah dimuat.");

    // Refresh seluruh tampilan aplikasi agar data baru langsung terlihat
    renderDashboard();
    renderHistoriTable();
    renderBroadcastTable();
    renderBackupInfo();

    resetImportInput();
  };

  reader.onerror = function () {
    showToast("Gagal membaca file. Silakan coba lagi.");
    resetImportInput();
  };

  reader.readAsText(file);
}

function resetImportInput() {
  const input = document.getElementById("importFileInput");
  const importBtn = document.getElementById("importDataBtn");
  if (input) input.value = "";
  if (importBtn) importBtn.disabled = true;
}

// ============================================
// BACKUP DATA: EVENT LISTENERS
// ============================================

function initBackupActions() {
  const exportBtn = document.getElementById("exportDataBtn");
  const importInput = document.getElementById("importFileInput");
  const importBtn = document.getElementById("importDataBtn");

  if (exportBtn) {
    exportBtn.addEventListener("click", exportBackupData);
  }

  if (importInput && importBtn) {
    importInput.addEventListener("change", function () {
      importBtn.disabled = !importInput.files || importInput.files.length === 0;
    });

    importBtn.addEventListener("click", function () {
      const file = importInput.files && importInput.files[0];
      if (!file) {
        showToast("Pilih file JSON terlebih dahulu.");
        return;
      }
      processImportFile(file);
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initNavigation();
  initDropdowns();
  initMapelCustomToggle();
  initRequestForm();
  initHistoriFilters();
  initHistoriActions();
  renderHistoriTable();
  initBroadcastActions();
  renderBroadcastTable();
  renderDashboard();
  initBackupActions();
  renderBackupInfo();
});
