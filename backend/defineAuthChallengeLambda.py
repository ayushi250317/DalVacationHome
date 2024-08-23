import json

def lambda_handler(event, context):
    print(event)
    
    if len(event["request"]["session"]) == 0:
        event["response"]["challengeName"] = "PASSWORD_VERIFIER"
        event["response"]["issueTokens"] = False
        event["response"]["failAuthentication"] = False
    elif len(event["request"]["session"]) == 1:
        event["response"]["challengeName"] = "CUSTOM_CHALLENGE"
        event["response"]["issueTokens"] = False
        event["response"]["failAuthentication"] = False
    elif len(event["request"]["session"]) == 2 and \
             event["request"]["session"][1]["challengeName"] == "CUSTOM_CHALLENGE" and \
             event["request"]["session"][1]["challengeResult"] == True:
        event["response"]["challengeName"] = "CUSTOM_CHALLENGE"
        event["response"]["issueTokens"] = False
        event["response"]["failAuthentication"] = False
    elif len(event["request"]["session"]) == 3 and \
             event["request"]["session"][2]["challengeName"] == "CUSTOM_CHALLENGE" and \
             event["request"]["session"][2]["challengeResult"] == True:
        event["response"]["issueTokens"] = True
        event["response"]["failAuthentication"] = False
    else:
        event["response"]["issueTokens"] = False
        event["response"]["failAuthentication"] = True
        
    return event
