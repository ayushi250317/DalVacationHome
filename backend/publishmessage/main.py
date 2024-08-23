import os
import json
from google.cloud import pubsub_v1
from google.cloud import firestore
import requests


# Initialize the Pub/Sub client
publisher = pubsub_v1.PublisherClient()
project_id = "csci-5410-428021"
topic_id = "CustomerService"
topic_path = publisher.topic_path(project_id, topic_id)
db = firestore.Client(project='csci-5410-428021',database='userdetails')

getUserDetails = 'https://14ul0d9spk.execute-api.us-east-1.amazonaws.com/dev/bookingInfo'

def fetch_user_details(booking_ref_code):
    url = f"{getUserDetails}/{booking_ref_code}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return data.get('username')
    else:
        raise Exception(f"API request failed with status code: {response.status_code}")
    
def publish_message_to_agent(request):
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    headers = {
        'Access-Control-Allow-Origin': '*'
    }


    try:
        request_json = request.get_json(silent=True)
        if request_json is None:
            return "No JSON data found in the request", 400, headers

        #REtrieve concern, booking_ref_code and username
        message = request_json.get('message')
        booking_ref_code=request_json.get('booking_ref_code')
        guest_username = fetch_user_details(booking_ref_code)

        if not message or not guest_username:
            return "Message or guest_username is missing in the request", 400, headers

        raise_concern = {
            'message': message,
            'sender': guest_username,
            'booking_ref_code' : booking_ref_code
        }

        query_details = {
            'guest' : guest_username,
            'booking_ref_code' : booking_ref_code,
            'query' : message
        }

        #Add record in queries collection
        db.collection('queries').add(query_details)

        message_json = json.dumps(raise_concern)
        message_bytes = message_json.encode('utf-8')

        # Publish the message
        message = publisher.publish(topic_path, data=message_bytes)
        message_id = message.result()

        return (json.dumps({'message_id': message_id, 'message' : 'Message published successfully'}), 200, headers)

    except Exception as e:
        return (json.dumps({'error': f'Error publishing message: {e}'}), 500, headers)


