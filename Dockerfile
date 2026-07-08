FROM node:lts-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@10

ENV HUSKY=0

COPY package*.json pnpm-lock.yaml  ./
RUN pnpm install --frozen-lockfile --quiet --loglevel=error

COPY . .

RUN pnpm build

FROM node:lts-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules


EXPOSE 3000

CMD [ "node", "dist/src/main" ]