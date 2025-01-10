import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const AVAILABLE_SERVICES = [
  { id: 'lambda', name: 'AWS Lambda', icon: '/aws-icons/lambda.png' },
  { id: 's3', name: 'Amazon S3', icon: '/aws-icons/s3.png' },
  { id: 'ec2', name: 'Amazon EC2', icon: '/aws-icons/ec2.png' },
  { id: 'ecs', name: 'Amazon ECS', icon: '/aws-icons/ecs.png' },
  { id: 'dynamodb', name: 'Amazon DynamoDB', icon: '/aws-icons/dynamodb.png' },
  { id: 'rds', name: 'Amazon RDS', icon: '/aws-icons/rds.png' }
];

const generateArchitecture = async (difficulty) => {
  try {
    const response = await fetch('YOUR_LAMBDA_API_GATEWAY_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ difficulty })
    });

    if (!response.ok) {
      throw new Error('Failed to generate architecture');
    }

    const data = await response.json();
    
    // Map service IDs to full service objects
    const getServiceById = (id) => AVAILABLE_SERVICES.find(s => s.id === id) || AVAILABLE_SERVICES[0];

    return {
      architecture: {
        services: data.services.map(id => getServiceById(id)),
        connections: data.connections
      },
      questions: data.missingServices.map(ms => ({
        text: `Which service would be most cost-efficient for ${ms.position}?`,
        position: ms.position,
        missingServices: ms.options.map(opt => opt.service),
        options: ms.options.map(opt => ({
          ...getServiceById(opt.service),
          costEfficiency: opt.costEfficiency,
          explanation: opt.explanation
        }))
      }))
    };

  } catch (error) {
    console.error('AI Error:', error);
    // The fallback logic is now handled by the Python code
    throw error;
  }
};

export { generateArchitecture }; 