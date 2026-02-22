/**
 * Provides constants for time values (in milliseconds).
 */
export enum Time {
  Second = 1000,
  Minute = 60 * Time.Second,
  Hour = 60 * Time.Minute,
  Day = 24 * Time.Hour,
  Week = 7 * Time.Day,
}
