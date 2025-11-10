#frontend
# Imagen base ligera
FROM node:20-slim

# Instalar http-server
RUN npm install -g http-server 

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos estáticos del frontend
COPY . .

# Instalar dependencias y construir la aplicación
RUN npm install && npm run build

# Exponer el puerto
EXPOSE 8081

# Servir el frontend
CMD ["http-server", "./dist", "-p", "8081", "-a", "0.0.0.0", "-S", "-C", "certs/fd_transcendence.crt", "-K", "certs/fd_transcendence.key"]