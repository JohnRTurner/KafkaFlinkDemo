FROM node:18

# Create app directory
WORKDIR /usr/src/app

COPY package.json .

RUN npm install --omit=dev
# If you are building your code for production
# RUN npm install --omit=dev
# for developement it is
# RUN npm install

# Bundle app source
COPY *.js ./

# Create certs directory
WORKDIR /usr/src/certs

COPY certs/* ./

WORKDIR /usr/src/app

CMD [ "node", "index.js" ]