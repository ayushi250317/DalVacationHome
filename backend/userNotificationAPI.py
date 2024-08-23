import boto3
import json

from boto3.dynamodb.conditions import Attr

USERS_TABLE_NAME = "users"

def lambda_handler(event, context):
    print(event)
    req = json.loads(event["body"])
    email = req["email"]
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table(USERS_TABLE_NAME)
    
    filter_exp = Attr("email").eq(email)
    db_resp = table.scan(
        FilterExpression=filter_exp
    )
    print(db_resp["Items"])
    
    if len(db_resp["Items"]) == 0:
        return {
            'statusCode': 200,
            'body': 'No user present with provided email!'
        }
    
    user_details = db_resp["Items"][0]
    sns_client = boto3.client("sns")
    topic = sns_client.create_topic(Name=user_details["id"] + "_an")
    sns_client.publish(
        TopicArn=topic["TopicArn"],
        Message=req["message"],
        Subject=req["subject"]
    )
    
    return {
        'statusCode': 200,
        'body': 'Message published to user!'
    }
