- Backend
- updated DB password
- allowed ec2 instance public IP on mongodb server
- npm intsall pm2 -g
- pm2 start npm --name "devfinder-backend" -- start
- pm2 logs
- pm2 list, pm2 flush <name> , pm2 stop <name>, pm2 delete <name>
- config nginx - /etc/nginx/sites-available/default
- restart nginx - sudo systemctl restart nginx
- Modify the BASEURL in frontend project to "/api"

nginx config
pah_to_nginx_file: /etc/nginx/sites-available/default

server_name 3.25.113.134;
location /api/ {
        proxy_pass http://localhost:7777/;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    sudo systemctl restart nginx