import os
import json
import random
import requests
from google.cloud import firestore



# Initialize the Firestore client
db = firestore.Client(project='csci-5410-428021',database='userdetails')
 
def sendmessages(request):

    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    try:
        if request.headers['Content-Type'] != 'application/json':
            return ("Request does not contain valid JSON", 400, headers)

        request_json = request.get_json(silent=True)
        if request_json is None:
            return ("No JSON data found in the request", 400, headers)

        message = request_json.get('message')
        sender = request_json.get('username')
        booking_ref_code=request_json.get('booking_ref_code')
        receiver=request_json.get('receiver')

        if not message or not sender or not receiver :
            return ("Message, sender or receiver is missing in the request", 400, headers)

        message_with_agent = {
            'message': message,
            'sender': sender,
            'receiver': receiver,
            'booking_ref_code' : booking_ref_code
        }

        doc=db.collection('messages').add(message_with_agent)

        db.collection('messages').document(doc[1].id).update({
            'timestamp': firestore.SERVER_TIMESTAMP
        })

        return (json.dumps({ 'message': 'Message sent successfully.'}), 200, headers)

    except Exception as e:
        return (json.dumps({'error': f'Error sending message: {e}'}), 500, headers)

def get_cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
