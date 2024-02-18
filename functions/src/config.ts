export const DISCORD_TIMEOUT_TIME = 1000;

export const PLAYTOMIC_API_URL = "https://playtomic.io/api/v1";

export const PLAYTOMIC_API_TENANTS_PARAMS = {
  "user_id": "me",
  "playtomic_status": "ACTIVE",
  "with_properties": "ALLOWS_CASH_PAYMENT",
  "coordinate": "52.401920,4.907461", // Buiksloterbreek
  "sport_id": "PADEL",
  "size": 40,
  "radius": 15000, // Meters
};

export const FAVOURITE_TENANTS = [
  "ndsm-padel",
  "xnrgy-club",
  "plaza-padel-amsterdam",
  "padelclub-zaandam",
  "padel-indoor-purmerend",
  "padelcentrum-bol",
];

export const PADEL_PREFERENCES = {
  // The minimum duration for a padel slot in minutes
  minimumSlotDuration: 90,
  // The default start time for padel sessions
  defaultStartTime: "20:00:00",
  // The default end time for padel sessions (end of the day)
  defaultEndTime: "23:59:59",
  // Indoor or outdoor courts.
  resourceType: "indoor",
  // Size double for 4 players.
  resourceSize: "double",
  // Preferred day of the week to play Padel.  0 = Sunday, 3 = Wednesday, 5 = Thursday, 6 = Saturday. Example: [2, 3, 5]
  prefferedDays: [3],
  // The default period for checking availability in days
  searchPeriodInDays: 30,
};

export const RAINBOW_COLORS = [
  "#820014", "#a8071a", "#cf1322", "#f5222d", "#ff4d4f", "#ff7a45",
  "#fa8c16", "#ffa940", "#ffc069", "#ffd666", "#ffc53d", "#faad14",
  "#d4b106", "#fadb14", "#ffec3d", "#bae637", "#a0d911", "#7cb305",
  "#389e0d", "#52c41a", "#73d13d", "#95de64", "#b7eb8f", "#87e8de",
  "#5cdbd3", "#36cfc9", "#13c2c2", "#08979c", "#006d75", "#002c8c",
  "#003eb3", "#0958d9", "#1677ff", "#4096ff", "#597ef7", "#9254de",
  "#722ed1", "#531dab",
];
