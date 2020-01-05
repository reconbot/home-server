FROM balenalib/raspberrypi3-node:10-build
# FROM balenalib/%%BALENA_MACHINE_NAME%%-node:12-stretch-run
WORKDIR /app

EXPOSE 3282
EXPOSE 5353

ENV DATA_DIRECTORY /data/
VOLUME $DATA_DIRECTORY

COPY package*.json ./

# This install npm dependencies on the balena build server,
# making sure to clean up the artifacts it creates in order to reduce the image size.
RUN JOBS=MAX npm install --production --unsafe-perm && npm cache verify && rm -rf /tmp/*

# This will copy all files in our root to the working directory in the container
COPY . ./

CMD ["npm", "start"]
