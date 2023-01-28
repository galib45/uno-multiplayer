import random

def create_deck():
    values = ['0', '1', '1', '2', '2', '3', '3', '4', '4', '5', '5', '6', '6', '7', '7', '8', '8', '9', '9', 'skip', 'skip', '+2', '+2', 'reverse', 'reverse']
    colors = ['red', 'yellow', 'green', 'blue']
    deck = [(color, value) for color in colors for value in values]
    deck = deck + [('black', 'wild')]*4 + [('black', '+4')]*4
    return deck

def shuffle_deck(deck):
    return random.sample(deck, k=len(deck))

    
def main():
    print(cards)

if __name__ == '__main__':
    main()
