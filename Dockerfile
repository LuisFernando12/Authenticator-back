FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@10

ENV HUSKY=0

COPY package*.json pnpm-lock.yaml  ./
RUN pnpm install  --frozen-lockfile --quiet --loglevel=error

COPY . .

RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm@10

ENV NODE_ENV=production
ENV HUSKY=0

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist

RUN pnpm install --prod  --frozen-lockfile --quiet --loglevel=error


EXPOSE 3000

CMD [ "node", "dist/src/main" ]