

# MCI Mosquera App

[![Deploy app to GitHub Pages](https://github.com/yrguativa/MCIM/actions/workflows/deploy.yml/badge.svg)](https://github.com/yrguativa/MCIM/actions/workflows/deploy.yml)

Este es un projecto que se genera para poder generar un QR de ingreso a un evento, simplemente se valida el numero de identificación y se genera un QR

## Como publicar

* Generar archivos de publicación
```sh
npm run build
```

> [!IMPORTANT]
> Hay que cambiar en el archivo index.html, la ruta de subdominio

* Copiar el contenido en la carpeta de raiz ./Docs

* Visar el sitio https://yrguativa.github.io/MCIM/


Send message by auth 
https://api.whatsapp.com/send?phone=50764659944&text=hola


# BackEnd

```sh
pnpm start:dev
```

Navigate to url http://localhost:3000/graphql