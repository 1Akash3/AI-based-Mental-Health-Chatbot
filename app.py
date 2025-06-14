from flask import Flask, jsonify, request
from flask_cors import CORS
from nlp_engine import get_response  # Ensure this import is correct

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_text = data.get('message', '')
        chatbot_response = get_response(user_text)  # Call your NLP function
        return jsonify({'reply': chatbot_response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ... (your /listen route remains the same or as needed) ...

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')