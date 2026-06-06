import Keycloak from 'keycloak-js'

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL ?? 'http://127.0.0.1:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM ?? 'toyota-finance',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT ?? 'finance-portal-app',
}

export const keycloak = new Keycloak(keycloakConfig)
