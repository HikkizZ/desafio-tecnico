# Operación Logística de Última Milla

Sistema de optimización de carga para furgonetas autónoma. A partir de un inventario de paquetes con peso y valor, determina la combinación óptima que maximiza el valor total sin exceder la capacidad de carga.

## Problema y solución

El problema es el **Problema de la mochila**. Cada paquete se carga completo o no se carga, y el peso total no puede superar la capacidad de la furgoneta.

La solución que implementé fue utilizar **Programación Dinámica** con una tabla `dp[i][w]` que almacena el valor máximo que se puede alcanzar usando los primeros `i` paquetes con capacidad `w`.

## Funcionalidades

- **Inventario de paquetes**: alta de paquetes con peso y valor, con resumen de cantidad, peso total y valor total.
- **Simular carga**: dada una capacidad de furgoneta, calcula automáticamente la combinación de paquetes que maximiza el valor sin exceder el peso disponible.
- **Verificar selección manual**: permite marcar a mano los paquetes a cargar y valida si esa selección es óptima respecto al mejor valor posible para la capacidad indicada.

## Stack

- **Backend**: Node.js + Express + Typescript
- **Frontend**: React + Vite + Typescript + Tailwind CSS

## Requisitos

- Node.js 18+
- npm

## Instalación y Ejecución

### Docker

En la raiz del proyecto ejecutar `docker-compose up --build`

### Desarrollador

Dentro de la carpeta backend ejecutar:

- `npm install`
- `npm run dev`

Dentro de la carpeta frontend ejecutar

- `npm install`
- `npm run dev`

## Autor

Felipe Miranda Rebolledo
