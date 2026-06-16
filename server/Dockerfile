# Production image for the Express API.
FROM node:20-alpine

WORKDIR /app

# Install only the server's production deps.
COPY package.json ./
RUN npm install --omit=dev

COPY src ./src

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "src/index.js"]
