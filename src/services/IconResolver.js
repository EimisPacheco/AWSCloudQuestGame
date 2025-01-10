import * as levenshteinModule from 'fast-levenshtein';

const AWS_ICON_CATEGORIES = {
    ANALYTICS: 'Arch_Analytics',
    APP_INTEGRATION: 'Arch_App-Integration',
    ARTIFICIAL_INTELLIGENCE: 'Arch_Artificial-Intelligence',
    BLOCKCHAIN: 'Arch_Blockchain',
    BUSINESS_APPLICATIONS: 'Arch_Business-Applications',
    CLOUD_FINANCIAL_MANAGEMENT: 'Arch_Cloud-Financial-Management',
    COMPUTE: 'Arch_Compute',
    CONTAINERS: 'Arch_Containers',
    CUSTOMER_ENABLEMENT: 'Arch_Customer-Enablement',
    DATABASE: 'Arch_Database',
    DEVELOPER_TOOLS: 'Arch_Developer-Tools',
    END_USER_COMPUTING: 'Arch_End-User-Computing',
    FRONT_END_WEB_MOBILE: 'Arch_Front-End-Web-Mobile',
    GAMES: 'Arch_Games',
    INTERNET_OF_THINGS: 'Arch_Internet-of-Things',
    MACHINE_LEARNING: 'Arch_Machine-Learning',
    MANAGEMENT_GOVERNANCE: 'Arch_Management-Governance',
    MEDIA_SERVICES: 'Arch_Media-Services',
    MIGRATION_TRANSFER: 'Arch_Migration-Transfer',
    NETWORKING_CONTENT_DELIVERY: 'Arch_Networking-Content-Delivery',
    QUANTUM_TECHNOLOGIES: 'Arch_Quantum-Technologies',
    ROBOTICS: 'Arch_Robotics',
    SATELLITE: 'Arch_Satellite',
    SECURITY_IDENTITY_COMPLIANCE: 'Arch_Security-Identity-Compliance',
    STORAGE: 'Arch_Storage'
  };

  const SERVICE_MAPPINGS = {
    // Analytics
    "Athena": "Arch_Analytics/16/Arch_Amazon-Athena_16.svg",
    "CloudSearch": "Arch_Analytics/16/Arch_Amazon-CloudSearch_16.svg",
    "Data Firehose": "Arch_Analytics/16/Arch_Amazon-Data-Firehose_16.svg",
    "DataZone": "Arch_Analytics/16/Arch_Amazon-DataZone_16.svg",
    "EMR": "Arch_Analytics/16/Arch_Amazon-EMR_16.svg",
    "FinSpace": "Arch_Analytics/16/Arch_Amazon-FinSpace_16.svg",
    "Kinesis": "Arch_Analytics/16/Arch_Amazon-Kinesis_16.svg",
    "Kinesis Data Streams": "Arch_Analytics/16/Arch_Amazon-Kinesis-Data-Streams_16.svg",
    "Kinesis Video Streams": "Arch_Analytics/16/Arch_Amazon-Kinesis-Video-Streams_16.svg",
    "Managed Service for Apache Flink": "Arch_Analytics/16/Arch_Amazon-Managed-Service-for-Apache-Flink_16.svg",
    "Managed Streaming for Apache Kafka": "Arch_Analytics/16/Arch_Amazon-Managed-Streaming-for-Apache-Kafka_16.svg",
    "OpenSearch Service": "Arch_Analytics/16/Arch_Amazon-OpenSearch-Service_16.svg",
    "QuickSight": "Arch_Analytics/16/Arch_Amazon-QuickSight_16.svg",
    "Redshift": "Arch_Analytics/16/Arch_Amazon-Redshift_16.svg",
    "Clean Rooms": "Arch_Analytics/16/Arch_AWS-Clean-Rooms_16.svg",
    "Data Exchange": "Arch_Analytics/16/Arch_AWS-Data-Exchange_16.svg",
    "Data Pipeline": "Arch_Analytics/16/Arch_AWS-Data-Pipeline_16.svg",
    "Entity Resolution": "Arch_Analytics/16/Arch_AWS-Entity-Resolution_16.svg",
    "Glue": "Arch_Analytics/16/Arch_AWS-Glue_16.svg",
    "Glue DataBrew": "Arch_Analytics/16/Arch_AWS-Glue-DataBrew_16.svg",
    "Glue Elastic Views": "Arch_Analytics/16/Arch_AWS-Glue-Elastic-Views_16.svg",
    "Lake Formation": "Arch_Analytics/16/Arch_AWS-Lake-Formation_16.svg",
  
    // App Integration
    "Step Functions": "Arch_App-Integration/16/Arch_AWS-Step-Functions_16.svg",
    "Express Workflows": "Arch_App-Integration/16/Arch_AWS-Express-Workflows_16.svg",
    "B2B Data Interchange": "Arch_App-Integration/16/Arch_AWS-B2B-Data-Interchange_16.svg",
    "AppSync": "Arch_App-Integration/16/Arch_AWS-AppSync_16.svg",
    "SQS": "Arch_App-Integration/16/Arch_Amazon-Simple-Queue-Service_16.svg",
    "SNS": "Arch_App-Integration/16/Arch_Amazon-Simple-Notification-Service_16.svg",
    "MQ": "Arch_App-Integration/16/Arch_Amazon-MQ_16.svg",
    "Managed Workflows for Apache Airflow": "Arch_App-Integration/16/Arch_Amazon-Managed-Workflows-for-Apache-Airflow_16.svg",
    "EventBridge": "Arch_App-Integration/16/Arch_Amazon-EventBridge_16.svg",
    "AppFlow": "Arch_App-Integration/16/Arch_Amazon-AppFlow_16.svg",
  
    // Artificial Intelligence
    "Augmented AI (A2I)": "Arch_Artificial-Intelligence/16/Arch_Amazon-Augmented-AI-A2I_16.svg",
    "Bedrock": "Arch_Artificial-Intelligence/16/Arch_Amazon-Bedrock_16.svg",
    "CodeGuru": "Arch_Artificial-Intelligence/16/Arch_Amazon-CodeGuru_16.svg",
    "CodeWhisperer": "Arch_Artificial-Intelligence/16/Arch_Amazon-CodeWhisperer_16.svg",
    "Comprehend": "Arch_Artificial-Intelligence/16/Arch_Amazon-Comprehend_16.svg",
    "Comprehend Medical": "Arch_Artificial-Intelligence/16/Arch_Amazon-Comprehend-Medical_16.svg",
    "DevOps Guru": "Arch_Artificial-Intelligence/16/Arch_Amazon-DevOps-Guru_16.svg",
    "Elastic Inference": "Arch_Artificial-Intelligence/16/Arch_Amazon-Elastic-Inference_16.svg",
    "Forecast": "Arch_Artificial-Intelligence/16/Arch_Amazon-Forecast_16.svg",
    "Fraud Detector": "Arch_Artificial-Intelligence/16/Arch_Amazon-Fraud-Detector_16.svg",
    "Kendra": "Arch_Artificial-Intelligence/16/Arch_Amazon-Kendra_16.svg",
    "Lex": "Arch_Artificial-Intelligence/16/Arch_Amazon-Lex_16.svg",
    "Lookout for Equipment": "Arch_Artificial-Intelligence/16/Arch_Amazon-Lookout-for-Equipment_16.svg",
    "Lookout for Metrics": "Arch_Artificial-Intelligence/16/Arch_Amazon-Lookout-for-Metrics_16.svg",
    "Lookout for Vision": "Arch_Artificial-Intelligence/16/Arch_Amazon-Lookout-for-Vision_16.svg",
    "Monitron": "Arch_Artificial-Intelligence/16/Arch_Amazon-Monitron_16.svg",
    "Personalize": "Arch_Artificial-Intelligence/16/Arch_Amazon-Personalize_16.svg",
    "Polly": "Arch_Artificial-Intelligence/16/Arch_Amazon-Polly_16.svg",
    "Q": "Arch_Artificial-Intelligence/16/Arch_Amazon-Q_16.svg",
    "Rekognition": "Arch_Artificial-Intelligence/16/Arch_Amazon-Rekognition_16.svg",
    "SageMaker": "Arch_Artificial-Intelligence/16/Arch_Amazon-SageMaker_16.svg",
    "SageMaker Ground Truth": "Arch_Artificial-Intelligence/16/Arch_Amazon-SageMaker-Ground-Truth_16.svg",
    "SageMaker Studio Lab": "Arch_Artificial-Intelligence/16/Arch_Amazon-SageMaker-Studio-Lab_16.svg",
    "Textract": "Arch_Artificial-Intelligence/16/Arch_Amazon-Textract_16.svg",
    "Transcribe": "Arch_Artificial-Intelligence/16/Arch_Amazon-Transcribe_16.svg",
    "Translate": "Arch_Artificial-Intelligence/16/Arch_Amazon-Translate_16.svg",
    "Apache MXNet on AWS": "Arch_Artificial-Intelligence/16/Arch_Apache-MXNet-on-AWS_16.svg",
    "Deep Learning AMIs": "Arch_Artificial-Intelligence/16/Arch_AWS-Deep-Learning-AMIs_16.svg",
    "Deep Learning Containers": "Arch_Artificial-Intelligence/16/Arch_AWS-Deep-Learning-Containers_16.svg",
    "DeepComposer": "Arch_Artificial-Intelligence/16/Arch_AWS-DeepComposer_16.svg",
    "DeepLens": "Arch_Artificial-Intelligence/16/Arch_AWS-DeepLens_16.svg",
    "DeepRacer": "Arch_Artificial-Intelligence/16/Arch_AWS-DeepRacer_16.svg",
    "HealthImaging": "Arch_Artificial-Intelligence/16/Arch_AWS-HealthImaging_16.svg",
    "HealthLake": "Arch_Artificial-Intelligence/16/Arch_AWS-HealthLake_16.svg",
    "HealthOmics": "Arch_Artificial-Intelligence/16/Arch_AWS-HealthOmics_16.svg",
    "HealthScribe": "Arch_Artificial-Intelligence/16/Arch_AWS-HealthScribe_16.svg",
    "Neuron": "Arch_Artificial-Intelligence/16/Arch_AWS-Neuron_16.svg",
    "Panorama": "Arch_Artificial-Intelligence/16/Arch_AWS-Panorama_16.svg",
    "PyTorch on AWS": "Arch_Artificial-Intelligence/16/Arch_PyTorch-on-AWS_16.svg",
    "TensorFlow on AWS": "Arch_Artificial-Intelligence/16/Arch_TensorFlow-on-AWS_16.svg",
  
    // Blockchain
    "Managed Blockchain": "Arch_Blockchain/16/Arch_Amazon-Managed-Blockchain_16.svg",
    "Quantum Ledger Database": "Arch_Blockchain/16/Arch_Amazon-Quantum-Ledger-Database_16.svg",
  
    // Business Applications
    "AppFabric": "Arch_Business-Applications/16/Arch_AWS-AppFabric_16.svg",
    "Supply Chain": "Arch_Business-Applications/16/Arch_AWS-Supply-Chain_16.svg",
    "Wickr": "Arch_Business-Applications/16/Arch_AWS-Wickr_16.svg",
    "Alexa For Business": "Arch_Business-Applications/16/Arch_Alexa-For-Business_16.svg",
    "Chime SDK": "Arch_Business-Applications/16/Arch_Amazon-Chime-SDK_16.svg",
    "Chime": "Arch_Business-Applications/16/Arch_Amazon-Chime_16.svg",
    "Connect": "Arch_Business-Applications/16/Arch_Amazon-Connect_16.svg",
    "Pinpoint APIs": "Arch_Business-Applications/16/Arch_Amazon-Pinpoint-APIs_16.svg",
    "Pinpoint": "Arch_Business-Applications/16/Arch_Amazon-Pinpoint_16.svg",
    "Simple Email Service": "Arch_Business-Applications/16/Arch_Amazon-Simple-Email-Service_16.svg",
    "WorkDocs SDK": "Arch_Business-Applications/16/Arch_Amazon-WorkDocs-SDK_16.svg",
    "WorkDocs": "Arch_Business-Applications/16/Arch_Amazon-WorkDocs_16.svg",
    "WorkMail": "Arch_Business-Applications/16/Arch_Amazon-WorkMail_16.svg",
  
    // Cloud Financial Management
    "Application Cost Profiler": "Arch_Cloud-Financial-Management/16/Arch_AWS-Application-Cost-Profiler_16.svg",
    "Billing Conductor": "Arch_Cloud-Financial-Management/16/Arch_AWS-Billing-Conductor_16.svg",
    "Budgets": "Arch_Cloud-Financial-Management/16/Arch_AWS-Budgets_16.svg",
    "Cost Explorer": "Arch_Cloud-Financial-Management/16/Arch_AWS-Cost-Explorer_16.svg",
    "Cost and Usage Report": "Arch_Cloud-Financial-Management/16/Arch_AWS-Cost-and-Usage-Report_16.svg",
    "Reserved Instance Reporting": "Arch_Cloud-Financial-Management/16/Arch_Reserved-Instance-Reporting_16.svg",
    "Savings Plans": "Arch_Cloud-Financial-Management/16/Arch_Savings-Plans_16.svg",
  
    // Compute
    "App Runner": "Arch_Compute/16/Arch_AWS-App-Runner_16.svg",
    "Batch": "Arch_Compute/16/Arch_AWS-Batch_16.svg",
    "Compute Optimizer": "Arch_Compute/16/Arch_AWS-Compute-Optimizer_16.svg",
    "Elastic Beanstalk": "Arch_Compute/16/Arch_AWS-Elastic-Beanstalk_16.svg",
    "Elastic Beanstalk": "Arch_Compute/16/Arch_AWS-Elastic-Beanstalk_16.svg",
    "Lambda": "Arch_Compute/16/Arch_AWS-Lambda_16.svg",
    "Local Zones": "Arch_Compute/16/Arch_AWS-Local-Zones_16.svg",
    "Nitro Enclaves": "Arch_Compute/16/Arch_AWS-Nitro-Enclaves_16.svg",
    "Outposts family": "Arch_Compute/16/Arch_AWS-Outposts-family_16.svg",
    "Outposts rack": "Arch_Compute/16/Arch_AWS-Outposts-rack_16.svg",
    "Outposts servers": "Arch_Compute/16/Arch_AWS-Outposts-servers_16.svg",
    "Parallel Cluster": "Arch_Compute/16/Arch_AWS-Parallel-Cluster_16.svg",
    "Serverless Application Repository": "Arch_Compute/16/Arch_AWS-Serverless-Application-Repository_16.svg",
    "SimSpace Weaver": "Arch_Compute/16/Arch_AWS-SimSpace-Weaver_16.svg",
    "Thinkbox Deadline": "Arch_Compute/16/Arch_AWS-Thinkbox-Deadline_16.svg",
    "Thinkbox Frost": "Arch_Compute/16/Arch_AWS-Thinkbox-Frost_16.svg",
    "Thinkbox Krakatoa": "Arch_Compute/16/Arch_AWS-Thinkbox-Krakatoa_16.svg",
    "Thinkbox Sequoia": "Arch_Compute/16/Arch_AWS-Thinkbox-Sequoia_16.svg",
    "Thinkbox Stoke": "Arch_Compute/16/Arch_AWS-Thinkbox-Stoke_16.svg",
    "Thinkbox XMesh": "Arch_Compute/16/Arch_AWS-Thinkbox-XMesh_16.svg",
    "Wavelength": "Arch_Compute/16/Arch_AWS-Wavelength_16.svg",
    "EC2 Auto Scaling": "Arch_Compute/16/Arch_Amazon-EC2-Auto-Scaling_16.svg",
    "EC2 Image Builder": "Arch_Compute/16/Arch_Amazon-EC2-Image-Builder_16.svg",
    "EC2": "Arch_Compute/16/Arch_Amazon-EC2_16.svg",
    "Lightsail for Research": "Arch_Compute/16/Arch_Amazon-Lightsail-for-Research_16.svg",
    "Lightsail": "Arch_Compute/16/Arch_Amazon-Lightsail_16.svg",
    "Bottlerocket": "Arch_Compute/16/Arch_Bottlerocket_16.svg",
    "Elastic Fabric Adapter": "Arch_Compute/16/Arch_Elastic-Fabric-Adapter_16.svg",
    "NICE DCV": "Arch_Compute/16/Arch_NICE-DCV_16.svg",
    "NICE EnginFrame": "Arch_Compute/16/Arch_NICE-EnginFrame_16.svg",

  // Containers
  "Fargate": "Arch_Containers/16/Arch_AWS-Fargate_16.svg",
  "ECS Anywhere": "Arch_Containers/16/Arch_Amazon-ECS-Anywhere_16.svg",
  "EKS Anywhere": "Arch_Containers/16/Arch_Amazon-EKS-Anywhere_16.svg",
  "EKS Cloud": "Arch_Containers/16/Arch_Amazon-EKS-Cloud_16.svg",
  "EKS Distro": "Arch_Containers/16/Arch_Amazon-EKS-Distro_16.svg",
  "Elastic Container Registry": "Arch_Containers/16/Arch_Amazon-Elastic-Container-Registry_16.svg",
  "Elastic Container Service": "Arch_Containers/16/Arch_Amazon-Elastic-Container-Service_16.svg",
  "Elastic Kubernetes Service": "Arch_Containers/16/Arch_Amazon-Elastic-Kubernetes-Service_16.svg",
  "Red Hat OpenShift Service on AWS": "Arch_Containers/16/Arch_Red-Hat-OpenShift-Service-on-AWS_16.svg",

  // Customer Enablement
  "Activate": "Arch_Customer-Enablement/16/Arch_AWS-Activate_16.svg",
  "IQ": "Arch_Customer-Enablement/16/Arch_AWS-IQ_16.svg",
  "Managed Services": "Arch_Customer-Enablement/16/Arch_AWS-Managed-Services_16.svg",
  "Professional Services": "Arch_Customer-Enablement/16/Arch_AWS-Professional-Services_16.svg",
  "Support": "Arch_Customer-Enablement/16/Arch_AWS-Support_16.svg",
  "Training Certification": "Arch_Customer-Enablement/16/Arch_AWS-Training-Certification_16.svg",
  "rePost Private": "Arch_Customer-Enablement/16/Arch_AWS-rePost-Private_16.svg",
  "rePost": "Arch_Customer-Enablement/16/Arch_AWS-rePost_16.svg",

  // Database
  "Database Migration Service": "Arch_Database/16/Arch_AWS-Database-Migration-Service_16.svg",
  "Aurora": "Arch_Database/16/Arch_Amazon-Aurora_16.svg",
  "DocumentDB": "Arch_Database/16/Arch_Amazon-DocumentDB_16.svg",
  "DynamoDB": "Arch_Database/16/Arch_Amazon-DynamoDB_16.svg",
  "ElastiCache": "Arch_Database/16/Arch_Amazon-ElastiCache_16.svg",
  "Keyspaces": "Arch_Database/16/Arch_Amazon-Keyspaces_16.svg",
  "MemoryDB for Redis": "Arch_Database/16/Arch_Amazon-MemoryDB-for-Redis_16.svg",
  "Neptune": "Arch_Database/16/Arch_Amazon-Neptune_16.svg",
  "RDS on VMware": "Arch_Database/16/Arch_Amazon-RDS-on-VMware_16.svg",
  "RDS": "Arch_Database/16/Arch_Amazon-RDS_16.svg",
  "Timestream": "Arch_Database/16/Arch_Amazon-Timestream_16.svg",

  // Developer Tools
  "Application Composer": "Arch_Developer-Tools/16/Arch_AWS-Application-Composer_16.svg",
  "Cloud Control API": "Arch_Developer-Tools/16/Arch_AWS-Cloud-Control-API_16.svg",
  "Cloud Development Kit": "Arch_Developer-Tools/16/Arch_AWS-Cloud-Development-Kit_16.svg",
  "Cloud9": "Arch_Developer-Tools/16/Arch_AWS-Cloud9_16.svg",
  "CloudShell": "Arch_Developer-Tools/16/Arch_AWS-CloudShell_16.svg",
  "CodeArtifact": "Arch_Developer-Tools/16/Arch_AWS-CodeArtifact_16.svg",
  "CodeBuild": "Arch_Developer-Tools/16/Arch_AWS-CodeBuild_16.svg",
  "CodeCommit": "Arch_Developer-Tools/16/Arch_AWS-CodeCommit_16.svg",
  "CodeDeploy": "Arch_Developer-Tools/16/Arch_AWS-CodeDeploy_16.svg",
  "CodePipeline": "Arch_Developer-Tools/16/Arch_AWS-CodePipeline_16.svg",
  "CodeStar": "Arch_Developer-Tools/16/Arch_AWS-CodeStar_16.svg",
  "Command Line Interface": "Arch_Developer-Tools/16/Arch_AWS-Command-Line-Interface_16.svg",
  "Fault Injection Service": "Arch_Developer-Tools/16/Arch_AWS-Fault-Injection-Service_16.svg",
  "Tools and SDKs": "Arch_Developer-Tools/16/Arch_AWS-Tools-and-SDKs_16.svg",
  "X-Ray": "Arch_Developer-Tools/16/Arch_AWS-X-Ray_16.svg",
  "CodeCatalyst": "Arch_Developer-Tools/16/Arch_Amazon-CodeCatalyst_16.svg",
  "Corretto": "Arch_Developer-Tools/16/Arch_Amazon-Corretto_16.svg",

  // End User Computing
  "AppStream 2.0": "Arch_End-User-Computing/16/Arch_Amazon-AppStream-2_16.svg",
  "WorkSpaces Family": "Arch_End-User-Computing/16/Arch_Amazon-WorkSpaces-Family_16.svg",
  "WorkSpaces Thin Client": "Arch_End-User-Computing/16/Arch_Amazon-WorkSpaces-Thin-Client_16.svg",

  // Front-End Web & Mobile
  "Amplify": "Arch_Front-End-Web-Mobile/16/Arch_AWS-Amplify_16.svg",
  "Device Farm": "Arch_Front-End-Web-Mobile/16/Arch_AWS-Device-Farm_16.svg",
  "Location Service": "Arch_Front-End-Web-Mobile/16/Arch_Amazon-Location-Service_16.svg",

  // Games
  "GameKit": "Arch_Games/16/Arch_AWS-GameKit_16.svg",
  "GameLift": "Arch_Games/16/Arch_Amazon-GameLift_16.svg",
  "GameSparks": "Arch_Games/16/Arch_Amazon-GameSparks_16.svg",
  "Open 3D Engine": "Arch_Games/16/Arch_Open-3D-Engine_16.svg",

  // Internet of Things
  "IoT 1-Click": "Arch_Internet-of-Things/16/Arch_AWS-IoT-1-Click_16.svg",
  "IoT Analytics": "Arch_Internet-of-Things/16/Arch_AWS-IoT-Analytics_16.svg",
  "IoT Button": "Arch_Internet-of-Things/16/Arch_AWS-IoT-Button_16.svg",
  "IoT Core": "Arch_Internet-of-Things/16/Arch_AWS-IoT-Core_16.svg",
  "IoT Device Defender": "Arch_Internet-of-Things/16/Arch_AWS-IoT-Device-Defender_16.svg",
  "IoT Device Management": "Arch_Internet-of-Things/16/Arch_AWS-IoT-Device-Management_16.svg",
  "IoT Events": "Arch_Internet-of-Things/16/Arch_AWS-IoT-Events_16.svg",
  "IoT ExpressLink": "Arch_Internet-of-Things/16/Arch_AWS-IoT-ExpressLink_16.svg",
  "IoT FleetWise": "Arch_Internet-of-Things/16/Arch_AWS-IoT-FleetWise_16.svg",
  "IoT Greengrass": "Arch_Internet-of-Things/16/Arch_AWS-IoT-Greengrass_16.svg",
  "IoT RoboRunner": "Arch_Internet-of-Things/16/Arch_AWS-IoT-RoboRunner_16.svg",
  "IoT SiteWise": "Arch_Internet-of-Things/16/Arch_AWS-IoT-SiteWise_16.svg",
  "IoT TwinMaker": "Arch_Internet-of-Things/16/Arch_AWS-IoT-TwinMaker_16.svg",
  "FreeRTOS": "Arch_Internet-of-Things/16/Arch_FreeRTOS_16.svg",

  // Management & Governance
  "AppConfig": "Arch_Management-Governance/16/Arch_AWS-AppConfig_16.svg",
  "Application Auto Scaling": "Arch_Management-Governance/16/Arch_AWS-Application-Auto-Scaling_16.svg",
  "Auto Scaling": "Arch_Management-Governance/16/Arch_AWS-Auto-Scaling_16.svg",
  "Backint Agent": "Arch_Management-Governance/16/Arch_AWS-Backint-Agent_16.svg",
  "Chatbot": "Arch_Management-Governance/16/Arch_AWS-Chatbot_16.svg",
  "CloudFormation": "Arch_Management-Governance/16/Arch_AWS-CloudFormation_16.svg",
  "CloudTrail": "Arch_Management-Governance/16/Arch_AWS-CloudTrail_16.svg",
  "Compute Optimizer": "Arch_Management-Governance/16/Arch_AWS-Compute-Optimizer_16.svg",
  "Config": "Arch_Management-Governance/16/Arch_AWS-Config_16.svg",
  "Console Mobile Application": "Arch_Management-Governance/16/Arch_AWS-Console-Mobile-Application_16.svg",
  "Control Tower": "Arch_Management-Governance/16/Arch_AWS-Control-Tower_16.svg",
  "Distro for OpenTelemetry": "Arch_Management-Governance/16/Arch_AWS-Distro-for-OpenTelemetry_16.svg",
  "Health Dashboard": "Arch_Management-Governance/16/Arch_AWS-Health-Dashboard_16.svg",
  "Launch Wizard": "Arch_Management-Governance/16/Arch_AWS-Launch-Wizard_16.svg",
  "License Manager": "Arch_Management-Governance/16/Arch_AWS-License-Manager_16.svg",
  "Management Console": "Arch_Management-Governance/16/Arch_AWS-Management-Console_16.svg",
  "OpsWorks": "Arch_Management-Governance/16/Arch_AWS-OpsWorks_16.svg",
  "Organizations": "Arch_Management-Governance/16/Arch_AWS-Organizations_16.svg",
  "Proton": "Arch_Management-Governance/16/Arch_AWS-Proton_16.svg",
  "Resilience Hub": "Arch_Management-Governance/16/Arch_AWS-Resilience-Hub_16.svg",
  "Resource Explorer": "Arch_Management-Governance/16/Arch_AWS-Resource-Explorer_16.svg",
  "Service Catalog": "Arch_Management-Governance/16/Arch_AWS-Service-Catalog_16.svg",
  "Service Management Connector": "Arch_Management-Governance/16/Arch_AWS-Service-Management-Connector_16.svg",
  "Systems Manager": "Arch_Management-Governance/16/Arch_AWS-Systems-Manager_16.svg",
  "Telco Network Builder": "Arch_Management-Governance/16/Arch_AWS-Telco-Network-Builder_16.svg",
  "Trusted Advisor": "Arch_Management-Governance/16/Arch_AWS-Trusted-Advisor_16.svg",
  "Well-Architected Tool": "Arch_Management-Governance/16/Arch_AWS-Well-Architected-Tool_16.svg",
  "CloudWatch": "Arch_Management-Governance/16/Arch_Amazon-CloudWatch_16.svg",
  "Managed Grafana": "Arch_Management-Governance/16/Arch_Amazon-Managed-Grafana_16.svg",
  "Managed Service for Prometheus": "Arch_Management-Governance/16/Arch_Amazon-Managed-Service-for-Prometheus_16.svg",

  // Media Services
  "Elemental Appliances & Software": "Arch_Media-Services/16/Arch_AWS-Elemental-Appliances-&-Software_16.svg",
  "Elemental Conductor": "Arch_Media-Services/16/Arch_AWS-Elemental-Conductor_16.svg",
  "Elemental Delta": "Arch_Media-Services/16/Arch_AWS-Elemental-Delta_16.svg",
  "Elemental Link": "Arch_Media-Services/16/Arch_AWS-Elemental-Link_16.svg",
  "Elemental Live": "Arch_Media-Services/16/Arch_AWS-Elemental-Live_16.svg",
  "Elemental MediaConnect": "Arch_Media-Services/16/Arch_AWS-Elemental-MediaConnect_16.svg",
  "Elemental MediaConvert": "Arch_Media-Services/16/Arch_AWS-Elemental-MediaConvert_16.svg",
  "Elemental MediaLive": "Arch_Media-Services/16/Arch_AWS-Elemental-MediaLive_16.svg",
  "Elemental MediaPackage": "Arch_Media-Services/16/Arch_AWS-Elemental-MediaPackage_16.svg",
  "Elemental MediaStore": "Arch_Media-Services/16/Arch_AWS-Elemental-MediaStore_16.svg",
  "Elemental MediaTailor": "Arch_Media-Services/16/Arch_AWS-Elemental-MediaTailor_16.svg",
  "Elemental Server": "Arch_Media-Services/16/Arch_AWS-Elemental-Server_16.svg",
  "Elastic Transcoder": "Arch_Media-Services/16/Arch_Amazon-Elastic-Transcoder_16.svg",
  "Interactive Video Service": "Arch_Media-Services/16/Arch_Amazon-Interactive-Video-Service_16.svg",
  "Nimble Studio": "Arch_Media-Services/16/Arch_Amazon-Nimble-Studio_16.svg",

  // Migration & Transfer
  "Application Discovery Service": "Arch_Migration-Modernization/16/Arch_AWS-Application-Discovery-Service_16.svg",
  "Application Migration Service": "Arch_Migration-Modernization/16/Arch_AWS-Application-Migration-Service_16.svg",
  "DataSync": "Arch_Migration-Modernization/16/Arch_AWS-DataSync_16.svg",
  "Mainframe Modernization": "Arch_Migration-Modernization/16/Arch_AWS-Mainframe-Modernization_16.svg",
  "Migration Evaluator": "Arch_Migration-Modernization/16/Arch_AWS-Migration-Evaluator_16.svg",
  "Migration Hub": "Arch_Migration-Modernization/16/Arch_AWS-Migration-Hub_16.svg",
    // ... (continuing from the previous part)

    "Transfer Family": "Arch_Migration-Modernization/16/Arch_AWS-Transfer-Family_16.svg",

    // Networking & Content Delivery
    "App Mesh": "Arch_Networking-Content-Delivery/16/Arch_AWS-App-Mesh_16.svg",
    "Client VPN": "Arch_Networking-Content-Delivery/16/Arch_AWS-Client-VPN_16.svg",
    "VPC Endpoint": "Arch_Networking-Content-Delivery/16/Arch_AWS-VPC-endpoint_16.svg",
    "VPC": "Arch_Networking-Content-Delivery/16/Arch_AWS-VPC.16.svg",
    "Cloud Map": "Arch_Networking-Content-Delivery/16/Arch_AWS-Cloud-Map_16.svg",
    "Cloud WAN": "Arch_Networking-Content-Delivery/16/Arch_AWS-Cloud-WAN_16.svg",
    "Direct Connect": "Arch_Networking-Content-Delivery/16/Arch_AWS-Direct-Connect_16.svg",
    "Global Accelerator": "Arch_Networking-Content-Delivery/16/Arch_AWS-Global-Accelerator_16.svg",
    "Private 5G": "Arch_Networking-Content-Delivery/16/Arch_AWS-Private-5G_16.svg",
    "PrivateLink": "Arch_Networking-Content-Delivery/16/Arch_AWS-PrivateLink_16.svg",
    "Site-to-Site VPN": "Arch_Networking-Content-Delivery/16/Arch_AWS-Site-to-Site-VPN_16.svg",
    "Transit Gateway": "Arch_Networking-Content-Delivery/16/Arch_AWS-Transit-Gateway_16.svg",
    "Verified Access": "Arch_Networking-Content-Delivery/16/Arch_AWS-Verified-Access_16.svg",
    "API Gateway": "Arch_Networking-Content-Delivery/16/Arch_Amazon-API-Gateway_16.svg",
    "CloudFront": "Arch_Networking-Content-Delivery/16/Arch_Amazon-CloudFront_16.svg",
    "Route 53": "Arch_Networking-Content-Delivery/16/Arch_Amazon-Route-53_16.svg",
    "VPC Lattice": "Arch_Networking-Content-Delivery/16/Arch_Amazon-VPC-Lattice_16.svg",
    "Virtual Private Cloud": "Arch_Networking-Content-Delivery/16/Arch_Amazon-Virtual-Private-Cloud_16.svg",
    "Elastic Load Balancer": "Arch_Networking-Content-Delivery/16/Arch_Elastic-Load-Balancing_16.svg",
    "Application Load Balancer": "Arch_Networking-Content-Delivery/16/Arch_Elastic-Load-Balancing_16.svg",
    "ALB": "Arch_Networking-Content-Delivery/16/Arch_Elastic-Load-Balancing_16.svg",
    "Elastic Load Balancering": "Arch_Networking-Content-Delivery/16/Arch_Elastic-Load-Balancing_16.svg",
    "ELB": "Arch_Networking-Content-Delivery/16/Arch_Elastic-Load-Balancing_16.svg",
  
    // Quantum Technologies
    "Braket": "Arch_Quantum-Technologies/16/Arch_Amazon-Braket_16.svg",
  
    // Robotics
    "RoboMaker": "Arch_Robotics/16/Arch_AWS-RoboMaker_16.svg",
  
    // Satellite
    "Ground Station": "Arch_Satellite/16/Arch_AWS-Ground-Station_16.svg",
  
    // Security, Identity & Compliance
    "Artifact": "Arch_Security-Identity-Compliance/16/Arch_AWS-Artifact_16.svg",
    "Audit Manager": "Arch_Security-Identity-Compliance/16/Arch_AWS-Audit-Manager_16.svg",
    "Certificate Manager": "Arch_Security-Identity-Compliance/16/Arch_AWS-Certificate-Manager_16.svg",
    "CloudHSM": "Arch_Security-Identity-Compliance/16/Arch_AWS-CloudHSM_16.svg",
    "Directory Service": "Arch_Security-Identity-Compliance/16/Arch_AWS-Directory-Service_16.svg",
    "Firewall Manager": "Arch_Security-Identity-Compliance/16/Arch_AWS-Firewall-Manager_16.svg",
    "IAM Identity Center": "Arch_Security-Identity-Compliance/16/Arch_AWS-IAM-Identity-Center_16.svg",
    "AWS IAM": "Arch_Security-Identity-Compliance/16/Arch_AWS-IAM-Identity-Center_16.svg",
    "Identity and Access Management": "Arch_Security-Identity-Compliance/16/Arch_AWS-Identity-and-Access-Management_16.svg",
    "Key Management Service": "Arch_Security-Identity-Compliance/16/Arch_AWS-Key-Management-Service_16.svg",
    "Network Firewall": "Arch_Security-Identity-Compliance/16/Arch_AWS-Network-Firewall_16.svg",
    "Payment Cryptography": "Arch_Security-Identity-Compliance/16/Arch_AWS-Payment-Cryptography_16.svg",
    "Private Certificate Authority": "Arch_Security-Identity-Compliance/16/Arch_AWS-Private-Certificate-Authority_16.svg",
    "Resource Access Manager": "Arch_Security-Identity-Compliance/16/Arch_AWS-Resource-Access-Manager_16.svg",
    "Secrets Manager": "Arch_Security-Identity-Compliance/16/Arch_AWS-Secrets-Manager_16.svg",
    "Security Hub": "Arch_Security-Identity-Compliance/16/Arch_AWS-Security-Hub_16.svg",
    "Shield": "Arch_Security-Identity-Compliance/16/Arch_AWS-Shield_16.svg",
    "Signer": "Arch_Security-Identity-Compliance/16/Arch_AWS-Signer_16.svg",
    "WAF": "Arch_Security-Identity-Compliance/16/Arch_AWS-WAF_16.svg",
    "Cloud Directory": "Arch_Security-Identity-Compliance/16/Arch_Amazon-Cloud-Directory_16.svg",
    "Cognito": "Arch_Security-Identity-Compliance/16/Arch_Amazon-Cognito_16.svg",
    "Detective": "Arch_Security-Identity-Compliance/16/Arch_Amazon-Detective_16.svg",
    "GuardDuty": "Arch_Security-Identity-Compliance/16/Arch_Amazon-GuardDuty_16.svg",
    "Inspector": "Arch_Security-Identity-Compliance/16/Arch_Amazon-Inspector_16.svg",
    "Macie": "Arch_Security-Identity-Compliance/16/Arch_Amazon-Macie_16.svg",
    "Security Lake": "Arch_Security-Identity-Compliance/16/Arch_Amazon-Security-Lake_16.svg",
    "Verified Permissions": "Arch_Security-Identity-Compliance/16/Arch_Amazon-Verified-Permissions_16.svg",
  
    // Storage
    "Backup": "Arch_Storage/16/Arch_AWS-Backup_16.svg",
    "Elastic Disaster Recovery": "Arch_Storage/16/Arch_AWS-Elastic-Disaster-Recovery_16.svg",
    "Snowball Edge": "Arch_Storage/16/Arch_AWS-Snowball-Edge_16.svg",
    "Snowball": "Arch_Storage/16/Arch_AWS-Snowball_16.svg",
    "Snowcone": "Arch_Storage/16/Arch_AWS-Snowcone_16.svg",
    "Storage Gateway": "Arch_Storage/16/Arch_AWS-Storage-Gateway_16.svg",
    "EFS": "Arch_Storage/16/Arch_Amazon-EFS_16.svg",
    "AWS Elastic File": "Arch_Storage/16/Arch_Amazon-EFS_16.svg",
    "Elastic Block Store": "Arch_Storage/16/Arch_Amazon-Elastic-Block-Store_16.svg",
    "FSx for Lustre": "Arch_Storage/16/Arch_Amazon-FSx-for-Lustre_16.svg",
    "FSx for NetApp ONTAP": "Arch_Storage/16/Arch_Amazon-FSx-for-NetApp-ONTAP_16.svg",
    "FSx for OpenZFS": "Arch_Storage/16/Arch_Amazon-FSx-for-OpenZFS_16.svg",
    "FSx for Windows File Server": "Arch_Storage/16/Arch_Amazon-FSx-for-WFS_16.svg",
    "FSx": "Arch_Storage/16/Arch_Amazon-FSx_16.svg",
    "File Cache": "Arch_Storage/16/Arch_Amazon-File-Cache_16.svg",
    "S3 on Outposts": "Arch_Storage/16/Arch_Amazon-S3-on-Outposts_16.svg",
    "S3 Glacier": "Arch_Storage/16/Arch_Amazon-Simple-Storage-Service-Glacier_16.svg",
    "S3": "Arch_Storage/16/Arch_Amazon-Simple-Storage-Service_16.svg"
  };

  
