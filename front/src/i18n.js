import i18n from "i18next"
import {initReactI18next} from 'react-i18next'

const resources = {
    en: {
        translation: {
            "welcome": "Welcome",
            'description': "This is a simple description",
            "prevalidation": "Pre-validation",
            'retourne': "Return",
            'tous-les-doc': "All documents",
            'deposez-les-fichiers': "Submit file(s)...",
            'glissez-et-deposez' : "Drag and drop one or more files here or click to select",
            'nom-fichier': 'File\'s name',
            'aucun-fichier': 'No files submitted'
        }
    },
    fr: {
        translation: {
            "welcome": "Bienvenue",
            'description': "Ceci est une simple description",
            "prevalidation": "Prè validation",
            'retourne': "Retourne",
            'tous-les-doc': "Tous les documents",
            'deposez-les-fichiers': "Déposez le(s) fichier(s)...",
            'glissez-et-deposez' : "Glissez et déposez un ou plusieurs fichiers ici ou cliquez pour sélectionner",
            'nom-fichier': 'Nom du Fichier',
            'aucun-fichier': 'Aucun fichier déposé'
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