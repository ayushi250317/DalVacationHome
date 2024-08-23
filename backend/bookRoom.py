import json
import boto3
from datetime import datetime
import random
import string
import logging

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('room_reservation')
sns = boto3.client('sns')

def lambda_handler(event, context):
    try:
        if 'Records' in event:
            logger.info(f"Received {len(event['Records'])} messages from SQS trigger")
            for record in event['Records']:
                process_message(record['body'])
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': "Booking successful"})
        }
    except Exception as e:
        logger.error(f"Error processing messages: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def process_message(message_body):
    body = json.loads(message_body)
    logger.info(f"Processing message: {body}")
    
    room_number = body['room_number']
    start_date = datetime.strptime(body['start_date'], '%m/%d/%Y').date().isoformat()
    end_date = datetime.strptime(body['end_date'], '%m/%d/%Y').date().isoformat()
    reservation_date = datetime.strptime(body['reservation_date'], '%m/%d/%Y').date().isoformat()
    username = body['username']
    
    booking_ref_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    
    table.put_item(Item={
        'booking_ref_code': booking_ref_code,
        'room_number': room_number,
        'start_date': start_date,
        'end_date': end_date,
        'reservation_date': reservation_date,
        'username': username
    })
    sendnotification(body,booking_ref_code)
    
    logger.info(f"Reservation added to DynamoDB: {booking_ref_code}")
    
def sendnotification(body,booking_ref_code):
    topic_arn='arn:aws:sns:us-east-1:022903751354:bookingNotification'
    username=body['username']
        
    sns.publish(
        TopicArn=topic_arn,
        Message=f"Your booking for DalVacation home with reference code {booking_ref_code} is successful for room number {body['room_number']} from {body['start_date']} to {body['end_date']}",
        Subject=f"Booking Confirmation - {booking_ref_code}",
        MessageAttributes={
            'username': {
                'DataType': 'String',
                'StringValue': username
            }
        }
    )