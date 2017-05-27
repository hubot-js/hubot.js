-- Up
ALTER TABLE config ADD language TEXT;
UPDATE config SET language = 'en-US';

-- Down
ALTER TABLE config DROP language TEXT;
