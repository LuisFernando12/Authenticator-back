FROM node:lts-alpine AS builder

WORKDIR /app

COPY package.json ./

RUN npm install --quiet --no-optional --no-fund --loglevel=error

COPY .  .

RUN npm run build

FROM node:lts-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

RUN npm run start

# CMD [ "node", "dist/main" ]