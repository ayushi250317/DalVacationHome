import json
from google.cloud import firestore

# Initialize a Firestore client
db = firestore.Client(project='csci-5410-428021', database='userdetails')

def getCustomerQueries(request):
    
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

    # Extract username from the query parameters
    username = request.args.get('username')
    if not username:
        return (json.dumps({'message': 'Username parameter is missing'}), 400, headers)

    try:
        # Query the Firestore to fetch queries for the given username
        applications_ref = db.collection('queries')
        query = applications_ref.where('agent', '==', username)
        docs = query.stream()

        applications = [doc.to_dict() for doc in docs]

        # Return the response with status code 200 
        return (json.dumps(applications), 200, headers)

    except Exception as e:
        # Return an error response with status code 500 and error details
        return (json.dumps({'message': 'Failed to fetch queries', 'error': str(e)}), 500, headers)