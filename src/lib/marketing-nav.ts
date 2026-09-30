import type { NavKey } from "../pages/landing-theme-styles";

export function navItemHref(navKey: NavKey): string {
  switch (navKey) {
    case "home":
      return "/";
    case "docs":
      return "/docs";
    case "features":
      return "/#features";
    case "pricing":
      return "/#features";
    case "community":
      return "/#features";
    case "github":
      return "https://github.com/kyler004/markdown-live-editor";
    default:
      return "/";
  }
}

export function isExternalNav(navKey: NavKey): boolean {
  return navKey === "github";
}
