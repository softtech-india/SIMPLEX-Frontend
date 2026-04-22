import { DatePeriod } from './types';

export function calculateDateRange(period: DatePeriod) {
  const now = new Date();
  let fromDate = new Date();
  let toDate = new Date();

  switch (period) {
    case 'today':
      fromDate = new Date(now.setHours(0, 0, 0, 0));
      toDate = new Date();
      break;

    case 'this_week': {
      const day = now.getDay(); // 0 = Sunday
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      fromDate = new Date(now.setDate(diff));
      fromDate.setHours(0, 0, 0, 0);
      toDate = new Date();
      break;
    }

    case 'this_month':
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      toDate = new Date();
      break;

    case 'this_quarter': {
      const quarter = Math.floor(now.getMonth() / 3);
      fromDate = new Date(now.getFullYear(), quarter * 3, 1);
      toDate = new Date();
      break;
    }

    case 'last_6_months':
      fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 6);
      toDate = new Date();
      break;

    case 'this_year':
      fromDate = new Date(now.getFullYear(), 0, 1);
      toDate = new Date();
      break;

    case 'financial_year': {
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const financialYearStartYear = currentMonth >= 3 ? currentYear : currentYear - 1;
      fromDate = new Date(financialYearStartYear, 3, 1);
      fromDate.setHours(0, 0, 0, 0);

      toDate = new Date();
      break;
    }

  }

  return { fromDate, toDate };
}