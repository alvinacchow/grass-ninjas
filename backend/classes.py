# classes.py
import psycopg2  # PostgreSQL driver

class Tournament:
    def __init__(self, id, name):
        self.id = id
        self.name = name
        self.pairs = {}  # dict[Person] : Person
        # self.load_pairs()

    def load_pairs(self):
        # Fetch the pairs from the database
        conn = psycopg2.connect(dbname="ninjasdb", user="your_user", password="your_password", host="localhost")
        cursor = conn.cursor()
        cursor.execute("""
            SELECT p1.name, p2.name
            FROM pairing AS pair
            JOIN person AS p1 ON pair.person_id = p1.id
            JOIN person AS p2 ON pair.paired_with_id = p2.id
            WHERE pair.tournament_id = %s
        """, (self.id,))
        rows = cursor.fetchall()
        for row in rows:
            person1 = Person(name=row[0], status="active")  # Fetch status as needed
            person2 = Person(name=row[1], status="active")  # Fetch status as needed
            self.pairs[person1] = person2
        conn.close()

    def add_pair(self, person1, person2):
        # Add the pair to the database
        conn = psycopg2.connect(dbname="ninjasdb", user="your_user", password="your_password", host="localhost")
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO pairing (tournament_id, person_id, paired_with_id)
            SELECT %s, p1.id, p2.id
            FROM person AS p1, person AS p2
            WHERE p1.name = %s AND p2.name = %s
        """, (self.id, person1.name, person2.name))
        conn.commit()
        conn.close()


class Person:
    def __init__(self, name, status):
        self.name = name
        self.status = status
        self.history = []  # List of (TournamentName, PersonPairedWith)

    def add_to_history(self, tournament, paired_with):
        self.history.append((tournament.name, paired_with.name))

    def load_history(self):
        # Fetch the history of tournaments this person participated in
        conn = psycopg2.connect(dbname="ninjasdb", user="your_user", password="your_password", host="localhost")
        cursor = conn.cursor()
        cursor.execute("""
            SELECT t.name, p2.name
            FROM pairing AS pair
            JOIN tournament AS t ON pair.tournament_id = t.id
            JOIN person AS p1 ON pair.person_id = p1.id
            JOIN person AS p2 ON pair.paired_with_id = p2.id
            WHERE p1.name = %s
        """, (self.name,))
        rows = cursor.fetchall()
        for row in rows:
            self.history.append((row[0], row[1]))  # Tournament name, paired person
        conn.close()
