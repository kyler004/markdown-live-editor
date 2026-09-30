export default {
  form: {
    email: "Email",
    password: "Password",
    displayName: "Display name",
    optional: "Optional",
    passwordHint: "Minimum 8 characters",
    signIn: "Sign in",
    signingIn: "Signing in…",
    createAccount: "Create account",
    creating: "Creating…",
    signInFailed: "Sign in failed",
    signUpFailed: "Sign up failed",
  },
  badges: {
    accessRequest: "ACCESS REQUEST",
    newIdentity: "NEW IDENTITY",
  },
  links: {
    noAccount: "No account?",
    createOne: "Create one",
    hasAccount: "Already have an account?",
    signIn: "Sign in",
  },
  oauth: {
    orContinue: "or continue with",
    google: "Google",
    github: "GitHub",
  },
  passwordStrength: {
    weak: "weak",
    medium: "medium",
    strong: "strong",
  },
  themes: {
    "light-blue": {
      panelBadge: "SECURE WORKSPACE GATE",
      panelTitle: "Precision access for digital architects.",
      panelDesc:
        "Sign in to sync your markdown vault, live preview sessions, and cloud-native exports — all in one professional environment.",
      perks: [
        "0.12ms preview latency",
        "Per-user workspace",
        "OAuth + email auth",
      ],
      terminalLines: [
        { prefix: ">", text: "auth.init(session)", accent: true },
        { prefix: ">", text: "vault.unlock(user_workspace)" },
        { prefix: ">", text: "preview.enable(live)" },
        { prefix: "✓", text: "AES-256 channel ready", accent: true },
      ],
      loginTitle: "Sign in",
      loginSubtitle: "Access your private markdown workspace",
      signupTitle: "Create account",
      signupSubtitle: "Initialize your personal architect environment",
    },
    "cyber-green": {
      panelBadge: "SYSTEM.AUTH_GATE",
      panelTitle: "Neural console access protocol.",
      panelDesc:
        "Authenticate to enter the kernel-level markdown environment. Zero-latency preview, CRT-grade typography, collaborative grid sync.",
      perks: [
        "Kernel-level rendering",
        "256-bit encryption",
        "Live session bridge",
      ],
      terminalLines: [
        { prefix: "root@", text: "system_sync_start()", accent: true },
        { prefix: ">", text: "loading neural_core..." },
        { prefix: ">", text: "handshake: 256-bit stream" },
        { prefix: "OK", text: "console ready", accent: true },
      ],
      loginTitle: "Interface login",
      loginSubtitle: "Establish connection to your workspace",
      signupTitle: "Initialize account",
      signupSubtitle: "Register a new neural console identity",
    },
    "obsidian-silver": {
      panelBadge: "VAULT ACCESS // v2.0",
      panelTitle: "Obsidian-grade workspace entry.",
      panelDesc:
        "Local-first markdown vault with encrypted sync, neural graph backlinks, and direct-to-metal input latency.",
      perks: [
        "Local-first storage",
        "Neural graph links",
        "Plugin ecosystem",
      ],
      terminalLines: [
        { prefix: "vault>", text: "unlock --local-first", accent: true },
        { prefix: ">", text: "graph.nodes: syncing" },
        { prefix: ">", text: "plugins: 1,200+ available" },
        { prefix: "●", text: "vault sealed & ready", accent: true },
      ],
      loginTitle: "Vault login",
      loginSubtitle: "Unlock your encrypted workspace",
      signupTitle: "Create vault",
      signupSubtitle: "Provision a new obsidian-grade environment",
    },
  },
} as const;
