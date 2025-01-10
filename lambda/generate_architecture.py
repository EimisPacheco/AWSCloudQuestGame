import json
import openai
import os
import random
from typing import Dict, List, TypedDict

class ServiceOption(TypedDict):
    service: str
    rating: float
    explanation: str
    isCorrect: bool
    isOptimal: bool

class MissingService(TypedDict):
    position: str
    optimizationFocus: str
    options: List[ServiceOption]

class Architecture(TypedDict):
    architecture: Dict[str, str]
    services: List[str]
    connections: List[Dict[str, str]]
    missingServices: List[MissingService]

# Acronym to full name mapping
ACRONYM_MAPPING = {
    'IAM': 'Identity and Access Management',
    'EC2': 'Elastic Compute Cloud',
    'RDS': 'Relational Database Service',
    'S3': 'Simple Storage Service',
    'VPC': 'Virtual Private Cloud',
    'ELB': 'Elastic Load Balancing',
    'ALB': 'Application Load Balancer',
    'NLB': 'Network Load Balancer',
    'EFS': 'Elastic File System',
    'EBS': 'Elastic Block Store',
    'SNS': 'Simple Notification Service',
    'SQS': 'Simple Queue Service',
    'SES': 'Simple Email Service',
    'CloudFront': 'CloudFront',
    'Route 53': 'Route 53',
    'DynamoDB': 'DynamoDB',
    'ElastiCache': 'ElastiCache',
    'Lambda': 'Lambda',
    'API Gateway': 'API Gateway',
    'ECS': 'Elastic Container Service',
    'EKS': 'Elastic Kubernetes Service',
    'ECR': 'Elastic Container Registry',
    'CloudWatch': 'CloudWatch',
    'CloudTrail': 'CloudTrail',
    'CloudFormation': 'CloudFormation',
    'WAF': 'Web Application Firewall',
    'KMS': 'Key Management Service',
    'SWF': 'Simple Workflow Service',
    'EMR': 'Elastic MapReduce',
    'Redshift': 'Redshift',
    'Athena': 'Athena',
    'Glue': 'Glue',
    'Kinesis': 'Kinesis',
    'Step Functions': 'Step Functions',
    'Cognito': 'Cognito',
    'Elastic Beanstalk': 'Elastic Beanstalk',
    'ACM': 'Certificate Manager',
    'SSM': 'Systems Manager',
    'OpsWorks': 'OpsWorks',
    'Config': 'Config',
    'Direct Connect': 'Direct Connect',
    'Storage Gateway': 'Storage Gateway',
    'AppSync': 'AppSync',
    'Neptune': 'Neptune',
    'Aurora': 'Aurora',
    'DocumentDB': 'DocumentDB',
    'Elasticsearch Service': 'Elasticsearch Service',
    'MSK': 'Managed Streaming for Apache Kafka',
    'SageMaker': 'SageMaker',
    'Comprehend': 'Comprehend',
    'Lex': 'Lex',
    'Polly': 'Polly',
    'Rekognition': 'Rekognition',
    'Textract': 'Textract',
    'Translate': 'Translate',
    'Connect': 'Connect',
    'WorkSpaces': 'WorkSpaces',
    'GuardDuty': 'GuardDuty',
    'Inspector': 'Inspector',
    'Macie': 'Macie',
    'Secrets Manager': 'Secrets Manager',
    'Shield': 'Shield',
    'Firewall Manager': 'Firewall Manager',
    'Lake Formation': 'Lake Formation',
    'Batch': 'Batch',
    'Amplify': 'Amplify',
    'AppStream': 'AppStream',
    'FSx': 'FSx',
    'Global Accelerator': 'Global Accelerator',
    'Outposts': 'Outposts',
    'Snow Family': 'Snow Family',
    'Transfer Family': 'Transfer Family',
    'VMware Cloud': 'VMware Cloud on AWS'
}

def validate_flow_structure(architecture_data: dict) -> bool:
    """Validate that the architecture data has all required elements for React Flow"""
    try:
        # Check basic structure
        if not all(key in architecture_data for key in ['architecture', 'services', 'connections', 'missingServices']):
            raise ValueError("Missing required top-level keys")

        # Validate services exist and are strings
        if not isinstance(architecture_data['services'], list):
            raise ValueError("Services must be a list")
        if not all(isinstance(s, str) for s in architecture_data['services']):
            raise ValueError("All services must be strings")

        # Validate connections have valid from/to references
        if not isinstance(architecture_data['connections'], list):
            raise ValueError("Connections must be a list")
        
        service_names = set(architecture_data['services'])
        for conn in architecture_data['connections']:
            if not isinstance(conn, dict) or 'from' not in conn or 'to' not in conn:
                raise ValueError("Each connection must have 'from' and 'to' properties")
            # Verify connection references existing services
            if conn['from'] not in service_names or conn['to'] not in service_names:
                raise ValueError(f"Connection references non-existent service: {conn}")

        # Validate missing services structure
        missing_services_count = len(architecture_data['missingServices'])
        if missing_services_count not in [3, 5, 7]:
            raise ValueError(f"Invalid number of missing services: {missing_services_count}")

        for ms in architecture_data['missingServices']:
            if not all(key in ms for key in ['position', 'optimizationFocus', 'options']):
                raise ValueError("Missing service missing required fields")
            if not isinstance(ms['options'], list) or len(ms['options']) != 4:
                raise ValueError("Each missing service must have exactly 4 options")
            
            # Validate each option has required fields for React Flow nodes
            for opt in ms['options']:
                if not all(key in opt for key in ['service', 'rating', 'explanation', 'isCorrect', 'isOptimal']):
                    raise ValueError("Service option missing required fields")

        return True

    except Exception as e:
        print(f"Validation error: {str(e)}")
        return False

