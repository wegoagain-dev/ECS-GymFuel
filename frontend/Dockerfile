FROM node:20-alpine AS builder

# reminder: libc6-compat might be needed. in nextjs image build.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Build the app (this will create the .next/standalone folder)
RUN npm run build

# Production image, copy all the files and run
FROM node:20-alpine AS runner
WORKDIR /app

RUN adduser -D nextjs

# COPY --from=builder /app/public ./public
# --chown so user 'nextjs' owns the files
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
