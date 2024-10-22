import i18n from "i18next"
import {initReactI18next} from 'react-i18next'

const resources = {
    en: {
        translation: {
            "welcome": "Welcome",
            'accueil': 'Home',
            'description': "This is a simple description",
            "prevalidation": "Pre-validation",
            'retourne': "Returned",
            'tous-les-doc': "All documents",
            'deposez-les-fichiers': "Submit file(s)...",
            'glissez-et-deposez' : "Drag and drop one or more files here or click to select",
            'nom-fichier': 'File\'s name',
            'aucun-fichier': 'No files submitted',
            'verouiller': 'Lock',
            "logout": "Logout",
            "returning-document": "Returning document...",
            "saving-document": "Saving document...",
            "canceling-document": "Canceling document...",
            "validating-document": "Validating document...",
            "return-document": "Return document",
            "validate-document": "Validate",
            "cancel-document": "Cancel document",
            "save-document": "Save change",
        }
    },
    fr: {
        translation: {
            "welcome": "Bienvenue",
            'accueil': 'Accueil',
            'description': "Ceci est une simple description",
            "prevalidation": "Prè validation",
            'retourne': "Retourné",
            'tous-les-doc': "Tous les documents",
            'deposez-les-fichiers': "Déposez le(s) fichier(s)...",
            'glissez-et-deposez' : "Glissez et déposez un ou plusieurs fichiers ici ou cliquez pour sélectionner",
            'nom-fichier': 'Nom du Fichier',
            'aucun-fichier': 'Aucun fichier déposé',
            'verouiller': 'Vérouiller',
            "logout": "Se déconnecter",
            "returning-document": "Renvoi document...",
            "saving-document": "Sauvegarde du document...",
            "canceling-document": "Annulation du document...",
            "validating-document": "Validation du document...",
            "return-document": "Retourner le document",
            "validate-document": "Valider",
            "cancel-document": "Annuler le document",
            "save-document": "Sauvarder le changement",
        }
    }
}

i18n
.use(initReactI18next)
.init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    }
})

export default i18n