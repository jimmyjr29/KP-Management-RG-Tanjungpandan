// ============================================
// KP MANAGEMENT TANJUNG PANDAN
// app.js
// ============================================

// ============================================
// KONFIGURASI SUPABASE
// ============================================
// Ganti dua nilai berikut dengan Project URL dan Publishable (anon) Key
// dari dashboard Supabase Anda. JANGAN PERNAH menaruh service_role key di sini.

const SUPABASE_URL = "https://cisjhkvazfosuajtegyx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_TB6Bv7OuDSOCvkUyoLWsbw_ur5FoOrx";

const SUPABASE_TABLE = "kp_requests";

// Key LocalStorage LAMA (sebelum migrasi ke Supabase) - hanya dibaca SEKALI
// untuk proses migrasi satu kali, TIDAK PERNAH dipakai lagi sebagai sumber data.
const OLD_LOCALSTORAGE_KEY = "kp_requests_tanjungpandan";
const MIGRATION_FLAG_KEY = "kp_supabase_migration_done";

let supabaseClient = null;
try {
  if (typeof supabase !== "undefined" && supabase.createClient) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  }
} catch (e) {
  console.error("Gagal inisialisasi Supabase client:", e);
  supabaseClient = null;
}

function ensureSupabaseReady() {
  if (!supabaseClient) {
    throw new Error("Supabase client belum siap / belum dikonfigurasi.");
  }
}

// Log detail error Supabase/PostgREST selengkap mungkin (message, details, hint, code)
// supaya gampang didiagnosis dari console browser tanpa perlu expand object manual.
function logSupabaseError(context, err) {
  const parts = [context];
  if (err) {
    if (err.message) parts.push("message: " + err.message);
    if (err.details) parts.push("details: " + err.details);
    if (err.hint) parts.push("hint: " + err.hint);
    if (err.code) parts.push("code: " + err.code);
  }
  console.error(parts.join(" | "), err);
}

// ============================================
// LOADING INDICATOR (sederhana)
// ============================================

function showGlobalLoading() {
  const el = document.getElementById("globalLoading");
  if (el) el.style.display = "block";
}

function hideGlobalLoading() {
  const el = document.getElementById("globalLoading");
  if (el) el.style.display = "none";
}

// ============================================
// MASTER DATA (hardcoded sesuai Project Instructions)
// ============================================

