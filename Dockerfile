FROM node:24.10.0-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:24.10.0-alpine

WORKDIR /usr/app

COPY --from=build /app/dist/production-analysis-frontend/browser ./browser
COPY --from=build /app/dist/production-analysis-frontend/server ./server

COPY --from=build /app/package*.json ./

RUN npm ci --omit=dev --legacy-peer-deps

ENV PORT=4200
ENV NODE_ENV=production

EXPOSE 4200

CMD ["node", "server/server.mjs"]
