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
    #Retrieve room number from the path
    room_number = event['pathParameters']['room_number']

    try:
        #Query table based on room number
        response = table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key('room_number').eq(room_number)
        )

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
            'body': json.dumps({'message': 'Failed to fetch applications', 'error': str(e)}),
        }
