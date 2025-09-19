// mobile/src/app/components/ui/DateOfBirthField.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import CenteredModal from './CenteredModal';
import Button from './Button';

type DobValue = {
  day: string;   // '01'..'31'
  month: string; // '01'..'12'
  year: string;  // minAge/maxAge'e göre üretilen yıl
};

type DobChange = DobValue & {
  iso: string;         // 'YYYY-MM-DD' veya ''
  isValid: boolean;
  age: number | null;
};

type Props = {
  value?: Partial<DobValue>;
  onChange?: (v: DobChange) => void;
  minAge?: number;  // default 13
  maxAge?: number;  // default 120
};

// Yardımcılar
function daysInMonth(year: number, month1to12: number) {
  return new Date(year, month1to12, 0).getDate();
}
function isValidDate(y: number, m: number, d: number) {
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y &&
    dt.getMonth() === m - 1 &&
    dt.getDate() === d
  );
}
function computeAge(y: number, m: number, d: number) {
  const now = new Date();
  let age = now.getFullYear() - y;
  const beforeBirthday =
    now.getMonth() + 1 < m ||
    (now.getMonth() + 1 === m && now.getDate() < d);
  if (beforeBirthday) age -= 1;
  return age;
}
function two(n: number | string) {
  return String(n).padStart(2, '0');
}

const TR_MONTHS: { label: string; value: string }[] = [
  { label: 'Ocak', value: '01' },
  { label: 'Şubat', value: '02' },
  { label: 'Mart', value: '03' },
  { label: 'Nisan', value: '04' },
  { label: 'Mayıs', value: '05' },
  { label: 'Haziran', value: '06' },
  { label: 'Temmuz', value: '07' },
  { label: 'Ağustos', value: '08' },
  { label: 'Eylül', value: '09' },
  { label: 'Ekim', value: '10' },
  { label: 'Kasım', value: '11' },
  { label: 'Aralık', value: '12' },
];

