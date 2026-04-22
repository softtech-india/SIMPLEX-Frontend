export type DatePeriod =
  | 'today'
  | 'this_week'
  | 'this_month'
  | 'this_quarter'
  | 'last_6_months'
  | 'this_year'
  | 'financial_year'
  | 'custom';

export interface DateRange {
  fromDate: Date;
  toDate: Date;
  period: DatePeriod;
}