FROM node:18.20.0-alpine3.19

WORKDIR /app

# 设置apk aliyun源
# RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
# RUN apk add --no-cache --update python3 make g++ \
#   && apk add --no-cache --update nodejs=16.19.0-r0 yarn=1.22.10-r0 \
#   && rm -rf /var/cache/apk/*

COPY client client
COPY public public
COPY src src
COPY .env.production .env.production
COPY index.html index.html
COPY nest-cli.json nest-cli.json
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json
COPY vite.config.ts vite.config.ts
COPY ecosystem.config.js ecosystem.config.js
COPY .npmrc .npmrc

RUN npm install --registry=https://registry.npmmirror.com && npm run build
RUN npm install pm2 -g

ENTRYPOINT ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
