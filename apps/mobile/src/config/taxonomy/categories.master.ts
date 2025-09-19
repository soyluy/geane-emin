// mobile/src/config/taxonomy/categories.master.ts

export type AttributeCode =
  | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "G1" | "G2"
  | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T";

export interface CategoryNode {
  /** Asıl ID: senin verdiğin numara (örn. "1.3.2") */
  id: string;
  /** Görünen ad (TR) */
  name: string;
  /** Bu kategoride kullanılacak etiket başlıkları (A–T) */
  attributes: AttributeCode[];
  /** Alt kategoriler */
  children?: CategoryNode[];
}

export const CATEGORIES: CategoryNode = {
  id: "ROOT",
  name: "GEANE",
  attributes: [],
  children: [
    // =========================
    // 1. GİYİM
    // =========================
    {
      id: "1",
      name: "GİYİM",
      attributes: [],
      children: [
        // 1.1 Üst Giyim
        {
          id: "1.1",
          name: "Üst Giyim",
          attributes: [],
          children: [
            { id: "1.1.1",  name: "Tişört",            attributes: ["A","B","F","G","H"] },
            { id: "1.1.2",  name: "Gömlek",            attributes: ["A","B","F","G","H","E"] },
            { id: "1.1.3",  name: "Bluz",              attributes: ["A","B","F","G","H","E"] },
            { id: "1.1.4",  name: "Sweatshirt",        attributes: ["A","B","F","G","H"] },
            { id: "1.1.5",  name: "Kazak",             attributes: ["A","B","F","G","H"] },
            { id: "1.1.6",  name: "Hırka",             attributes: ["B","F","G"] },
            { id: "1.1.7",  name: "Atlet / Body",      attributes: ["A","B","G","I"] },
            { id: "1.1.8",  name: "Büstiyer",          attributes: ["G","J"] },
            { id: "1.1.9",  name: "Crop Üst",          attributes: ["A","B","F","G","H","E"] },
            { id: "1.1.10", name: "Büstiyer Takım",    attributes: ["A","B","E","F","G","I","J"] },
            { id: "1.1.11", name: "Korse",             attributes: ["G","I","J"] },
            { id: "1.1.12", name: "Süveter",           attributes: ["A","B","F","G","H"] }
          ]
        },

        // 1.2 Dış Giyim
        {
          id: "1.2",
          name: "Dış Giyim",
          attributes: [],
          children: [
            { id: "1.2.1",  name: "Ceket",                 attributes: ["A","B","F","G","I","J","E"] },
            { id: "1.2.2",  name: "Kot Ceket",             attributes: ["A","B","F","G","I","J","E"] },
            { id: "1.2.3",  name: "Mont",                  attributes: ["A","B","F","G","I","J","E"] },
            { id: "1.2.4",  name: "Kaban",                 attributes: ["A","B","F","G","I","J","E"] },
            { id: "1.2.5",  name: "Palto",                 attributes: ["A","B","F","G","I","J","E"] },
            { id: "1.2.6",  name: "Trençkot",              attributes: ["A","B","F","G","I","J","E"] },
            { id: "1.2.7",  name: "Yağmurluk / Rüzgarlık", attributes: ["A","B","F","G","I","J","E"] },
            { id: "1.2.8",  name: "Yelek",                 attributes: ["A","B","F","G","J"] },
            { id: "1.2.9",  name: "Deri Ceket",            attributes: ["A","B","F","G","I","J","E"] },
            { id: "1.2.10", name: "Bomber Ceket",          attributes: ["A","B","F","G","I","J","E"] },
            { id: "1.2.11", name: "Panço",                 attributes: ["A","B","F","G","J","E"] },
            { id: "1.2.12", name: "Kaftan",                attributes: ["A","B","F","G","J","E"] },
            { id: "1.2.13", name: "Bolero",                attributes: ["A","B","F","G","J","E"] },
            { id: "1.2.14", name: "Kimono",                attributes: ["A","B","F","G","J","E"] },
            { id: "1.2.15", name: "Parka",                 attributes: ["A","B","F","G","I","J","E"] }
          ]
        },

        // 1.3 Alt Giyim
        {
          id: "1.3",
          name: "Alt Giyim",
          attributes: [],
          children: [
            { id: "1.3.1", name: "Pantolon",                 attributes: ["C","D","F","G","H","I","J"] },
            { id: "1.3.2", name: "Kot Pantolon",             attributes: ["C","D","F","G","H","I","J"] },
            { id: "1.3.3", name: "Kumaş Pantolon",           attributes: ["C","D","F","G","H","I","J"] },
            { id: "1.3.4", name: "Tayt",                     attributes: ["E","F","G","H","I","J"] },
            { id: "1.3.5", name: "Şort",                     attributes: ["E","F","G","H","I","J"] },
            { id: "1.3.6", name: "Etek",                     attributes: ["E","F","G","H","I","J"] },
            { id: "1.3.7", name: "Pantolon Etek (Culotte)",  attributes: ["C","D","E","F","G","H","I","J"] },
            { id: "1.3.8", name: "Jogger",                   attributes: ["E","F","G","H","I","J"] }
          ]
        },

        // 1.4 Elbise / Tulum
        {
          id: "1.4",
          name: "Elbise / Tulum",
          attributes: [],
          children: [
            { id: "1.4.1", name: "Elbise",                   attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.4.2", name: "Abiye / Davet Elbisesi",   attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.4.3", name: "Günlük Elbise",            attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.4.4", name: "Triko Elbise",             attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.4.5", name: "Plaj Elbisesi",            attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.4.6", name: "Önlük Elbise",             attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.4.7", name: "Tulum",                    attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.4.8", name: "Salopet",                  attributes: ["A","B","E","F","G","H","I","J"] }
          ]
        },

        // 1.5 İç Giyim (Word'e birebir — 1.5.4 intentionally boş)
        {
          id: "1.5",
          name: "İç Giyim",
          attributes: [],
          children: [
            { id: "1.5.1", name: "Sütyen",            attributes: ["G","I","J"] },
            { id: "1.5.2", name: "Külot",             attributes: ["G","I","J"] },
            { id: "1.5.3", name: "Büstiyer / Bralet", attributes: ["G","I","J"] },
            // 1.5.4 boş bırakıldı (Word’e birebir)
            { id: "1.5.5", name: "Gecelik",           attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.5.6", name: "Sabahlık",          attributes: ["E","F","G","H","J"] },
            { id: "1.5.7", name: "Çorap / Jartiyer",  attributes: ["G","J"] },
            { id: "1.5.8", name: "İçlik",             attributes: ["E","F","G","H","I","J"] },
            { id: "1.5.9", name: "Fantezi İç Giyim",  attributes: ["G","I","J"] }
          ]
        },

        // 1.6 Ev Giyimi
        {
          id: "1.6",
          name: "Ev Giyimi",
          attributes: [],
          children: [
            { id: "1.6.1", name: "Pijama",   attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.6.2", name: "Gecelik",  attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.6.3", name: "Sabahlık", attributes: ["E","F","G","H","J"] }
          ]
        },

        // 1.7 Spor Giyim (Word'e birebir — 1.7.6 yok, 1.7.7 var)
        {
          id: "1.7",
          name: "Spor Giyim",
          attributes: [],
          children: [
            { id: "1.7.1", name: "Spor Sütyeni",           attributes: ["G","I","J"] },
            { id: "1.7.2", name: "Tayt / Koşu Pantolonu",  attributes: ["E","F","G","H","I","J"] },
            { id: "1.7.3", name: "Spor Tişört",            attributes: ["A","B","F","G","H"] },
            { id: "1.7.4", name: "Spor Şort",              attributes: ["E","F","G","H","I","J"] },
            { id: "1.7.5", name: "Eşofman Takımı",         attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.7.7", name: "Spor Atleti",            attributes: ["A","B","F","G","H","I"] }
          ]
        },

        // 1.8 Mayo / Plaj Giyim
        {
          id: "1.8",
          name: "Mayo / Plaj Giyim",
          attributes: [],
          children: [
            { id: "1.8.1", name: "Mayo",          attributes: ["G","I","J"] },
            { id: "1.8.2", name: "Bikini",        attributes: ["G","I","J"] },
            { id: "1.8.3", name: "Tankini",       attributes: ["G","I","J"] },
            { id: "1.8.4", name: "Mayokini",      attributes: ["G","I","J"] },
            { id: "1.8.5", name: "Haşema",        attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.8.6", name: "Plaj Elbisesi", attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.8.7", name: "Pareo",         attributes: ["E","F","G","H","J"] }
          ]
        },

        // 1.9 Tesettür Giyim
        {
          id: "1.9",
          name: "Tesettür Giyim",
          attributes: [],
          children: [
            { id: "1.9.1",  name: "Tesettür Elbise", attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.9.2",  name: "Ferace",          attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.9.3",  name: "Abaya",           attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.9.4",  name: "Kap / Pardesü",   attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.9.5",  name: "Tunik",           attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.9.6",  name: "Tesettür Gömlek", attributes: ["A","B","F","G","H","E"] },
            { id: "1.9.7",  name: "Pantolon / Etek", attributes: ["C","D","E","F","G","H","I","J"] },
            { id: "1.9.8",  name: "Şal / Eşarp",     attributes: ["G","J"] },
            { id: "1.9.9",  name: "Tesettür Mayo",   attributes: ["A","B","E","F","G","H","I","J"] },
            { id: "1.9.10", name: "Tesettür Abiye",  attributes: ["A","B","E","F","G","H","I","J"] }
          ]
        }
      ]
    },

    // =========================
    // 2. AYAKKABI
    // =========================
    {
      id: "2",
      name: "AYAKKABI",
      attributes: [],
      children: [
        { id: "2.1", name: "Topuklu Ayakkabı",   attributes: ["G2","H","J","Q"] },
        { id: "2.2", name: "Babet",              attributes: ["G2","H","J","Q"] },
        { id: "2.3", name: "Sandalet / Terlik",  attributes: ["G2","H","J","Q"] },
        { id: "2.4", name: "Spor Ayakkabı",      attributes: ["G2","H","J","Q"] },
        { id: "2.5", name: "Bot / Çizme",        attributes: ["G2","H","J","Q"] },
        { id: "2.6", name: "Günlük Ayakkabı",    attributes: ["G2","H","J","Q"] }
      ]
    },

    // =========================
    // 3. ÇANTA
    // =========================
    {
      id: "3",
      name: "ÇANTA",
      attributes: [],
      children: [
        { id: "3.1", name: "El Çantası",          attributes: ["G1","H","I","J","R","S","T"] },
        { id: "3.2", name: "Omuz Çantası",        attributes: ["G1","H","I","J","R","S","T"] },
        { id: "3.3", name: "Sırt Çantası",        attributes: ["G1","H","I","J","R","S","T"] },
        { id: "3.4", name: "Cüzdan",              attributes: ["G1","H","I","J"] },
        { id: "3.5", name: "Bez Çanta",           attributes: ["G1","H","I","J","R","S","T"] },
        { id: "3.6", name: "Tote Çanta",          attributes: ["G1","H","I","J","R","S","T"] },
        { id: "3.7", name: "Alışveriş Çantası",   attributes: ["G1","H","I","J","R","S","T"] }
      ]
    },

    // =========================
    // 4. TAKI / AKSESUAR
    // =========================
    {
      id: "4",
      name: "TAKI / AKSESUAR",
      attributes: [],
      children: [
        // 4.1 Takı
        {
          id: "4.1",
          name: "Takı",
          attributes: [],
          children: [
            { id: "4.1.1", name: "Kolye",     attributes: ["K","L","M","N","O"] },
            { id: "4.1.2", name: "Küpe",      attributes: ["K","L","M","N","O"] },
            { id: "4.1.3", name: "Bileklik",  attributes: ["K","L","M","N","O"] },
            { id: "4.1.4", name: "Yüzük",     attributes: ["K","L","M","N","O"] },
            { id: "4.1.5", name: "Saat",      attributes: ["K","L","M","N","O"] },
            { id: "4.1.6", name: "Halhal",    attributes: ["K","L","M","N","O"] },
            { id: "4.1.7", name: "Bel Zinciri", attributes: ["K","L","M","N","O"] }
          ]
        },

        // 4.2 Şapka / Bere / Eldiven / Atkı
        {
          id: "4.2",
          name: "Şapka / Bere / Eldiven / Atkı",
          attributes: [],
          children: [
            { id: "4.2.1", name: "Şapka",      attributes: ["G1","H","J"] },
            { id: "4.2.2", name: "Bere",       attributes: ["G1","H","J"] },
            { id: "4.2.3", name: "Eldiven",    attributes: ["G1","H","J"] },
            { id: "4.2.4", name: "Boyun Bağı", attributes: ["G1","H","J"] },
            { id: "4.2.5", name: "Atkı",       attributes: ["G1","H","J"] }
          ]
        },

        // 4.3 Kemer
        {
          id: "4.3",
          name: "Kemer",
          attributes: [],
          children: [
            { id: "4.3.1", name: "Spor Kemer",   attributes: ["G1","H","I","J"] },
            { id: "4.3.2", name: "Klasik Kemer", attributes: ["G1","H","I","J"] }
          ]
        },

        // 4.4 Saç Aksesuarları & Gözlük
        {
          id: "4.4",
          name: "Saç Aksesuarları & Gözlük",
          attributes: [],
          children: [
            { id: "4.4.1", name: "Toka",              attributes: ["G1","H","J"] },
            { id: "4.4.2", name: "Taç",               attributes: ["G1","H","J"] },
            { id: "4.4.3", name: "Saç Bandı",         attributes: ["G1","H","J"] },
            { id: "4.4.4", name: "Scrunchie",         attributes: ["G1","H","J"] },
            { id: "4.4.5", name: "Bone / Türban İçliği", attributes: ["G1","H","J"] },
            {
              id: "4.4.6",
              name: "Gözlük",
              attributes: [],
              children: [
                { id: "4.4.6.1", name: "Güneş Gözlüğü", attributes: ["K","L","M"] },
                { id: "4.4.6.2", name: "Optik Gözlük",  attributes: ["K","L","M"] }
              ]
            }
          ]
        }
      ]
    }
  ]
};
