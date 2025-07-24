#!/bin/bash

# Database creation script for Smart Education Platform
# Run this to create the database and all tables

# Configuration
DB_NAME="smart_education"
DB_USER="smart_admin"
DB_PASSWORD="smart_2024_secure!"  # Change this in production!
DB_HOST="localhost"
DB_PORT="5432"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "Smart Education Platform Database Setup"
echo "======================================"

# Check if PostgreSQL is running
if ! pg_isready -h $DB_HOST -p $DB_PORT > /dev/null 2>&1; then
    echo -e "${RED}Error: PostgreSQL is not running on $DB_HOST:$DB_PORT${NC}"
    echo "Please start PostgreSQL first"
    exit 1
fi

echo -e "${GREEN}PostgreSQL is running${NC}"

# Create user if doesn't exist
echo "Creating database user..."
psql -h $DB_HOST -p $DB_PORT -U postgres <<EOF
-- Create user if not exists
DO
\$do\$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE rolname = '$DB_USER') THEN
      CREATE ROLE $DB_USER LOGIN PASSWORD '$DB_PASSWORD';
   END IF;
END
\$do\$;

-- Grant necessary permissions
ALTER ROLE $DB_USER CREATEDB;
EOF

# Create database
echo "Creating database..."
psql -h $DB_HOST -p $DB_PORT -U postgres <<EOF
-- Drop database if exists (uncomment only if you want to reset)
-- DROP DATABASE IF EXISTS $DB_NAME;

-- Create database
CREATE DATABASE $DB_NAME OWNER $DB_USER;
EOF

# Enable extensions
echo "Enabling required extensions..."
psql -h $DB_HOST -p $DB_PORT -U postgres -d $DB_NAME <<EOF
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector for AI embeddings (install separately if needed)
-- CREATE EXTENSION IF NOT EXISTS vector;

-- Enable pg_trgm for better text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
EOF

# Create schema
echo "Creating schema from schema.sql..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME < schema.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Database created successfully!${NC}"
    echo ""
    echo "Database Details:"
    echo "=================="
    echo "Name: $DB_NAME"
    echo "User: $DB_USER"
    echo "Password: $DB_PASSWORD"
    echo "Host: $DB_HOST"
    echo "Port: $DB_PORT"
    echo ""
    echo "Connection string for your app:"
    echo -e "${YELLOW}postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME${NC}"
    echo ""
    echo "Environment variable for .env file:"
    echo -e "${YELLOW}DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME${NC}"
else
    echo -e "${RED}Error creating database schema${NC}"
    exit 1
fi

# Optional: Create initial data
read -p "Do you want to create sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Creating sample data..."
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME < sample_data.sql
    echo -e "${GREEN}Sample data created${NC}"
fi

echo ""
echo -e "${GREEN}Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Add the DATABASE_URL to your .env file"
echo "2. Update your app configuration"
echo "3. Run your migrations if needed"
echo ""
echo "To connect to the database:"
echo "psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"