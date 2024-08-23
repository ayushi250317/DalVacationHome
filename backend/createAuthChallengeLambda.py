import json
import string
import random

def caesar_cipher_encrypt(text, key):
    encrypted_text = []
    text = text.lower()
    
    for char in text:
        if char.isalpha():
            shift = key % 26
            shifted = ord(char) + shift
            if shifted > ord('z'):
                shifted -= 26
            encrypted_text.append(chr(shifted))
    
    return ''.join(encrypted_text)

def generate_random_lower_case_string(length=6):
    lowercase_ascii_letters = string.ascii_letters[0:26]
    return ''.join(random.choice(lowercase_ascii_letters) for _ in range(length))

def lambda_handler(event, context):
    # Create Auth Challenge function
    print(event)
    
    if event["request"]["challengeName"] != "CUSTOM_CHALLENGE":
        return event
    
    if len(event["request"]["session"]) == 1 and \
        event["request"]["session"][0]["challengeName"] == "PASSWORD_VERIFIER":
        event["response"]["publicChallengeParameters"] = {}
        event["response"]["privateChallengeParameters"] = {}
        event["response"]["publicChallengeParameters"]["securityQuestion"] = event["request"]["userAttributes"]["custom:sec_question"]
        event["response"]["privateChallengeParameters"]["answer"] = event["request"]["userAttributes"]["custom:sec_question_answer"]
        
    if len(event["request"]["session"]) == 2:
        plaintext_str = generate_random_lower_case_string()
        event["response"]["publicChallengeParameters"] = {}
        event["response"]["privateChallengeParameters"] = {}
        event["response"]["publicChallengeParameters"]["caesarPassphrase"] = caesar_cipher_encrypt(plaintext_str, int(event["request"]["userAttributes"]["custom:caesar_cipher_key"]))
        event["response"]["privateChallengeParameters"]["answer"] = plaintext_str

    return event
