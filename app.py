from flask import Flask, render_template
import backend.functions as functions

app = Flask(__name__)

@app.route('/')
def index():
    # Render the HTML template
    return render_template('index.html')

@app.route('/button1')
def button1_action():
    # Perform some action when Button 1 is clicked
    # functions.read_file('/Users/alvinachow/Downloads/Roster.csv')
    return 'Button 1 clicked, action performed!'

@app.route('/button2')
def button2_action():
    # Perform some action when Button 2 is clicked
    return 'Button 2 clicked!'

if __name__ == '__main__':
    app.run(debug=True)
