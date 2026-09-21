import { Question, QuestionCategory } from '../types/game';

// Helper to create a question with option shuffling
export function shuffleQuestionOptions(q: Question): Question {
  const correctText = q.options[q.correctIndex];
  const shuffled = [...q.options];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const newCorrectIndex = shuffled.indexOf(correctText);

  return {
    ...q,
    options: shuffled,
    correctIndex: newCorrectIndex,
  };
}

function q(
  id: string,
  category: QuestionCategory,
  categoryTitle: string,
  scenario: string,
  question: string,
  correct: string,
  wrongs: [string, string, string],
  explanation: string,
  scoresEffect: { discipline: number; responsibility: number; respect: number; cleanliness: number; community: number } = {
    discipline: 15,
    responsibility: 15,
    respect: 15,
    cleanliness: 10,
    community: 15,
  }
): Question {
  // Initial options with correct placed at deterministic index (will be dynamically shuffled when served)
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash << 5) - hash + id.charCodeAt(i);
  const initialIndex = Math.abs(hash) % 4;

  const options = [...wrongs];
  options.splice(initialIndex, 0, correct);

  return {
    id,
    category,
    categoryTitle,
    scenario,
    question,
    options,
    correctIndex: initialIndex,
    explanation,
    isHots: true,
    scoresEffect,
  };
}

// 1. Meaning of Rules (Makna & Pentingnya Aturan untuk Anak SD Kelas 4)
const meaningOfRulesQuestions: Question[] = [
  q(
    'mr_1',
    'meaning_of_rules',
    'Makna & Manfaat Aturan',
    'Setiap hari di sekolah dan di rumah, kita selalu memiliki aturan yang harus ditaati bersama.',
    'Mengapa sebuah tempat seperti sekolah atau rumah perlu memiliki aturan bersama?',
    'Agar semua orang merasa aman, nyaman, dan kehidupan menjadi teratur',
    [
      'Agar anak-anak merasa takut dan tidak bisa bermain sama sekali',
      'Supaya guru dan orang tua bisa memberi hukuman setiap hari',
      'Hanya untuk pajangan tulisan di dinding yang tidak perlu dibaca',
    ],
    'Aturan dibuat sebagai petunjuk hidup bersama agar semua merasa nyaman, adil, dan terhindar dari kekacauan.'
  ),
  q(
    'mr_2',
    'meaning_of_rules',
    'Makna & Manfaat Aturan',
    'Bayangkan jika di jalan raya tidak ada lampu lalu lintas dan tidak ada aturan sama sekali.',
    'Apa yang paling mungkin terjadi jika semua pengendara berkendara semaunya sendiri?',
    'Terjadi kemacetan parah dan kecelakaan di mana-mana karena saling berebut',
    [
      'Semua kendaraan akan melaju lebih cepat dan sampai dengan selamat',
      'Jalan raya akan menjadi sangat sepi dan menyenangkan',
      'Semua pengendara akan saling tersenyum bahagia tanpa ada masalah',
    ],
    'Aturan lalu lintas melindungi keselamatan setiap pengguna jalan agar tidak bertabrakan.'
  ),
  q(
    'mr_3',
    'meaning_of_rules',
    'Makna & Manfaat Aturan',
    'Di dalam keluarga Beni, ada aturan: setiap anggota keluarga merapikan piring makannya sendiri ke dapur.',
    'Apa manfaat yang dirasakan Beni dan keluarganya dengan adanya aturan tersebut?',
    'Pekerjaan ibu di dapur menjadi lebih ringan dan rumah menjadi rapi',
    [
      'Beni bisa memamerkan piringnya kepada tetangga sebelah rumah',
      'Piring di dapur akan bersih sendiri tanpa perlu dicuci',
      'Beni tidak perlu lagi makan nasi bersama keluarga',
    ],
    'Aturan di rumah melatih kemandirian dan rasa peduli untuk saling membantu keluarga.'
  ),
  q(
    'mr_4',
    'meaning_of_rules',
    'Makna & Manfaat Aturan',
    'Saat bermain petak umpet di lapangan, Edo bersikeras ingin mengubah aturan permainan secara tiba-tiba tanpa persetujuan teman lain.',
    'Apa yang sebaiknya dilakukan teman-teman Edo agar permainan tetap berjalan seru dan adil?',
    'Mengajak Edo bermusyawarah dan menyepakati aturan permainan bersama-sama',
    [
      'Meninggalkan Edo sendirian dan tidak mau berteman dengannya selamanya',
      'Membiarkan Edo berbuat curang terus menerus sesuka hatinya',
      'Saling melempar batu dan bertengkar di lapangan',
    ],
    'Aturan permainan yang disepakati bersama menjamin keadilan dan kegembiraan bagi seluruh peserta.'
  ),
  q(
    'mr_5',
    'meaning_of_rules',
    'Makna & Manfaat Aturan',
    'Di perpustakaan sekolah terdapat papan bertuliskan: "Harap Tenang dan Tidak Berisik".',
    'Mengapa aturan tenang di perpustakaan sangat penting untuk dipatuhi?',
    'Agar teman-teman lain dapat membaca buku dengan konsentrasi dan nyaman',
    [
      'Supaya ruangan perpustakaan terlihat seperti gua yang sepi',
      'Agar penjaga perpustakaan bisa tidur siang tanpa terganggu',
      'Karena buku-buku di perpustakaan takut terhadap suara berisik',
    ],
    'Perpustakaan adalah tempat belajar bersama yang membutuhkan ketenangan agar pembaca bisa fokus.'
  ),
  q(
    'mr_6',
    'meaning_of_rules',
    'Makna & Manfaat Aturan',
    'Siti mematuhi aturan membuang sampah pada tempatnya meskipun saat itu tidak ada guru yang mengawasi.',
    'Sikap yang ditunjukkan Siti tersebut mencerminkan sikap...',
    'Disiplin dan jujur karena mematuhi aturan dari kesadaran diri sendiri',
    [
      'Takut karena mengira ada kamera tersembunyi yang mengintipnya',
      'Pura-pura baik agar mendapat pujian dan hadiah uang saku',
      'Terpaksa karena tempat sampahnya berada persis di depan kakinya',
    ],
    'Disiplin sejati dilakukan dengan ikhlas dan penuh kesadaran, bukan hanya karena diawasi orang lain.'
  ),
  q(
    'mr_7',
    'meaning_of_rules',
    'Makna & Manfaat Aturan',
    'Di kelas 4, semua murid bersama guru membuat "Kesepakatan Kelas" di awal semester.',
    'Mengapa kesepakatan kelas dibuat bersama-sama oleh murid dan guru?',
    'Agar semua murid merasa memiliki dan bertanggung jawab menjaga ketertiban kelas',
    [
      'Hanya untuk mengisi waktu kosong di hari pertama sekolah',
      'Supaya guru tidak perlu lagi mengajar di dalam kelas',
      'Agar ketua kelas bisa menghukum murid lain seenaknya sendiri',
    ],
    'Aturan yang dibuat bersama akan ditaati dengan penuh kesadaran dan rasa tanggung jawab.'
  ),
];

