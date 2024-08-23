import base64
import json
from google.cloud import pubsub_v1

def processpubsubmessages(request):
    try:
        request_json = request.get_json()

        if 'username' not in request_json:
            return json.dumps({'error': '"username" field is required in the request JSON.'}), 400, {'Content-Type': 'application/json'}

        logged_in_username = request_json['username']
        subscription_path = 'projects/csci-5410-428021/subscriptions/CustomerService-sub'

        # Initialize Pub/Sub client
        subscriber = pubsub_v1.SubscriberClient()

        # Pull messages from Pub/Sub subscription
        while True:
            response = subscriber.pull(
                request={
                    "subscription": subscription_path,
                    "max_messages": 100, 
                }
            )

        # Process pulled messages
            messages = response.received_messages
            filtered_messages = []
            for message in messages:
                try:
                    # Decode message data
                    message_data = message.message.data
                    decoded_data = message_data.decode('latin-1')
                    try:
                        message_json = json.loads(decoded_data)
                    except json.JSONDecodeError:
                        message_json = {"raw_data": decoded_data}

                    if ('receiver' in message_json and message_json['receiver'] == logged_in_username) or \
                            ('sender' in message_json and message_json['sender'] == logged_in_username):
                            filtered_messages.append(message_json)

                #Acknowledge the message to remove it from the subscription
                            subscriber.acknowledge(
                                request={
                                    "subscription": subscription_path,
                                    "ack_ids": [message.ack_id],
                                }
                            )

                except Exception as e:
                    print(f"Error processing message: {str(e)}")

            print(f"Number of filtered messages: {len(filtered_messages)}")  

        # Return filtered messages in the response
            return json.dumps(filtered_messages), 200, {'Content-Type': 'application/json'}

    except Exception as e:
        print(f"Error in main function: {str(e)}") 
        return json.dumps({'error': f'Error processing messages: {str(e)}'}), 500, {'Content-Type': 'application/json'}