const S3_BUCKET_URL = 'https://hackthon-backend-files-ep-2024.s3.amazonaws.com';
const ICONS_BASE_PATH = '/amazon-icons-set/Architecture-Service-Icons_06072024';

// Cache for resolved icons
const iconCache = new Map();

// Acronym to full name mapping
const ACRONYM_MAPPING = {
    'IAM': 'Identity and Access Management',
    'AWS IAM': 'Identity and Access Management',
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
  };


// Reverse mapping for full names to acronyms
const FULL_NAME_TO_ACRONYM = Object.fromEntries(
  Object.entries(ACRONYM_MAPPING).map(([acronym, fullName]) => [fullName.toLowerCase(), acronym])
);

export const getCachedServiceIcon = (serviceName) => {
  if (!serviceName) {
    console.error('❌ No service name provided to getServiceIcon');
    return null;
  }

  // Handle missing services first
  if (serviceName.toLowerCase().includes('missing')) {
    console.log('🎯 Missing service detected, using local missing.svg');
    return '/aws-icons/missing.svg';
  }

  // Check cache first
  if (iconCache.has(serviceName)) {
    return iconCache.get(serviceName);
  }

  const normalizeServiceName = (name) => {
    return name
      .toLowerCase()
      .replace(/^(aws|amazon)\s+/i, '')  // Remove AWS/Amazon prefix
      .replace(/\([^)]*\)/g, '')         // Remove parentheses and content
      .replace(/\s+/g, ' ')              // Normalize spaces
      .trim();
  };

  // Clean and normalize the input service name
  const normalizedInput = normalizeServiceName(serviceName);
  console.log(`🔍 Looking for service: "${normalizedInput}" (original: "${serviceName}")`);

  // Find the best match
  let bestMatch = null;
  let bestScore = Infinity;

  Object.entries(SERVICE_MAPPINGS).forEach(([key, value]) => {
    const normalizedKey = normalizeServiceName(key);
    
    // Check for exact match first (case insensitive)
    if (normalizedKey === normalizedInput) {
      bestMatch = [key, value];
      bestScore = 0;
      console.log(`✅ Exact match found for ${serviceName} -> ${key}`);
      return;
    }

    // Check if one string contains the other
    if (normalizedKey.includes(normalizedInput) || normalizedInput.includes(normalizedKey)) {
      const score = 1; // Prioritize partial matches over Levenshtein
      if (score < bestScore) {
        bestScore = score;
        bestMatch = [key, value];
        console.log(`📎 Partial match found: ${serviceName} -> ${key}`);
      }
    } else {
      // Use Levenshtein as a fallback
      const score = levenshteinModule.get(normalizedKey, normalizedInput);
      if (score < bestScore && score < 3) { // threshold of 3 for similarity
        bestScore = score;
        bestMatch = [key, value];
        console.log(`📊 Levenshtein match found: ${serviceName} -> ${key} (score: ${score})`);
      }
    }
  });

  if (!bestMatch) {
    console.warn(`⚠️ No icon mapping found for service: ${serviceName}`);
    return `${S3_BUCKET_URL}${ICONS_BASE_PATH}/General/16/Arch_AWS-General_16.svg`;
  }

  const fullUrl = `${S3_BUCKET_URL}${ICONS_BASE_PATH}/${bestMatch[1]}`;
  console.log(`🎨 Resolved icon for ${serviceName}:`, fullUrl);
  
  // Cache the result
  iconCache.set(serviceName, fullUrl);
  
  return fullUrl;
};

export { AWS_ICON_CATEGORIES, SERVICE_MAPPINGS };