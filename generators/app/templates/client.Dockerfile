#stage 1 - compile angular app
FROM node:11-alpine as builder

WORKDIR /var/src

COPY package.json .

RUN npm install

COPY . .

#For angular app - in your package.json add: "build:prod":"ng build --prod"
RUN npm run build:prod 

# stage 2 copy dist to small nginx server
FROM nginx:alpine

COPY --from=builder /var/src/dist/<%=clientProjName%> /user/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
