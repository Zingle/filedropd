FROM node:16

ENV FILEDROP_DIR=/var/filedrop
ENV FILEDROP_PORT=4135
ENV FILEDROP_USER=filedrop
ENV FILEDROP_PASS=

COPY . /usr/src/filedropd

RUN npm pack /usr/src/filedropd \
 && npm install -g ./filedropd-*.tgz \
 && rm ./filedropd-*.tgz

EXPOSE 4135
CMD ["/usr/local/bin/filedropd"]
