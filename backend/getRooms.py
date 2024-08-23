import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('room_info')

# Custom JSON encoder to handle Decimal
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    try:
        #Scan table to get list of all rooms
        response = table.scan()

        return {
            'statusCode': 200,
            'headers': {
             'Access-Control-Allow-Origin': '*'
           },
            'body': json.dumps(response['Items'],cls=DecimalEncoder),
             
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
             'Access-Control-Allow-Origin': '*'
           },
            'body': json.dumps({'message': 'Failed to fetch rooms', 'error': str(e)}),
        }
