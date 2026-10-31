const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const SHORT_MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

const DAY_NAMES = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentTimeString(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatTanggalIndo(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayName = DAY_NAMES[date.getDay()];
    const monthName = MONTH_NAMES[month - 1];
    return `${dayName}, ${day} ${monthName} ${year}`;
  } catch {
    return dateStr;
  }
}

export function formatTanggalRelatif(dateStr: string): string {
  const today = getTodayDateString();
  if (dateStr === today) {
    return 'Hari Ini';
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  if (dateStr === yStr) {
    return 'Kemarin';
  }

  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayName = DAY_NAMES[date.getDay()];
    const shortMonth = SHORT_MONTH_NAMES[month - 1];
    const currentYear = new Date().getFullYear();

    if (year === currentYear) {
      return `${dayName}, ${day} ${shortMonth}`;
    }
    return `${dayName}, ${day} ${shortMonth} ${year}`;
  } catch {
    return dateStr;
  }
}

export function formatBulanTahun(year: number, month: number): string {
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

export function getShortMonthName(month: number): string {
  return SHORT_MONTH_NAMES[month - 1] || '';
}

export function getFullMonthName(month: number): string {
  return MONTH_NAMES[month - 1] || '';
}
