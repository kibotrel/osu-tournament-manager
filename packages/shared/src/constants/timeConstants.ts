/**
 * Provides constants for time values (in milliseconds).
 */
export enum Time {
  Second = 1000,
  Minute = Time.Second * 60,
  Hour = Time.Minute * 60,
  Day = Time.Hour * 24,
  Week = Time.Day * 7,
}