const MASTER_TEACHERS = [
  { nama: "Achmad Abdussalam", email: "abdussalamachmad3@gmail.com", noWa: "6283175623433" },
  { nama: "Addela Amelia", email: "addelaameliajob@gmail.com", noWa: "6281995401403" },
  { nama: "Anisah", email: "anisahhnf@gmail.com", noWa: "6281311023710" },
  { nama: "Annida Naufallina", email: "dainnaafaun@gmail.com", noWa: "6281214458037" },
  { nama: "Cherin", email: "cherinerin1312@gmail.com", noWa: "6283179135146" },
  { nama: "Delila", email: "azizahrizkidelila@gmail.com", noWa: "6287708299334" },
  { nama: "Della Gustia", email: "dellagstia@gmail.com", noWa: "6287893762232" },
  { nama: "Dian Haryati", email: "dianharyati.ar@gmail.com", noWa: "6287896437160" },
  { nama: "Dimas Dwi Goestoro", email: "dimasdwigoestoro@gmail.com", noWa: "6281367588176" },
  { nama: "Elia Santo Ekawalta Perangin Angin", email: "eliaperanginangin21@guru.sma.belajar.id", noWa: "6281367230157" },
  { nama: "Erieka Rahmah", email: "eriekarahm23@gmail.com", noWa: "6285172392302" },
  { nama: "Felicia Prassilia", email: "feliciaaprssl12.pel@gmail.com", noWa: "628381245975" },
  { nama: "Ferdiyanto", email: "ferdiyanto6q@gmail.com", noWa: "6287713426806" },
  { nama: "Indah Amalia Putri", email: "indahamaliap2121@gmail.com", noWa: "6281477182894" },
  { nama: "Maharizky Aji Luhur", email: "ajiluhur0813@gmail.com", noWa: "6281943293338" },
  { nama: "Misfah Nur Rohmah", email: "ppg.misfahrohmah01128@program.belajar.id", noWa: "6285526313756" },
  { nama: "Monica Putri Ramadan", email: "monica.putri2080@guru.sd.belajar.id", noWa: "6287802550723" },
  { nama: "Nadyla", email: "nadyla014@gmail.com", noWa: "6287882433092" },
  { nama: "Novrian Tanoki Putera", email: "novrian.tanoki2@guru.smp.belajar.id", noWa: "6285945533434" },
  { nama: "Nur Izza Arifah", email: "nurizzaarifah10@gmail.com", noWa: "6281949059996" },
  { nama: "Primanisa Nurgravisi", email: "prinurgravisi@gmail.com", noWa: "6283175353388" },
  { nama: "Princessa Dinda Oktaviana", email: "incess2210@gmail.com", noWa: "6282134489158" },
  { nama: "Revnika Fethya", email: "revibastian5@gmail.com", noWa: "6283183488192" },
  { nama: "Riska Istiqomah", email: "riskaaisti@gmail.com", noWa: "6283175085547" },
  { nama: "Safua Nur Habibah", email: "safuanurhabibah24@gmail.com", noWa: "6282246340534" },
  { nama: "Sheila", email: "sheilafanesia22@gmail.com", noWa: "62859110220208" },
  { nama: "Sonny Kosasi", email: "sonnykosasi16@gmail.com", noWa: "6281949582772" },
  { nama: "Suci Utami Putri", email: "suciputri82@guru.sma.belajar.id", noWa: "628176052264" },
  { nama: "Tiara Juniarti", email: "tiarajuniarti76@gmail.com", noWa: "6283803581626" },
  { nama: "Widya Patricia Nauli", email: "patnaul89@gmail.com", noWa: "6281367530324" },
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
  "UTBK",
  "TKA",
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

// ============================================
// STATE / CACHE DATA (sumber untuk seluruh fungsi render yang bersifat sinkron)
// ============================================
// PENTING: Supabase adalah SINGLE SOURCE OF TRUTH. `cachedRequests` hanyalah
// salinan di memori dari data Supabase, di-refresh setiap kali ada perubahan
// (create/edit/delete/import) lewat refreshDataFromSupabase().

let cachedRequests = [];

// Dipertahankan agar SELURUH fungsi render yang sudah ada (Dashboard, Histori,
// Broadcast, Kuota) TIDAK PERLU diubah sama sekali - mereka tetap memanggil
// getAllRequests() secara sinkron seperti sebelumnya.
function getAllRequests() {
  return cachedRequests;
}

function generateId() {
  return "REQ-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);
}

// ============================================
// MAPPING FIELD: JS (camelCase) <-> Supabase (snake_case)
// ============================================

function toSupabaseRow(reqObj) {
  const row = {
    id: reqObj.id,
    nama_siswa: reqObj.namaSiswa || null,
    sa_agent: reqObj.saAgent || null,
    tanggal: reqObj.tanggal || null,
    jam_mulai: reqObj.jamMulai || null,
    jam_selesai: reqObj.jamSelesai || null,
    mapel: reqObj.mapel || null,
    kelas: reqObj.kelas || null,
    master_teacher: reqObj.masterTeacher || null,
    ruangan: reqObj.ruangan || null,
    tipe_kp: reqObj.tipeKp || null,
    status: reqObj.status || null,
    topik: reqObj.topik || null,
    jumlah_sesi:
      reqObj.jumlahSesi && reqObj.jumlahSesi > 0
        ? reqObj.jumlahSesi
        : 1
  };

  // created_at hanya dikirim jika memang tersedia.
  // Jika tidak ada, Supabase akan menggunakan DEFAULT now().
  if (reqObj.createdAt) {
    row.created_at = reqObj.createdAt;
  }

  // updated_at hanya dikirim jika memang tersedia.
  // Jika tidak ada, Supabase akan menggunakan DEFAULT now().
  if (reqObj.updatedAt) {
    row.updated_at = reqObj.updatedAt;
  }

  return row;
}

// function toSupabaseRow(reqObj) {
//   return {
//     id: reqObj.id,
//     created_at: reqObj.createdAt || new Date().toISOString(),
//     updated_at: reqObj.updatedAt || null,
//     nama_siswa: reqObj.namaSiswa || null,
//     sa_agent: reqObj.saAgent || null,
//     tanggal: reqObj.tanggal || null,
//     jam_mulai: reqObj.jamMulai || null,
//     jam_selesai: reqObj.jamSelesai || null,
//     mapel: reqObj.mapel || null,
//     kelas: reqObj.kelas || null,
//     master_teacher: reqObj.masterTeacher || null,
//     ruangan: reqObj.ruangan || null,
//     tipe_kp: reqObj.tipeKp || null,
//     status: reqObj.status || null,
//     topik: reqObj.topik || null,
//     jumlah_sesi: reqObj.jumlahSesi && reqObj.jumlahSesi > 0 ? reqObj.jumlahSesi : 1
//   };
// }

// Kolom Postgres bertipe TIME sering keluar sebagai "09:30:00" (dengan detik).
// Dipotong jadi "09:30" agar konsisten dgn seluruh logika app (sorting, format broadcast, dst).
function normalizeTimeHM(value) {
  if (!value) return value;
  return String(value).substring(0, 5);
}

function fromSupabaseRow(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    namaSiswa: row.nama_siswa,
    saAgent: row.sa_agent,
    tanggal: row.tanggal,
    jamMulai: normalizeTimeHM(row.jam_mulai),
    jamSelesai: normalizeTimeHM(row.jam_selesai),
    mapel: row.mapel,
    kelas: row.kelas,
    masterTeacher: row.master_teacher,
    ruangan: row.ruangan,
    tipeKp: row.tipe_kp,
    status: row.status,
    topik: row.topik,
    jumlahSesi: row.jumlah_sesi && row.jumlah_sesi > 0 ? row.jumlah_sesi : 1
  };
}

// ============================================
// REFRESH DATA DARI SUPABASE (dipanggil setelah load awal & setiap mutasi)
// ============================================

async function refreshDataFromSupabase() {
  showGlobalLoading();
  try {
    ensureSupabaseReady();

    const { data, error } = await supabaseClient
      .from(SUPABASE_TABLE)
      .select("*")
      .order("tanggal", { ascending: true })
      .order("jam_mulai", { ascending: true });

    if (error) throw error;

    cachedRequests = (data || []).map(fromSupabaseRow);
    renderAllViews();
    return true;
  } catch (err) {
    logSupabaseError("Gagal memuat data dari Supabase", err);
    showToast("⚠️ Gagal terhubung ke database. Periksa koneksi internet.");
    return false;
  } finally {
    hideGlobalLoading();
  }
}

function renderAllViews() {
  renderDashboard();
  renderHistoriTable();
  renderBroadcastTable();
  renderBackupInfo();
}

// ============================================
// MIGRASI SATU KALI: LocalStorage LAMA -> Supabase
// ============================================

