from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/data')
def get_data():
    data = {"message": "Data retrieved successfully", "data": [1, 2, 3]}
    return jsonify(data)

def main():
    app.run(debug=True, port=5000)

if __name__ == '__main__':
    main()