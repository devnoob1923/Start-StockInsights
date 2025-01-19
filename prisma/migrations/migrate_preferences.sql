-- Create the new table with enums
CREATE TYPE "Frequency" AS ENUM ('REALTIME', 'DAILY', 'WEEKLY', 'MONTHLY');
CREATE TYPE "Channel" AS ENUM ('EMAIL', 'WHATSAPP', 'SMS', 'PUSH');
CREATE TYPE "Topic" AS ENUM (
  'EARNINGS',
  'DIVIDENDS',
  'MERGERS_ACQUISITIONS',
  'MARKET_ANALYSIS',
  'INDUSTRY_NEWS',
  'TECHNICAL_ANALYSIS',
  'INSIDER_TRADING',
  'SEC_FILINGS',
  'PRICE_MOVEMENTS',
  'ANALYST_RATINGS'
);

-- Create new UserPreferences table
CREATE TABLE "UserPreferences" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "newsFrequency" "Frequency" NOT NULL DEFAULT 'DAILY',
  "deliveryChannel" "Channel"[] DEFAULT ARRAY['EMAIL']::"Channel"[],
  "topics" "Topic"[] DEFAULT ARRAY[]::Topic[],
  "priceAlerts" BOOLEAN NOT NULL DEFAULT false,
  "alertThreshold" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "UserPreferences_userId_key" UNIQUE ("userId"),
  CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Migrate data from old to new table
INSERT INTO "UserPreferences" ("id", "userId", "newsFrequency", "deliveryChannel", "topics", "createdAt", "updatedAt")
SELECT 
  "id",
  "userId",
  CASE "newsFrequency"
    WHEN 'DAILY' THEN 'DAILY'::"Frequency"
    WHEN 'WEEKLY' THEN 'WEEKLY'::"Frequency"
    ELSE 'DAILY'::"Frequency"
  END,
  ARRAY['EMAIL']::"Channel"[],
  ARRAY[]::Topic[],
  "createdAt",
  "updatedAt"
FROM "Preferences";

-- Drop old table
DROP TABLE "Preferences"; 