// 2. Rules at Home (Aturan di Rumah: Kamar, Waktu Belajar, Gadget, Menghormati Orang Tua)
const rulesAtHomeQuestions: Question[] = [
  q(
    'rh_1',
    'rules_at_home',
    'Aturan di Rumah',
    'Aldi baru saja bangun tidur di pagi hari. Di kamarnya, selimut dan bantal masih kusut dan berantakan.',
    'Apa tindakan terbaik yang sebaiknya Aldi lakukan sebelum keluar dari kamar?',
    'Merapikan kasur dan melipat selimutnya sendiri dengan rapi',
    [
      'Langsung berlari ke ruang depan untuk menonton kartun TV',
      'Menyuruh ibu atau adik untuk membereskan tempat tidurnya',
      'Menyembunyikan selimut kotor di bawah kolong tempat tidur',
    ],
    'Merapikan tempat tidur sendiri melatih kemandirian dan meringankan pekerjaan ibu di pagi hari.'
  ),
  q(
    'rh_2',
    'rules_at_home',
    'Aturan di Rumah',
    'Rina selesai makan siang di meja makan keluarga. Ibu sedang sibuk menidurkan adik kecil di kamar.',
    'Apa yang sebaiknya dilakukan Rina terhadap piring bekas makannya?',
    'Membawa piring dan sendok kotor ke tempat cuci piring lalu mencucinya',
    [
      'Meninggalkan piring kotor di atas meja agar dibersihkan oleh ibu nanti',
      'Menaruh piring kotor di lantai agar kucing yang memakannya',
      'Menumpuk piring di kursi makan lalu segera pergi bermain',
    ],
    'Mencuci piring sendiri setelah makan adalah bentuk tanggung jawab dan kasih sayang kepada orang tua.'
  ),
  q(
    'rh_3',
    'rules_at_home',
    'Aturan di Rumah',
    'Budi sudah berjanji kepada ayah hanya bermain game di ponsel selama 30 menit. Jam alarm berbunyi tanda waktu bermain telah habis.',
    'Keputusan terbaik apa yang sebaiknya Budi ambil saat alarm berbunyi?',
    'Menyimpan game dengan tertib, mematikan ponsel, dan mulai belajar',
    [
      'Mematikan alarm dan diam-diam terus bermain game 1 jam lagi',
      'Menangis dan marah-marah kepada ayah karena permainannya dihentikan',
      'Menyembunyikan ponsel di balik bantal untuk bermain secara sembunyi-sembunyi',
    ],
    'Menepati janji batas waktu bermain game menjaga kesehatan mata dan melatih disiplin diri.'
  ),
  q(
    'rh_4',
    'rules_at_home',
    'Aturan di Rumah',
    'Sore hari, Made ingin bermain sepeda bersama teman-teman di lapangan kampung. Ibu sedang berada di dapur.',
    'Sebelum berangkat bermain, apa yang wajib Made lakukan sesuai aturan di rumah?',
    'Berpamitan dan meminta izin dengan sopan kepada ibu',
    [
      'Langsung pergi diam-diam lewat pintu samping tanpa memberi tahu siapa pun',
      'Menulis pesan di tanah yang mudah terhapus oleh air',
      'Berangkat begitu saja dan baru pulang saat larut malam',
    ],
    'Berpamitan sebelum keluar rumah sangat penting agar orang tua tidak cemas dan mengetahui keberadaan kita.'
  ),
  q(
    'rh_5',
    'rules_at_home',
    'Aturan di Rumah',
    'Doni dan adiknya selesai bermain balok susun di ruang tamu. Balok-balok plastik berserakan di karpet lantai.',
    'Tindakan mana yang menunjukkan kerja sama dan tanggung jawab di rumah?',
    'Mengajak adik bersama-sama mengumpulkan balok ke dalam wadah mainan',
    [
      'Meninggalkan mainan begitu saja dan menyalahkan adik kepada ibu',
      'Menendang balok-balok mainan ke bawah sofa agar tidak terlihat',
      'Menangis dan menolak membereskan karena merasa bukan dia yang mengeluarkan semua',
    ],
    'Merapikan mainan bersama adik mencegah orang lain tersandung dan menjaga kerapian rumah.'
  ),
  q(
    'rh_6',
    'rules_at_home',
    'Aturan di Rumah',
    'Saat malam hari, ayah sedang beristirahat karena lelah bekerja. Fitri ingin mendengarkan musik di ponselnya.',
    'Sikap santun apa yang sebaiknya Fitri tunjukkan?',
    'Mengecilkan volume musik atau menggunakan earphone agar ayah tidak terganggu',
    [
      'Menyalakan speaker sekeras-kerasnya di dekat pintu kamar ayah',
      'Menari sambil berteriak di depan kamar tidur ayah',
      'Marah jika ayah meminta volume musik dikecilkan',
    ],
    'Menghormati anggota keluarga yang sedang beristirahat mencerminkan adab dan kasih sayang di rumah.'
  ),
  q(
    'rh_7',
    'rules_at_home',
    'Aturan di Rumah',
    'Ibu meminta bantuan Dayu untuk menyapu ruang tengah rumah sebelum tamu datang berkunjung.',
    'Bagaimana sikap Dayu yang menunjukkan rasa tanggung jawab sebagai anak?',
    'Membantu menyapu lantai dengan senang hati dan ikhlas',
    [
      'Mengeluh dan meminta bayaran uang jajan kepada ibu',
      'Pura-pura tidur di sofa agar tidak disuruh oleh ibu',
      'Menyuruh teman yang sedang lewat untuk menyapu rumahnya',
    ],
    'Membantu orang tua dengan ikhlas membuat suasana rumah penuh keberkahan dan kehangatan.'
  ),
];

