import { LevelConfig, WorldId } from '../types/game';

export interface InvestigationQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GeneratedCivicCase {
  caseTitle: string;
  learningObjective: string;
  caseScenario: string;
  characterName: string;
  setting: 'home' | 'classroom' | 'school' | 'playground' | 'canteen' | 'neighborhood' | 'public_places';
  questions: {
    rule: InvestigationQuestion;
    decision: InvestigationQuestion;
    consequence: InvestigationQuestion;
    solution: InvestigationQuestion;
  };
}

interface CaseTemplate {
  title: string;
  learningObjective: string;
  scenario: (name: string) => string;
  characterNames: string[];
  setting: 'home' | 'classroom' | 'school' | 'playground' | 'canteen' | 'neighborhood' | 'public_places';
  rule: {
    prompt: string;
    correct: string;
    distractors: [string, string, string];
    explanation: string;
  };
  decision: {
    prompt: string;
    correct: string;
    distractors: [string, string, string];
    explanation: string;
  };
  consequence: {
    prompt: string;
    correct: string;
    distractors: [string, string, string];
    explanation: string;
  };
  solution: {
    prompt: string;
    correct: string;
    distractors: [string, string, string];
    explanation: string;
  };
}

// Fisher-Yates shuffle that returns options array & the new correctIndex
function shuffleOptions(correct: string, distractors: [string, string, string]): { options: string[]; correctIndex: number } {
  const all = [correct, ...distractors];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  const correctIndex = all.indexOf(correct);
  return { options: all, correctIndex };
}

