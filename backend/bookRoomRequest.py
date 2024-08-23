import json
import boto3

def lambda_handler(event, context):
   
        body = json.loads(event['body'])
        sqs = boto3.client('sqs')
    
   
        queue_url = 'https://sqs.us-east-1.amazonaws.com/022903751354/bookRoom.fifo'
  
        message = {
            'id': '12345',
            'room_number': body['room_number'],
            'start_date':body['start_date'],
            'end_date':body['end_date'],
            'reservation_date':body['reservation_date'],
            'username':body['username'],
            'timestamp': '2024-06-26T12:00:00Z',
        }
    

        response = sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=json.dumps(message),
            MessageGroupId=body['room_number']+body['username'],
            MessageDeduplicationId=body['room_number']+body['username']
        )
        
    
        return {
            'statusCode': 200,
             'body': json.dumps({'message': "Booking request processed successfully. You will receive confirmation mail soon."})
        }