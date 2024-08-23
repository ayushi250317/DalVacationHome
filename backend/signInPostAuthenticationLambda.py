import json
import boto3

TABLE_NAME="users"

def lambda_handler(event, context):
    # Authentication is successful
    print(event)
    user_attr = event["request"]["userAttributes"]
    
    # Get user details from DynamoDB
    dynamodb_client = boto3.client("dynamodb")
    get_response = dynamodb_client.get_item(
        TableName=TABLE_NAME,
        Key={
            'id': {'S': user_attr["sub"]}
        }
    )
    user_details = get_response["Item"]
    print(user_details)
    
    sns_client = boto3.client("sns")
    topic = sns_client.create_topic(Name=user_attr["sub"] + "_an")
    print(topic)
    
    if not user_details["reg_confirm_email"]["BOOL"]:
        sns_client.publish(
            TopicArn=topic["TopicArn"],
            Message=f"Hi {user_attr['given_name']} {user_attr['family_name']},\n\nYou have successfully created an account with Dal Vacation Home.\n\nRegards,\nDal Vacation Home Team",
            Subject="Account Notification"
        )
        dynamodb_client.update_item(
            TableName=TABLE_NAME,
            Key={
                'id': {'S': user_attr["sub"]}
            },
            UpdateExpression="set #reg_confirm_email = :rce",
            ExpressionAttributeNames={'#reg_confirm_email': 'reg_confirm_email'},
            ExpressionAttributeValues={":rce": {'BOOL': True}},
            ReturnValues="UPDATED_NEW"
        )
    
    sns_client.publish(
        TopicArn=topic["TopicArn"],
        Message=f"Hi {user_attr['given_name']} {user_attr['family_name']},\n\nYou have successfully logged into your Dal Vacation Home account.\n\nRegards,\nDal Vacation Home Team",
        Subject="Login Notification"
    )
    return event
