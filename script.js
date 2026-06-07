let currentRole='mahasiswa';
let activeAlerts=3;
let pinjamTarget='';

function go(id){
  document.querySelectorAll('.screen').forEach(s=>{s.style.display='none';s.classList.remove('active');});
  const t=document.getElementById(id);
  if(!t)return;
  t.style.display='flex';
  t.classList.add('active');
  const sb=t.querySelector('.scroll-body');
  if(sb)sb.scrollTop=0;
}
function setNav(el){
  const nav=el.closest('.bottom-nav');
  if(!nav)return;
  nav.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  el.classList.add('active');
}
function setTab(el){
  const row=el.closest('.tab-row');
  if(!row)return;
  row.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
}
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;
  t.classList.add('show');
  clearTimeout(t._to);
  t._to=setTimeout(()=>t.classList.remove('show'),2400);
}
function startLogin(role){
  currentRole=role;
  const labels={mahasiswa:'Mahasiswa',petugas:'Petugas Parkir',tamu:'Tamu / Pengunjung'};
  const lbl=document.getElementById('login-role-label');
  if(lbl)lbl.textContent='Masuk sebagai '+labels[role];
  if(role==='tamu'){go('s-tamu-reg');return;}
  const hints={mahasiswa:'nama@students.unnes.ac.id',petugas:'nip@unnes.ac.id'};
  const em=document.getElementById('login-email');
  if(em){em.placeholder=hints[role];em.value='';}
  go('s-login');
}
function doLogin(){
  const email=document.getElementById('login-email').value.trim();
  const pass=document.getElementById('login-pass').value;
  if(!email||!pass){showToast('⚠️ Isi email dan password');return;}
  if(!email.includes('@')){showToast('⚠️ Format email tidak valid');return;}
  runLoading();
}
function doGoogleLogin(){
  const btn=document.getElementById('google-btn-text');
  btn.innerHTML='<span class="spinner spinner-blue"></span>  Menghubungkan…';
  setTimeout(()=>{btn.textContent='Lanjut dengan Google UNNES';runLoading();},1200);
}
function runLoading(){
  go('s-loading');
  const msgs=['Memverifikasi akun…','Mengambil data kampus…','Menyiapkan dashboard…'];
  let i=0;
  const el=document.getElementById('loading-text');
  const iv=setInterval(()=>{el.textContent=msgs[i++%msgs.length];},700);
  setTimeout(()=>{
    clearInterval(iv);
    go(currentRole==='petugas'?'s-ptgs-dash':'s-mhs-dash');
  },2200);
}
function doLogout(){
  showToast('Berhasil logout 👋');
  setTimeout(()=>go('s-splash'),800);
}

// QR
const vehicles=[
  {plate:'H 1234 ABC',detail:'Honda Beat 2022 · Merah · Salma Afifah Maharani',veh:'Honda Beat 2022'},
  {plate:'H 5678 XYZ',detail:'Land Cruiser 2024 · Putih · Salma Afifah Maharani',veh:'Land Cruiser 2024'}
];
let activeQr=0;
function switchQrVehicle(idx){
  activeQr=idx-1;
  const v=vehicles[activeQr];
  document.getElementById('qr-plate').textContent=v.plate;
  document.getElementById('qr-detail').textContent=v.detail;
  document.getElementById('qr-info-plate').textContent=v.plate;
  document.getElementById('qr-info-veh').textContent=v.veh;
  const c1=document.getElementById('qr-chip-1');
  const c2=document.getElementById('qr-chip-2');
  if(idx===1){
    c1.style.cssText='background:rgba(255,255,255,.9);color:var(--blue-d);border:none;cursor:pointer;padding:6px 12px;';
    c2.style.cssText='background:rgba(255,255,255,.15);color:#fff;border:1px solid rgba(255,255,255,.2);cursor:pointer;padding:6px 12px;';
  }else{
    c2.style.cssText='background:rgba(255,255,255,.9);color:var(--blue-d);border:none;cursor:pointer;padding:6px 12px;';
    c1.style.cssText='background:rgba(255,255,255,.15);color:#fff;border:1px solid rgba(255,255,255,.2);cursor:pointer;padding:6px 12px;';
  }
  showToast('QR '+v.plate+' ditampilkan');
}

// TIMERS
let qrSec=28;
setInterval(()=>{
  qrSec--;
  if(qrSec<=0){qrSec=30;showToast('🔄 QR diperbarui otomatis');}
  const el=document.getElementById('qr-timer');
  if(el)el.textContent='Refresh dalam '+qrSec+' detik';
},1000);
let guestSec=28794;
setInterval(()=>{
  if(guestSec>0)guestSec--;
  const h=Math.floor(guestSec/3600),m=Math.floor((guestSec%3600)/60),s=guestSec%60;
  const str=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  const el=document.getElementById('guest-timer');
  if(el)el.textContent=str;
},1000);
let parkMins=84;
setInterval(()=>{
  parkMins++;
  const h=Math.floor(parkMins/60),m=parkMins%60;
  const e1=document.getElementById('dur-live');
  const e2=document.getElementById('status-dur');
  if(e1)e1.textContent=h+'j '+m+'m berlalu';
  if(e2)e2.textContent=h+'j '+m+'m';
},60000);

