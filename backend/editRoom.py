import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('room_info')

def lambda_handler(event, context):
    try:
        request_body = json.loads(event['body'])
        
        # Get the item ID from the path parameters
        item_id = event['pathParameters']['id']
        
        update_expression = 'SET '
        expression_attribute_names = {}
        expression_attribute_values = {}
        
        for i, attr in enumerate(request_body.keys()):
            expr_attr_name = '#attr' + str(i)
            expression_attribute_names[expr_attr_name] = attr
            expression_attribute_values[':value' + str(i)] = request_body[attr]
            
            update_expression += f"{expr_attr_name} = :value{i}, "
        
        update_expression = update_expression[:-2]
        
        # Update the item in DynamoDB
        response = table.update_item(
            Key={'room_number': item_id},
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_attribute_names,
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues='UPDATED_NEW'
        )
        
        response_body = {
            "message": "Room details updated successfully",
            "item": response['Attributes']
        }
        
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps(response_body)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
            'Access-Control-Allow-Origin': '*'
        },
            'body': json.dumps({'error': str(e)}),
        }    