// World 1: Home & Family
const homeTemplates: CaseTemplate[] = [
  {
    title: 'Merapikan Tempat Tidur & Kamar',
    learningObjective: 'Kemandirian dan tanggung jawab menjaga kebersihan rumah',
    characterNames: ['Rina', 'Aldi', 'Siti', 'Beni'],
    setting: 'home',
    scenario: (name) =>
      `${name} baru saja bangun tidur. Ia ingin segera pergi menonton televisi kartun kesukaannya, sementara bantal, guling, dan selimutnya masih berserakan di kasur.`,
    rule: {
      prompt: 'Tindakan mana yang menunjukkan tanggung jawab terhadap aturan di rumah?',
      correct: 'Melipat selimut dan merapikan bantal terlebih dahulu sebelum menonton TV',
      distractors: [
        'Menunggu ibu masuk ke kamar untuk merapikan tempat tidur',
        'Menyembunyikan selimut kusut di bawah tempat tidur agar tidak terlihat',
        'Langsung menyalakan TV dan melupakan kondisi kamar',
      ],
      explanation: 'Merapikan tempat tidur melatih disiplin diri dan meringankan pekerjaan orang tua sejak pagi.',
    },
    decision: {
      prompt: 'Apa keputusan terbaik untuk situasi ini?',
      correct: 'Meluangkan waktu 3 menit untuk merapikan kasur dengan rapi baru kemudian beristirahat',
      distractors: [
        'Menonton TV seharian penuh sampai ibu menegur dengan keras',
        'Menyuruh adik kecil yang sedang tidur untuk membereskan kasur',
        'Berpura-pura lupa bahwa kasurnya belum dirapikan',
      ],
      explanation: 'Keputusan yang bijak mendahulukan kewajiban sebelum menikmati hiburan.',
    },
    consequence: {
      prompt: 'Apa yang bisa terjadi jika kebiasaan malas merapikan kasur terus dibiarkan?',
      correct: 'Kamar menjadi kotor berdebu, mudah menjadi sarang nyamuk, dan membuat diri menjadi pribadi pemalas',
      distractors: [
        'Kasur akan menjadi lebih harum dan bersih dengan sendirinya',
        'Ibu akan memberikan hadiah uang saku tambahan',
        'Bantal dan selimut akan tertata sendiri secara ajaib',
      ],
      explanation: 'Kamar yang tidak dirawat mengundang kuman penyakit dan menciptakan kebiasaan menunda kewajiban.',
    },
    solution: {
      prompt: 'Apa yang sebaiknya dilakukan selanjutnya agar kebiasaan baik terbentuk?',
      correct: 'Membuat jadwal rutin: merapikan tempat tidur setiap hari segera setelah bangun pagi',
      distractors: [
        'Tidur di karpet lantai terus agar tidak perlu merapikan kasur lagi',
        'Meminta orang tua menyewa asisten pribadi untuk merapikan kasurnya',
        'Hanya merapikan kasur jika akan ada tamu yang berkunjung ke rumah',
      ],
      explanation: 'Kebiasaan baik lahir dari komitmen kecil yang diulang setiap hari secara konsisten.',
    },
  },
  {
    title: 'Membantu Mencuci Piring Setelah Makan',
    learningObjective: 'Gotong royong dan rasa hormat kepada anggota keluarga',
    characterNames: ['Budi', 'Edo', 'Made', 'Lani'],
    setting: 'home',
    scenario: (name) =>
      `Keluarga ${name} baru saja selesai makan malam bersama. Ibu terlihat lelah setelah seharian bekerja dan memasak di dapur. Di meja masih tertumpuk piring dan gelas kotor.`,
    rule: {
      prompt: 'Tindakan mana yang menunjukkan rasa tanggung jawab dan kepedulian di rumah?',
      correct: 'Membawa piring dan sendok sendiri ke wastafel cuci piring lalu membilasnya dengan bersih',
      distractors: [
        'Langsung pergi ke kamar dan meninggalkan piring kotor di atas meja makan',
        'Menyuruh ayah atau ibu membawakan piring bekas makannya',
        'Menunggu piring kotor bertumpuk banyak hingga esok hari',
      ],
      explanation: 'Membawa dan mencuci piring bekas sendiri adalah bentuk nyata menghargai jerih payah orang tua.',
    },
    decision: {
      prompt: 'Apa keputusan terbaik yang paling adil bagi semua anggota keluarga?',
      correct: 'Semua anggota keluarga saling berbagi tugas membersihkan meja makan secara bergotong royong',
      distractors: [
        'Membebankan seluruh pekerjaan rumah hanya kepada ibu seorang diri',
        'Saling tunjuk dan berdebat tentang siapa yang harus mencuci piring',
        'Membiarkan piring kotor sampai dihinggapi lalat',
      ],
      explanation: 'Keluarga yang rukun dan bahagia saling membantu meringankan beban pekerjaan rumah tangga.',
    },
    consequence: {
      prompt: 'Apa yang bisa terjadi jika tidak ada yang peduli mencuci peralatan makan?',
      correct: 'Meja makan menjadi bau amis, mengundang kecoa dan tikus, serta membuat ibu kelelahan',
      distractors: [
        'Piring kotor akan mengilap dan bersih dengan sendirinya',
        'Rumah akan terasa lebih luas dan tenang',
        'Anggota keluarga akan merasa lebih sehat dan gembira',
      ],
      explanation: 'Peralatan makan yang kotor menjadi sumber penyakit dan menciptakan suasana rumah yang tidak nyaman.',
    },
    solution: {
      prompt: 'Apa yang sebaiknya dilakukan selanjutnya?',
      correct: 'Mengajak adik atau kakak berbagi giliran mencuci piring dengan gembira dan ikhlas',
      distractors: [
        'Makan menggunakan bungkus plastik sekali pakai terus menerus',
        'Menolak makan bersama keluarga agar tidak mencuci piring',
        'Menyembunyikan piring kotor di lemari dapur',
      ],
      explanation: 'Jadwal giliran yang disepakati bersama menciptakan keadilan dan kebiasaan kerja sama.',
    },
  },
  {
    title: 'Membatasi Waktu Bermain Gawai (Game HP)',
    learningObjective: 'Disiplin waktu dan keseimbangan antara belajar, istirahat, dan hiburan',
    characterNames: ['Doni', 'Fitri', 'Galang', 'Dayu'],
    setting: 'home',
    scenario: (name) =>
      `${name} asyik bermain game di ponsel pintarnya. Waktu bermain yang disepakati dengan orang tua adalah 30 menit. Saat alarm berbunyi, permainannya sedang seru-serunya.`,
    rule: {
      prompt: 'Tindakan mana yang mencerminkan sikap disiplin terhadap kesepakatan keluarga?',
      correct: 'Menyimpan game dengan tertib, mematikan ponsel, dan beralih mengerjakan PR sekolah',
      distractors: [
        'Mematikan suara alarm dan diam-diam terus bermain selama 1 jam lagi',
        'Menangis dan marah kepada orang tua saat diingatkan batas waktu',
        'Berbohong bahwa permainannya baru saja dimulai beberapa detik yang lalu',
      ],
      explanation: 'Mematuhi batas waktu layar melatih kejujuran dan mengendalikan diri dari kecanduan gawai.',
    },
    decision: {
      prompt: 'Apa keputusan terbaik untuk situasi ini?',
      correct: 'Menepati janji batas waktu agar kesehatan mata terjaga dan tugas sekolah selesai tepat waktu',
      distractors: [
        'Memohon izin bermain hingga larut malam tanpa belajar',
        'Menyembunyikan ponsel di balik bantal untuk bermain secara sembunyi-sembunyi',
        'Mogok makan jika tidak diizinkan bermain game lagi',
      ],
      explanation: 'Menepati janji membangun rasa percaya orang tua kepada kita.',
    },
    consequence: {
      prompt: 'Masalah apa yang bisa timbul jika anak bermain game tanpa mematuhi aturan waktu?',
      correct: 'Mata menjadi cepat lelah dan rusak, tugas sekolah terbengkalai, dan mudah marah',
      distractors: [
        'Nilai raport sekolah akan otomatis meningkat drastis',
        'Tubuh akan menjadi lebih bugar dan segar bertenaga',
        'Orang tua akan merasa sangat bangga dan tenang',
      ],
      explanation: 'Terlalu lama menatap layar menurunkan konsentrasi belajar dan mengganggu kesehatan fisik anak.',
    },
    solution: {
      prompt: 'Solusi mana yang paling adil dan bertanggung jawab?',
      correct: 'Mengatur timer jam dinding secara jujur dan mendisiplinkan diri sendiri setiap kali bermain',
      distractors: [
        'Membuang jam dinding agar tidak tahu kapan waktu habis',
        'Hanya berhenti bermain saat baterai ponsel benar-benar habis total',
        'Menolak belajar sama sekali selama di rumah',
      ],
      explanation: 'Disiplin mandiri dengan bantuan pengatur waktu membuat anak terbiasa mengatur jadwal hidup.',
    },
  },
];

