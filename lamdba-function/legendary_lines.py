# lambda_functions/legendary_lines.py
import json
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

AI_PERSONALITY_PROMPT = """You are an enthusiastic, witty, and super encouraging game show host for 'Legendary Lines'! 🎮 

Your personality traits:
- Super energetic and excited about the game! 🌟
- Always celebrate player's successes with genuine enthusiasm! 🎉
- Use fun expressions like "You're crushing it!", "What a superstar!", "You're on fire!" 🔥
- Be playful and engaging, like a friend cheering them on! 💫
- Use emojis naturally to express excitement and emotions! ✨
- Always mention points earned with enthusiasm! 🏆
- Keep the energy high even when players make mistakes! 💪
- Be encouraging and supportive, never discouraging! 🌈

YOU MUST USE THESE EXACT RESPONSE TEMPLATES but add your enthusiastic personality and emojis:

FOR CORRECT SOURCE ANSWER USE THIS EXACT FORMAT:
Your answer is correct! The [type] is indeed '[answer]'. 🎯

Would you like to try guessing the year for DOUBLE points?
(Yes/No)

FOR CORRECT YEAR ANSWER USE THIS EXACT FORMAT:
That's spot on! The [type] '[answer]' was released in [year]. 🎉

Would you like to try guessing the artist for TRIPLE points?
(Yes/No)

FOR WRONG ANSWERS USE THIS EXACT FORMAT:
The answer was '[correct]'. No worries though - you've got this next one! 💫

FOR BONUS DECLINES USE THIS EXACT FORMAT:
Alright! You keep your [X] points for this round. Let's move on! ⭐"""

def generate_phrase(event, context):
    try:
        body = json.loads(event['body'])
        category = body.get('category', 'QUOTE')
        difficulty = body.get('difficulty', 'MEDIUM')
        difficulty_config = body.get('difficultyConfig')
        conversation_history = body.get('conversationHistory')

        system_message = {
            "role": "system",
            "content": f"{AI_PERSONALITY_PROMPT}\nYou are a game master for 'Legendary Lines'. Generate {difficulty_config['popularity']} content for the {category} category. Focus on {difficulty_config['description']}."
        }

        user_message = {
            "role": "user",
            "content": f"Generate a {difficulty.lower()} difficulty {category.lower()} phrase."
        }

        messages = [system_message]
        if conversation_history:
            messages.append({
                "role": "system",
                "content": f"Previous game history: {json.dumps(conversation_history)}"
            })
        messages.append(user_message)

        completion = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            functions=[{
                "name": "generatePhrase",
                "description": "Generate a phrase or quote for the game based on category and difficulty",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "phrase": {
                            "type": "string",
                            "description": "The actual quote or phrase to be guessed"
                        },
                        "source": {
                            "type": "string",
                            "description": "The origin of the phrase (book title, movie name, etc.)"
                        },
                        "year": {
                            "type": "number",
                            "description": "The year the source was released/published"
                        },
                        "hint": {
                            "type": "string",
                            "description": "A subtle hint without giving away the answer"
                        },
                        "additionalInfo": {
                            "type": "object",
                            "properties": {
                                "creator": {
                                    "type": "string",
                                    "description": "Director (for movies), Artist/Band (for songs), or Author (for books)"
                                },
                                "genre": {
                                    "type": "string",
                                    "description": "The genre of the source material"
                                }
                            }
                        }
                    },
                    "required": ["phrase", "source", "year", "hint"]
                }
            }],
            function_call={"name": "generatePhrase"}
        )

        function_call = completion.choices[0].message.function_call
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            'body': function_call.arguments
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            'body': json.dumps({'error': str(e)})
        }

def check_answer(event, context):
    try:
        body = json.loads(event['body'])
        player_answer = body.get('playerAnswer')
        correct_answer = body.get('correctAnswer')
        answer_type = body.get('answerType', 'source')
        conversation_history = body.get('conversationHistory', [])

        messages = [
            {
                "role": "system",
                "content": f"""{AI_PERSONALITY_PROMPT}

                VALIDATION RULES:
                1. For bonus confirmation questions (yes/no):
                   - Accept variations: "yes", "yeah", "sure", "y", "ok" as affirmative
                   - Accept variations: "no", "nope", "pass", "skip", "n" as negative
                
                2. For source/creator answers:
                   - Ignore case sensitivity
                   - Accept common variations and abbreviations
                   - Be flexible with minor typos
                
                3. For year answers:
                   - Must be exact match
                   - Only accept precise year number

                Previous conversation context: {json.dumps(conversation_history)}"""
            },
            {
                "role": "user",
                "content": f"""Question type: {answer_type}
                             Player's answer: "{player_answer}"
                             Correct answer: "{correct_answer}"
                             Context: {"This is a response to whether they want to attempt the bonus round" if "bonus_confirmation" in answer_type else "This is an actual answer attempt"}"""
            }
        ]

        completion = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            functions=[{
                "name": "validateAnswer",
                "description": "Validate player's answer and return the exact formatted response",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "isCorrect": {
                            "type": "boolean",
                            "description": "Whether the answer is correct or if the player wants to continue with bonus"
                        },
                        "feedback": {
                            "type": "string",
                            "description": "The EXACT formatted response following the templates"
                        },
                        "isBonusResponse": {
                            "type": "boolean",
                            "description": "Whether this was a response to a bonus question prompt"
                        },
                        "bonusDeclined": {
                            "type": "boolean",
                            "description": "Whether the player has declined to attempt the bonus round"
                        }
                    },
                    "required": ["isCorrect", "feedback", "isBonusResponse"]
                }
            }],
            function_call={"name": "validateAnswer"}
        )

        function_call = completion.choices[0].message.function_call
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            'body': function_call.arguments
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            'body': json.dumps({'error': str(e)})
        }