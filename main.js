function $(id) { return document.getElementById(id); }

function num(id) {
  var v = $(id).value;
  return v === "" ? NaN : Number(v);
}

function fmt(n) {
  return n.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
}

// Class Tailwind cho khung kết quả
var OUT_BASE = "mt-4 px-4 py-3 rounded-lg border whitespace-pre-line ";
var OUT_CLASS = {
  normal: OUT_BASE + "bg-slate-50 border-slate-200 text-slate-800",
  ok: OUT_BASE + "bg-green-50 border-green-600 text-green-800",
  bad: OUT_BASE + "bg-red-50 border-red-600 text-red-800"
};

function show(id, html, type) {
  var o = $(id);
  o.className = OUT_CLASS[type || "normal"];
  o.innerHTML = html;
}

/* ===== Tabs ===== */
var TAB_ACTIVE = "bg-blue-600 text-white border-blue-600 font-semibold";
var TAB_IDLE = "bg-white text-slate-800 border-slate-300 hover:bg-slate-50";

function chonTab(id) {
  document.querySelectorAll(".tab-panel").forEach(function (p) {
    p.classList.toggle("hidden", p.id !== id);
  });
  document.querySelectorAll(".tab-btn").forEach(function (b) {
    b.className = "tab-btn shrink-0 px-4 py-2 rounded-lg border " +
      (b.dataset.tab === id ? TAB_ACTIVE : TAB_IDLE);
  });
}

document.querySelectorAll(".tab-btn").forEach(function (b) {
  b.addEventListener("click", function () { chonTab(b.dataset.tab); });
});
chonTab("s1");

/* ===== Bài 1: Quản lý tuyển sinh ===== */
function diemKhuVuc(kv) {
  var bang = { A: 2, B: 1, C: 0.5, X: 0 };
  return bang[kv] || 0;
}

function diemDoiTuong(dt) {
  var bang = { "1": 2.5, "2": 1.5, "3": 1, "0": 0 };
  return bang[dt] || 0;
}

$("btn1").addEventListener("click", function () {
  var chuan = num("chuan"), m1 = num("m1"), m2 = num("m2"), m3 = num("m3");
  if ([chuan, m1, m2, m3].some(isNaN)) {
    show("out1", "Hãy nhập điểm chuẩn và đủ điểm 3 môn.", "bad");
    return;
  }
  var uuTien = diemKhuVuc($("khuvuc").value) + diemDoiTuong($("doituong").value);
  var tong = m1 + m2 + m3 + uuTien;
  var coDiem0 = (m1 === 0 || m2 === 0 || m3 === 0);
  var dau = tong >= chuan && !coDiem0;
  var lyDo = coDiem0 ? "Có môn bị điểm 0." : (dau ? "" : "Tổng điểm thấp hơn điểm chuẩn.");

  show("out1",
    "<b>" + (dau ? "Đậu" : "Rớt") + "</b>\n" +
    "Tổng điểm: " + fmt(tong) + " (điểm ưu tiên: " + fmt(uuTien) + ")" +
    (lyDo ? "\n" + lyDo : ""),
    dau ? "ok" : "bad");
});

/* ===== Bài 2: Tính tiền điện ===== */
function tinhTienDien(kw) {
  // [số kW của bậc, đơn giá]
  var bac = [[50, 500], [50, 650], [100, 850], [150, 1100], [Infinity, 1300]];
  var tien = 0, conLai = kw;
  for (var i = 0; i < bac.length && conLai > 0; i++) {
    var dung = Math.min(conLai, bac[i][0]);
    tien += dung * bac[i][1];
    conLai -= dung;
  }
  return tien;
}

$("btn2").addEventListener("click", function () {
  var kw = num("kw"), ten = $("ten2").value.trim();
  if (isNaN(kw) || kw < 0) {
    show("out2", "Hãy nhập số kW hợp lệ (từ 0 trở lên).", "bad");
    return;
  }
  show("out2",
    "Khách hàng: " + (ten || "(chưa nhập tên)") + "\n" +
    "Số kW: " + fmt(kw) + "\n" +
    "<b>Tiền điện: " + fmt(tinhTienDien(kw)) + " đ</b>");
});

