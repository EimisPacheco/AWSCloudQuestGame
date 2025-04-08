# Inspiration
I wanted to create a fun and engaging way for people to learn AWS concepts by making the process interactive and entertaining. I combined my love for learning games with my passion for AWS architecture to create a game that helps players practice real-world cloud skills in a playful way.

# What it does
Azure CloudQuest Game has two exciting modes:

**Rocket Blast Mode** – This is a browser-based shooting game where players shoot Azure service icons. The game aims to help players learn AWS services by categorizing them and making it interactive.
Key Components:

Canvas-based game rendering
Player controls (mouse movement and clicking)
Scoring system
Sound effects
High score tracking
This implementation:

• Gets all icons for the current category

• Gets all icons from other categories

• Randomly selects 4 unique icons from the current category (or all if fewer than 4 available)

• Randomly selects 6 unique icons from other categories

• Uses a helper function to ensure we get unique random selections

This correctly checks if the hit icon belongs to the current target category. If it does:

• Player gets points (5 + height bonus)

• Shows positive feedback

• Plays correct sound

• Creates green explosion

If it doesn't:

• Player loses 5 points

• Shows negative feedback

• Plays incorrect sound

Multiple game states (name entry, rocket selection, gameplay, game over)

**Architecture Builder Mode** – Players complete cloud architecture diagrams by filling in the missing AWS services from four possible options.
This game helps users understand AWS services, their use cases, and how they fit into real-world cloud architectures.

They player can select Begginer, Intermediate or Advance complexity Level.

These Architectures are generated my the AI model.

# How I built it
I built the game using:

- **Amazon S3** to host game assets and media files, like game sounds, Amazon Icons, Rockets Type, ect..
- **AWS Lambda functions**  to handle the backend logic and process user actions. This call the AI model for the Web Services Architecture generation
- **Amazon API Gateway** to manage HTTP requests between the client and backend.
- **Q Developer and Amazon Q**  for making the game logic more dynamic and incorporating intelligent responses. I am primarily a Python developer and not well-versed in React or JavaScript. That's why Q Developer was instrumental in making this game possible. It helped me better understand the language and accelerate my learning. Despite not being a React/JavaScript developer, I was able to develop this app in record time, thanks to Q Developer.
  
I designed the architecture to be serverless for scalability and cost efficiency.

Challenges I ran into
One challenge was ensuring that the latency between API Gateway and Lambda functions remained low to provide a smooth experience during rapid gameplay. Another challenge was balancing the difficulty levels to keep the game fun for beginners while still being challenging for more advanced users.

# Accomplishments that I am proud of
I’m proud of successfully integrating multiple AWS services to create a seamless and interactive experience. It was rewarding to see the architecture builder mode working well with the intelligent service options provided through Amazon Q. The serverless design has also made the solution cost-effective and highly scalable.

# What I learned
I learned a lot about optimizing API Gateway and Lambda interactions for speed and reliability. Additionally, working with Q Developer taught me how to dynamically tailor the service options presented to users in a way that makes the gameplay feel more personalized.

What's next for Launch & Link - CloudQuest Game
Next, I plan to:
Incorporate leaderboard and scoring systems to boost player engagement.
Improve the interface and add more animations to make the game even more interactive and visually appealing.
Explore additional AWS integrations, like Amazon DynamoDB for tracking player progress.
Take advantage of AWS Amplify capabilities for full-stack web." please replace this with Azure services instead