// 3. Rules at School (Aturan di Sekolah: Tepat Waktu, Seragam, Piket, Kantin, Perpustakaan)
const rulesAtSchoolQuestions: Question[] = [
  q(
    'rs_1',
    'rules_at_school',
    'Aturan di Sekolah',
    'Aldi melihat temannya membuang bungkus jajan makanan ringan di lantai ruang kelas setelah bel istirahat.',
    'Apa yang sebaiknya Aldi lakukan untuk menjaga ketertiban kelasnya?',
    'Mengingatkan temannya dengan ramah agar mengambilnya dan membuang ke tempat sampah',
    [
      'Membiarkannya saja karena merasa itu bukan sampah miliknya sendiri',
      'Membalas dengan membuang sampah lebih banyak ke lantai kelas',
      'Mengejek temannya dengan kata-kata kasar di depan seluruh murid',
    ],
    'Mengingatkan teman dengan sopan menjaga kebersihan kelas tanpa menimbulkan pertengkaran.'
  ),
  q(
    'rs_2',
    'rules_at_school',
    'Aturan di Sekolah',
    'Saat guru sedang menjelaskan materi pelajaran IPA di depan papan tulis, Edo ingin berbicara dengan teman di sampingnya.',
    'Tindakan mana yang paling tepat dan menghormati proses belajar di kelas?',
    'Mendengarkan penjelasan guru terlebih dahulu dengan tertib hingga selesai',
    [
      'Mengobrol dan tertawa dengan suara keras sambil membelakangi guru',
      'Melempar gumpalan kertas kepada teman di seberang meja',
      'Tertidur di atas meja saat guru sedang berbicara',
    ],
    'Memperhatikan penjelasan guru menunjukkan rasa hormat dan membantu kita memahami pelajaran dengan baik.'
  ),
  q(
    'rs_3',
    'rules_at_school',
    'Aturan di Sekolah',
    'Hari ini adalah jadwal regu piket Siti untuk membersihkan kelas setelah bel pulang berbunyi. Teman-teman lain mengajak Siti untuk langsung pulang bermain layang-layang.',
    'Keputusan terbaik apa yang sebaiknya Siti ambil?',
    'Menyelesaikan tugas piket menyapu kelas terlebih dahulu bersama regunya',
    [
      'Langsung kabur pulang dan membiarkan teman piket yang lain bekerja sendirian',
      'Menyembunyikan sapu agar teman regu piket tidak bisa menyapu',
      'Membayar teman lain untuk menggantikan tugas piketnya',
    ],
    'Menepati tugas piket kelas mencerminkan tanggung jawab dan kerja sama yang adil antarsesama murid.'
  ),
  q(
    'rs_4',
    'rules_at_school',
    'Aturan di Sekolah',
    'Di kantin sekolah saat jam istirahat, barisan antrean membeli bakso cukup panjang. Tiba-tiba seorang siswa kelas 4 datang dan langsung menyerobot berdiri di depan Made.',
    'Bagaimana sikap Made yang paling baik dan sesuai aturan budaya antre?',
    'Menegur dengan ramah dan memintanya antre dengan tertib dari barisan paling belakang',
    [
      'Mendorong siswa tersebut dengan keras hingga kuahnya tumpah',
      'Ikut-ikutan menyerobot orang lain di depannya agar tidak mau kalah',
      'Menangis keras-keras dan memukul meja penjual kantin',
    ],
    'Budaya antre melatih kesabaran dan keadilan bagi semua yang sudah menunggu giliran terlebih dahulu.'
  ),
  q(
    'rs_5',
    'rules_at_school',
    'Aturan di Sekolah',
    'Rina tiba di sekolah setiap hari selalu setelah bel masuk berbunyi dan guru sudah mulai mengajar.',
    'Masalah apa yang paling mungkin terjadi jika Rina terus mengabaikan aturan jam masuk sekolah?',
    'Ketinggalan materi pelajaran penting di awal jam dan mengganggu konsentrasi teman sekelas',
    [
      'Mendapatkan piala penghargaan sebagai siswa teladan',
      'Badan Rina menjadi lebih sehat dan bugar secara ajaib',
      'Guru akan memberikan nilai tertinggi di kelas',
    ],
    'Keterlambatan merugikan diri sendiri karena tertinggal pelajaran dan memecah kekhidmatan kelas saat berdoa.'
  ),
  q(
    'rs_6',
    'rules_at_school',
    'Aturan di Sekolah',
    'Hari Senin adalah jadwal pelaksanaan upacara bendera di lapangan sekolah.',
    'Kelengkapan apa yang wajib dikenakan murid sesuai tata tertib upacara?',
    'Seragam putih merah lengkap dengan topi, dasi, ikat pinggang, dan sepatu hitam',
    [
      'Baju kaos santai tanpa topi dan memakai sandal jepit',
      'Pakaian tidur karena upacara diadakan pagi hari',
      'Topi pantai dan kacamata hitam yang mencolok',
    ],
    'Mengenakan seragam lengkap saat upacara bendera adalah wujud disiplin dan penghormatan kepada bendera merah putih.'
  ),
  q(
    'rs_7',
    'rules_at_school',
    'Aturan di Sekolah',
    'Bagas meminjam buku ensiklopedia dari perpustakaan sekolah. Batas pengembalian buku adalah hari ini.',
    'Apa tindakan yang bertanggung jawab yang harus Bagas lakukan?',
    'Mengembalikan buku tepat waktu dalam keadaan bersih dan tidak robek',
    [
      'Menyimpan buku tersebut di rumah selamanya dan tidak mengembalikannya',
      'Mencoret-coret halaman buku ensiklopedia dengan spidol warna',
      'Menyobek gambar di dalam buku untuk dijadikan hiasan kamar',
    ],
    'Menjaga dan mengembalikan buku perpustakaan tepat waktu memberi kesempatan bagi murid lain untuk ikut membaca.'
  ),
  q(
    'rs_8',
    'rules_at_school',
    'Aturan di Sekolah',
    'Saat jam pelajaran berlangsung, Doni ingin izin pergi ke toilet sekolah.',
    'Bagaimana tata krama yang benar saat meminta izin keluar kelas?',
    'Mengacungkan tangan dengan sopan dan meminta izin kepada guru yang sedang mengajar',
    [
      'Langsung berlari kencang keluar pintu kelas tanpa berbicara sepatah kata pun',
      'Berteriak sekeras mungkin dari bangku belakang kelas',
      'Melompati jendela kelas saat guru sedang menoleh ke papan tulis',
    ],
    'Meminta izin dengan sopan adalah tata krama dasar menghormati guru dan menjaga ketertiban kelas.'
  ),
];

