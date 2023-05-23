# Plantilla tienda - Sami 5

### 🚀 Estructura de proyecto

```css
/
├── src/
│   └── assets/
│   └── footer/
│   └── header/
│   └── js/
│   └── json/
│   └── module/
│   └── paginas_contenido/
│   └── recursos/
│   └── template_correos/
│   └── template_pasarelas/
│   └── atribute_variaciones.json
│   └── categorias.json
│   └── template_bk.html
│   └── template.html
├── .env.example
├── .gitignore
├── README.md
```

### Configurar CI

Copiar las variables de `env.example` en nuestros secretos de Github Actions.

### ⚒️ Comandos de GIT

- Crear una nueva rama.

  ```bash
  git switch -c $branch
  ```

  $branch: brando-dev

- Listar cambios en el proyecto local.

  ```bash
  git status -s
  ```

- Agregar cambios al Staging Area (Cambios Locales).

  ```bash
  git add .
  ```

- Agregar comentario de la subida de los cambios.

  ```bash
  git commit -m 'test commit'
  ```

- Agregar cambios al Repositorio Remoto (Github).

  ```bash
  git push --set-upstream origin $branch
  ```

  $branch: brando-dev

###  ⚒️ Comandos adicionales

- Actualizar cambios del proyecto.

  ```bash
  git pull origin main
  ```

- Volver a la rama principal.

  ```bash
  git switch main
  ```

- Fusionar los cambios realizados desde $branch a la rama main.

  ```bash
  git merge $branch
  ```

  $branch: brando-dev

- Listar cambios subidos en el repositorio remoto.

  ```bash
  git log --decorate --oneline --graph --all
  ```

- Definir la subida desde una rama principal.

  ```bash
  git push --set-upstream origin main
  ```
