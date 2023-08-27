FROM node:18

# Create certs directory
WORKDIR /usr/src/certs

COPY certs/* ./

# Create app directory
WORKDIR /usr/src/app

COPY package.json .

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY *.js ./

CMD [ "node", "index.js" ]