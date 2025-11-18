#frontend dev
FROM node:20-slim
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 5173 8081
ENV HOST=0.0.0.0

CMD ["npm", "run", "dev"]

# RUN npm install && npm run build
#CMD ["http-server", ".", "-p", "5153", "-a", "0.0.0.0", "-S", "-C", "certs/fd_transcendence.crt", "-K", "certs/fd_transcendence.key"]