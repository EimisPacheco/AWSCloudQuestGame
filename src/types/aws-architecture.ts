export interface AWSService {
  id: string;
  name: string;
  icon: string;
}

export interface AWSArchitecture {
  services: AWSService[];
  connections: Array<{
    from: string;
    to: string;
  }>;
}

export interface AWSQuestion {
  text: string;
  position: string;
  missingServices: string[];
}

export interface ServiceOption {
  id: string;
  name: string;
  icon: string;
}

export interface ArchitectureData {
  architecture: AWSArchitecture;
  question: AWSQuestion;
  options: ServiceOption[];
} 