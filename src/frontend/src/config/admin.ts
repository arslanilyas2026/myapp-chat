/**
 * Admin Configuration
 *
 * ADMIN: This file controls app-wide settings.
 * Edit this file to configure access control, message expiry rules, and branding.
 *
 * ⚠️  Do NOT commit real phone numbers to version control.
 *     Use Firebase Console > Authentication > Users to manage user access.
 */

export const ADMIN_CONFIG = {
  // ADMIN: Add E.164 phone numbers of allowed users here, e.g. '+15550001234'
  // Users not in this list cannot log in.
  allowedPhoneNumbers: [] as string[],

  // ADMIN: App display name shown to users
  appName: "MyApp",

  // ADMIN: Hard cap on concurrent users (max 4 for this app)
  maxUsers: 4,

  /**
   * Message expiry durations in milliseconds.
   * Set to 0 for view-once / immediate delete after media is consumed.
   */
  messageExpiry: {
    /** Text messages: auto-delete 2 minutes after send */
    text: 2 * 60 * 1000,
    /** Images: view-once — deleted after first view */
    image: 0,
    /** Audio: deleted immediately after played */
    audio: 0,
    /** Video: deleted immediately after watched */
    video: 0,
  },
} as const;
