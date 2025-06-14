import re
import json

import re
import json

def load_responses():
    with open('responses.json', 'r') as f:
        return json.load(f)

responses = load_responses()

patterns = {
    'greeting': r"\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b",
    'feeling_positive': r"\b(happy|joyful|excited|great|fantastic|wonderful|good|well)\b",
    'feeling_negative': r"\b(sad|unhappy|depressed|anxious|stressed|worried|frustrated|tired|bad)\b",
    'help_request': r"\b(help|assist|support|guide|advice)\b",
    'thank_you': r"\b(thank you|thanks|appreciate it|cheers)\b",
    'farewell': r"\b(bye|goodbye|see you|later|take care)\b",
    'name_inquiry': r"\b(what is your name|who are you)\b",
    'age_inquiry': r"\b(how old are you)\b",
    'weather_inquiry': r"\b(what's the weather|weather like|is it raining)\b",
    'time_inquiry': r"\b(what time is it|what's the time)\b",
    'joke_request': r"\b(tell me a joke|joke please|make me laugh)\b",
    'news_inquiry': r"\b(what's the news|any news)\b",
    'location_inquiry': r"\b(where are you from|where are you located)\b",
    'ability_inquiry': r"\b(what can you do|what are your capabilities)\b",
    'yes_response': r"\b(yes|yeah|yup|sure|okay)\b",
    'no_response': r"\b(no|nope|nah|not really)\b",
    'maybe_response': r"\b(maybe|perhaps|possibly|could be)\b",
    'default_inquiry': r"\b(what|why|how|when|where|who)\b", # General question words
    'specific_question': r"^(.*)\?$", # Matches any question ending with a question mark
}

def classify_intent(text: str) -> str:
    text = text.lower()
    for intent, pattern in patterns.items():
        if re.search(pattern, text):
            return intent
    return 'fallback'

def get_response(text: str) -> str:
    intent = classify_intent(text)
    return responses.get(intent, responses['fallback'])

if __name__ == '__main__':
    print(classify_intent("Hello!"))
    print(classify_intent("I feel really sad today."))
    print(classify_intent("Can you help me with something?"))
    print(classify_intent("Thanks a lot!"))
    print(classify_intent("What time is it?"))
    print(classify_intent("Tell me a joke."))
    print(classify_intent("Where are you from?"))
    print(classify_intent("What do you do?"))
    print(classify_intent("Is it going to rain?"))
    print(classify_intent("Just wondering what is up?"))