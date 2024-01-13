#!/bin/bash

yum update -y

# Install Docker
yum install -y docker
service docker start
usermod -a -G docker ec2-user
chkconfig docker on

sudo -u ec2-user -i <<'EOF'

# Install Github Actions runner and dependencies
mkdir github-actions-runner
cd github-actions-runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz \
  -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz
sudo yum install dotnet-runtime-6.0 -y

# Configure Github Actions runner
./config.sh \
  --unattended \
  --url https://github.com/rurunosep/ruruflashcards \
  --pat "$(aws ssm get-parameter --name /ruruflashcards/github-actions-runner-pat | jq -r '.Parameter.Value')" \
  --name ruruflashcards-ec2  \
  --labels ruruflashcards-ec2 \
  --replace

EOF

# Start runner as service
cd /home/ec2-user/github-actions-runner
./svc.sh install
./svc.sh start

# Login Docker to Amazon ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  454158562433.dkr.ecr.us-east-1.amazonaws.com

# Pull latest Docker image
docker pull \
  454158562433.dkr.ecr.us-east-1.amazonaws.com/ruruflashcards:latest

# Start Docker container
docker run -d -p 80:5000 -p 443:5000 \
  --env GOOGLE_CLOUD_CREDENTIALS="$(aws ssm get-parameter \
    --name /ruruflashcards/google-cloud-credentials | jq -r '.Parameter.Value')" \
  --env MONGODB_URI="$(aws ssm get-parameter \
    --name /ruruflashcards/mongodb-uri | jq -r '.Parameter.Value')" \
  --env SESSION_SECRET="$(aws ssm get-parameter \
    --name /ruruflashcards/session-secret | jq -r '.Parameter.Value')" \
  --name ruruflashcards-server \
  454158562433.dkr.ecr.us-east-1.amazonaws.com/ruruflashcards:latest