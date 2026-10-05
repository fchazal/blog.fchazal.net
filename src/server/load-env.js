/**
 * Charge `.env` dans `process.env` (Node ≥ 20.12), sans écraser
 * les variables déjà définies (shell / conteneur ont priorité).
 * Doit être importé en premier pour que CONTENT_PATH / DATABASE_PATH
 * soient disponibles au chargement des autres modules.
 */
try {
  process.loadEnvFile?.();
} catch {
  /* pas de fichier .env : on garde l'environnement ambiant */
}
