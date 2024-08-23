import os
import json
import random
import requests
from google.cloud import pubsub_v1
from google.cloud import firestore


# Initialize the Pub/Sub client
publisher = pubsub_v1.PublisherClient()
project_id = "csci-5410-428021"
topic_id = "CustomerService"
topic_path = publisher.topic_path(project_id, topic_id)

# Initialize the Firestore client
db = firestore.Client(project='csci-5410-428021',database='userdetails')

# API endpoint to fetch user details
api_endpoint = 'https://5t27si7ur2u2p22ofim7xbxgze0lnhcn.lambda-url.us-east-1.on.aws/' 

def fetch_random_agent():
    response = requests.get(api_endpoint)
    if response.status_code != 200:
        raise Exception('Error fetching agents from API')
    agents = response.json()
    if not agents:
        raise Exception('No agents found in the API response')
    return random.choice(agents)

def publish_message(request):
    try:
        if request.headers['Content-Type'] != 'application/json':
            return "Request does not contain valid JSON", 400, get_cors_headers()

        request_json = request.get_json(silent=True)
        if request_json is None:
            return "No JSON data found in the request", 400, get_cors_headers()

        message = request_json.get('message')
        guest_username = request_json.get('guest_username')
        booking_ref_code=request_json.get('booking_ref_code')

        if not message or not guest_username:
            return "Message or guest_username is missing in the request", 400, get_cors_headers()

        agent = fetch_random_agent()
        agent_username = agent['email']

        message_with_agent = {
            'message': message,
            'sender': guest_username,
            'receiver': agent_username,
            'booking_ref_code' : booking_ref_code
        }

        query_details = {
            'guest' : guest_username,
            'agent' : agent_username,
            'booking_ref_code' : booking_ref_code,
            'query' : message
        }

        db.collection('queries').add(query_details)
        doc=db.collection('messages').add(message_with_agent)

        db.collection('messages').document(doc[1].id).update({
            'timestamp': firestore.SERVER_TIMESTAMP
        })

        message_json = json.dumps(message_with_agent)
        message_bytes = message_json.encode('utf-8')

        # Publish the message
        message = publisher.publish(topic_path, data=message_bytes)
        message_id = message.result()

        return json.dumps({'message_id': message_id, 'message' : 'Message assigned to property agent successfully.'}), 200, get_cors_headers()

    except Exception as e:
        return json.dumps({'error': f'Error publishing message: {e}'}), 500, get_cors_headers()

def get_cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