// 4. Rules in Society & Neighborhood (Aturan di Lingkungan Sekitar & Warga RT/RW)
const rulesInSocietyQuestions: Question[] = [
  q(
    'soc_1',
    'rules_in_society',
    'Aturan di Lingkungan Warga',
    'Hari Minggu pagi diadakan kerja bakti membersihkan selokan di lingkungan tempat tinggal Budi.',
    'Sebagai anak kelas 4 SD, apa tindakan peduli yang dapat Budi lakukan untuk membantu warga?',
    'Membantu menyapu daun kering dan mengumpulkan sampah plastik ke wadah sampah',
    [
      'Mengunci pintu kamar dan pura-pura tidur agar tidak diajak kerja bakti',
      'Bermain bola di jalanan yang sedang dibersihkan oleh bapak-bapak warga',
      'Melempar sampah batu ke dalam selokan yang baru saja dibersihkan',
    ],
    'Anak-anak dapat ikut gotong royong sesuai kemampuannya untuk menumbuhkan rasa cinta lingkungan.'
  ),
  q(
    'soc_2',
    'rules_in_society',
    'Aturan di Lingkungan Warga',
    'Saat bermain sepeda di gang perumahan, Edo berpapasan dengan Pak RT yang sedang berjalan kaki.',
    'Sikap sopan santun apa yang sebaiknya ditunjukkan oleh Edo?',
    'Memperlambat laju sepeda, tersenyum, dan menyapa Pak RT dengan ramah',
    [
      'Mengebut kencang sambil membunyikan bel di dekat telinga Pak RT',
      'Memalingkan wajah ke tembok dan pura-pura tidak melihat Pak RT',
      'Menabrakkan sepeda ke pagar rumah tetangga',
    ],
    'Menyapa orang yang lebih tua saat berpapasan adalah cerminan norma kesopanan dan keramahan warga yang baik.'
  ),
  q(
    'soc_3',
    'rules_in_society',
    'Aturan di Lingkungan Warga',
    'Di dekat rumah Siti, ada tetangga yang baru saja melahirkan bayi yang sedang tidur siang.',
    'Apa yang sebaiknya dilakukan Siti dan teman-temannya saat hendak bermain bersama?',
    'Bermain permainan yang tenang atau berpindah ke lapangan yang jauh dari rumah bayi tersebut',
    [
      'Berteriak-teriak dan membunyikan peluit di depan jendela rumah bayi',
      'Menggedor-gedor pagar rumah tetangga tersebut berulang kali',
      'Menyalakan kembang api di jalan sempit depan rumah warga',
    ],
    'Tenggang rasa dan menghargai hak istirahat tetangga menciptakan kerukunan hidup bermasyarakat.'
  ),
  q(
    'soc_4',
    'rules_in_society',
    'Aturan di Lingkungan Warga',
    'Di taman bermain kampung terdapat fasilitas ayunan dan jungkat-jungkit untuk anak-anak.',
    'Tindakan mana yang menunjukkan tanggung jawab merawat fasilitas umum warga?',
    'Menggunakan ayunan secara wajar, bergiliran, dan tidak merusak rantai ayunan',
    [
      'Mencoret-coret tiang ayunan menggunakan cat semprot atau pisau',
      'Berdiri di atas ayunan dan mengayunkannya hingga berputar terbalik',
      'Menguasai ayunan seharian penuh dan melarang anak lain memakainya',
    ],
    'Fasilitas umum adalah milik bersama yang harus dijaga agar awet dan bisa dinikmati oleh semua anak.'
  ),
  q(
    'soc_5',
    'rules_in_society',
    'Aturan di Lingkungan Warga',
    'Warga desa memasang papan peringatan: "Dilarang Membuang Sampah ke Sungai atau Selokan".',
    'Mengapa aturan ini sangat penting bagi keselamatan seluruh warga desa?',
    'Mencegah terjadinya banjir saat musim hujan dan menjaga air tidak tercemar kuman',
    [
      'Supaya ikan di sungai tidak menjadi terlalu kenyang',
      'Agar warga harus membeli sampah dari desa tetangga',
      'Supaya air sungai berubah warna menjadi hitam pekat',
    ],
    'Membuang sampah ke sungai menyumbat aliran air, memicu banjir, dan mencemari sumber air warga.'
  ),
  q(
    'soc_6',
    'rules_in_society',
    'Aturan di Lingkungan Warga',
    'Dayu sedang memakan buah pisang saat berjalan kaki di trotoar jalan kampung.',
    'Apa yang sebaiknya Dayu lakukan terhadap kulit pisang tersebut?',
    'Menyimpannya terlebih dahulu dan membuangnya saat menemukan tempat sampah',
    [
      'Melempar kulit pisang ke tengah jalan raya agar terlindas mobil',
      'Menaruh kulit pisang di depan pintu rumah tetangga',
      'Membuang kulit pisang ke selokan air yang mengalir pelan',
    ],
    'Kulit pisang yang dibuang sembarangan di jalan bisa membuat pejalan kaki terpeleset dan celaka.'
  ),
];

