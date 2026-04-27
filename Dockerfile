FROM python:3.11-slim
WORKDIR /app

# Install Node.js
RUN apt-get update && apt-get install -y nodejs npm

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Build React
RUN cd ui && npm install && npm run build

EXPOSE 7860
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "7860"]