/* ===== Bài 3: Thuế thu nhập cá nhân (đơn vị: triệu đồng) ===== */
// [trần của bậc, thuế suất]
var BAC_THUE = [
  [60, 0.05], [120, 0.10], [210, 0.15], [384, 0.20],
  [624, 0.25], [960, 0.30], [Infinity, 0.35]
];

function tinhThue(chiuThue, cach) {
  if (chiuThue <= 0) return 0;

  if (cach === "bac") {
    // Áp một thuế suất của bậc mà thu nhập chịu thuế rơi vào
    for (var i = 0; i < BAC_THUE.length; i++) {
      if (chiuThue <= BAC_THUE[i][0]) return chiuThue * BAC_THUE[i][1];
    }
  }

  // Lũy tiến từng phần
  var thue = 0, truoc = 0;
  for (var j = 0; j < BAC_THUE.length; j++) {
    var tran = BAC_THUE[j][0];
    if (chiuThue > truoc) {
      thue += (Math.min(chiuThue, tran) - truoc) * BAC_THUE[j][1];
    }
    truoc = tran;
  }
  return thue;
}

$("btn3").addEventListener("click", function () {
  var tn = num("thunhap"), pt = num("phuthuoc"), ten = $("ten3").value.trim();
  if (isNaN(tn) || tn < 0 || isNaN(pt) || pt < 0) {
    show("out3", "Hãy nhập tổng thu nhập và số người phụ thuộc hợp lệ.", "bad");
    return;
  }
  var chiuThue = tn - 4 - pt * 1.6;
  var thue = tinhThue(chiuThue, $("cachtinh").value);

  show("out3",
    "Họ tên: " + (ten || "(chưa nhập tên)") + "\n" +
    "Thu nhập chịu thuế: " + fmt(Math.max(chiuThue, 0)) + " triệu" +
    (chiuThue <= 0 ? " (không phải nộp thuế)" : "") + "\n" +
    "<b>Thuế phải trả: " + fmt(thue) + " triệu đồng</b>");
});

/* ===== Bài 4: Tính tiền cáp ===== */
// Chọn Doanh nghiệp thì hiện ô số kết nối, ngược lại ẩn đi
$("loai").addEventListener("change", function () {
  var laDoanhNghiep = $("loai").value === "doanhnghiep";
  $("ketnoiWrap").classList.toggle("hidden", !laDoanhNghiep);
  if (!laDoanhNghiep) $("ketnoi").value = "";
});

function tinhTienCap(loai, ketNoi, kenh) {
  if (loai === "nhadan") {
    return 4.5 + 20.5 + 7.5 * kenh;
  }
  var ketNoiThem = Math.max(ketNoi - 10, 0);
  return 15 + 75 + ketNoiThem * 5 + 50 * kenh;
}

$("btn4").addEventListener("click", function () {
  var loai = $("loai").value;
  var ma = $("ma").value.trim();
  var kenh = num("kenh");
  var ketNoi = loai === "doanhnghiep" ? num("ketnoi") : 0;

  if (!loai) {
    show("out4", "Hãy chọn loại khách hàng.", "bad");
    return;
  }
  if (isNaN(kenh) || kenh < 0 || isNaN(ketNoi) || ketNoi < 0) {
    show("out4", "Hãy nhập số kênh" + (loai === "doanhnghiep" ? " và số kết nối" : "") + " hợp lệ.", "bad");
    return;
  }

  var tien = tinhTienCap(loai, ketNoi, kenh);
  show("out4",
    "Mã khách hàng: " + (ma || "(chưa nhập)") + "\n" +
    "Loại: " + (loai === "nhadan" ? "Nhà dân" : "Doanh nghiệp") + "\n" +
    "<b>Tiền cáp: $" + tien.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</b>");
});
