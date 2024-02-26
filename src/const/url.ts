export const PageUrls = {
  auth: "/auth",
  home: "/",
  settings: {
    index: "/settings",
    security: "/settings/security",
  },
  board: {
    index: "/board",
    id: (id: string) => `/board/${id}`,
    settings: (id: string) => `/board/${id}/settings`,
  },
} as const;
