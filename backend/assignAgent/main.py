import base64
import json
import requests
import random
from google.cloud import firestore

get_agent_list = 'https://5t27si7ur2u2p22ofim7xbxgze0lnhcn.lambda-url.us-east-1.on.aws/' 


db = firestore.Client(project='csci-5410-428021', database='userdetails')

def fetch_random_agent():
    response = requests.get(get_agent_list)
    if response.status_code != 200:
        raise Exception('Error fetching agents from API')
    agents = response.json()
    if not agents:
        raise Exception('No agents found in the API response')
    return random.choice(agents)

def fetchUserDetails(booking_ref_code):
    response=requests.get(f"getUserDetails"/{booking_ref_code})
    data=response.json()
    return data['username']


def assignAgent(event, context):
    """Triggered from a message on a Cloud Pub/Sub topic."""
    pubsub_message = base64.b64decode(event['data']).decode('utf-8')
    
    try:

        #Retrieve values from the published message
        message_data = json.loads(pubsub_message)
        booking_ref_code = message_data.get('booking_ref_code')
        guest_username = message_data.get('sender')
        concern = message_data.get('message')
        
        if not all([booking_ref_code, guest_username, concern]):
            raise ValueError("Missing required fields in the message")

        agent = fetch_random_agent()
        agent_username = agent['email']

        message_with_agent = {
            'message': concern,
            'sender': guest_username,
            'receiver': agent_username,
            'booking_ref_code': booking_ref_code,
            'timestamp': firestore.SERVER_TIMESTAMP
        }

        # Update queries document
        query_ref = db.collection('queries').where('booking_ref_code', '==', booking_ref_code).limit(1)
        docs = query_ref.get()
        if docs:
            db.collection('queries').document(docs[0].id).update({
                'agent': agent_username
            })
        else:
            print(f"No query document found for booking_ref_code: {booking_ref_code}")

        # Add new message
        db.collection('messages').add(message_with_agent)

        print(f"Agent {agent_username} assigned to booking {booking_ref_code}")
        
    except json.JSONDecodeError:
        print("Error: Invalid JSON in message")
    except KeyError as e:
        print(f"Error: Missing expected key in message: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
    
    return 'OK'