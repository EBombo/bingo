# base image
FROM node:14.15.4-alpine
# working directory
WORKDIR /app
# add binaries to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install and cache app dependencies
COPY package*.json /app/
RUN npm install --force --only=production

ARG SERVER_PORT=5000
EXPOSE $SERVER_PORT
# copy app files and build
COPY . /app
RUN npm build
# start app
CMD [ "npm", "start" ]