async function migrateLocalStorageToSupabase() {
  try {
    if (localStorage.getItem(MIGRATION_FLAG_KEY) === "true") {
      return; // sudah pernah migrasi di browser ini, tidak perlu diulang
    }

    const raw = localStorage.getItem(OLD_LOCALSTORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MIGRATION_FLAG_KEY, "true");
      return; // tidak ada data lama di browser ini
    }

    let oldData;
    try {
      oldData = JSON.parse(raw);
    } catch (e) {
      console.error("Data lama di LocalStorage rusak, migrasi dilewati:", e);
      return; // jangan tandai selesai; jangan hapus data lama
    }

    if (!Array.isArray(oldData) || oldData.length === 0) {
      localStorage.setItem(MIGRATION_FLAG_KEY, "true");
      return;
    }

    ensureSupabaseReady();

    const rows = oldData.map(toSupabaseRow);

    // UPSERT berdasarkan id -> aman dari duplikasi jika sebagian data sudah ada di Supabase
    const { error } = await supabaseClient
      .from(SUPABASE_TABLE)
      .upsert(rows, { onConflict: "id" });

    if (error) throw error;

    localStorage.setItem(MIGRATION_FLAG_KEY, "true");
    showToast("Data lokal berhasil dimigrasikan ke database.");
  } catch (err) {
    logSupabaseError("Migrasi LocalStorage -> Supabase gagal", err);
    // JANGAN set flag selesai & JANGAN hapus data lama jika gagal -> akan dicoba lagi saat load berikutnya
  }
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

// ============================================
// SIDEBAR: CIUTKAN / LEBARKAN (persist pilihan di browser)
// ============================================

const SIDEBAR_COLLAPSE_KEY = "kp_sidebar_collapsed";

function initSidebarCollapse() {
  const toggleBtn = document.getElementById("sidebarToggleBtn");
  const appContainer = document.querySelector(".app-container");
  if (!toggleBtn || !appContainer) return;

  const isCollapsed = localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "true";
  if (isCollapsed) {
    appContainer.classList.add("sidebar-collapsed");
  }

  toggleBtn.addEventListener("click", function () {
    appContainer.classList.toggle("sidebar-collapsed");
    localStorage.setItem(
      SIDEBAR_COLLAPSE_KEY,
      appContainer.classList.contains("sidebar-collapsed") ? "true" : "false"
    );
  });
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

  form.addEventListener("submit", async function (e) {
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
      status: document.getElementById("status").value,
      topik: document.getElementById("topik").value.trim()
    };

    const errors = validateForm(data);

    if (errors.length > 0) {
      showFormErrors(errors);
      return;
    }

    showFormErrors([]);

    const editingId = document.getElementById("editingId").value;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (editingId) {
      // MODE EDIT: Supabase UPDATE berdasarkan id (TIDAK overwrite seluruh tabel)
      const row = toSupabaseRow(Object.assign({ id: editingId }, data, { updatedAt: new Date().toISOString() }));
      delete row.id; // id adalah primary key, jangan ikut di-update
      delete row.created_at; // jangan timpa created_at saat update

      if (submitBtn) submitBtn.disabled = true;
      showGlobalLoading();
      try {
        ensureSupabaseReady();
        const { error } = await supabaseClient.from(SUPABASE_TABLE).update(row).eq("id", editingId);
        if (error) throw error;

        const refreshed = await refreshDataFromSupabase();
        if (refreshed) {
          showToast("Request KP berhasil diperbarui.");
          resetFormToCreateMode();
          switchToPage("histori");
        }
        // Jika refresh gagal, data TIDAK dianggap sukses secara diam-diam;
        // pesan error sudah ditampilkan oleh refreshDataFromSupabase().
      } catch (err) {
        logSupabaseError("Gagal update request", err);
        showToast("⚠️ Gagal terhubung ke database. Periksa koneksi internet.");
      } finally {
        hideGlobalLoading();
        if (submitBtn) submitBtn.disabled = false;
      }
    } else {
      // MODE TAMBAH BARU: cek kuota bulanan (dari cache lokal) sebelum insert
      if (isQuotaExceededForNewRequest(data.tanggal, data.status, 1)) {
        showFormErrors(["Kuota KP bulan ini sudah habis. Request baru tidak dapat dibuat."]);
        return;
      }

      const newRequest = Object.assign(
        {
          id: generateId(),
          createdAt: new Date().toISOString(),
          jumlahSesi: 1
        },
        data
      );
      const row = toSupabaseRow(newRequest);

      if (submitBtn) submitBtn.disabled = true;
      showGlobalLoading();
      try {
        ensureSupabaseReady();
        const { error } = await supabaseClient.from(SUPABASE_TABLE).insert(row);
        if (error) throw error;

        const refreshed = await refreshDataFromSupabase();
        if (refreshed) {
          showToast("Request KP berhasil disimpan.");
          resetFormToCreateMode();
        }
        // Jika INSERT/refresh gagal, form SENGAJA TIDAK direset & TIDAK dianggap
        // tersimpan, supaya user tidak kehilangan isian dan tidak tertipu status sukses palsu.
      } catch (err) {
        logSupabaseError("Gagal menyimpan request baru", err);
        showToast("⚠️ Gagal terhubung ke database. Periksa koneksi internet.");
      } finally {
        hideGlobalLoading();
        if (submitBtn) submitBtn.disabled = false;
      }
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
  document.getElementById("status").value = req.status || "Terjadwal";
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

async function deleteRequest(id) {
  const confirmed = window.confirm(
    "Apakah Anda yakin ingin menghapus request ini? Data yang dihapus tidak dapat dikembalikan."
  );

  if (!confirmed) return;

  showGlobalLoading();
  try {
    ensureSupabaseReady();
    const { error } = await supabaseClient.from(SUPABASE_TABLE).delete().eq("id", id);
    if (error) throw error;

    const refreshed = await refreshDataFromSupabase();
    if (refreshed) {
      showToast("Request KP berhasil dihapus.");
    }
  } catch (err) {
    logSupabaseError("Gagal menghapus request", err);
    showToast("⚠️ Gagal terhubung ke database. Periksa koneksi internet.");
  } finally {
    hideGlobalLoading();
  }
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
// STATUS BADGE (dipakai di Dashboard & Histori)
// ============================================

const STATUS_BADGE_MAP = {
  Request: { label: "Request", cls: "status-request" },
  Terjadwal: { label: "Terjadwal", cls: "status-terjadwal" },
  Cancelled: { label: "Cancelled", cls: "status-cancelled" },
  Rejected: { label: "Rejected", cls: "status-rejected" },
  Selesai: { label: "Selesai", cls: "status-selesai" }
};

function getStatusBadgeHtml(status) {
  const info = STATUS_BADGE_MAP[status] || STATUS_BADGE_MAP.Request;
  return '<span class="status-badge ' + info.cls + '">' + info.label + "</span>";
}

// ============================================
// PAGINATION (dipakai di Histori & Broadcast)
// ============================================

function getPageNumbersToShow(current, total) {
  const delta = 1;
  const middle = [];

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    middle.push(i);
  }

  const result = [1];
  if (middle.length && middle[0] > 2) result.push("...");
  result.push.apply(result, middle);
  if (middle.length && middle[middle.length - 1] < total - 1) result.push("...");
  if (total > 1) result.push(total);

  return result;
}

// onPageChange(newPage) dipanggil ketika user mengklik salah satu kontrol halaman.
function renderPaginationBar(containerId, totalItems, currentPage, pageSize, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (totalItems === 0) {
    container.innerHTML = "";
    return;
  }

  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  let html =
    '<span class="pagination-info">Halaman ' +
    currentPage +
    " dari " +
    totalPages +
    " &middot; " +
    totalItems +
    " data</span>";

  html +=
    '<button type="button" class="pagination-btn" data-page="prev" ' +
    (currentPage === 1 ? "disabled" : "") +
    ">&laquo;</button>";

  getPageNumbersToShow(currentPage, totalPages).forEach(function (p) {
    if (p === "...") {
      html += '<span class="pagination-ellipsis">&hellip;</span>';
    } else {
      html +=
        '<button type="button" class="pagination-btn ' +
        (p === currentPage ? "active" : "") +
        '" data-page="' +
        p +
        '">' +
        p +
        "</button>";
    }
  });

  html +=
    '<button type="button" class="pagination-btn" data-page="next" ' +
    (currentPage === totalPages ? "disabled" : "") +
    ">&raquo;</button>";

  container.innerHTML = html;

  container.querySelectorAll("button[data-page]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const val = btn.getAttribute("data-page");
      let newPage = currentPage;
      if (val === "prev") newPage = Math.max(currentPage - 1, 1);
      else if (val === "next") newPage = Math.min(currentPage + 1, totalPages);
      else newPage = parseInt(val, 10);
      onPageChange(newPage);
    });
  });
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
    tbody.innerHTML = '<tr><td colspan="11" class="empty-state">Tidak ada data request KP yang cocok.</td></tr>';
    renderPaginationBar("historiPagination", 0, 1, HISTORI_PAGE_SIZE, function () {});
    return;
  }

  const totalPages = Math.max(Math.ceil(data.length / HISTORI_PAGE_SIZE), 1);
  if (historiCurrentPage > totalPages) historiCurrentPage = totalPages;
  if (historiCurrentPage < 1) historiCurrentPage = 1;

  const startIdx = (historiCurrentPage - 1) * HISTORI_PAGE_SIZE;
  const pageData = data.slice(startIdx, startIdx + HISTORI_PAGE_SIZE);

  let html = "";

  pageData.forEach(function (r, idx) {
    const rowNumber = startIdx + idx + 1;
    html += "<tr>";
    html += "<td>" + rowNumber + "</td>";
    html += "<td>" + escapeHtml(r.namaSiswa) + "</td>";
    html += "<td>" + escapeHtml(r.saAgent) + "</td>";
    html += "<td>" + getHariFromTanggal(r.tanggal) + "</td>";
    html += "<td>" + formatTanggalDisplay(r.tanggal) + "</td>";
    html += "<td>" + (r.jamMulai || "-") + " - " + (r.jamSelesai || "-") + "</td>";
    html += "<td>" + escapeHtml(r.mapel) + "</td>";
    html += "<td>" + escapeHtml(r.kelas) + "</td>";
    html += "<td>" + escapeHtml(r.masterTeacher) + "</td>";
    html += "<td>" + getStatusBadgeHtml(r.status || "Request") + "</td>";
    html += '<td class="action-cell">';
    html += '<button type="button" class="btn-icon btn-edit" data-action="edit" data-id="' + r.id + '">Edit</button>';
    html += '<button type="button" class="btn-icon btn-delete" data-action="delete" data-id="' + r.id + '">Hapus</button>';
    html += "</td>";
    html += "</tr>";
  });

  tbody.innerHTML = html;

  renderPaginationBar("historiPagination", data.length, historiCurrentPage, HISTORI_PAGE_SIZE, function (newPage) {
    historiCurrentPage = newPage;
    renderHistoriTable();
  });
}

