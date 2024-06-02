/**
 * Provides constants for time values (in milliseconds).
 */
export enum Times {
  Second = 1000,
  Minute = Times.Second * 60,
  Hour = Times.Minute * 60,
  Day = Times.Hour * 24,
  Week = Times.Day * 7,
}
