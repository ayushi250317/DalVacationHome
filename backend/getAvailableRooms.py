import json
import boto3
from datetime import datetime
from boto3.dynamodb.conditions import Attr
from decimal import Decimal

#Initialize dynamodb resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('room_info')
avail_table = dynamodb.Table("room_reservation")

# Custom JSON encoder to handle Decimal
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    try:

        #Retrieve query parameters
        start_date_str = event['queryStringParameters']['start_date']
        end_date_str = event['queryStringParameters']['end_date']
        start_date = datetime.strptime(start_date_str, '%m-%d-%Y').date()
        end_date = datetime.strptime(end_date_str, '%m-%d-%Y').date()
        room_type=event['queryStringParameters']['room_type']
        
        response = table.scan( FilterExpression=(Attr('room_type').eq(room_type)))
        
        avail_rooms = []
        rooms = response.get('Items', [])
        
        #Scan all the rooms for checking availability between given dates
        for room in rooms:
            response = avail_table.scan(
                FilterExpression = (
                    Attr('room_number').eq(room.get('room_number')) &
                    Attr('start_date').lte(end_date.isoformat()) &
                    Attr('end_date').gte(start_date.isoformat()) 
                )
            )
            
            
            avail = response['Items']
            if len(avail) == 0:
                avail_rooms.append(room)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(avail_rooms, cls=DecimalEncoder),
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Failed to fetch rooms', 'error': str(e)}),
        }