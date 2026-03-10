#!/bin/bash

# Load .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

set -e



MIGRATIONS_DIR="$(dirname "$0")/../migrations"
DB_URL="${DATABASE_URL}"

if [ -z "$DB_URL" ]; then
  echo "ERROR: DATABASE_URL is not set"
  exit 1
fi

echo "Running migrations..."

psql "$DB_URL" -f "$MIGRATIONS_DIR/000_migration_table.sql"

for migration in $(ls "$MIGRATIONS_DIR"/*.sql | sort); do
  filename=$(basename "$migration")

  if [ "$filename" = "000_migration_table.sql" ]; then
    continue
  fi

  already_run=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM schema_migrations WHERE filename = '$filename';" | tr -d ' ')

  if [ "$already_run" -eq 0 ]; then
    echo "Applying: $filename"
    psql "$DB_URL" -f "$migration"
    psql "$DB_URL" -c "INSERT INTO schema_migrations (filename) VALUES ('$filename');"
    echo "Done: $filename"
  else
    echo "Skipping (already applied): $filename"
  fi
done

echo "All migrations complete."