// ============================================
// HISTORI: EVENT LISTENERS (filter, search, aksi)
// ============================================

function initHistoriFilters() {
  const ids = ["historiSearch", "filterTanggal", "filterAgent", "filterMT", "filterMapel", "filterKelas"];

  ids.forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", function () {
      historiCurrentPage = 1;
      renderHistoriTable();
    });
    el.addEventListener("change", function () {
      historiCurrentPage = 1;
      renderHistoriTable();
    });
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
      historiCurrentPage = 1;
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

const HISTORI_PAGE_SIZE = 10;
let historiCurrentPage = 1;

const BROADCAST_PAGE_SIZE = 10;
let broadcastCurrentPage = 1;

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

    const namaTampil =
      r.namaSiswa + (r.tipeKp === "Private" ? " (private)" : "");

    lines.push("🧑‍🎓 Siswa: " + namaTampil);

    const sesi = calculateSesiKp(r.jamMulai, r.jamSelesai);

    lines.push(
      "🕟 Jam: " +
      formatJamBroadcast(r.jamMulai) +
      " - " +
      formatJamBroadcast(r.jamSelesai) +
      " [" +
      sesi +
      " SESI KP]"
    );

    lines.push("📝 Mapel: " + r.mapel);
    lines.push("👩‍🏫 Master Teacher: " + getMTShortName(r.masterTeacher));
    lines.push("📚 Ruangan: " + getRuanganShort(r.ruangan));
    lines.push("📝 Topik: " + (r.topik || "-"));
  });

  return {
    text: lines.join("\n"),
    multipleDates: uniqueDates.length > 1
  };
}


