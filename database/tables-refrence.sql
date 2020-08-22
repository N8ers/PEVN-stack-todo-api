CREATE TABLE persons(
  id       SERIAL PRIMARY KEY,
  name     TEXT,
  email    TEXT,
  password TEXT
);

CREATE TABLE tasks (
  task_id    SERIAL PRIMARY KEY,
  user_id    INT,
  name       TEXT,
  sort_order INT,
  completed  BOOL,
  FOREIGN KEY(user_id) REFERENCES persons(id)
);