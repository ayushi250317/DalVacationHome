import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('room_reservation')
room_table = dynamodb.Table('room_info')

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    username = event['pathParameters']['username']

    try:
        # Scan the room_reservation table for the given username
        response = table.scan(
            FilterExpression=boto3.dynamodb.conditions.Attr('username').eq(username)
        )
        
        if not response['Items']:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'No bookings found for the provided username'}),
            }

        # For each booking, get the room information from the room_info table
        bookings = response['Items']
        combined_data = []
        for booking in bookings:
            room_response = room_table.query(
                KeyConditionExpression=boto3.dynamodb.conditions.Key('room_number').eq(booking['room_number'])
            )

            if room_response['Items']:
                room_info = room_response['Items'][0]  
                combined_booking = {**booking, **room_info}
                combined_data.append(combined_booking)
            else:
                combined_data.append(booking)  

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
