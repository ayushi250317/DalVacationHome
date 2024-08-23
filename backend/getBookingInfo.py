import json
import boto3
from decimal import Decimal

#Initialize dynamodb resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('room_reservation')
room_table = dynamodb.Table('room_info')

# Custom JSON encoder to handle Decimal
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    booking_ref_code = event['pathParameters']['booking_ref_code']

    try:
        # Query the room_reservation table
        response = table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key('booking_ref_code').eq(booking_ref_code)
        )
        
        if not response['Items']:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Booking reference code not found'}),
            }

        data = response['Items'][0]  

        # Query the room_info table using the room_number from the reservation data
        room_response = room_table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key('room_number').eq(data['room_number'])
        )
        
        if not room_response['Items']:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Room information not found'}),
            }

        room_info = room_response['Items'][0]  

        # Combine the data from both tables
        combined_data = {**data, **room_info}

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(combined_data, cls=DecimalEncoder),
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Failed to fetch data', 'error': str(e)}),
        }
