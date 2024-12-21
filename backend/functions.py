import csv
from backend.classes import Person
import psycopg2

def read_file(filename: str): 
    try:
        conn = psycopg2.connect(
            dbname="ninjasdb", 
            user="alvinachow", 
            password="alvinachow", 
            host="localhost"
        )
        cursor = conn.cursor()
        
        with open(filename, mode='r') as file:
            csvFile = csv.reader(file)
            for lines in list(csvFile)[1:]:
                new_person = Person(lines[0], lines[1])
                insertNewPerson(new_person, cursor)

        conn.commit()  # Commit the changes after all inserts are done
    except Exception as e:
        print(f"Error reading file: {e}")
    finally:
        if conn:
            cursor.close()
            conn.close()

def insertNewPerson(person: Person, cursor): 
    try:
        cursor.execute("""
            INSERT INTO person (name, status) VALUES (%s, %s)
        """, (person.name, person.status))

    except Exception as e:
        print(f"Error inserting person: {e}")