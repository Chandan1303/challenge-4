FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY shared/package.json shared/package.json
COPY frontend/package.json frontend/package.json
RUN npm install

FROM deps AS build
COPY shared shared
COPY frontend frontend
RUN npm run build -w shared && npm run build -w frontend

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/shared shared
COPY --from=build /app/frontend frontend
EXPOSE 3000
CMD ["npm", "run", "start", "-w", "frontend"]
