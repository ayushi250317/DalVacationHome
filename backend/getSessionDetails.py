import json
import boto3

def lambda_handler(event, context):
    session = boto3.session.Session()

    # Get session details
    session_details = {
        'Region': session.region_name,
        'Access Key ID': session.get_credentials().access_key,
        'Secret Access Key': session.get_credentials().secret_key,
        'Session Token': session.get_credentials().token
    }

    return {
        'statusCode': 200,
        'body': json.dumps(session_details),
        'headers': {
            'Access-Control-Allow-Origin': '*'
          },
    }
