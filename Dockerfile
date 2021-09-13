# base image
FROM node:15.2.1-alpine

# working directory
WORKDIR /app

# add binaries to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/

RUN npm install

# copy app files and build
COPY . /app

#ARG SERVER_PORT=5000

RUN npm run build
# start app
CMD ["npm", "run", "start"]