// ============================================
// BROADCAST: RENDER TABEL PEMILIHAN REQUEST
// ============================================

function renderBroadcastTable() {
  const tbody = document.getElementById("broadcastTableBody");
  if (!tbody) return;

  // Urutan tampilan: data TERBARU lebih dulu (tanggal & jam mulai descending).
  // Ini hanya memengaruhi urutan tampilan/pagination - seleksi checklist &
  // aksi "Pilih Semua"/"Pilih Tanggal Ini" tetap bekerja atas seluruh data.
  const requests = getAllRequests().slice().sort(function (a, b) {
    const dateCompare = (b.tanggal || "").localeCompare(a.tanggal || "");
    if (dateCompare !== 0) return dateCompare;
    return (b.jamMulai || "").localeCompare(a.jamMulai || "");
  });

  if (requests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="empty-state">Belum ada data request KP.</td></tr>';
    updateSelectedCountLabel();
    renderPaginationBar("broadcastPagination", 0, 1, BROADCAST_PAGE_SIZE, function () {});
    return;
  }

  const totalPages = Math.max(Math.ceil(requests.length / BROADCAST_PAGE_SIZE), 1);
  if (broadcastCurrentPage > totalPages) broadcastCurrentPage = totalPages;
  if (broadcastCurrentPage < 1) broadcastCurrentPage = 1;

  const startIdx = (broadcastCurrentPage - 1) * BROADCAST_PAGE_SIZE;
  const pageData = requests.slice(startIdx, startIdx + BROADCAST_PAGE_SIZE);

  let html = "";

  pageData.forEach(function (r) {
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

  renderPaginationBar("broadcastPagination", requests.length, broadcastCurrentPage, BROADCAST_PAGE_SIZE, function (newPage) {
    broadcastCurrentPage = newPage;
    renderBroadcastTable();
  });
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
// KUOTA KP BULANAN
// ============================================
// Periode kuota TIDAK dimulai tanggal 1. Periode dimulai setiap tanggal 15
// dan berakhir tanggal 14 bulan berikutnya (contoh: 15 Agustus - 14 September).

const QUOTA_LIMIT = 150;

const MONTH_NAMES_TITLE_CASE = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

function formatDateYMD(d) {
  return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
}

// Menghitung periode kuota aktif berdasarkan tanggal referensi (biasanya hari ini)
function getQuotaPeriod(refDate) {
  const year = refDate.getFullYear();
  const month = refDate.getMonth(); // 0-11
  const day = refDate.getDate();

  let startYear = year;
  let startMonth = month;

  if (day < 15) {
    // Sebelum tanggal 15 -> periode dimulai tanggal 15 BULAN SEBELUMNYA
    startMonth = month - 1;
    if (startMonth < 0) {
      startMonth = 11;
      startYear = year - 1;
    }
  }
  // Jika day >= 15 -> periode dimulai tanggal 15 bulan ini (startMonth = month, tidak diubah)

  const startDate = new Date(startYear, startMonth, 15);

  let endMonth = startMonth + 1;
  let endYear = startYear;
  if (endMonth > 11) {
    endMonth = 0;
    endYear = startYear + 1;
  }
  const endDate = new Date(endYear, endMonth, 14);

  return { startDate: startDate, endDate: endDate };
}

function formatPeriodRangeID(startDate, endDate) {
  const startStr = startDate.getDate() + " " + MONTH_NAMES_TITLE_CASE[startDate.getMonth()];
  const endStr =
    endDate.getDate() + " " + MONTH_NAMES_TITLE_CASE[endDate.getMonth()] + " " + endDate.getFullYear();
  return startStr + " - " + endStr;
}

// Menghitung total sesi KP terpakai dalam suatu rentang periode.
// Request berstatus Cancelled/Rejected TIDAK dihitung.
function getQuotaUsage(startDate, endDate) {
  const requests = getAllRequests();
  const startStr = formatDateYMD(startDate);
  const endStr = formatDateYMD(endDate);

  let used = 0;
  requests.forEach(function (r) {
    if (!r.tanggal) return;
    if (r.tanggal < startStr || r.tanggal > endStr) return;

    const status = r.status || "Terjadwal";
    if (status === "Cancelled" || status === "Rejected") return;

    const sesi = r.jumlahSesi && r.jumlahSesi > 0 ? r.jumlahSesi : 1;
    used += sesi;
  });

  return used;
}

function calculateQuotaPercentage(used, total) {
  if (total <= 0) return 0;
  return (used / total) * 100;
}

function getQuotaStatusInfo(percentage) {
  if (percentage >= 100) return { label: "Kuota Habis", className: "quota-habis" };
  if (percentage >= 85) return { label: "Warning", className: "quota-warning-level" };
  if (percentage >= 70) return { label: "Perhatian", className: "quota-perhatian" };
  return { label: "Normal", className: "quota-normal" };
}

// Dipanggil sebelum menyimpan request BARU (bukan edit).
// Request berstatus Cancelled/Rejected tidak pernah diblokir karena tidak memakai kuota.
function isQuotaExceededForNewRequest(tanggal, status, jumlahSesi) {
  if (status === "Cancelled" || status === "Rejected") return false;
  if (!tanggal) return false;

  const d = new Date(tanggal + "T00:00:00");
  if (isNaN(d.getTime())) return false;

  const period = getQuotaPeriod(d);
  const currentUsage = getQuotaUsage(period.startDate, period.endDate);
  const sesi = jumlahSesi && jumlahSesi > 0 ? jumlahSesi : 1;

  return currentUsage + sesi > QUOTA_LIMIT;
}

function renderQuotaCard() {
  const badgeEl = document.getElementById("quotaBadge");
  if (!badgeEl) return; // halaman dashboard belum ter-render (jaga-jaga)

  const period = getQuotaPeriod(new Date());
  const used = getQuotaUsage(period.startDate, period.endDate);
  const percentage = calculateQuotaPercentage(used, QUOTA_LIMIT);
  const sisa = Math.max(QUOTA_LIMIT - used, 0);
  const statusInfo = getQuotaStatusInfo(percentage);

  document.getElementById("quotaPeriodLabel").textContent =
    "Periode: " + formatPeriodRangeID(period.startDate, period.endDate);
  document.getElementById("quotaUsedTotal").textContent = used + " / " + QUOTA_LIMIT;
  document.getElementById("quotaTerpakai").textContent = used;
  document.getElementById("quotaSisa").textContent = sisa;
  document.getElementById("quotaPercentage").textContent = percentage.toFixed(1) + "%";

  const fillEl = document.getElementById("quotaProgressFill");
  fillEl.style.width = Math.min(percentage, 100) + "%";
  fillEl.className = "quota-progress-fill " + statusInfo.className;

  // Gauge lingkaran kaca di dashboard - lingkaran mengikuti persentase yang sama
  // dengan progress bar linear di atas, hanya beda bentuk visualnya.
  const gaugeFill = document.getElementById("quotaGaugeFill");
  const gaugePercentLabel = document.getElementById("quotaGaugePercent");
  if (gaugeFill && gaugePercentLabel) {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const clampedPct = Math.min(Math.max(percentage, 0), 100);
    const offset = circumference - (clampedPct / 100) * circumference;

    gaugeFill.style.strokeDasharray = circumference.toFixed(2);
    gaugeFill.style.strokeDashoffset = offset.toFixed(2);
    gaugeFill.setAttribute("class", "quota-gauge-fill " + statusInfo.className);

    gaugePercentLabel.textContent = Math.round(percentage) + "%";
  }

  badgeEl.textContent = statusInfo.label;
  badgeEl.className = "quota-badge " + statusInfo.className;

  const warningBox = document.getElementById("quotaWarningBox");
  if (percentage >= 100) {
    warningBox.style.display = "block";
    warningBox.className = "quota-warning quota-habis-box";
    warningBox.innerHTML =
      "🚨 <strong>KUOTA KP HABIS</strong><br>Kuota " + QUOTA_LIMIT + " sesi untuk periode ini telah digunakan.";
  } else if (percentage >= 85) {
    warningBox.style.display = "block";
    warningBox.className = "quota-warning quota-warning-box";
    warningBox.innerHTML = "⚠️ <strong>KUOTA KP HAMPIR HABIS</strong><br>Sisa kuota: " + sisa + " sesi.";
  } else {
    warningBox.style.display = "none";
    warningBox.innerHTML = "";
  }
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

  // ---- Render kuota bulanan ----
  renderQuotaCard();
}

function renderKpHariIniList(kpHariIniArr) {
  const tbody = document.getElementById("kpHariIniBody");
  if (!tbody) return;

  const sorted = kpHariIniArr.slice().sort(function (a, b) {
    return (a.jamMulai || "").localeCompare(b.jamMulai || "");
  });

  if (sorted.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Tidak ada request KP untuk hari ini.</td></tr>';
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
    html += "<td>" + getStatusBadgeHtml(r.status || "Request") + "</td>";
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
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Belum ada request KP.</td></tr>';
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
    html += "<td>" + getStatusBadgeHtml(r.status || "Request") + "</td>";
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
// BACKUP DATA: EXPORT EXCEL (SheetJS / XLSX)
// ============================================

function buildExcelRows(requests) {
  const header = [
    "No", "Nama Siswa", "Nama SA/Agent", "Hari", "Tanggal",
    "Jam Mulai", "Jam Selesai", "Jam", "Mata Pelajaran", "Kelas",
    "Nama MT", "Email MT", "No WA MT", "Ruangan", "Tipe KP",
    "Topik", "Status", "Jumlah Sesi", "ID"
  ];

  const rows = [header];

  requests.forEach(function (r, idx) {
    const mt = MASTER_TEACHERS.find(function (m) {
      return m.nama === r.masterTeacher;
    });

    rows.push([
      idx + 1,
      r.namaSiswa || "",
      r.saAgent || "",
      getHariFromTanggal(r.tanggal),
      formatTanggalDisplay(r.tanggal),
      r.jamMulai || "",
      r.jamSelesai || "",
      (r.jamMulai || "-") + " - " + (r.jamSelesai || "-"),
      r.mapel || "",
      r.kelas || "",
      r.masterTeacher || "",
      mt ? mt.email : "",
      mt ? mt.noWa : "",
      r.ruangan || "",
      r.tipeKp || "",
      r.topik || "",
      r.status || "Terjadwal",
      r.jumlahSesi && r.jumlahSesi > 0 ? r.jumlahSesi : 1,
      r.id || ""
    ]);
  });

  return rows;
}

async function exportExcelData() {
  if (typeof XLSX === "undefined") {
    showToast("Library Excel gagal dimuat. Periksa koneksi internet Anda lalu coba lagi.");
    return;
  }

  showGlobalLoading();
  try {
    ensureSupabaseReady();
    const { data, error } = await supabaseClient
      .from(SUPABASE_TABLE)
      .select("*")
      .order("tanggal", { ascending: true })
      .order("jam_mulai", { ascending: true });

    if (error) throw error;

    const requests = (data || []).map(fromSupabaseRow);
    const rows = buildExcelRows(requests);

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data KP");

    const filename = "KP-Management-" + getTodayDateString() + ".xlsx";
    XLSX.writeFile(workbook, filename);

    showToast("Export Excel berhasil (" + requests.length + " data).");
  } catch (err) {
    logSupabaseError("Gagal export Excel", err);
    showToast("⚠️ Gagal terhubung ke database. Periksa koneksi internet.");
  } finally {
    hideGlobalLoading();
  }
}

// ============================================
// BACKUP DATA: IMPORT EXCEL (SheetJS / XLSX) - mode ADD/MERGE
// ============================================

const REQUIRED_EXCEL_HEADERS = [
  "Nama Siswa", "Nama SA/Agent", "Tanggal",
  "Jam Mulai", "Jam Selesai", "Mata Pelajaran", "Kelas", "Nama MT"
];

// Menerima format Tanggal: "DD/MM/YYYY", "YYYY-MM-DD", objek Date (jika Excel
// menyimpannya sbg tanggal asli), atau serial number Excel.
function parseExcelDateToYMD(value) {
  if (value === undefined || value === null || value === "") return "";

  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return value.getFullYear() + "-" + pad2(value.getMonth() + 1) + "-" + pad2(value.getDate());
  }

  if (typeof value === "number" && typeof XLSX !== "undefined" && XLSX.SSF && XLSX.SSF.parse_date_code) {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) {
      return parsed.y + "-" + pad2(parsed.m) + "-" + pad2(parsed.d);
    }
  }

  const str = String(value).trim();

  const ddmmyyyy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyy) {
    return ddmmyyyy[3] + "-" + pad2(parseInt(ddmmyyyy[2], 10)) + "-" + pad2(parseInt(ddmmyyyy[1], 10));
  }

  const yyyymmdd = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (yyyymmdd) {
    return yyyymmdd[1] + "-" + pad2(parseInt(yyyymmdd[2], 10)) + "-" + pad2(parseInt(yyyymmdd[3], 10));
  }

  return "";
}

// Menerima format Jam: "HH:MM", "HH.MM", atau fraksi hari (serial number Excel).
function parseExcelTimeToHM(value) {
  if (value === undefined || value === null || value === "") return "";

  if (typeof value === "number") {
    const totalMinutes = Math.round(value * 24 * 60);
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return pad2(h) + ":" + pad2(m);
  }

  const str = String(value).trim();
  const match = str.match(/^(\d{1,2})[.:](\d{2})/);
  if (match) {
    return pad2(parseInt(match[1], 10)) + ":" + pad2(parseInt(match[2], 10));
  }

  return "";
}

function processImportExcelFile(file) {
  if (typeof XLSX === "undefined") {
    showToast("Library Excel gagal dimuat. Periksa koneksi internet Anda lalu coba lagi.");
    resetImportExcelInput();
    return;
  }

  const reader = new FileReader();

  reader.onload = async function (e) {
    let workbook;

    try {
      const data = new Uint8Array(e.target.result);
      workbook = XLSX.read(data, { type: "array" });
    } catch (err) {
      showToast("File tidak valid.");
      resetImportExcelInput();
      return;
    }

    if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
      showToast("File tidak valid.");
      resetImportExcelInput();
      return;
    }

    const sheetName = workbook.SheetNames.indexOf("Data KP") !== -1 ? "Data KP" : workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    let rows;
    try {
      rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    } catch (err) {
      showToast("File tidak valid.");
      resetImportExcelInput();
      return;
    }

    if (!rows || rows.length === 0) {
      showToast("File Excel tidak berisi data.");
      resetImportExcelInput();
      return;
    }

    // ---- Validasi header wajib ----
    const actualHeaders = Object.keys(rows[0]);
    const missingHeaders = REQUIRED_EXCEL_HEADERS.filter(function (h) {
      return actualHeaders.indexOf(h) === -1;
    });

    if (missingHeaders.length > 0) {
      showToast("Format Excel tidak sesuai.");
      resetImportExcelInput();
      return;
    }

    // ---- Konfirmasi sebelum menambahkan data (mode ADD/MERGE) ----
    const confirmed = window.confirm(
      "Import Excel akan menambahkan data ke data yang sudah ada. Lanjutkan?"
    );

    if (!confirmed) {
      showToast("Import Excel dibatalkan.");
      resetImportExcelInput();
      return;
    }

    // ---- Konversi baris & cegah duplikasi berdasarkan ID ----
    const existingRequests = getAllRequests();
    const existingIds = new Set(
      existingRequests.map(function (r) { return r.id; }).filter(Boolean)
    );

    let berhasil = 0;
    let duplikat = 0;
    let gagal = 0;
    const toAdd = [];

    rows.forEach(function (row) {
      const namaSiswa = String(row["Nama Siswa"] || "").trim();
      const saAgent = String(row["Nama SA/Agent"] || "").trim();
      const tanggal = parseExcelDateToYMD(row["Tanggal"]);
      const jamMulai = parseExcelTimeToHM(row["Jam Mulai"]);
      const jamSelesai = parseExcelTimeToHM(row["Jam Selesai"]);
      const mapel = String(row["Mata Pelajaran"] || "").trim();
      const kelas = String(row["Kelas"] || "").trim();
      const masterTeacher = String(row["Nama MT"] || "").trim();

      const isRowValid =
        namaSiswa && saAgent && tanggal && jamMulai && jamSelesai && mapel && kelas && masterTeacher;

      if (!isRowValid) {
        gagal++;
        return;
      }

      let rowId = row["ID"] ? String(row["ID"]).trim() : "";

      if (rowId && existingIds.has(rowId)) {
        duplikat++;
        return;
      }

      if (!rowId) {
        rowId = generateId();
      }

      let jumlahSesi = parseInt(row["Jumlah Sesi"], 10);
      if (!jumlahSesi || jumlahSesi < 1) jumlahSesi = 1;

      const newReq = {
        id: rowId,
        createdAt: new Date().toISOString(),
        namaSiswa: namaSiswa,
        saAgent: saAgent,
        tanggal: tanggal,
        jamMulai: jamMulai,
        jamSelesai: jamSelesai,
        mapel: mapel,
        kelas: kelas,
        masterTeacher: masterTeacher,
        ruangan: String(row["Ruangan"] || "").trim(),
        tipeKp: String(row["Tipe KP"] || "").trim() || "Klinik PR",
        topik: String(row["Topik"] || "").trim(),
        status: String(row["Status"] || "").trim() || "Terjadwal",
        jumlahSesi: jumlahSesi
      };

      toAdd.push(newReq);
      existingIds.add(rowId); // cegah duplikat antar baris di file yang sama
      berhasil++;
    });

    if (toAdd.length > 0) {
      const rowsForSupabase = toAdd.map(toSupabaseRow);

      showGlobalLoading();
      try {
        ensureSupabaseReady();
        // INSERT biasa (bukan upsert) - baris di sini SUDAH dipastikan idnya belum ada,
        // sesuai aturan "cegah duplikasi berdasarkan ID" (duplikat dilewati di atas, bukan ditimpa).
        const { error } = await supabaseClient.from(SUPABASE_TABLE).insert(rowsForSupabase);
        if (error) throw error;

        await refreshDataFromSupabase();
      } catch (err) {
        logSupabaseError("Gagal menyimpan data import Excel ke Supabase", err);
        window.alert(
          "⚠️ Gagal terhubung ke database. Import dibatalkan, tidak ada data yang tersimpan.\n" +
          "Periksa koneksi internet lalu coba lagi."
        );
        hideGlobalLoading();
        resetImportExcelInput();
        return;
      }
      hideGlobalLoading();
    }

    // ---- Ringkasan hasil import ----
    const summaryLines = ["Import selesai."];
    summaryLines.push("Berhasil: " + berhasil + " data");
    if (duplikat > 0) summaryLines.push("Duplikat dilewati: " + duplikat + " data");
    summaryLines.push("Gagal: " + gagal + " data");

    window.alert(summaryLines.join("\n"));

    resetImportExcelInput();
  };

  reader.onerror = function () {
    showToast("Gagal membaca file. Silakan coba lagi.");
    resetImportExcelInput();
  };

  reader.readAsArrayBuffer(file);
}

function resetImportExcelInput() {
  const input = document.getElementById("importExcelFileInput");
  const btn = document.getElementById("importExcelBtn");
  if (input) input.value = "";
  if (btn) btn.disabled = true;
}

// ============================================
// BACKUP DATA: EXPORT JSON
// ============================================

async function exportBackupData() {
  showGlobalLoading();
  try {
    ensureSupabaseReady();
    const { data, error } = await supabaseClient
      .from(SUPABASE_TABLE)
      .select("*")
      .order("tanggal", { ascending: true })
      .order("jam_mulai", { ascending: true });

    if (error) throw error;

    const requests = (data || []).map(fromSupabaseRow);

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
  } catch (err) {
    logSupabaseError("Gagal export JSON", err);
    showToast("⚠️ Gagal terhubung ke database. Periksa koneksi internet.");
  } finally {
    hideGlobalLoading();
  }
}

// ============================================
// BACKUP DATA: IMPORT JSON + VALIDASI + KONFIRMASI (mode UPSERT, bukan timpa)
// ============================================

function processImportFile(file) {
  const reader = new FileReader();

  reader.onload = async function (e) {
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

    // PENTING: mode UPSERT (id sudah ada -> UPDATE, id belum ada -> INSERT).
    // Data lain di database yang TIDAK ada di file backup TIDAK DIHAPUS.
    const confirmed = window.confirm(
      "File backup berisi " + normalized.length + " data request.\n" +
      "Data dengan ID yang sama akan DIPERBARUI, data dengan ID baru akan DITAMBAHKAN.\n" +
      "Data lain yang sudah ada di database TIDAK akan dihapus.\n\n" +
      "Lanjutkan import?"
    );

    if (!confirmed) {
      showToast("Import dibatalkan.");
      resetImportInput();
      return;
    }

    const rowsForSupabase = normalized.map(toSupabaseRow);

    showGlobalLoading();
    try {
      ensureSupabaseReady();
      const { error } = await supabaseClient
        .from(SUPABASE_TABLE)
        .upsert(rowsForSupabase, { onConflict: "id" });

      if (error) throw error;

      const refreshed = await refreshDataFromSupabase();
      if (refreshed) {
        showToast("Import berhasil. " + normalized.length + " data telah digabungkan ke database.");
      }
    } catch (err) {
      logSupabaseError("Gagal import JSON ke Supabase", err);
      showToast("⚠️ Gagal terhubung ke database. Periksa koneksi internet.");
    } finally {
      hideGlobalLoading();
      resetImportInput();
    }
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

  // ---- Excel ----
  const exportExcelBtn = document.getElementById("exportExcelBtn");
  const importExcelInput = document.getElementById("importExcelFileInput");
  const importExcelBtn = document.getElementById("importExcelBtn");

  if (exportExcelBtn) {
    exportExcelBtn.addEventListener("click", exportExcelData);
  }

  if (importExcelInput && importExcelBtn) {
    importExcelInput.addEventListener("change", function () {
      importExcelBtn.disabled = !importExcelInput.files || importExcelInput.files.length === 0;
    });

    importExcelBtn.addEventListener("click", function () {
      const file = importExcelInput.files && importExcelInput.files[0];
      if (!file) {
        showToast("Pilih file Excel terlebih dahulu.");
        return;
      }
      processImportExcelFile(file);
    });
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  // ---- Setup UI & event listener (sinkron, tidak butuh data) ----
  initSidebarCollapse();
  initNavigation();
  initDropdowns();
  initMapelCustomToggle();
  initRequestForm();
  initHistoriFilters();
  initHistoriActions();
  initBroadcastActions();
  initBackupActions();

  // ---- Migrasi satu kali: LocalStorage lama -> Supabase (jika ada & belum pernah) ----
  await migrateLocalStorageToSupabase();

  // ---- Load data awal dari Supabase (Supabase = single source of truth) ----
  // renderDashboard(), renderHistoriTable(), renderBroadcastTable(), dan
  // renderBackupInfo() otomatis dipanggil di dalam refreshDataFromSupabase().
  await refreshDataFromSupabase();
});