# Project File Structure

This project is organized with a root folder containing configuration files, a Prisma folder, and two main apps: **website** and **bot**.

| Folder/File           | Description                                                     |
|----------------------|-----------------------------------------------------------------|
| `.env`               | Environment variables for all services.                         |
| `docker-compose.yml` | Docker Compose configuration for all services.                 |
| `README.md`          | Project documentation.                                          |
| `prisma/`            | Prisma schema, migrations, and generated clients.               |
| `website/`           | Website application with its own dependencies.                  |
| `bot/`               | Bot application with its own dependencies.                      |

### Notes

- Both **website** and **bot** have their own `node_modules` directories.
- The **root `.env`** file is used for global environment variables, and is inherited by lower directories such as `website` and `bot`.
- Prisma clients are generated from the `prisma/` folder and used in both apps automatically, just run `npx prisma generate | npx prisma migrate dev --name update` when updating the `schema.prisma`.
