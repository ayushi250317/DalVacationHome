import json
from google.cloud import firestore
from google.api_core.datetime_helpers import DatetimeWithNanoseconds

# Initialize a Firestore client
db = firestore.Client(project='csci-5410-428021', database='userdetails')

class FirestoreEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, DatetimeWithNanoseconds):
            return obj.isoformat()
        return super(FirestoreEncoder, self).default(obj)

def getMessages(request):
    
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

    # Extract booking_ref_code from the query parameters
    booking_ref_code = request.args.get('booking_ref_code')
    if not booking_ref_code:
        return (json.dumps({'message': 'Booking reference parameter is missing'}), 400, headers)

    try:
        # Query the Firestore to fetch messages for the given booking_ref_code
        messages_ref = db.collection('messages')
        query = messages_ref.where('booking_ref_code', '==', booking_ref_code)
        docs = query.stream()

        messages = [doc.to_dict() for doc in docs]

        # Sort messages by timestamp 
        messages.sort(key=lambda x: x.get('timestamp', ''), reverse=False)

        # Return the response with status code 200 and list of messages
        return (json.dumps(messages, cls=FirestoreEncoder), 200, headers)

    except Exception as e:
        # Return an error response with status code 500 and error details
        return (json.dumps({'message': 'Failed to fetch queries', 'error': str(e)}), 500, headers)