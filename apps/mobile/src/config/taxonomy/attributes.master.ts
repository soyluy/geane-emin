export type AttributeValue = {
  code: string;   // Örn: "A1"
  label: string;  // Örn: "Bisiklet Yaka"
};

export type AttributeGroup = {
  code: string;        // Grup kodu (A, B, C, ... G1, G2, ...)
  label: string;       // Grup adı (TR)
  values: AttributeValue[];
};

export const ATTRIBUTE_GROUPS: AttributeGroup[] = [
  // A. YAKA TİPİ
  {
    code: "A",
    label: "YAKA TİPİ",
    values: [
      { code: "A1",  label: "Bisiklet Yaka" },
      { code: "A2",  label: "V Yaka" },
      { code: "A3",  label: "Hakim Yaka" },
      { code: "A4",  label: "Kare Yaka" },
      { code: "A5",  label: "Kayık Yaka" },
      { code: "A6",  label: "Halter Yaka" },
      { code: "A7",  label: "Degaje Yaka" },
      { code: "A8",  label: "Düğmeli Yaka" },
      { code: "A9",  label: "Fermuarlı Yaka" },
      { code: "A10", label: "Kapüşonlu Yaka" },
      { code: "A11", label: "Straplez" },
      { code: "A12", label: "Düşük Omuzlu" },
      { code: "A13", label: "Dik Yaka" },
      { code: "A14", label: "Omuz Açık Yaka" },
      { code: "A15", label: "Asimetrik Yaka" },
      { code: "A16", label: "Kravat Yaka" }
    ]
  },

  // B. KOL TİPİ / UZUNLUĞU
  {
    code: "B",
    label: "KOL TİPİ / UZUNLUĞU",
    values: [
      { code: "B1",  label: "Askılı" },
      { code: "B2",  label: "Kolsuz" },
      { code: "B3",  label: "Düşük Omuz (Off-Shoulder)" },
      { code: "B4",  label: "Kısa Kol" },
      { code: "B5",  label: "Yarım Kol" },
      { code: "B6",  label: "Üç Çeyrek Kol" },
      { code: "B7",  label: "Uzun Kol" },
      { code: "B8",  label: "Balon Kol" },
      { code: "B9",  label: "Yarasa Kol" },
      { code: "B10", label: "Volan Kol" },
      { code: "B11", label: "Pileli Kol" },
      { code: "B12", label: "Reglan Kol" },
      { code: "B13", label: "Manşetli Kol" },
      { code: "B14", label: "Transparan Kol" },
      { code: "B15", label: "Çan Kol" },
      { code: "B16", label: "Katmanlı Kol" },
      { code: "B17", label: "Dantel Kol" },
      { code: "B18", label: "Fırfırlı Kol" }
    ]
  },

  // C. PAÇA KESİMİ
  {
    code: "C",
    label: "PAÇA KESİMİ",
    values: [
      { code: "C1",  label: "Düz Paça" },
      { code: "C2",  label: "Dar Paça (Slim Fit)" },
      { code: "C3",  label: "Bol Paça" },
      { code: "C4",  label: "İspanyol Paça" },
      { code: "C5",  label: "Bilekte Biten" },
      { code: "C6",  label: "Manşetli Paça" },
      { code: "C7",  label: "Lastikli Paça" },
      { code: "C8",  label: "Yırtmaçlı Paça" },
      { code: "C9",  label: "Katlanabilir Paça" },
      { code: "C10", label: "Asimetrik Paça" },
      { code: "C11", label: "Püsküllü Paça" },
      { code: "C12", label: "Kesik Paça" },
      { code: "C13", label: "Kıvrımlı Paça" }
    ]
  },

  // D. BEL YÜKSEKLİĞİ
  {
    code: "D",
    label: "BEL YÜKSEKLİĞİ",
    values: [
      { code: "D1", label: "Yüksek Bel" },
      { code: "D2", label: "Orta Bel" },
      { code: "D3", label: "Normal Bel" },
      { code: "D4", label: "Düşük Bel" },
      { code: "D5", label: "Lastikli Bel" },
      { code: "D6", label: "Ayarlanabilir Bel" },
      { code: "D7", label: "Korse Bel" }
    ]
  },

  // E. BOY / UZUNLUK
  {
    code: "E",
    label: "BOY / UZUNLUK",
    values: [
      { code: "E1", label: "Kısa" },
      { code: "E2", label: "Orta" },
      { code: "E3", label: "Uzun" },
      { code: "E4", label: "Mini" },
      { code: "E5", label: "Midi" },
      { code: "E6", label: "Maksi" }
    ]
  },

  // F. KALIP / KESİM
  {
    code: "F",
    label: "KALIP / KESİM",
    values: [
      { code: "F1", label: "Düz Kesim" },
      { code: "F2", label: "Oversize" },
      { code: "F3", label: "Slim Fit" },
      { code: "F4", label: "Regular Fit" },
      { code: "F5", label: "Vücuda Oturan" },
      { code: "F6", label: "A Kesim (Elbise)" },
      { code: "F7", label: "Kloş (Elbise)" },
      { code: "F8", label: "Kalem Etek" },
      { code: "F9", label: "Balon Etek" }
    ]
  },

  // G. MATERYAL (Giyim)
  {
    code: "G",
    label: "MATERYAL",
    values: [
      { code: "G1",  label: "Pamuk" },
      { code: "G2",  label: "Polyester" },
      { code: "G3",  label: "Viskon" },
      { code: "G4",  label: "Keten" },
      { code: "G5",  label: "Yün" },
      { code: "G6",  label: "Kaşmir" },
      { code: "G7",  label: "Şifon" },
      { code: "G8",  label: "Saten" },
      { code: "G9",  label: "Kadife" },
      { code: "G10", label: "Tül" },
      { code: "G11", label: "Dantel" },
      { code: "G12", label: "Deri" },
      { code: "G13", label: "Süet" },
      { code: "G14", label: "Denim (Kot Kumaş)" },
      { code: "G15", label: "Triko" },
      { code: "G16", label: "Likra / Elastan" },
      { code: "G17", label: "İpek" },
      { code: "G18", label: "Organze" },
      { code: "G19", label: "Gabardin" },
      { code: "G20", label: "Polar / Peluş" },
      { code: "G21", label: "Akrilik" },
      { code: "G22", label: "Nubuk" },
      { code: "G23", label: "Neopren" },
      { code: "G24", label: "Medine İpeği (Tesettür için)" },
      { code: "G25", label: "Krep" },
      { code: "G26", label: "Jarse" },
      { code: "G27", label: "Kaşe" }
    ]
  },

  // G1. İÇ TABAN MATERYALİ (Ayakkabı)
  {
    code: "G1",
    label: "İÇ TABAN MATERYALİ (Ayakkabı için)",
    values: [
      { code: "G1", label: "Deri" },
      { code: "G2", label: "Suni Deri" },
      { code: "G3", label: "Tekstil" },
      { code: "G4", label: "Ortopedik" },
      { code: "G5", label: "Kauçuk" },
      { code: "G6", label: "Jel Taban" }
    ]
  },

  // G2. DIŞ TABAN MATERYALİ (Ayakkabı)
  {
    code: "G2",
    label: "DIŞ TABAN MATERYALİ (Ayakkabı için)",
    values: [
      { code: "G1", label: "Termo" },
      { code: "G2", label: "Poliüretan (PU)" },
      { code: "G3", label: "Kauçuk" },
      { code: "G4", label: "Neolit" },
      { code: "G5", label: "PVC" }
    ]
  },

  // H. DESEN / BASKI / DOKU
  {
    code: "H",
    label: "DESEN / BASKI / DOKU",
    values: [
      { code: "H1",  label: "Düz / Desensiz" },
      { code: "H2",  label: "Çizgili" },
      { code: "H3",  label: "Ekose / Kareli" },
      { code: "H4",  label: "Puantiyeli" },
      { code: "H5",  label: "Çiçekli" },
      { code: "H6",  label: "Hayvan Deseni" },
      { code: "H7",  label: "Kamuflaj" },
      { code: "H8",  label: "Geometrik" },
      { code: "H9",  label: "Etnik" },
      { code: "H10", label: "Colorblock" },
      { code: "H11", label: "Yazı / Slogan" },
      { code: "H12", label: "Figür / Karakter" },
      { code: "H13", label: "Dijital Baskı" },
      { code: "H14", label: "Batik" },
      { code: "H15", label: "Tie Dye" },
      { code: "H16", label: "Payetli" },
      { code: "H17", label: "Simli / Işıltılı" },
      { code: "H18", label: "Nakışlı" },
      { code: "H19", label: "İşlemeli" },
      { code: "H20", label: "Jakarlı" },
      { code: "H21", label: "Örgü Deseni" },
      { code: "H22", label: "Logolu" },
      { code: "H23", label: "Soyut" },
      { code: "H24", label: "Retro" },
      { code: "H25", label: "Minimal" }
    ]
  },

  // I. KAPAMA ŞEKLİ
  {
    code: "I",
    label: "KAPAMA ŞEKLİ",
    values: [
      { code: "I1",  label: "Düğmeli" },
      { code: "I2",  label: "Fermuarlı" },
      { code: "I3",  label: "Bağlamalı" },
      { code: "I4",  label: "Cırt Cırtlı" },
      { code: "I5",  label: "Kopçalı" },
      { code: "I6",  label: "Halka Geçirmeli" },
      { code: "I7",  label: "Toka" },
      { code: "I8",  label: "Lastikli" },
      { code: "I9",  label: "Klipsli" },
      { code: "I10", label: "Mandallı Metal" },
      { code: "I11", label: "Kapamasız" },
      { code: "I12", label: "Gizli Fermuar" },
      { code: "I13", label: "Yan Fermuar" },
      { code: "I14", label: "Önden Fermuar / Düğme" },
      { code: "I15", label: "Arka Fermuar / Düğme" }
    ]
  },

  // J. DETAYLAR
  {
    code: "J",
    label: "DETAYLAR",
    values: [
      { code: "J1",  label: "Cep" },
      { code: "J2",  label: "Dekoratif Düğme" },
      { code: "J3",  label: "Fırfır / Volan" },
      { code: "J4",  label: "Büzgü" },
      { code: "J5",  label: "Drape" },
      { code: "J6",  label: "Astar" },
      { code: "J7",  label: "Biye" },
      { code: "J8",  label: "Metal Aksesuar" },
      { code: "J9",  label: "Dantel Detay" },
      { code: "J10", label: "Transparan" },
      { code: "J11", label: "Kapüşon" },
      { code: "J12", label: "Kemer / Kuşak" },
      { code: "J13", label: "Omuz Vatkası" },
      { code: "J14", label: "Payet" },
      { code: "J15", label: "Taş İşleme" },
      { code: "J16", label: "Nakış" },
      { code: "J17", label: "Katmanlı Yapı" },
      { code: "J18", label: "File / Mesh" },
      { code: "J19", label: "Göğüs Desteği" },
      { code: "J20", label: "Çıtçıt" },
      { code: "J21", label: "Yırtmaç" },
      { code: "J22", label: "Kürk Detay" },
      { code: "J23", label: "Ek Parça / Blok" }
    ]
  },

  // K. KULLANIM AMACI / ORTAM
  {
    code: "K",
    label: "KULLANIM AMACI / ORTAM",
    values: [
      { code: "K1",  label: "Günlük Kullanım" },
      { code: "K2",  label: "Ofis / İş Hayatı" },
      { code: "K3",  label: "Özel Gün / Davet" },
      { code: "K4",  label: "Tatil / Resort" },
      { code: "K5",  label: "Spor / Aktif Yaşam" },
      { code: "K6",  label: "Kamp / Outdoor" },
      { code: "K7",  label: "Ev Giyimi" },
      { code: "K8",  label: "Uyku Giyimi" },
      { code: "K9",  label: "Plaj / Deniz Kenarı" },
      { code: "K10", label: "Gece Hayatı" },
      { code: "K11", label: "Parti Giyimi" },
      { code: "K12", label: "Mezuniyet / Balo" },
      { code: "K13", label: "Nişan / Düğün" },
      { code: "K14", label: "Abiye / Davet Giyimi" }
    ]
  },

  // L. STİL / TARZ / AKIM / İLGİ ALANI / MODA TRENDLERİ
  {
    code: "L",
    label: "STİL / TARZ / AKIM / İLGİ ALANI / MODA TRENDLERİ",
    values: [
      { code: "L1",  label: "Klasik" },
      { code: "L2",  label: "Modern" },
      { code: "L3",  label: "Bohem" },
      { code: "L4",  label: "Vintage" },
      { code: "L5",  label: "Y2K" },
      { code: "L6",  label: "Minimalist" },
      { code: "L7",  label: "Feminen" },
      { code: "L8",  label: "Maskülen" },
      { code: "L9",  label: "Sportif" },
      { code: "L10", label: "Sokak Stili" },
      { code: "L11", label: "Grunge" },
      { code: "L12", label: "Goth" },
      { code: "L13", label: "Parisian Chic" },
      { code: "L14", label: "Preppy" },
      { code: "L15", label: "Romantik" },
      { code: "L16", label: "Country" },
      { code: "L17", label: "Academia" },
      { code: "L18", label: "Cottagecore" },
      { code: "L19", label: "Glam / Işıltılı" },
      { code: "L20", label: "Normcore" }
    ]
  },

  // M. UYGUNLUK (YAŞ, TESETTÜR, PREMIUM ALGISI)
  {
    code: "M",
    label: "UYGUNLUK (YAŞ, TESETTÜR, PREMIUM ALGISI)",
    values: [
      { code: "M1", label: "MY18-24" },
      { code: "M2", label: "MY25-34" },
      { code: "M3", label: "MY35+" },
      { code: "M4", label: "MT (Tesettür Uygun)" },
      { code: "M5", label: "MP (Premium Algı)" },
      { code: "M6", label: "MB (Büyük Beden Uygun)" },
      { code: "M7", label: "MC (Hamile / Emzirme Uygun)" },
      { code: "M8", label: "MÇ (Çocuk / Genç Uygun)" }
    ]
  },

  // N. ÖZEL GÜNLER / TEMALAR
  {
    code: "N",
    label: "ÖZEL GÜNLER / TEMALAR",
    values: [
      { code: "N1",  label: "Sevgililer Günü" },
      { code: "N2",  label: "8 Mart Kadınlar Günü" },
      { code: "N3",  label: "Anneler Günü" },
      { code: "N4",  label: "Bayram / Ramazan" },
      { code: "N5",  label: "Mezuniyet" },
      { code: "N6",  label: "Yılbaşı / Noel" },
      { code: "N7",  label: "Festival" },
      { code: "N8",  label: "Tatil" },
      { code: "N9",  label: "Düğün / Nişan" },
      { code: "N10", label: "Doğum Günü" },
      { code: "N11", label: "Hafta Sonu Planı" },
      { code: "N12", label: "Sezon Açılışı" },
      { code: "N13", label: "Back to School" },
      { code: "N14", label: "Ofis Kombinleri" }
    ]
  },

  // O. SEZON
  {
    code: "O",
    label: "SEZON",
    values: [
      { code: "O1", label: "İlkbahar" },
      { code: "O2", label: "Yaz" },
      { code: "O3", label: "Sonbahar" },
      { code: "O4", label: "Kış" },
      { code: "O5", label: "4 Mevsim" },
      { code: "O6", label: "Geçiş Mevsimi" }
    ]
  },

  // P. TOPUK TİPİ (Ayakkabı)
  {
    code: "P",
    label: "TOPUK TİPİ (Ayakkabı için)",
    values: [
      { code: "P1",  label: "İnce Topuk" },
      { code: "P2",  label: "Kalın Topuk" },
      { code: "P3",  label: "Dolgu Topuk" },
      { code: "P4",  label: "Platform" },
      { code: "P5",  label: "Düz Taban" },
      { code: "P6",  label: "Kısa Topuk" },
      { code: "P7",  label: "Stiletto" },
      { code: "P8",  label: "Kıvrımlı Topuk" },
      { code: "P9",  label: "Blok Topuk" },
      { code: "P10", label: "Taban Detaylı (Tırtıklı, Kaymaz vb.)" }
    ]
  },

  // Q. TOPUK YÜKSEKLİĞİ (Ayakkabı)
  {
    code: "Q",
    label: "TOPUK YÜKSEKLİĞİ (Ayakkabı için)",
    values: [
      { code: "Q1", label: "0–2 cm" },
      { code: "Q2", label: "3–5 cm" },
      { code: "Q3", label: "6–8 cm" },
      { code: "Q4", label: "9–11 cm" },
      { code: "Q5", label: "12+ cm" }
    ]
  },

  // R. ASKı TİPİ (Çanta)
  {
    code: "R",
    label: "ASKı TİPİ (Çanta için)",
    values: [
      { code: "R1", label: "Zincir Askı" },
      { code: "R2", label: "Deri Askı" },
      { code: "R3", label: "Ayarlanabilir Askı" },
      { code: "R4", label: "Tek Askı" },
      { code: "R5", label: "Çift Askı" },
      { code: "R6", label: "Kemer Tipi Askı" },
      { code: "R7", label: "Omuz Askısı" },
      { code: "R8", label: "El Askısı" }
    ]
  },

  // S. ASKı UZUNLUĞU (Çanta)
  {
    code: "S",
    label: "ASKı UZUNLUĞU (Çanta için)",
    values: [
      { code: "S1", label: "Kısa Askı (El Çantası)" },
      { code: "S2", label: "Orta Askı (Omuz Çantası)" },
      { code: "S3", label: "Uzun Askı (Postacı / Crossbody)" },
      { code: "S4", label: "Ayarlanabilir Askı" }
    ]
  },

  // T. TAŞIMA ŞEKLİ (Çanta)
  {
    code: "T",
    label: "TAŞIMA ŞEKLİ (Çanta için)",
    values: [
      { code: "T1", label: "El Taşıma" },
      { code: "T2", label: "Omuz Taşıma" },
      { code: "T3", label: "Sırt Taşıma" },
      { code: "T4", label: "Çapraz Taşıma" },
      { code: "T5", label: "Bel Taşıma" },
      { code: "T6", label: "Kol Altı Taşıma" }
    ]
  }
];

// ------------------------------------------------------
// Uyumluluk köprüsü (validator scripti beklenen exportlar)
// ------------------------------------------------------
export type AttributeCode =
  | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "G1" | "G2"
  | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T";

export type AttributeDef = {
  code: AttributeCode;
  name: string;
  type: "select";
  multi: boolean;
  values: { code: string; label: string; sort?: number }[];
};

export const ALL_ATTRIBUTES: AttributeDef[] = ATTRIBUTE_GROUPS.map((g) => ({
  code: g.code as AttributeCode,
  name: g.label,
  type: "select",
  multi: true,
  values: g.values.map((v, i) => ({ code: v.code, label: v.label, sort: i })),
}));

export default ATTRIBUTE_GROUPS;
