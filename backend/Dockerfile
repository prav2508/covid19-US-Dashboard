FROM node:alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
CMD ["npm", "run", "start"]

FROM python:3.10
ADD dataImport.py .
RUN pip install requests mysql-connector-python
CMD [ "python3", "./dataImport.py" ]