
DO
$do$
BEGIN
   IF NOT EXISTS ( SELECT FROM pg_roles  
                   WHERE  rolname = 'postgres') THEN
      CREATE USER postgres;
   END IF;
END
$do$;
SELECT 'CREATE DATABASE postgres'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'postgres')\gexec
GRANT ALL PRIVILEGES ON DATABASE postgres TO postgres;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS submissions;
CREATE TABLE users (
	id SERIAL,
 	email VARCHAR(254) UNIQUE,
	firebaseid VARCHAR(254) UNIQUE,
	PRIMARY KEY (email, firebaseid)
);

CREATE TABLE submissions (
   id SERIAL,
   firebaseid VARCHAR(254),
   questionid INTEGER,
   languageid INTEGER,
   code TEXT,
   updated_at TIMESTAMP DEFAULT NOW(),
   PRIMARY KEY (firebaseid, questionid, languageid)
);
