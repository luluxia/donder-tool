FROM nginx:stable-alpine

# 复制自定义的 nginx 配置文件
COPY default.conf /etc/nginx/conf.d/default.conf

# 将当前目录下的所有文件（构建产物）复制到 nginx 的 web 根目录
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