def generate_architecture(difficulty: str) -> Architecture:
    openai.api_key = os.environ['OPENAI_API_KEY']
    
    # Determine the number of missing services based on difficulty
    if difficulty.upper() == "BEGINNER":
        missing_services_count = 3
    elif difficulty.upper() == "INTERMEDIATE":
        missing_services_count = 5
    elif difficulty.upper() == "ADVANCED":
        missing_services_count = 7
    else:
        missing_services_count = 3  # Default to beginner if unknown difficulty
    
    try:
        completion = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                "role": "system",
                "content": f"""You are an AWS architecture expert. Generate realistic AWS architecture scenarios.
                
                For each architecture:
                - Provide a clear name (e.g., "Serverless Data Pipeline", "Scalable E-commerce Platform")
                - Include a brief description explaining its purpose and key features
                - Design a realistic service topology
                
                For each missing service position:
                - Ensure that the missing service placeholder (e.g., "missing_1") appears in the "services" array.
                - Ensure that the missing service placeholder (e.g., "missing_1") appears in the "connections" array.
                - Ensure that all the service names and missing service placeholder are in the correct order in the "services" array and the "connections" array.
                - Place the missing service between existing services in the connections array (e.g., "from": "previous_service", "to": "missing_1").
                - Include a specific question in each missing service block, formatted in a similar way as: "What is the ideal service for <position>?" (only in a similar way but be creative, no repetitive)
                - Provide exactly 4 options: 2 correct (with 1 optimal) and 2 incorrect. Please, make sure you are not repeating the same service name in the same four option set.
                - The optimal choice should randomly vary between cost-efficiency, performance, scalability, or maintainability.
                - Explain why each option is or isn't suitable.

                Generate an architecture with exactly {missing_services_count} missing services.
                """
                },
                {
                    "role": "user",
                    "content": f"Generate a random {difficulty} AWS architecture with {missing_services_count} missing services. Make it a realistic scenario that a company might implement. Sometimes include architectures where two services share the same dependency from one service, and there are also parallel nodes."
                }
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "aws_architecture_schema",
                    "schema": {
                        "type": "object",
                        "required": ["architecture", "services", "connections", "missingServices"],
                        "properties": {
                            "architecture": {
                                "type": "object",
                                "required": ["name", "description"],
                                "properties": {
                                    "name": {"type": "string"},
                                    "description": {"type": "string"}
                                }
                            },
                            "services": {
                                "type": "array",
                                "items": {"type": "string"}
                            },
                            "connections": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "required": ["from", "to"],
                                    "properties": {
                                        "from": {"type": "string"},
                                        "to": {"type": "string"}
                                    }
                                }
                            },
                            "missingServices": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "required": ["position", "options", "optimizationFocus", "question"],
                                    "properties": {
                                        "position": {"type": "string"},
                                        "optimizationFocus": {
                                            "type": "string",
                                            "enum": ["cost", "performance", "scalability", "maintainability"]
                                        },
                                        "question": {
                                            "type": "string",
                                            "description": "A question prompting the user to identify the missing service"
                                        },
                                        "options": {
                                            "type": "array",
                                            "minItems": 4,
                                            "maxItems": 4,
                                            "items": {
                                                "type": "object",
                                                "required": ["service", "rating", "explanation", "isCorrect", "isOptimal"],
                                                "properties": {
                                                    "service": {"type": "string"},
                                                    "rating": {"type": "number"},
                                                    "explanation": {"type": "string"},
                                                    "isCorrect": {"type": "boolean"},
                                                    "isOptimal": {"type": "boolean"}
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        )

        # Parse the OpenAI response
        return json.loads(completion.choices[0].message.content)
    
    except Exception as e:
        print(f"Error generating architecture: {str(e)}")
        # Fallback response
        services = random.sample(list(ACRONYM_MAPPING.keys()), missing_services_count + 1)
        missing_services = random.sample([s for s in ACRONYM_MAPPING.keys() if s not in services], missing_services_count)
        
        return {
            "architecture": {
                "name": "Fallback Architecture",
                "description": "A basic architecture generated due to an error."
            },
            "services": services,
            "connections": [
                {"from": services[i], "to": services[i+1]} 
                for i in range(len(services)-1)
            ],
            "missingServices": [
                {
                    "position": f"Position {i+1}",
                    "optimizationFocus": random.choice(["cost", "performance", "scalability", "maintainability"]),
                    "options": [
                        {
                            "service": service,
                            "rating": round(random.uniform(1, 10), 1),
                            "explanation": f"{ACRONYM_MAPPING[service]} could be used here",
                            "isCorrect": random.choice([True, False]),
                            "isOptimal": False
                        }
                        for service in random.sample(list(ACRONYM_MAPPING.keys()), 4)
                    ]
                }
                for i, service in enumerate(missing_services)
            ]
        }

def lambda_handler(event, context):
    try:
        # Parse the request body if it exists, otherwise use default difficulty
        body = json.loads(event.get('body', '{}')) if event.get('body') else {}
        difficulty = body.get('difficulty', 'BEGINNER').upper()
        
        # Validate difficulty level
        if difficulty not in ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']:
            difficulty = 'BEGINNER'
        
        architecture = generate_architecture(difficulty)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
                'Access-Control-Allow-Methods': 'POST,OPTIONS',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'  # For CORS
            },
            'body': json.dumps(architecture)
        }
        
    except Exception as e:
        print(f"Lambda handler error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': str(e)
            })
        }