FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the production build
RUN npm run build

# Serve the build folder
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000", "--listen", "0.0.0.0"]

