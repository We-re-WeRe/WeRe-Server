FROM node:18-alpine AS base
FROM base as build
ENV NODE_ENV = ${NODE_ENV}
COPY . /usr/local/server
RUN npm install -g @nestjs/cli
WORKDIR /usr/local/server
RUN yarn && yarn build

FROM base as production
WORKDIR /usr/local/server
COPY --from=build /usr/local/server/dist ./dist
COPY --from=build /usr/local/server/node_modules ./node_modules
COPY --from=build /usr/local/server/package.json ./package.json
COPY --from=build /usr/local/server/tsconfig.json ./tsconfig.json
RUN chmod +x ./dist/src/main.js
CMD [ "node", "./dist/src/main.js" ]