// 5. Disciplined Behavior (Perilaku Disiplin, Tanggung Jawab & Kejujuran)
const disciplinedBehaviorQuestions: Question[] = [
  q(
    'db_1',
    'disciplined_behavior',
    'Perilaku Disiplin & Tanggung Jawab',
    'Ibu guru memberikan PR matematika yang harus dikumpulkan besok pagi. Di TV sedang tayang film seru.',
    'Tindakan mana yang mencerminkan sikap disiplin dan mandiri?',
    'Mengerjakan dan menyelesaikan PR terlebih dahulu sebelum menonton TV',
    [
      'Menonton film sampai larut malam lalu meminta ayah yang mengerjakan PR-nya',
      'Berangkat pagi-pagi ke sekolah hanya untuk menyontek jawaban teman',
      'Tidak mengerjakan PR dan beralasan bukunya hilang dimakan ayam',
    ],
    'Disiplin belajar berarti mendahulukan kewajiban tugas sekolah sebelum bersenang-senang.'
  ),
  q(
    'db_2',
    'disciplined_behavior',
    'Perilaku Disiplin & Tanggung Jawab',
    'Saat bermain bola di halaman rumah, tendangan Beni tidak sengaja memecahkan pot bunga milik ibu.',
    'Sikap ksatria dan jujur apa yang sebaiknya Beni tunjukkan kepada ibu?',
    'Mengakui kesalahan dengan jujur, meminta maaf, dan membantu membersihkan pecahan pot',
    [
      'Menyalahkan adik kecil yang sedang tidur di dalam kamar',
      'Melarikan diri ke rumah teman dan berpura-pura tidak tahu apa yang terjadi',
      'Menyembunyikan pecahan pot bunga di bawah timbunan pasir',
    ],
    'Mengakui kesalahan dengan jujur dan berani bertanggung jawab adalah tanda anak yang berkarakter mulia.'
  ),
  q(
    'db_3',
    'disciplined_behavior',
    'Perilaku Disiplin & Tanggung Jawab',
    'Lani menemukan uang pecahan Rp10.000 terjatuh di lantai depan meja guru saat kelas kosong.',
    'Apa tindakan paling terpuji dan jujur yang sebaiknya Lani lakukan?',
    'Menyerahkan uang tersebut kepada bapak/ibu guru untuk diumumkan pemiliknya',
    [
      'Segera memasukkan uang ke kantong celana dan jajan di kantin sekolah',
      'Membagi uang tersebut kepada teman sebangku agar tutup mulut',
      'Membuang uang tersebut ke tempat sampah',
    ],
    'Menyerahkan barang temuan kepada guru mencerminkan kejujuran dan amanah.'
  ),
  q(
    'db_4',
    'disciplined_behavior',
    'Perilaku Disiplin & Tanggung Jawab',
    'Galang lupa menyiapkan buku pelajaran sesuai jadwal hari esok sebelum pergi tidur. Pagi harinya Galang terburu-buru dan ada buku tugas yang tertinggal di rumah.',
    'Solusi terbaik agar peristiwa tersebut tidak terulang lagi adalah...',
    'Membiasakan diri menata buku dan seragam sekolah setiap malam sebelum tidur',
    [
      'Menyalahkan orang tua karena tidak memasukkan buku ke dalam tasnya',
      'Tidak usah membawa tas sekolah lagi selamanya',
      'Meminta guru untuk menghapus pelajaran yang bukunya tertinggal',
    ],
    'Menyiapkan perlengkapan sekolah sejak malam hari mencegah kelupaan dan ketergesa-gesaan di pagi hari.'
  ),
  q(
    'db_5',
    'disciplined_behavior',
    'Perilaku Disiplin & Tanggung Jawab',
    'Saat ujian harian berlangsung, pengawas sedang keluar ruangan sebentar. Teman di samping Fitri menawarkan contekan kunci jawaban soal ujian.',
    'Keputusan berintegritas apa yang sebaiknya Fitri ambil?',
    'Menolak dengan santun dan tetap percaya diri mengerjakan ujian dengan jujur',
    [
      'Menerima contekan tersebut agar mendapat nilai seratus tanpa perlu belajar',
      'Menyebarkan contekan kepada seluruh teman di dalam kelas',
      'Meminta bayaran kepada teman yang menawarkan contekan',
    ],
    'Kejujuran saat ujian jauh lebih berharga daripada nilai tinggi yang diperoleh dengan cara curang.'
  ),
];

