FROM node:16-alpine as build

WORKDIR /usr/local/app
RUN npm install -g @angular/cli
COPY simple-frontend /usr/local/app
COPY nginx.conf /usr/local/app/nginx.conf

RUN npm install
RUN ng build --configuration production

FROM nginx:latest as runtime
COPY --from=build /usr/local/app/nginx.conf /etc/nginx/conf.d/nginx.conf
COPY --from=build /usr/local/app/dist/simple-frontend /usr/share/nginx/html
