FROM node:current

# Create app directory and use as the shared working directory for both client and server side
RUN mkdir -p /srv/app/client
WORKDIR /srv/app/client

COPY package.json /srv/app/client
COPY package-lock.json /srv/app/client

RUN npm install --legacy-peer-deps

COPY . /srv/app/client

CMD ["npm", "start"]