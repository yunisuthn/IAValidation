import i18n from "i18next"
import {initReactI18next} from 'react-i18next'

const resources = {
    en: {
        translation: {
            "welcome": "Welcome",
            'accueil': 'Home',
            'description': "This is a simple description",
            "prevalidation": "Pre-validation",
            'retourne': "Return",
            'tous-les-doc': "All documents",
            'deposez-les-fichiers': "Submit file(s)...",
            'glissez-et-deposez' : "Drag and drop one or more files here or click to select",
            'nom-fichier': 'File\'s name',
            'aucun-fichier': 'No files submitted',
            'verouiller': 'Lock',
            'se-connecter': 'Please login to your account',
            'connexion': 'Login',
            'email': 'Email address',
            'mot-de-passe': 'Password',
            'souvenir-de-moi': 'Remember me',
            'mdp-oublier': 'Forgot password',
            "creer-un-compte": "Create an account",
            "confirmer-mot-de-passe": "Confirm password",
            "admin": "Administrator"
        }
    },
    fr: {
        translation: {
            "welcome": "Bienvenue",
            'accueil': 'Accueil',
            'description': "Ceci est une simple description",
            "prevalidation": "Prè validation",
            'retourne': "Retourne",
            'tous-les-doc': "Tous les documents",
            'deposez-les-fichiers': "Déposez le(s) fichier(s)...",
            'glissez-et-deposez' : "Glissez et déposez un ou plusieurs fichiers ici ou cliquez pour sélectionner",
            'nom-fichier': 'Nom du Fichier',
            'aucun-fichier': 'Aucun fichier déposé',
            'verouiller': 'Vérouiller',
            'se-connecter': 'Veuillez vous connecter à votre compte',
            'connexion': 'Connexion',
            'email': 'Adresse email',
            'mot-de-passe': 'Mot de passe',
            'souvenir-de-moi': 'Se souvenir de moi',
            'mdp-oublier': 'Mot de passe oublier',
            "creer-un-compte": "Créer un compte",
            "confirmer-mot-de-passe": "Confirmer le mot de passe",
            "admin": "Administrateur"
              
              
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