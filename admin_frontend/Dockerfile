FROM node:12
WORKDIR /usr/admin_frontend
COPY . .
RUN yarn install && yarn build
EXPOSE 3001
CMD ["npx", "serve", "-s", "build"]