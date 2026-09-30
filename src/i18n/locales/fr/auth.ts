export default {
  form: {
    email: "E-mail",
    password: "Mot de passe",
    displayName: "Nom affiché",
    optional: "Optionnel",
    passwordHint: "8 caractères minimum",
    signIn: "Se connecter",
    signingIn: "Connexion…",
    createAccount: "Créer un compte",
    creating: "Création…",
    signInFailed: "Échec de la connexion",
    signUpFailed: "Échec de l'inscription",
  },
  badges: {
    accessRequest: "DEMANDE D'ACCÈS",
    newIdentity: "NOUVELLE IDENTITÉ",
  },
  links: {
    noAccount: "Pas de compte ?",
    createOne: "En créer un",
    hasAccount: "Déjà un compte ?",
    signIn: "Se connecter",
  },
  oauth: {
    orContinue: "ou continuer avec",
    google: "Google",
    github: "GitHub",
  },
  passwordStrength: {
    weak: "faible",
    medium: "moyen",
    strong: "fort",
  },
  themes: {
    "light-blue": {
      panelBadge: "PORTAIL ESPACE SÉCURISÉ",
      panelTitle: "Accès de précision pour architectes numériques.",
      panelDesc:
        "Connectez-vous pour synchroniser votre vault markdown, les sessions d'aperçu live et les exports cloud — dans un environnement professionnel unifié.",
      perks: [
        "Latence d'aperçu 0,12 ms",
        "Espace par utilisateur",
        "OAuth + e-mail",
      ],
      terminalLines: [
        { prefix: ">", text: "auth.init(session)", accent: true },
        { prefix: ">", text: "vault.unlock(user_workspace)" },
        { prefix: ">", text: "preview.enable(live)" },
        { prefix: "✓", text: "Canal AES-256 prêt", accent: true },
      ],
      loginTitle: "Connexion",
      loginSubtitle: "Accédez à votre espace markdown privé",
      signupTitle: "Créer un compte",
      signupSubtitle: "Initialisez votre environnement architecte personnel",
    },
    "cyber-green": {
      panelBadge: "PORTAIL.AUTH_SYSTÈME",
      panelTitle: "Protocole d'accès console neurale.",
      panelDesc:
        "Authentifiez-vous pour entrer dans l'environnement markdown niveau kernel. Aperçu sans latence, typo CRT, sync grille collaborative.",
      perks: [
        "Rendu niveau kernel",
        "Chiffrement 256 bits",
        "Pont de session live",
      ],
      terminalLines: [
        { prefix: "root@", text: "system_sync_start()", accent: true },
        { prefix: ">", text: "chargement neural_core..." },
        { prefix: ">", text: "poignée : flux 256 bits" },
        { prefix: "OK", text: "console prête", accent: true },
      ],
      loginTitle: "Connexion interface",
      loginSubtitle: "Établir la connexion à votre espace",
      signupTitle: "Initialiser le compte",
      signupSubtitle: "Enregistrer une nouvelle identité console neurale",
    },
    "obsidian-silver": {
      panelBadge: "ACCÈS VAULT // v2.0",
      panelTitle: "Entrée espace grade Obsidian.",
      panelDesc:
        "Vault markdown local-first avec sync chiffrée, backlinks graphe neural et latence de saisie direct-to-metal.",
      perks: [
        "Stockage local-first",
        "Liens graphe neural",
        "Écosystème plugins",
      ],
      terminalLines: [
        { prefix: "vault>", text: "unlock --local-first", accent: true },
        { prefix: ">", text: "graph.nodes: sync" },
        { prefix: ">", text: "plugins: 1 200+ disponibles" },
        { prefix: "●", text: "vault scellé & prêt", accent: true },
      ],
      loginTitle: "Connexion vault",
      loginSubtitle: "Déverrouillez votre espace chiffré",
      signupTitle: "Créer un vault",
      signupSubtitle: "Provisionner un environnement grade obsidian",
    },
  },
} as const;
