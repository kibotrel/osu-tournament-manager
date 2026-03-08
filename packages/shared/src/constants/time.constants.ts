/**
 * Provides constants for time values (in milliseconds).
 */
export enum Time {
  Millisecond = 1,
  Second = 1000 * Time.Millisecond,
  Minute = 60 * Time.Second,
  Hour = 60 * Time.Minute,
  Day = 24 * Time.Hour,
  Week = 7 * Time.Day,
}
