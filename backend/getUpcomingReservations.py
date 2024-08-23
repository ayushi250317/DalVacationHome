import json
import boto3
from decimal import Decimal
from datetime import datetime, date

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('room_reservation')
room_table = dynamodb.Table('room_info')

#Customer JSON Encoder to handle decimal values
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    try:
        current_date = date.today().isoformat()

        # Scan the room_reservation table for upcoming bookings
        response = table.scan(
            FilterExpression=boto3.dynamodb.conditions.Attr('start_date').gte(current_date)
        )
        
        if not response['Items']:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'No upcoming bookings found'}),
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

       
        combined_data.sort(key=lambda x: x['start_date'])

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