// PINJAM SEARCH
const mahasiswaDB=[
  {nama:'Meliya Kholisatun Nisa',nim:'2405090089',prodi:'Pendidikan Teknik Informatika dan Komputer'},
  {nama:'Flora Valenta',nim:'2405090021',prodi:'Pendidikan Teknik Informatika dan Komputer'},
  {nama:'Binawan Praba Seta',nim:'2405090055',prodi:'Teknik Sipil'},
  {nama:'Nafisah Desvita Aji Saputri',nim:'2405090077',prodi:'Teknik Mesin'},
];
function handlePinjamSearch(v){
  const res=document.getElementById('pinjam-result-found');
  const empty=document.getElementById('pinjam-empty');
  if(v.length<3){
    if(res)res.style.display='none';
    if(empty)empty.style.display='none';
    pinjamTarget='';
    return;
  }
  const found=mahasiswaDB.find(m=>m.nama.toLowerCase().includes(v.toLowerCase())||m.nim.includes(v));
  if(found){
    pinjamTarget=found.nama;
    if(res){
      res.style.display='flex';
      document.getElementById('pinjam-found-name').textContent=found.nama;
      document.getElementById('pinjam-found-nim').textContent='NIM '+found.nim+' · '+found.prodi;
    }
    if(empty)empty.style.display='none';
  }else{
    pinjamTarget='';
    if(res)res.style.display='none';
    if(empty)empty.style.display='block';
  }
}
function submitPinjam(){
  if(!pinjamTarget){showToast('⚠️ Pilih peminjam terlebih dahulu');return;}
  const alasan=document.getElementById('pinjam-alasan').value;
  if(!alasan){showToast('⚠️ Isi alasan peminjaman');return;}
  const mulai=document.getElementById('pinjam-mulai').value;
  const selesai=document.getElementById('pinjam-selesai').value;
  if(!mulai||!selesai){showToast('⚠️ Tentukan tanggal peminjaman');return;}
  document.getElementById('pinjam-sent-name').textContent=pinjamTarget;
  document.getElementById('pinjam-sent-sub').textContent='Menunggu konfirmasi dari '+pinjamTarget;
  const m=new Date(mulai),s=new Date(selesai);
  const fmt=d=>d.getDate()+' '+['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][d.getMonth()]+' '+d.getFullYear();
  document.getElementById('pinjam-sent-durasi').textContent=fmt(m)+' – '+fmt(s);
  go('s-mhs-pinjam-sent');
}

// NOTIF PINJAM ACTIONS
function terimaNotifPinjam(){
  const item=document.getElementById('notif-pinjam');
  if(!item)return;
  item.classList.remove('notif-unread');
  const actions=document.getElementById('notif-pinjam-actions');
  if(actions)actions.innerHTML='<span class="badge green">✅ Diterima</span>';
  item.style.cursor='default';
  showToast('Peminjaman disetujui ✅');
}
function tolakNotifPinjam(){
  const item=document.getElementById('notif-pinjam');
  if(!item)return;
  item.classList.remove('notif-unread');
  const actions=document.getElementById('notif-pinjam-actions');
  if(actions)actions.innerHTML='<span class="badge red">❌ Ditolak</span>';
  item.style.cursor='default';
  showToast('Peminjaman ditolak');
}
function bacaSemua(){
  document.querySelectorAll('#notif-list .notif-unread').forEach(el=>el.classList.remove('notif-unread'));
  showToast('Semua notifikasi sudah dibaca ✓');
}

// TERIMA/TOLAK di halaman detail
function terimaPermintaanPinjam(){
  const actions=document.getElementById('terima-pinjam-actions');
  if(actions)actions.innerHTML='<div class="info-card green" style="width:100%;text-align:center;font-weight:700;">✅ Peminjaman disetujui! Meliya dapat menggunakan kendaraan Anda.</div>';
  showToast('Peminjaman disetujui ✅');
  setTimeout(()=>go('s-mhs-notif'),1500);
}
function tolakPermintaanPinjam(){
  const actions=document.getElementById('terima-pinjam-actions');
  if(actions)actions.innerHTML='<div class="info-card" style="background:var(--red-l);border:1px solid #FECACA;width:100%;text-align:center;font-weight:700;color:#991B1B;">❌ Peminjaman ditolak.</div>';
  showToast('Peminjaman ditolak');
  setTimeout(()=>go('s-mhs-notif'),1500);
}

// CABUT IZIN PINJAM
function cabutIzinPinjam(){
  const btn=document.getElementById('btn-cabut-pinjam');
  const status=document.getElementById('pinjam-detail-status');
  const card=document.getElementById('pinjam-active-card');
  if(btn){btn.disabled=true;btn.textContent='Izin Dicabut ✓';btn.style.background='#9CA3AF';}
  if(status)status.innerHTML='<span class="badge gray">Dicabut</span>';
  if(card)card.style.display='none';
  showToast('Izin peminjaman berhasil dicabut ✅');
}

// TAMBAH KENDARAAN
function submitTambahKendaraan(){
  const plat=document.getElementById('tambah-plat').value;
  const merk=document.getElementById('tambah-merk').value;
  if(!plat||!merk){showToast('⚠️ Lengkapi data kendaraan');return;}
  showToast('Kendaraan '+plat+' berhasil didaftarkan ✅');
  setTimeout(()=>go('s-mhs-kendaraan'),800);
}

// RIWAYAT FILTER
function filterRiwayat(period){
  const statsData={
    hari:{total:2,avg:'1j 24m'},
    minggu:{total:5,avg:'2j 10m'},
    bulan:{total:18,avg:'1j 45m'}
  };
  const d=statsData[period]||statsData['hari'];
  const grid=document.getElementById('riwayat-stats');
  if(grid){
    grid.children[0].querySelector('.stat-val').textContent=d.total;
    grid.children[1].querySelector('.stat-val').textContent=d.avg;
  }
  document.querySelectorAll('#riwayat-list [data-period]').forEach(el=>{
    el.style.display=el.dataset.period.includes(period)?'block':'none';
  });
}

// LOG FILTER
function filterLog(type){
  const items=document.querySelectorAll('#log-list .notif-item');
  let found=0;
  items.forEach(item=>{
    if(type==='semua'||item.dataset.type===type){
      item.style.display='flex';found++;
    }else{
      item.style.display='none';
    }
  });
  // fix borders
  let lastVisible=null;
  items.forEach(item=>{
    if(item.style.display!=='none'){
      item.style.borderBottom='1px solid var(--border2)';
      lastVisible=item;
    }
  });
  if(lastVisible)lastVisible.style.borderBottom='none';
  const empty=document.getElementById('log-empty');
  if(empty)empty.style.display=found===0?'block':'none';
}

// ALERT: SELESAIKAN
function selesaikanAlert(id){
  activeAlerts=Math.max(0,activeAlerts-1);
  const card=document.getElementById(id);
  if(!card)return;
  const doneSection=document.getElementById('alert-done-section');
  const doneList=document.getElementById('alert-done-list');
  const title=card.querySelector('.alert-title').textContent;
  // Move to done section
  card.style.opacity='0';
  setTimeout(()=>{
    card.remove();
    doneSection.style.display='block';
    const doneCard=document.createElement('div');
    doneCard.style.cssText='background:var(--green-l);border:1.5px solid var(--green-mid);border-radius:var(--r-xl);padding:12px 14px;margin-bottom:8px;';
    doneCard.innerHTML='<div style="font-size:12px;font-weight:700;color:#15803D;">✅ '+title.replace(/^[^ ]+ /,'')+'</div><div style="font-size:11px;color:var(--green);margin-top:4px;">Diselesaikan oleh Rudi Hartono</div>';
    doneList.appendChild(doneCard);
    updateAlertBadge();
    if(activeAlerts===0){
      document.getElementById('alert-all-done').style.display='block';
    }
  },300);
}
function laporkanAlert(id){
  showToast('Laporan dikirim ke supervisor 🚨');
  selesaikanAlert(id);
}
function updateAlertBadge(){
  const badge=document.getElementById('alert-badge-count');
  const dashCount=document.getElementById('ptgs-alert-count');
  if(badge)badge.textContent=activeAlerts+' Aktif';
  if(dashCount)dashCount.textContent=activeAlerts;
}

// SCAN INVALID: MANUAL ENTRY
function submitManualEntry(){
  const plat=document.getElementById('manual-plat').value;
  if(!plat){showToast('⚠️ Masukkan plat nomor terlebih dahulu');return;}
  showToast('✅ '+plat+' diizinkan masuk secara manual');
  setTimeout(()=>go('s-ptgs-masuk-ok'),600);
}

// LAPORKAN KEJADIAN toggle form
function laporkanKejadian(){
  const form=document.getElementById('laporan-form');
  if(form)form.style.display=form.style.display==='none'?'block':'none';
}
function submitLaporan(){
  const desc=document.getElementById('laporan-desc').value;
  if(!desc){showToast('⚠️ Isi deskripsi kejadian');return;}
  showToast('📋 Laporan berhasil dikirim ke supervisor!');
  document.getElementById('laporan-form').style.display='none';
  document.getElementById('laporan-desc').value='';
}

// TAMU
let tamuTypeSelected='Gojek / GoSend';
let tamuEmoji='🛵';
function selectTamuType(el,type,emoji){
  tamuTypeSelected=type;tamuEmoji=emoji;
  document.querySelectorAll('#tamu-chips .tamu-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  const sel=document.getElementById('tamu-jenis');
  if(sel){
    for(let i=0;i<sel.options.length;i++){
      if(sel.options[i].text.toLowerCase().includes(type.split(' ')[0].toLowerCase())){sel.selectedIndex=i;break;}
    }
  }
}
function submitTamu(){
  const nama=document.getElementById('tamu-nama').value;
  const plat=document.getElementById('tamu-plat').value;
  const telp=document.getElementById('tamu-telp').value;
  const lokasi=document.getElementById('tamu-lokasi').value;
  const tujuanSingkat=document.getElementById('tamu-tujuan-singkat').value;
  if(!nama){showToast('⚠️ Isi nama pengunjung');return;}
  if(!plat){showToast('⚠️ Isi plat nomor');return;}
  const jenis=document.getElementById('tamu-jenis');
  const jenisText=jenis?jenis.options[jenis.selectedIndex].text:'Motor';
  const kend=document.getElementById('tamu-kendaraan');
  const kendText=kend?kend.options[kend.selectedIndex].text:'Motor';
  document.getElementById('tamu-qr-type').textContent='TAMU — '+tamuTypeSelected.split(' ')[0];
  document.getElementById('tamu-qr-plat').textContent=plat+' · '+kendText;
  document.getElementById('tamu-qr-nama').textContent=nama+(jenisText.includes('Gojek')||jenisText.includes('Grab')||jenisText.includes('Kurir')?' ('+tamuTypeSelected.split(' ')[0]+')':'');
  document.getElementById('tamu-qr-tujuan').textContent=lokasi||tujuanSingkat||'—';
  document.getElementById('tamu-qr-kendaraan').textContent=plat;
  document.getElementById('tamu-qr-telp').textContent=telp||'—';
  document.getElementById('tamu-qr-id').textContent='GUEST-'+Date.now().toString().slice(-6)+'-'+Math.floor(Math.random()*9999).toString().padStart(4,'0');
  go('s-tamu-qr');
}

// UPLOAD SIMULATION
function simulateUploadFoto(boxId,previewId){
  const box=document.getElementById(boxId);
  const preview=document.getElementById(previewId);
  if(box)box.style.display='none';
  if(preview)preview.style.display='block';
  showToast('Foto berhasil diambil 📷');
}

// PASSWORD STRENGTH
function checkPassStrength(v){
  const fill=document.getElementById('pass-strength-fill');
  const text=document.getElementById('pass-strength-text');
  if(!fill||!text)return;
  let score=0;
  if(v.length>=8)score++;
  if(/[A-Z]/.test(v))score++;
  if(/[0-9]/.test(v))score++;
  if(/[^A-Za-z0-9]/.test(v))score++;
  const levels=[
    {w:'0%',c:'var(--border2)',t:'Masukkan password baru'},
    {w:'25%',c:'var(--red)',t:'Terlalu lemah'},
    {w:'50%',c:'var(--amber)',t:'Cukup — tambahkan angka/simbol'},
    {w:'75%',c:'#16a34a',t:'Kuat'},
    {w:'100%',c:'var(--green)',t:'Sangat kuat!'}
  ];
  const l=levels[score];
  fill.style.width=l.w;fill.style.background=l.c;text.textContent=l.t;text.style.color=l.c;
}

// TOGGLE SWITCH
function toggleSwitch(label){
  const inp=label.querySelector('input');
  const span=label.querySelector('span');
  const knob=span.querySelector('span');
  const checked=!inp.checked;
  inp.checked=checked;
  span.style.background=checked?'var(--green)':'var(--border)';
  knob.style.transform=checked?'translateX(20px)':'translateX(0px)';
  showToast(checked?'Notifikasi diaktifkan 🔔':'Notifikasi dimatikan');
}

// FAQ TOGGLE
function toggleFaq(menuItem){
  const answer=menuItem.nextElementSibling;
  const arrow=menuItem.querySelector('span:last-child');
  if(!answer)return;
  const open=answer.style.display==='block';
  answer.style.display=open?'none':'block';
  if(arrow)arrow.textContent=open?'+':'−';
}

// INIT
go('s-splash');
// set date inputs to today
const today=new Date().toISOString().split('T')[0];
document.querySelectorAll('input[type=date]').forEach(el=>el.value=today);