// 6. Consequences of Breaking Rules (Akibat Melanggar Aturan: Fakta, Analisis & Logika)
const consequencesQuestions: Question[] = [
  q(
    'cq_1',
    'consequences_of_breaking_rules',
    'Akibat Melanggar Aturan',
    'Seorang pejalan kaki nekat menyeberang di jalan raya yang padat kendaraan tanpa menggunakan zebra cross.',
    'Bahaya terbesar apa yang dapat menimpa pejalan kaki tersebut?',
    'Tertabrak kendaraan bermotor yang melaju kencang dan membahayakan nyawa',
    [
      'Mendapatkan hadiah pujian dari polisi lalu lintas di pos penjagaan',
      'Kendaraan di jalan akan langsung terbang melompati dirinya',
      'Jalan raya akan langsung berubah menjadi jalan tol sepi',
    ],
    'Zebra cross dan jembatan penyeberangan dibuat khusus untuk melindungi keselamatan pejalan kaki saat menyeberang.'
  ),
  q(
    'cq_2',
    'consequences_of_breaking_rules',
    'Akibat Melanggar Aturan',
    'Seorang anak sering begadang bermain game hingga pukul 12 malam setiap hari.',
    'Masalah kesehatan apa yang paling mungkin dialami anak tersebut?',
    'Mata menjadi lelah, badan lemas, sulit berkonsentrasi di sekolah, dan mudah sakit',
    [
      'Daya tahan tubuh meningkat dua kali lipat seperti pahlawan super',
      'Tinggi badan akan bertambah 10 centimeter setiap malam',
      'Nilai ujian matematika otomatis menjadi juara satu di kelas',
    ],
    'Kurang tidur di malam hari merusak kesehatan tubuh dan menurunkan daya pikir anak saat belajar di sekolah.'
  ),
  q(
    'cq_3',
    'consequences_of_breaking_rules',
    'Akibat Melanggar Aturan',
    'Jika para pengendara sepeda motor nekat menaiki trotoar pejalan kaki saat jalan raya macet.',
    'Akibat buruk apa yang langsung dirasakan oleh pejalan kaki?',
    'Hak pejalan kaki terampas dan pejalan kaki merasa terancam bahaya tertabrak',
    [
      'Pejalan kaki akan merasa senang karena trotoar menjadi semakin ramai',
      'Trotoar jalan akan menjadi semakin lebar dan bersih',
      'Semua pengendara motor akan mendapatkan hadiah bensin gratis',
    ],
    'Trotoar adalah hak khusus pejalan kaki yang tidak boleh diserobot oleh kendaraan bermotor jenis apa pun.'
  ),
  q(
    'cq_4',
    'consequences_of_breaking_rules',
    'Akibat Melanggar Aturan',
    'Di dalam laboratorium komputer sekolah, terdapat aturan: "Dilarang Membawa Makanan dan Minuman ke Dekat Komputer".',
    'Apa akibat yang bisa terjadi jika murid melanggar aturan tersebut dan menumpahkan air minum?',
    'Air tumpah bisa merusak komponen komputer dan memicu korsleting listrik yang berbahaya',
    [
      'Komputer akan bekerja lebih cepat dan layarnya menjadi lebih terang',
      'Guru komputer akan berterima kasih karena komputer diberi minum',
      'Kabel komputer akan berubah warna menjadi pelangi',
    ],
    'Cairan yang mengenai alat elektronik dapat merusak sistem dan membahayakan keselamatan pengguna.'
  ),
  q(
    'cq_5',
    'consequences_of_breaking_rules',
    'Akibat Melanggar Aturan',
    'Jika seluruh murid di kelas tidak mau melaksanakan jadwal piket kebersihan kelas.',
    'Kondisi apa yang akan terjadi pada ruang kelas setelah beberapa hari?',
    'Kelas menjadi kotor, berbau apek, sarang kuman penyakit, dan tidak nyaman untuk belajar',
    [
      'Ruang kelas akan menjadi bersih mengkilap dengan sendirinya',
      'Guru akan memberikan libur tambahan selama satu bulan',
      'Meja dan kursi kelas akan tertata rapi secara ajaib',
    ],
    'Tanpa kerja sama piket rutin, ruangan bersama akan cepat rusak dan kotor mengganggu kesehatan.'
  ),
];

