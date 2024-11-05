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
            "rejecting-document": "Rejecting document...",
            "validating-document": "Validating document...",
            "return-document": "Return document",
            "validate-document": "Validate",
            "cancel-document": "Cancel document",
            "reject-document": "Reject",
            "save-document": "Save change",
            'se-connecter': 'Please login to your account',
            'connexion': 'Login',
            'email': 'Email address',
            'mot-de-passe': 'Password',
            'souvenir-de-moi': 'Remember me',
            'mdp-oublier': 'Forgot password?',
            "creer-un-compte": "Create an account",
            "confirmer-mot-de-passe": "Confirm password",
            "admin": "Administrator",
            "Email_incorrect": "Incorrect email or password",
            "se-reinitialiser-mot-de-pass": "Please enter your email address",
            "email_sent_reset_link" : "Email sent for reset",
            "data-registered": "Data registered!",
            "validated-menu": "Validated",
            "users-menu": "User management",
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
            "nom": "Name",
            "prenom": "First name",
            "role": "Role",
            "error-occured": "Add user error",
            "document-is-locked": "Document is locked",
            "current-user-col": "Current user",
            "warning-add-user": "Add user error",
            "success-add-user": "Successful user backup",
            "add-newuser-menu": "Add new user",
            "view-users-menu": "List of users",
            "validator1-col": "Validator 1",
            "validator2-col": "Validator 2",
            // status workflow
            "inprogress-status": "In progress",
            "pendingassignment-status": "Pending Assignment",
            "completed-status": "Worked On",
            "click-to-open-document": "Click to open the document",
            "select-role": "Select role",
            "reset_password": "Reset password",
            "loading": "Loading...",
            "error_sending_email": "Email adress not found",
            "remember_me": "Remember me",
            "modifier_utilisateur": 'Update user',
            "annuler": "Cancel",
            "sauvegarder": "Save",
            "data-update": "Update success user",
            "error-updating-data": "Error update user",
            'invoice-val': "Invoice",
            "credit-note-val": "Credit Note",
            "reject-reason": "Reason",
            "reject-message": "Please provide the reason for rejecting this document.",
            "all-records": "All",
            "or": "or",
            "signin-with-google": "Sign In with Google"
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
            "rejecting-document": "Rejet du document...",
            "validating-document": "Validation du document...",
            "return-document": "Retourner le document",
            "validate-document": "Valider",
            "cancel-document": "Annuler le document",
            "reject-document": "Rejeter",
            "save-document": "Sauvegarder le changement",
            'se-connecter': 'Veuillez vous connecter à votre compte',
            "se-reinitialiser-mot-de-pass": "Veuillez entrer votre adresse email",
            'connexion': 'Connexion',
            'email': 'Adresse email',
            'mot-de-passe': 'Mot de passe',
            'souvenir-de-moi': 'Se souvenir de moi',
            'mdp-oublier': 'Mot de passe oublier?',
            "creer-un-compte": "Créer un compte",
            "confirmer-mot-de-passe": "Confirmer le mot de passe",
            "admin": "Administrateur",
            "Email_incorrect": "Email ou mot de passe incorrect",
            "reset_password": "Réinitialiser le mot de passe",
            "email_sent_reset_link" : "Email envoyé pour la réinitialisation",
            "data-registered": "Données enregistrées!",
            "validated-menu": "Validés",
            "users-menu": "Gestion des utilisateurs",
            "file-col": "Nom du document",
            "documentid-col": "ID du document",
            "comments-col": "Commentaires",
            "validation1-col": "Validation 1",
            "validation2-col": "Validation 2",
            "invoicetype-col": "Type de facture",
            "workflowstatus-col": "Statut",
            "return-dialog-title": "Motif du retour",
            "your-comment": "Votre commentaire",
            "close-btn": "Fermer",
            "submit-btn": "Soumettre",
            "return-document-required-comment": "Le commentaire ne peut pas être vide. Veuillez fournir votre retour avant de soumettre.",
            "download-as-xml": "Télécharger en XML",
            "nom": "Nom",
            "prenom": "Prénom",
            "role": "Role",
            "document-is-locked": "Le document est verouillé",
            "current-user-col": "Utilisateur actuel",
            "warning-add-user": "Erreur d'ajout d'utilisateur",
            "success-add-user": "Sauvegarde réussie de l'utilisateur",
            "add-newuser-menu": "Nouvel utilisateur",
            "view-users-menu": "Liste d'utilisateurs",
            "validator1-col": "Validateur 1",
            "validator2-col": "Validateur 2",
            // status workflow
            "inprogress-status": "En cours",
            "pendingassignment-status": "En attente d'attribution",
            "completed-status": "Travaillé",
            "click-to-open-document": "Cliquer pour ouvrir le document",
            "select-role": "Séléctionner le rôle",
            "loading": "Chargement...",
            "error_sending_email": "L'adresse email est introuvable",
            "remember_me": "Se souvenir",
            "modifier_utilisateur": "Modifier l'utilisateur",
            "annuler": "Annuler",
            "sauvegarder": "Sauvegarder",
            "data-update": "Mis à jours d'utilisateur succès",
            "error-updating-data": "Erreur du mis à jours d'utilisateur",
            'invoice-val': "Facture",
            "credit-note-val": "Note de crédit",
            "reject-reason": "Raison",
            "reject-message": "Veuillez indiquer la raison du rejet de ce document.",
            "all-records": "Tous",
            "or": "ou",
            "signin-with-google": "Se connecter avec Google"
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