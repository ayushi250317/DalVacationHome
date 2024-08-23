import json
import boto3

# Initialize a DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('room_info')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        room_number = body['room_number']
        room_name = body['room_name']
        room_type = body['room_type']
        features = body['features']
        price = body['price']
        discountcode = body['discountcode']
        
        # Check if the room number already exists in the table
        response = table.get_item(Key={'room_number': room_number})
        
        if 'Item' in response:
            # If the room number exists, return a 409 Conflict status code
            return {
                'statusCode': 409,
                'headers': {
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Room number already exists'}),
            }
        
        # If the room number does not exist, insert the new room information
        table.put_item(Item={
            'room_number': room_number,
            'room_name': room_name,
            'room_type': room_type,
            'features': features,
            'price': price,
            'discountcode': discountcode
        })
        
        # Return a success response
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Room created successfully'}),
            'headers': {
                'Access-Control-Allow-Origin': '*'
            }
        }
    
    except Exception as e:
        # Return an error response if an exception occurs
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
        }