// 7. HOTS Civic Dilemma Cases (Kasus Dilema Moral & Pemecahan Masalah Kelas 4)
const hotsCivicQuestions: Question[] = [
  q(
    'hots_1',
    'hots_civic_cases',
    'Dilema Kasus Nyata (HOTS)',
    'Saat sedang belajar kelompok di kelas, suasana menjadi sangat berisik karena beberapa teman saling berdebat tentang tugas poster.',
    'Tindakan apa yang dapat membantu kelompok menyelesaikan tugas dengan baik dan tertib?',
    'Menunjuk satu orang memimpin musyawarah dan membagi tugas secara adil dengan suara tenang',
    [
      'Ikut berteriak lebih kencang agar suaranya bisa mengalahkan teman-teman lain',
      'Meninggalkan kelompok dan bermain sendiri di luar ruangan kelas',
      'Menyobek kertas tugas kelompok karena merasa kesal dengan perdebatan',
    ],
    'Musyawarah yang tenang dan pembagian tugas yang adil adalah kunci menyelesaikan kerja kelompok dengan sukses.'
  ),
  q(
    'hots_2',
    'hots_civic_cases',
    'Dilema Kasus Nyata (HOTS)',
    'Di halte bus kota yang padat, seorang kakek tua yang membawa tongkat berdiri kesulitan menjaga keseimbangan di samping kursi Made.',
    'Apa tindakan yang mencerminkan pengamalan sila kedua Pancasila: Kemanusiaan yang Adil dan Beradab?',
    'Segera berdiri dengan sopan dan mempersilakan kakek tersebut duduk di kursinya',
    [
      'Pura-pura memejamkan mata dan tidur agar tidak diminta mengalah',
      'Menyuruh kakek tersebut duduk di lantai halte yang kotor berdebu',
      'Melihat ke arah lain dan tidak memedulikan keadaan kakek tersebut',
    ],
    'Memberikan kursi prioritas kepada lansia menunjukkan rasa hormat, empati, dan kepedulian sosial.'
  ),
  q(
    'hots_3',
    'hots_civic_cases',
    'Dilema Kasus Nyata (HOTS)',
    'Rina melihat seorang anak mencoret-coret bangku taman bermain dengan spidol permanen hitam.',
    'Langkah bijak apa yang sebaiknya Rina lakukan sebagai warga cilik yang peduli lingkungan?',
    'Mengingatkan anak tersebut dengan sopan bahwa fasilitas taman adalah milik bersama yang harus dijaga',
    [
      'Ikut meminjam spidol untuk menuliskan nama Rina di tiang ayunan',
      'Mendorong anak tersebut ke rumput dan mengajaknya berkelahi',
      'Menonton sambil menertawakan coretan yang merusak fasilitas',
    ],
    'Menegur dengan santun dan berani melindungi fasilitas bersama mencegah perusakan lingkungan umum.'
  ),
  q(
    'hots_4',
    'hots_civic_cases',
    'Dilema Kasus Nyata (HOTS)',
    'Edo membawa bekal kue lezat ke sekolah. Saat jam istirahat, ia melihat temannya yang tidak membawa bekal tampak lapar duduk sendiri.',
    'Tindakan terpuji mana yang menunjukkan nilai kepedulian dan kebersamaan antarteman?',
    'Menghampiri temannya dan dengan ikhlas membagikan sebagian kue bekalnya untuk dimakan bersama',
    [
      'Memakan kue di depan temannya sambil memamerkan kelezatannya',
      'Menjual sepotong kue kepada temannya dengan harga yang sangat mahal',
      'Menyembunyikan kue di tas agar temannya tidak melihat',
    ],
    'Berbagi bekal dengan teman yang membutuhkan mempererat tali persahabatan dan kerukunan antarsiswa.'
  ),
  q(
    'hots_5',
    'hots_civic_cases',
    'Dilema Kasus Nyata (HOTS)',
    'Saat bermain kelereng bersama, Aldi melihat Made tidak sengaja menyentuh garis batas yang menurut aturan permainan dianggap gugur.',
    'Made tidak menyadari hal itu. Apa tindakan jujur yang sebaiknya Aldi lakukan?',
    'Memberitahukan hal itu kepada Made dengan ramah dan tetap menjunjung sportivitas permainan',
    [
      'Memarahi Made di depan semua orang dan menuduhnya curang',
      'Diam saja tetapi membalas berbuat curang di putaran berikutnya',
      'Mengambil seluruh kelereng Made lalu kabur pulang ke rumah',
    ],
    'Sportivitas dan kejujuran dalam bermain jauh lebih penting dan membanggakan daripada sekadar menang bermain.'
  ),
];