// World 2: School & Classroom
const schoolTemplates: CaseTemplate[] = [
  {
    title: 'Menjaga Kebersihan Ruang Kelas',
    learningObjective: 'Kepedulian terhadap kebersihan lingkungan belajar bersama',
    characterNames: ['Aldi', 'Beni', 'Siti', 'Rina'],
    setting: 'classroom',
    scenario: (name) =>
      `${name} melihat seorang teman di depannya melempar bungkus jajan makanan ringan ke bawah meja kelas saat jam istirahat sekolah.`,
    rule: {
      prompt: 'Tindakan mana yang paling tepat dan menunjukkan tanggung jawab warga kelas?',
      correct: 'Mengingatkan temannya dengan sopan agar mengambil sampah itu dan membuangnya ke tempat sampah',
      distractors: [
        'Ikut-ikutan membuang bungkus jajan di lantai karena merasa tidak ada guru',
        'Membiarkannya begitu saja karena merasa itu bukan sampah miliknya sendiri',
        'Menendang sampah tersebut ke kolong meja teman lain secara sembunyi-sembunyi',
      ],
      explanation: 'Mengingatkan teman dengan santun menjaga kebersihan kelas tanpa menimbulkan pertengkaran.',
    },
    decision: {
      prompt: 'Apa keputusan terbaik untuk situasi ini?',
      correct: 'Mengajak teman bersama-sama menjaga kebersihan kelas agar ruang belajar tetap bersih dan nyaman',
      distractors: [
        'Mengejek temannya di depan umum dengan kata-kata kasar',
        'Mengabaikan sampah dan menunggu petugas kebersihan datang membersihkan',
        'Membuang sampah lebih banyak ke lantai sebagai bentuk protes',
      ],
      explanation: 'Kelas yang bersih dan nyaman adalah hak dan kewajiban seluruh siswa yang belajar di dalamnya.',
    },
    consequence: {
      prompt: 'Apa yang bisa terjadi jika semua murid membuang sampah sembarangan di kelas?',
      correct: 'Kelas menjadi kotor, berbau tidak sedap, banyak nyamuk dan lalat, serta mengganggu konsentrasi belajar',
      distractors: [
        'Ruang kelas akan menjadi lebih sejuk dan harum semerbak',
        'Buku-buku pelajaran akan tertata lebih rapi secara otomatis',
        'Guru akan memuji seluruh siswa karena kelas menjadi ramai',
      ],
      explanation: 'Sampah yang menumpuk di kelas menjadi sarang kuman penyakit dan menurunkan kenyamanan belajar.',
    },
    solution: {
      prompt: 'Solusi mana yang paling adil untuk menjaga kebersihan kelas setiap hari?',
      correct: 'Melaksanakan piket kelas dengan kompak dan membiasakan diri membuang sampah langsung ke tempatnya',
      distractors: [
        'Melarang semua murid membawa bekal makanan ke sekolah',
        'Hanya menyuruh ketua kelas seorang diri untuk menyapu seluruh ruangan',
        'Menumpuk seluruh sampah di sudut pojok belakang kelas',
      ],
      explanation: 'Kerja sama regu piket dan kesadaran pribadi menjamin kelas selalu bersih setiap saat.',
    },
  },
  {
    title: 'Disiplin Antre Tertib di Kantin Sekolah',
    learningObjective: 'Menghargai hak orang lain dan melatih kesabaran melalui budaya antre',
    characterNames: ['Made', 'Doni', 'Edo', 'Lani'],
    setting: 'canteen',
    scenario: (name) =>
      `Saat bel istirahat berbunyi, kantin sekolah sangat ramai. Banyak siswa sedang mengantre dengan rapi menunggu giliran membeli makanan. Tiba-tiba seorang teman datang memotong antrean di depan ${name}.`,
    rule: {
      prompt: 'Tindakan mana yang mencerminkan kepatuhan terhadap aturan antrean?',
      correct: 'Mengingatkan teman tersebut dengan ramah bahwa antrean dimulai dari belakang barisan',
      distractors: [
        'Mendorong teman tersebut dengan kasar hingga makanannya jatuh',
        'Ikut menyerobot orang lain di depan agar tidak kalah cepat',
        'Diam saja lalu berteriak marah-marah kepada penjual kantin',
      ],
      explanation: 'Mengingatkan dengan ramah dan tegas menegakkan budaya antre secara damai dan beradab.',
    },
    decision: {
      prompt: 'Apa keputusan terbaik untuk situasi ini?',
      correct: 'Tetap berdiri sabar dalam barisan dan mengajak semua teman menghargai yang datang lebih awal',
      distractors: [
        'Membuat keributan dan mengajak teman-teman berkelahi di kantin',
        'Menyerobot antrean teman lain yang bertubuh lebih kecil',
        'Memaksa penjual kantin melayani dirinya terlebih dahulu',
      ],
      explanation: 'Budaya antre menjamin rasa keadilan bagi setiap orang yang telah menunggu giliran.',
    },
    consequence: {
      prompt: 'Apa yang bisa terjadi jika budaya antre tidak dipatuhi di kantin sekolah?',
      correct: 'Terjadi dorong-dorongan, makanan bisa tumpah melukai siswa, dan suasana menjadi ricuh',
      distractors: [
        'Semua siswa akan terlayani lebih cepat dan teratur',
        'Harga makanan di kantin akan turun menjadi gratis',
        'Penjual kantin akan lebih mudah menghitung uang kembalian',
      ],
      explanation: 'Saling serobot memicu kecelakaan kecil, tumpahan kuah panas, dan pertengkaran antar siswa.',
    },
    solution: {
      prompt: 'Apa yang sebaiknya dilakukan selanjutnya agar kantin selalu tertib?',
      correct: 'Membuat garis tanda antrean di lantai kantin dan saling mengingatkan untuk tertib',
      distractors: [
        'Menghapus sistem antrean dan membiarkan siapa yang terkuat yang dilayani',
        'Menutup kantin sekolah selamanya agar tidak ada antrean',
        'Mengizinkan siswa yang berbadan besar untuk selalu maju paling depan',
      ],
      explanation: 'Tanda batas visual dan kesadaran antre membuat suasana kantin nyaman dan aman untuk semua.',
    },
  },
  {
    title: 'Disiplin Waktu dan Datang Tepat Waktu',
    learningObjective: 'Menghargai waktu belajar dan tidak mengganggu proses pembelajaran',
    characterNames: ['Bagas', 'Fitri', 'Dayu', 'Galang'],
    setting: 'school',
    scenario: (name) =>
      `${name} sering begadang menonton video di malam hari, sehingga pagi harinya sulit dibangunkan dan hampir selalu tiba di sekolah setelah bel masuk berbunyi.`,
    rule: {
      prompt: 'Tindakan mana yang menunjukkan tanggung jawab sebagai seorang siswa?',
      correct: 'Tidur lebih awal di malam hari dan menyetel alarm agar bisa tiba di sekolah 15 menit sebelum bel',
      distractors: [
        'Meminta izin sakit palsu agar tidak tercatat terlambat oleh guru piket',
        'Melompati pagar belakang sekolah agar tidak terlihat satpam sekolah',
        'Tetap tidur larut malam dan menyalahkan jalanan macet setiap hari',
      ],
      explanation: 'Disiplin waktu dimulai dari pengaturan jadwal istirahat di malam hari secara teratur.',
    },
    decision: {
      prompt: 'Apa keputusan terbaik untuk situasi ini?',
      correct: 'Memperbaiki jadwal tidur malam demi menghargai waktu belajar dan guru di sekolah',
      distractors: [
        'Membolos sekolah saja jika merasa sudah terlambat 5 menit',
        'Menyalahkan orang tua karena tidak membangunkan dirinya berkali-kali',
        'Menganggap remeh aturan sekolah karena merasa masih anak kelas 4',
      ],
      explanation: 'Keputusan bertanggung jawab mengakui kelemahan diri dan berusaha memperbaikinya.',
    },
    consequence: {
      prompt: 'Masalah apa yang bisa timbul jika seorang siswa terus menerus terlambat datang ke sekolah?',
      correct: 'Ketinggalan materi pelajaran penting di awal jam, mendapat teguran, dan mengganggu teman yang sedang belajar',
      distractors: [
        'Guru akan memberikan nilai paling tinggi di kelas',
        'Tubuh akan menjadi semakin sehat karena tidur lebih lama di pagi hari',
        'Teman sekelas akan semakin kagum dan hormat',
      ],
      explanation: 'Terlambat masuk kelas memecah konsentrasi kelas yang sedang berdoa atau memulai pelajaran.',
    },
    solution: {
      prompt: 'Solusi mana yang paling tepat untuk mengatasi kebiasaan terlambat?',
      correct: 'Mempersiapkan tas dan seragam sekolah sejak malam hari sebelum tidur',
      distractors: [
        'Meminta sekolah memundurkan jam masuk kelas menjadi siang hari',
        'Menyuruh teman mencatatkan daftar hadir kehadiran secara curang',
        'Berlari kencang di jalan raya tanpa memperhatikan keselamatan lalu lintas',
      ],
      explanation: 'Menyiapkan keperluan sekolah di malam hari mencegah kepanikan dan keterlambatan di pagi hari.',
    },
  },
  {
    title: 'Tertib Saat Kerja Kelompok di Kelas',
    learningObjective: 'Kerja sama, mendengarkan pendapat teman, dan menjaga suasana kelas tetap kondusif',
    characterNames: ['Siti', 'Edo', 'Aldi', 'Rina'],
    setting: 'classroom',
    scenario: (name) =>
      `Saat tugas kerja kelompok Pendidikan Pancasila, kelompok ${name} mulai gaduh. Beberapa anggota sibuk bercanda dan berteriak, sementara tugas membuat poster aturan belum selesai.`,
    rule: {
      prompt: 'Tindakan mana yang dapat membantu kelompok menyelesaikan tugas dengan baik?',
      correct: 'Mengingatkan teman untuk fokus, membagi tugas dengan adil, dan berbicara dengan suara wajar',
      distractors: [
        'Ikut berteriak lebih kencang agar kelompok lain kalah bersuara',
        'Meninggalkan kelompok dan bermain sendiri di luar kelas',
        'Mengerjakan semua tugas sendiri sambil memarahi seluruh anggota kelompok',
      ],
      explanation: 'Menjaga ketenangan dan membagi tugas secara adil mempercepat penyelesaian kerja kelompok.',
    },
    decision: {
      prompt: 'Apa keputusan terbaik yang paling bijak untuk kelompok?',
      correct: 'Musyawarah sebentar untuk membagi bagian tugas masing-masing teman sesuai kemampuannya',
      distractors: [
        'Melaporkan teman ke kepala sekolah agar langsung dihukum berat',
        'Menyobek lembar kerja karena kesal tugas tidak kunjung selesai',
        'Menyalin hasil pekerjaan kelompok lain tanpa izin',
      ],
      explanation: 'Musyawarah pembagian tugas membuat setiap anggota merasa dihargai dan bertanggung jawab.',
    },
    consequence: {
      prompt: 'Apa yang bisa terjadi jika kelas terus gaduh saat kerja kelompok berlangsung?',
      correct: 'Tugas kelompok tidak selesai tepat waktu dan kelas sebelah merasa terganggu belajarnya',
      distractors: [
        'Tugas akan selesai lebih cepat karena suasana sangat ramai',
        'Semua kelompok akan mendapatkan nilai A plus otomatis',
        'Guru akan mengajak seluruh murid berlibur ke pantai',
      ],
      explanation: 'Kegaduhan yang berlebihan mengganggu konsentrasi kelas sendiri maupun kelas lain di sekitarnya.',
    },
    solution: {
      prompt: 'Apa yang sebaiknya dilakukan selanjutnya?',
      correct: 'Menunjuk satu teman sebagai ketua kelompok yang memimpin diskusi dengan tenang dan tertib',
      distractors: [
        'Melarang semua anggota kelompok berbicara sama sekali selama 2 jam',
        'Membatalkan tugas dan meminta pulang lebih awal',
        'Menghukum anggota kelompok yang bersuara dengan mencubit tangannya',
      ],
      explanation: 'Pemimpin kelompok yang baik dapat mengarahkan jalannya diskusi agar tetap tertib dan produktif.',
    },
  },
];

