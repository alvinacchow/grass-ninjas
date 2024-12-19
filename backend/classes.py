# classes.py

class Tournament: 
    def __init__(self, name): 
        self.name = name
        self.pairs = {}
        # dict[Person] : Person


class Person: 
    def __init__(self, name, status): 
        self.name = name
        self.status = status
        self.history = []
        # list[Tuple(TournamentName, PersonPairedWith)]
