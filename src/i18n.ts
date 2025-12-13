import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translation resources
const resources = {
  en: {
    translation: {
      profile: "Profile",
      security: "Security",
      preferences: "Preferences",
      danger: "Danger Zone",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      back: "Back",
      emailNotifications: "Email Notifications",
      pushNotifications: "Push Notifications",
      language: "Language",
      timezone: "Timezone",
      // ...add more keys as needed
    },
  },
  fr: {
    translation: {
      profile: "Profil",
      security: "Sécurité",
      preferences: "Préférences",
      danger: "Zone dangereuse",
      saveChanges: "Enregistrer les modifications",
      cancel: "Annuler",
      back: "Retour",
      emailNotifications: "Notifications par email",
      pushNotifications: "Notifications push",
      language: "Langue",
      timezone: "Fuseau horaire",
    },
  },
  // Add more languages here
};

i18n
  .use(LanguageDetector) // detect browser language
  .use(initReactI18next) // bind to React
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
