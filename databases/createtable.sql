-- Create the tournament table
CREATE TABLE IF NOT EXISTS tournament (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, 
    year INT NOT NULL
);

-- Create the person table
CREATE TABLE IF NOT EXISTS person (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(10) NOT NULL
);

-- Create the pairing table with foreign keys
CREATE TABLE IF NOT EXISTS pairing (
    tournament_id INT,
    person_id INT,
    paired_with_id INT,
    PRIMARY KEY (tournament_id, person_id),
    FOREIGN KEY (tournament_id) REFERENCES tournament(id),
    FOREIGN KEY (person_id) REFERENCES person(id),
    FOREIGN KEY (paired_with_id) REFERENCES person(id)
);