// Combine all questions
export const ALL_QUESTIONS: Question[] = [
  ...meaningOfRulesQuestions,
  ...rulesAtHomeQuestions,
  ...rulesAtSchoolQuestions,
  ...rulesInSocietyQuestions,
  ...disciplinedBehaviorQuestions,
  ...consequencesQuestions,
  ...hotsCivicQuestions,
];

// Question Session Manager with dynamic option randomization
export class QuestionSessionManager {
  private usedQuestionIds: Set<string> = new Set();

  public getNextQuestion(category?: QuestionCategory): Question {
    let candidates = ALL_QUESTIONS.filter((q) => !this.usedQuestionIds.has(q.id));

    if (category) {
      const categoryCandidates = candidates.filter((q) => q.category === category);
      if (categoryCandidates.length > 0) {
        candidates = categoryCandidates;
      }
    }

    // Reset if all used
    if (candidates.length === 0) {
      this.usedQuestionIds.clear();
      candidates = category ? ALL_QUESTIONS.filter((q) => q.category === category) : ALL_QUESTIONS;
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const selected = candidates[randomIndex];
    this.usedQuestionIds.add(selected.id);

    // Shuffle options dynamically so correct answer is NOT predictable!
    return shuffleQuestionOptions(selected);
  }

  public getRandomQuestion(category?: QuestionCategory): Question {
    return this.getNextQuestion(category);
  }

  public resetSession() {
    this.usedQuestionIds.clear();
  }

  public getQuestionsCount(): { total: number; byCategory: Record<QuestionCategory, number> } {
    const byCat: Record<QuestionCategory, number> = {
      meaning_of_rules: 0,
      rules_at_home: 0,
      rules_at_school: 0,
      rules_in_society: 0,
      disciplined_behavior: 0,
      consequences_of_breaking_rules: 0,
      hots_civic_cases: 0,
    };

    ALL_QUESTIONS.forEach((item) => {
      byCat[item.category] = (byCat[item.category] || 0) + 1;
    });

    return {
      total: ALL_QUESTIONS.length,
      byCategory: byCat,
    };
  }
}

export const questionManager = new QuestionSessionManager();
export const questionSessionManager = questionManager;