// World 3: Community & Neighborhood
const communityTemplates: CaseTemplate[] = [
  {
    title: 'Gotong Royong Kebersihan Selokan Warga',
    learningObjective: 'Kerja sama menjaga kebersihan lingkungan dan mencegah banjir',
    characterNames: ['Budi', 'Made', 'Bagas', 'Doni'],
    setting: 'neighborhood',
    scenario: (name) =>
      `Hari Minggu pagi diadakan kerja bakti membersihkan selokan di lingkungan RT tempat tinggal ${name}. Beberapa tetangga sudah berkumpul membawa cangkul dan sapu lidi.`,
    rule: {
      prompt: 'Tindakan mana yang mencerminkan kepedulian seorang warga yang baik?',
      correct: 'Ikut membantu mengumpulkan sampah daun kering dan menyapu halaman pos ronda bersama warga',
      distractors: [
        'Mengurung diri di kamar sambil menutup jendela agar tidak diajak kerja bakti',
        'Menonton warga yang sedang lelah bekerja sambil membuang sampah sembarangan',
        'Mengeluh dan menuntut orang lain bekerja lebih keras untuk dirinya',
      ],
      explanation: 'Gotong royong membersihkan lingkungan adalah wujud nyata sila ketiga Pancasila: Persatuan Indonesia.',
    },
    decision: {
      prompt: 'Apa keputusan terbaik untuk situasi ini?',
      correct: 'Mengajak teman-teman sebaya membantu pekerjaan ringan yang sesuai dengan kemampuan anak-anak',
      distractors: [
        'Menolak membantu karena merasa tugas kebersihan hanya untuk orang tua',
        'Bermain bola di jalanan yang sedang dibersihkan warga',
        'Membuang batu-batu kerikil kembali ke dalam selokan yang baru dibersihkan',
      ],
      explanation: 'Anak-anak dapat berperan aktif membantu pekerjaan ringan seperti membuang sampah kantong plastik.',
    },
    consequence: {
      prompt: 'Apa yang bisa terjadi jika warga acuh dan selokan penuh dengan tumpukan sampah?',
      correct: 'Saat hujan deras air selokan meluap membanjiri rumah warga dan menyebarkan bibit penyakit demam berdarah',
      distractors: [
        'Selokan akan menjadi lebih wangi dan indah dipandang mata',
        'Air selokan akan berubah menjadi jernih seperti air mineral pegunungan',
        'Banjir akan membawa rezeki kekayaan bagi seluruh warga',
      ],
      explanation: 'Selokan yang tersumbat sampah menyebabkan banjir dan menjadi sarang jentik nyamuk demam berdarah.',
    },
    solution: {
      prompt: 'Solusi mana yang paling adil dan efektif untuk menjaga lingkungan warga?',
      correct: 'Menyepakati jadwal kerja bakti berkala dan memasang larangan membuang sampah ke selokan',
      distractors: [
        'Menutup seluruh selokan dengan beton semen rapat tanpa lubang air',
        'Membuang seluruh sampah ke halaman rumah tetangga sebelah',
        'Membiarkan selokan mampet sampai pemerintah datang membersihkan',
      ],
      explanation: 'Kesadaran warga dan kerja bakti rutin menjamin saluran air berfungsi dengan baik sepanjang tahun.',
    },
  },
  {
    title: 'Menjaga Ketenangan Warga Saat Jam Istirahat',
    learningObjective: 'Menghormati hak istirahat dan ketenteraman tetangga sekitar',
    characterNames: ['Edo', 'Galang', 'Dayu', 'Fitri'],
    setting: 'neighborhood',
    scenario: (name) =>
      `Saat jam istirahat siang hari, ${name} dan teman-temannya ingin bermain permainan petak umpet di gang depan rumah tetangga yang sedang ada bayi tidur dan seorang kakek yang sakit.`,
    rule: {
      prompt: 'Tindakan mana yang menunjukkan sikap tenggang rasa dan menghormati tetangga?',
      correct: 'Pindah bermain ke lapangan terbuka yang jauh dari rumah warga yang sedang sakit atau istirahat',
      distractors: [
        'Tetap berteriak-teriak sekeras mungkin di depan jendela rumah tetangga tersebut',
        'Membunyikan lonceng sepeda terus menerus untuk menggoda bayi yang sedang tidur',
        'Marah-marah kepada tetangga jika ditegur karena berisik',
      ],
      explanation: 'Menghormati hak istirahat tetangga adalah bagian dari norma kesopanan hidup bermasyarakat.',
    },
    decision: {
      prompt: 'Apa keputusan terbaik untuk situasi ini?',
      correct: 'Memilih permainan yang tenang atau berpindah lokasi bermain ke taman bermain yang semestinya',
      distractors: [
        'Mengabaikan teguran tetangga karena merasa jalan depan rumah milik bersama',
        'Melempar batu ke atap rumah tetangga secara sembunyi-sembunyi',
        'Mengajak lebih banyak anak untuk berteriak bersama di lorong gang',
      ],
      explanation: 'Keputusan yang beradab memprioritaskan ketenangan orang yang sedang sakit atau membutuhkan istirahat.',
    },
    consequence: {
      prompt: 'Apa yang bisa terjadi jika kita tidak peduli dengan ketenangan tetangga sekitar?',
      correct: 'Terjadi pertengkaran antarwarga, hubungan tetangga menjadi renggang, dan orang sakit sulit sembuh',
      distractors: [
        'Tetangga akan membelikan hadiah es krim kepada anak-anak yang berisik',
        'Lingkungan sekitar akan menjadi semakin damai dan rukun',
        'Orang yang sakit akan langsung sembuh seketika karena mendengar kebisingan',
      ],
      explanation: 'Kebisingan yang tidak pada tempatnya mengganggu kenyamanan dan merusak kerukunan hidup bertetangga.',
    },
    solution: {
      prompt: 'Solusi mana yang paling adil bagi anak-anak dan tetangga sekitar?',
      correct: 'Menyepakati jam bermain di luar rumah setelah jam istirahat siang usai dan memanfaatkan lapangan RT',
      distractors: [
        'Melarang anak-anak bermain selamanya di mana pun berada',
        'Mengusir tetangga yang sedang sakit keluar dari lingkungan RT',
        'Membiarkan anak-anak berbuat semaunya tanpa aturan',
      ],
      explanation: 'Menyepakati waktu dan tempat bermain yang aman memberikan ruang gembira bagi anak sekaligus ketenangan bagi warga.',
    },
  },
];

