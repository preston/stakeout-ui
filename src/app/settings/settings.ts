// Author: Preston Lee

export enum ThemeType {
  AUTOMATIC = 'automatic',
  LIGHT = 'light',
  DARK = 'dark',
}

export class Settings {
  public static readonly DEFAULT_THEME = ThemeType.AUTOMATIC;

  public experimental = false;
  public developer = false;
  public cds_username = '';
  public cds_password = '';
  public theme_preferred: ThemeType = ThemeType.AUTOMATIC;
}
