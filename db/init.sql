CREATE TABLE IF NOT EXISTS iphones (
  id        SERIAL       PRIMARY KEY,
  model     VARCHAR(255) NOT NULL,
  color     VARCHAR(255) NOT NULL,
  storage   VARCHAR(255) NOT NULL,
  stock     INTEGER      NOT NULL,
  price     FLOAT        NOT NULL,
  available BOOLEAN      NOT NULL
);