// World 4: Public Spaces & Roads
const publicTemplates: CaseTemplate[] = [
  {
    title: 'Menyeberang Jalan Melalui Zebra Cross',
    learningObjective: 'Kepatuhan terhadap rambu keselamatan jalan raya bagi pejalan kaki',
    characterNames: ['Beni', 'Lani', 'Siti', 'Aldi'],
    setting: 'public_places',
    scenario: (name) =>
      `${name} hendak menyeberang jalan raya di depan sekolah yang ramai dengan kendaraan bermotor yang melaju cepat. Jarak 20 meter dari posisinya terdapat garis penyeberangan zebra cross.`,
    rule: {
      prompt: 'Tindakan mana yang paling aman dan menunjukkan kepatuhan aturan lalu lintas?',
      correct: 'Berjalan sedikit ke garis zebra cross, menengok kanan-kiri, dan menyeberang saat kendaraan berhenti',
      distractors: [
        'Langsung berlari menyeberang di sembarang tempat sambil bermain ponsel',
        'Menerobos di antara mobil yang sedang melaju kencang tanpa melihat sekitar',
        'Menutup mata dan berharap semua pengendara motor berhenti mendadak',
      ],
      explanation: 'Zebra cross dirancang khusus sebagai zona aman pejalan kaki yang wajib diutamakan oleh pengendara.',
    },
    decision: {
      prompt: 'Apa keputusan terbaik untuk situasi ini?',
      correct: 'Mengutamakan keselamatan diri dengan memanfaatkan fasilitas zebra cross meskipun harus berjalan sedikit',
      distractors: [
        'Memilih jalan pintas yang berbahaya hanya demi menghemat waktu beberapa detik',
        'Menyeberang sambil bercanda dan saling dorong dengan teman di tengah jalan',
        'Berdiri diam di tengah pembatas jalan raya',
      ],
      explanation: 'Keselamatan nyawa jauh lebih berharga daripada terburu-buru menghemat beberapa langkah kaki.',
    },
    consequence: {
      prompt: 'Apa yang bisa terjadi jika pejalan kaki menyeberang jalan sembarangan?',
      correct: 'Bisa tertabrak kendaraan bermotor, menyebabkan kecelakaan beruntun, dan membahayakan pengguna jalan lain',
      distractors: [
        'Pengendara kendaraan bermotor akan memberikan jempol apresiasi',
        'Jalan raya akan menjadi lebih lancar dan bebas hambatan',
        'Lampu lalu lintas akan berubah menjadi warna pelangi',
      ],
      explanation: 'Menyeberang sembarangan adalah salah satu penyebab utama kecelakaan fatal di ruang publik.',
    },
    solution: {
      prompt: 'Apa yang sebaiknya dilakukan selanjutnya?',
      correct: 'Mengajak teman-teman selalu menyeberang di zebra cross atau jembatan penyeberangan orang (JPO)',
      distractors: [
        'Menghapus garis zebra cross agar tidak perlu digunakan lagi',
        'Melarang semua mobil melintas di seluruh jalan kota',
        'Berjalan di tengah jalan raya sebagai pengganti trotoar',
      ],
      explanation: 'Membiasakan diri menggunakan fasilitas pejalan kaki menciptakan budaya tertib lalu lintas sejak dini.',
    },
  },
  {
    title: 'Etika Kursi Prioritas di Angkutan Umum',
    learningObjective: 'Empati sosial dan kepedulian terhadap kelompok rentan di ruang publik',
    characterNames: ['Fitri', 'Rina', 'Edo', 'Made'],
    setting: 'public_places',
    scenario: (name) =>
      `${name} sedang duduk di kursi angkutan bus umum yang cukup penuh. Di halte berikutnya, naik seorang nenek lanjut usia yang membawa tas belanja berat dan tampak kesulitan berdiri saat bus berguncang.`,
    rule: {
      prompt: 'Tindakan mana yang mencerminkan nilai kemanusiaan yang adil dan beradab?',
      correct: 'Segera berdiri dengan sopan dan mempersilakan nenek tersebut duduk di kursinya',
      distractors: [
        'Pura-pura tidur dan memejamkan mata agar tidak diminta memberikan tempat duduk',
        'Menyuruh nenek tersebut duduk di lantai bus yang kotor',
        'Melihat ke luar jendela dan tidak memedulikan keadaan nenek tersebut',
      ],
      explanation: 'Memberikan kursi kepada lansia adalah bentuk penghormatan dan empati kepada sesama warga.',
    },
    decision: {
      prompt: 'Apa keputusan terbaik untuk situasi ini?',
      correct: 'Membantu membawakan tas belanja nenek dan tersenyum ramah saat menyerahkan kursi',
      distractors: [
        'Menuntut bayaran ongkos bus kepada nenek jika ingin duduk',
        'Menolak berdiri karena merasa sudah membayar tiket bus yang sama',
        'Menyuruh penumpang lain saja yang berdiri sementara dirinya tetap duduk santai',
      ],
      explanation: 'Sikap peduli dan rela berkorban membuat ruang publik menjadi hangat dan ramah untuk semua generasi.',
    },
    consequence: {
      prompt: 'Apa yang bisa terjadi jika warga tidak memiliki kepedulian di transportasi umum?',
      correct: 'Lansia atau ibu hamil bisa jatuh terluka saat bus mengerem mendadak, dan masyarakat kehilangan rasa kasih sayang',
      distractors: [
        'Semua penumpang akan merasa lebih bahagia dan nyaman',
        'Bus akan melaju lebih cepat sampai ke tujuan',
        'Kursi bus akan bertambah jumlahnya dengan sendirinya',
      ],
      explanation: 'Ketidakpedulian merugikan keselamatan warga yang lemah dan menciptakan masyarakat yang egois.',
    },
    solution: {
      prompt: 'Solusi mana yang paling tepat untuk diterapkan di semua fasilitas umum?',
      correct: 'Menghormati tanda stiker "Kursi Prioritas" bagi lansia, ibu hamil, dan penyandang disabilitas',
      distractors: [
        'Melarang orang tua lansia naik angkutan umum',
        'Menghilangkan seluruh kursi di dalam bus agar semua penumpang berdiri',
        'Mengizinkan siapa saja yang paling kuat untuk menguasai kursi',
      ],
      explanation: 'Menghormati kursi prioritas adalah aturan kesopanan universal di seluruh sistem transportasi modern.',
    },
  },
  {
    title: 'Menjaga Fasilitas Umum dari Vandalisme',
    learningObjective: 'Melindungi sarana publik dan menghargai milik bersama',
    characterNames: ['Galang', 'Doni', 'Bagas', 'Beni'],
    setting: 'public_places',
    scenario: (name) =>
      `Saat sedang menunggu jemputan di halte bus kota, ${name} melihat dua orang anak seusianya mengeluarkan spidol permanen dan hendak mencoret-coret kaca halte dan dinding pengumuman rute bus.`,
    rule: {
      prompt: 'Tindakan mana yang menunjukkan tanggung jawab menjaga fasilitas umum?',
      correct: 'Mengingatkan dengan tegas dan santun bahwa halte adalah milik bersama yang harus dijaga kebersihannya',
      distractors: [
        'Ikut meminjam spidol untuk menuliskan nama sendiri di bangku halte',
        'Menonton sambil menertawakan coretan yang merusak fasilitas',
        'Membantu memegangi kaca agar temannya lebih mudah mencoret',
      ],
      explanation: 'Fasilitas umum dibangun dari uang bersama rakyat untuk kenyamanan seluruh warga kota.',
    },
    decision: {
      prompt: 'Apa keputusan terbaik untuk situasi ini?',
      correct: 'Mencegah aksi perusakan fasilitas umum dan mengajak mereka menyalurkan bakat menggambar di buku gambar',
      distractors: [
        'Mengajak berkelahi di tempat umum tanpa berbicara baik-baik',
        'Merusak lampu halte bus sekalian agar semakin gelap',
        'Membiarkan halte kotor dan rusak karena merasa bukan rumah sendiri',
      ],
      explanation: 'Mengarahkan bakat seni ke tempat yang tepat (seperti kanvas atau buku) mencegah perusakan ruang publik.',
    },
    consequence: {
      prompt: 'Masalah apa yang terjadi jika fasilitas publik dibiarkan dicoret-coret dan dirusak?',
      correct: 'Kota menjadi kumuh, informasi rute bus tidak terbaca oleh penumpang, dan biaya perbaikan sangat mahal',
      distractors: [
        'Halte akan menjadi objek wisata terkenal dunia',
        'Warga kota akan merasa bangga melihat coretan nama di mana-mana',
        'Armada bus akan datang lebih sering ke halte tersebut',
      ],
      explanation: 'Vandalisme merusak keindahan kota dan menghabiskan dana yang seharusnya bisa untuk pembangunan lain.',
    },
    solution: {
      prompt: 'Apa yang sebaiknya dilakukan selanjutnya sebagai solusi jangka panjang?',
      correct: 'Menjaga bersama fasilitas umum dan melaporkan sarana yang rusak kepada pihak berwenang agar lekas diperbaiki',
      distractors: [
        'Membongkar seluruh halte bus agar tidak ada yang mencoret lagi',
        'Membiarkan dinding halte penuh sampah dan coretan liar',
        'Melarang warga kota menggunakan fasilitas transportasi umum',
      ],
      explanation: 'Rasa memiliki bersama (sense of belonging) menjaga fasilitas kota tetap bersih, rapi, dan awet.',
    },
  },
];

