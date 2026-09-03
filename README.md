# Vault TSA

Prototype web statique (HTML/CSS/JS) de l'application **Vault TSA** — plateforme
permettant à un utilisateur de mettre en vente l'accès à ses propres coordonnées
de contact (numéro d'appel, WhatsApp), avec paiement pour déblocage.

## Structure du projet

```
vault-tsa/
├── index.html            # Écran d'accueil (logo, créer compte / se connecter)
├── terms.html             # Conditions d'utilisation (case à cocher obligatoire)
├── signup.html             # Création de compte (email + mot de passe)
├── login.html               # Connexion
├── browse.html                # Accueil : recherche + liste des contacts en vente
├── settings.html                # Paramètres (profil, compte, suppression)
├── profile-edit.html              # Édition du profil privé (figurine, âge, etc.)
├── profile-detail.html              # Fiche d'un vendeur (infos floutées avant achat)
├── payment-method.html                # Choix du moyen de paiement
├── payment-confirm.html                 # Confirmation + contact débloqué (appel/WhatsApp)
├── seller-step1.html                      # Devenir vendeur — étape 1 (catégorie, prix)
├── seller-step2.html                        # Devenir vendeur — étape 2 (lieu, contacts)
├── css/style.css                              # Design system partagé (jetons de couleur, composants)
└── js/app.js                                    # Interactions (interrupteurs, badges, curseur de prix)
```

## Déploiement rapide

Ce projet est 100% statique, sans backend ni dépendance de build.

### GitHub Pages
1. Poussez ce dossier dans un dépôt GitHub.
2. Dans **Settings → Pages**, choisissez la branche `main` et le dossier racine `/`.
3. Le site sera disponible sur `https://<votre-utilisateur>.github.io/<nom-du-repo>/`.

### Netlify / Vercel
Glissez-déposez le dossier dans l'interface de déploiement, ou connectez le dépôt
GitHub — aucune commande de build n'est nécessaire (site statique).

## Ce qui est simulé (à brancher sur un vrai backend)

Ce prototype navigue entre les écrans et anime les composants (interrupteurs,
sélection de catégorie, curseur de prix) côté client uniquement. Pour une
version en production, il faudra :

- **Authentification réelle** : remplacer les formulaires email/mot de passe par
  un vrai service (ex. Firebase Auth, Auth0, ou backend maison avec hachage
  de mot de passe).
- **Emails de confirmation** : brancher un service transactionnel (ex. SendGrid,
  Postmark) pour l'email de confirmation évoqué lors de la création de compte.
- **Paiement** : intégrer un vrai prestataire (Stripe, PayPal Checkout, etc.).
  Les logos de marques (PayPal, Visa, Western Union, Google Pay, Wise) ne sont
  **pas** inclus dans ce prototype — utilisez les kits officiels de chaque
  prestataire une fois le partenariat/l'intégration technique en place.
- **Base de données** : stocker les profils, prix, transactions et historiques
  d'achats (actuellement tout est statique/factice dans les pages HTML).
- **Vérification d'identité des vendeurs** : le badge « Vérifié » est un
  élément visuel statique ; une vraie vérification (pièce d'identité,
  validation manuelle) est recommandée avant d'autoriser la mise en vente,
  notamment pour limiter les usurpations de profils de célébrités.
- **Conformité légale** : les textes des conditions d'utilisation sont un point
  de départ, pas un document juridique. Faites-les valider par un juriste avant
  mise en production, notamment sur la protection des données personnelles
  (RGPD si des utilisateurs européens sont concernés) et les lois locales
  encadrant ce type de service selon les pays visés.

## Palette

| Usage | Couleur |
|---|---|
| Fond sombre (navigation/compte) | `#03101c` → `#061524` |
| Accent bleu | `#378ADD` |
| Fond clair (achat/paiement) | `#f4f8fc` |
| Bleu profond (thème clair) | `#185FA5` |
| Succès | `#1e9e5a` |
| Danger / suppression | `#E24B4A` |
