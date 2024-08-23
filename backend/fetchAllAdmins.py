import json
import boto3
from boto3.dynamodb.conditions import Key, Attr
from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, Decimal):
      return str(obj.normalize())
    return json.JSONEncoder.default(self, obj)

def lambda_handler(event, context):
    
    # Initialize a session using Amazon DynamoDB
    dynamodb = boto3.resource('dynamodb')
    
    # Select your DynamoDB table
    table = dynamodb.Table('users')

    # Scan the table
    response = table.scan()
    data = response.get('Items', [])
    
    # Check for pagination
    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        data.extend(response.get('Items', []))
    
    print(data)
    data = list(filter(lambda user : True if user["user_type"] == "admin" else False, data))
    
    # Return the data
    return {
        'statusCode': 200,
        'body': json.dumps(data, cls=DecimalEncoder)
    }