export class SmartCaseGenerator {
  public static getCaseForLevel(level: LevelConfig): GeneratedCivicCase {
    let templateList: CaseTemplate[];

    switch (level.worldId) {
      case 'world1':
        templateList = homeTemplates;
        break;
      case 'world2':
        templateList = schoolTemplates;
        break;
      case 'world3':
        templateList = communityTemplates;
        break;
      case 'world4':
      default:
        templateList = publicTemplates;
        break;
    }

    // Pick a template (varied by level.id + random seed to guarantee replay variety)
    const randomIndex = Math.floor(Math.random() * templateList.length);
    const template = templateList[randomIndex];

    // Pick a familiar character name
    const characterName = template.characterNames[Math.floor(Math.random() * template.characterNames.length)];

    // Build scenario
    const scenario = template.scenario(characterName);

    // Shuffle each of the 4 question option sets
    const q1 = shuffleOptions(template.rule.correct, template.rule.distractors);
    const q2 = shuffleOptions(template.decision.correct, template.decision.distractors);
    const q3 = shuffleOptions(template.consequence.correct, template.consequence.distractors);
    const q4 = shuffleOptions(template.solution.correct, template.solution.distractors);

    return {
      caseTitle: `Investigasi: ${template.title}`,
      learningObjective: template.learningObjective,
      caseScenario: scenario,
      characterName,
      setting: template.setting,
      questions: {
        rule: {
          prompt: template.rule.prompt,
          options: q1.options,
          correctIndex: q1.correctIndex,
          explanation: template.rule.explanation,
        },
        decision: {
          prompt: template.decision.prompt,
          options: q2.options,
          correctIndex: q2.correctIndex,
          explanation: template.decision.explanation,
        },
        consequence: {
          prompt: template.consequence.prompt,
          options: q3.options,
          correctIndex: q3.correctIndex,
          explanation: template.consequence.explanation,
        },
        solution: {
          prompt: template.solution.prompt,
          options: q4.options,
          correctIndex: q4.correctIndex,
          explanation: template.solution.explanation,
        },
      },
    };
  }
}
