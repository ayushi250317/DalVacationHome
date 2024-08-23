import json
import boto3

TABLE_NAME="users"

def lambda_handler(event, context):
    print(event)
    user_attr = event["request"]["userAttributes"]
    dynamodb_client = boto3.client("dynamodb")
    dynamodb_client.put_item(TableName=TABLE_NAME, Item={
        'id': {'S' : user_attr["sub"]},
        'first_name': {'S': user_attr["given_name"]},
        'last_name': {'S': user_attr["family_name"]},
        'email': {'S' : user_attr["email"]},
        'cipher_key': {'S' : user_attr["custom:caesar_cipher_key"]},
        'security_question': {'S' : user_attr["custom:sec_question"]},
        'security_question_answer': {'S' : user_attr["custom:sec_question_answer"]},
        'user_type': {'S' : user_attr["custom:user_type"] },
        'reg_confirm_email': {'BOOL': False},
        'num_login': {'N' : '0'}
    })
    
    # Signup is successful
    sns_client = boto3.client("sns")
    # Create a SNS topic where future login messages will be sent
    topic = sns_client.create_topic(Name=user_attr["sub"] + "_an")
    print(topic)
    sns_client.subscribe(TopicArn=topic["TopicArn"], Protocol="email", Endpoint=user_attr["email"])
    sns_client.publish(
        TopicArn=topic["TopicArn"],
        Message=f"Hi {user_attr['given_name']} {user_attr['family_name']},\n\nYou have successfully created an account with Dal Vacation Home.\n\nRegards,\nDal Vacation Home Team",
        Subject="Account Notification"
    )
    # Update login count
    dynamodb_client.update_item(
        TableName=TABLE_NAME,
        Key={
            'id': {'S': user_attr["sub"]}
        },
        UpdateExpression="set #nl = :count",
        ExpressionAttributeNames={'#nl': 'num_login'},
        ExpressionAttributeValues={":count": {'N': str(int(user_details["num_login"]["N"]) + 1)}},
        ReturnValues="UPDATED_NEW"
    )
    
    return event
