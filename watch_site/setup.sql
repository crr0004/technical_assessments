CREATE USER watchsite PASSWORD 'watchsite';
ALTER USER watchsite WITH CREATEDB;
CREATE DATABASE sites WITH OWNER watchsite;
\c sites watchsite;
DROP TABLE IF EXISTS sites;
CREATE TABLE sites (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    time TIMESTAMP NOT NULL,
    content TEXT NOT NULL
)