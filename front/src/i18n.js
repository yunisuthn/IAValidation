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
            "go-back": "Back",
            "returning-document": "Returning document...",
            "saving-document": "Saving document...",
            "cancelling-document": "Canceling document...",
            "validating-document": "Validating document...",
            "return-document": "Return document",
            "validate-document": "Validate",
            "cancel-document": "Cancel document",
            "save-document": "Save change",
            'se-connecter': 'Please login to your account',
            'connexion': 'Login',
            'email': 'Email address',
            'mot-de-passe': 'Password',
            'souvenir-de-moi': 'Remember me',
            'mdp-oublier': 'Forgot password',
            "creer-un-compte": "Create an account",
            "confirmer-mot-de-passe": "Confirm password",
            "admin": "Administrator",
            "Email_incorrect": "Incorrect email or password",
            "se-reinitialiser-mot-de-pass": "Please enter your email address",
            "email_sent_reset_link" : "Email sent for reset",
            "data-registered": "Data registered!",
            "validated-menu": "Validated",
            "users-menu": "Users",
            "file-col": "Document name",
            "documentid-col": "Document ID",
            "comments-col": "Comments",
            "validation1-col": "Validation 1",
            "validation2-col": "Validation 2",
            "invoicetype-col": "Invoice type",
            "workflowstatus-col": "Workflow status",
            "return-dialog-title": "Reason for Return",
            "your-comment": "Your comment",
            "close-btn": "Close",
            "submit-btn": "Submit",
            "return-document-required-comment": "Comment cannot be empty. Please provide your feedback before submitting.",
            "download-as-xml": "Download as XML",
            "document-is-locked": "Document is locked",
            "current-user-col": "Current user"

        }
    },
    fr: {
        translation: {
            "welcome": "Bienvenue",
            'accueil': 'Accueil',
            'description': "Ceci est une simple description",
            "prevalidation": "Prévalidation",
            'retourne': "Retourné",
            'tous-les-doc': "Tous les documents",
            'deposez-les-fichiers': "Déposez le(s) fichier(s)...",
            'glissez-et-deposez' : "Glissez et déposez un ou plusieurs fichiers ici ou cliquez pour sélectionner",
            'nom-fichier': 'Nom du Fichier',
            'aucun-fichier': 'Aucun fichier déposé',
            'verouiller': 'Vérouiller',
            "logout": "Se déconnecter",
            "go-back": "Retour",
            "returning-document": "Renvoi du document...",
            "saving-document": "Sauvegarde du document...",
            "cancelling-document": "Annulation du document...",
            "validating-document": "Validation du document...",
            "return-document": "Retourner le document",
            "validate-document": "Valider",
            "cancel-document": "Annuler le document",
            "save-document": "Sauvarder le changement",
            'se-connecter': 'Veuillez vous connecter à votre compte',
            "se-reinitialiser-mot-de-pass": "Veuillez entrer votre adresse email",
            'connexion': 'Connexion',
            'email': 'Adresse email',
            'mot-de-passe': 'Mot de passe',
            'souvenir-de-moi': 'Se souvenir de moi',
            'mdp-oublier': 'Mot de passe oublier',
            "creer-un-compte": "Créer un compte",
            "confirmer-mot-de-passe": "Confirmer le mot de passe",
            "admin": "Administrateur",
            "Email_incorrect": "Email ou mot de passe incorrect",
            "reset_password": "Réinitialiser le mot de passe",
            "email_sent_reset_link" : "Email envoyé pour la réinitialisation",
            "data-registered": "Données enregistrées!",
            "validated-menu": "Validés",
            "users-menu": "Utilisateurs",
            "file-col": "Nom du document",
            "documentid-col": "ID du document",
            "comments-col": "Commentaires",
            "validation1-col": "Validation 1",
            "validation2-col": "Validation 2",
            "invoicetype-col": "Type de facture",
            "workflowstatus-col": "Statut du flux de travail",
            "return-dialog-title": "Motif du retour",
            "your-comment": "Votre commentaire",
            "close-btn": "Fermer",
            "submit-btn": "Soumettre",
            "return-document-required-comment": "Le commentaire ne peut pas être vide. Veuillez fournir votre retour avant de soumettre.",
            "download-as-xml": "Télécharger en XML",
            "document-is-locked": "Le document est verouillé",
            "current-user-col": "Utilisateur"
        }
    }
}


const savedLanguage = localStorage.getItem('startverifica__i18nextLng') || 'en';

i18n
.use(initReactI18next)
.init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    }
});


// Event listener to save language when it changes
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('startverifica__i18nextLng', lng); // Save selected language in localStorage
});

export default i18n