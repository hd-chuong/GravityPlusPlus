FROM node:current

# Create app directory and use as the shared working directory for both server and server side
RUN mkdir -p /srv/app/server
WORKDIR /srv/app/server

COPY package.json /srv/app/server
COPY package-lock.json /srv/app/server

RUN npm install

COPY . /srv/app/server

CMD ["npm", "start"]