export default function DateOfBirthField({
  value,
  onChange,
  minAge = 13,
  maxAge = 120,
}: Props) {
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();

  // TextField ile aynı oranlar
  const HEIGHT_RATIO = 0.04184;             // %4.184 yükseklik
  const H_MARGIN_RATIO = 0.03953;           // %3.953 sol/sağ dış boşluk
  const INPUT_H = SCREEN_H * HEIGHT_RATIO;
  const H_MARGIN = SCREEN_W * H_MARGIN_RATIO;

  const [open, setOpen] = useState(false);

  // Seçili değerler (dış kutuda gösterilecek)
  const [day, setDay] = useState(value?.day ?? '');
  const [month, setMonth] = useState(value?.month ?? '');
  const [year, setYear] = useState(value?.year ?? '');

  // Modal içi geçici değerler (kullanıcı Onayla'ya basana dek)
  const [tmpDay, setTmpDay] = useState(day || '');
  const [tmpMonth, setTmpMonth] = useState(month || '');
  const [tmpYear, setTmpYear] = useState(year || '');

  // min/max yaşa göre yıl listesi
  const years = useMemo(() => {
    const now = new Date();
    const latestYear = now.getFullYear() - minAge;   // örn: 2025-13 = 2012
    const earliestYear = now.getFullYear() - maxAge; // örn: 2025-120 = 1905
    const arr: string[] = [];
    for (let y = latestYear; y >= earliestYear; y--) {
      arr.push(String(y));
    }
    return arr;
  }, [minAge, maxAge]);

  // Seçili ay/yıla göre gün listesi
  const days = useMemo(() => {
    const Y = parseInt(tmpYear || '2000', 10);
    const M = parseInt(tmpMonth || '1', 10);
    const dim = daysInMonth(Y, M);
    return Array.from({ length: dim }, (_, i) => two(i + 1));
  }, [tmpYear, tmpMonth]);

  // Onay butonuna basıldığında
  const handleConfirm = () => {
    // Geçerli mi?
    const d = parseInt(tmpDay || '0', 10);
    const m = parseInt(tmpMonth || '0', 10);
    const y = parseInt(tmpYear || '0', 10);

    let iso = '';
    let isValid = false;
    let age: number | null = null;

    if (y && m && d && isValidDate(y, m, d)) {
      age = computeAge(y, m, d);
      isValid = age >= minAge && age <= maxAge;
      if (isValid) {
        iso = `${y}-${two(m)}-${two(d)}`;
      }
    }

    // State'i kalıcı yap (dış kutu güncellensin)
    setDay(tmpDay);
    setMonth(tmpMonth);
    setYear(tmpYear);

    // Callbacks
    onChange?.({
      day: tmpDay || '',
      month: tmpMonth || '',
      year: tmpYear || '',
      iso,
      isValid,
      age,
    });

    setOpen(false);
  };

  // Modal açıldığında geçici değerleri senkronla
  const openModal = () => {
    setTmpDay(day || '');
    setTmpMonth(month || '');
    setTmpYear(year || '');
    setOpen(true);
  };

  // Kutu üzerinde gösterilecek metin
  const display = useMemo(() => {
    if (day && month && year) {
      return `${day}.${month}.${String(year).slice(-2)}`; // return  yıl formatını değiştirmek istiyorsan`${day}/${month}/${year}`;
    }
    return ''; // KONTEYNIR İÇ METNİ
  }, [day, month, year]);

  return (
    <>
      {/* Dışarıdaki sahte-TextField kutu (klavye açılmaz) */}
      <Pressable onPress={openModal} style={{ marginHorizontal: H_MARGIN }}>
        <View style={[styles.input, { height: INPUT_H }]}>
          <Text style={styles.inputText}>{display}</Text>
        </View>
      </Pressable>

      {/* Modal: Gün / Ay / Yıl seçimleri + Onayla */}
      <CenteredModal visible={open} onClose={() => setOpen(false)}>
        <View style={styles.modalWrap}>
          <Text style={styles.modalTitle}>Doğum Tarihini Seç</Text>

          <View style={styles.pickersRow}>
            {/* Gün */}
            <View style={styles.pickerCol}>
              <Text style={styles.colLabel}>Gün</Text>
              <ScrollView style={styles.list} showsVerticalScrollIndicator>
                {days.map((d) => (
                  <Pressable
                    key={d}
                    onPress={() => setTmpDay(d)}
                    style={[
                      styles.item,
                      tmpDay === d && styles.itemActive,
                    ]}
                  >
                    <Text style={[styles.itemText, tmpDay === d && styles.itemTextActive]}>
                      {d}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Ay */}
            <View style={styles.pickerCol}>
              <Text style={styles.colLabel}>Ay</Text>
              <ScrollView style={styles.list} showsVerticalScrollIndicator>
                {TR_MONTHS.map(({ label, value }) => (
                  <Pressable
                    key={value}
                    onPress={() => setTmpMonth(value)}
                    style={[
                      styles.item,
                      tmpMonth === value && styles.itemActive,
                    ]}
                  >
                    <Text style={[styles.itemText, tmpMonth === value && styles.itemTextActive]}>
                      {label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Yıl */}
            <View style={styles.pickerCol}>
              <Text style={styles.colLabel}>Yıl</Text>
              <ScrollView style={styles.list} showsVerticalScrollIndicator>
                {years.map((y) => (
                  <Pressable
                    key={y}
                    onPress={() => setTmpYear(y)}
                    style={[
                      styles.item,
                      tmpYear === y && styles.itemActive,
                    ]}
                  >
                    <Text style={[styles.itemText, tmpYear === y && styles.itemTextActive]}>
                      {y}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              mode="locked"
              lockedStyleType="primary" // F13957 kırmızı
              title="Onayla"
              onPress={handleConfirm}
            />
          </View>
        </View>
      </CenteredModal>
    </>
  );
}

const styles = StyleSheet.create({
  // TextField görünümü ile bire bir
  input: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  inputText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#000',
  },

  // Modal içi
  modalWrap: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
  },
  pickersRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  pickerCol: {
    flex: 1,
  },
  colLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 6,
    color: '#000',
    textAlign: 'center',
  },
  list: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  itemActive: {
    backgroundColor: 'rgba(241,57,87,0.12)', // F13957'in hafif tonu
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#000',
  },
  itemTextActive: {
    fontFamily: 'Inter_700Bold',
  },
  footer: {
    marginTop: 12,
  },
});
