# MEDICA

Application developed for healthcare industry using RESTful APIs (Node, Sequelize, React, Postgres) for doctors and administrators. Included features like appointment scheduling, patient management, vital signs recording, and medication tracking. Integrated email reminders to enhance appointment communication.

## Getting started

Clone the repo and install the dependencies.

```shell
git clone https://github.com/basicem/medica-api.git
cd medica-api
```

```shell
npm install
```

You should have PostgreSQL installed on your system. If not, you can download it from the [official PostgreSQL website](https://www.postgresql.org/download/).

### Configuration

To configure the PostgreSQL database connection, you need to set the following environment variables:

- `DB_HOST`: The hostname or IP address of the PostgreSQL server.
- `DB_USERNAME`: The username for PostgreSQL authentication.
- `DB_PASSWORD`: The password for PostgreSQL authentication.

## Email Configuration (Using Mailtrap)

Before configuring Mailtrap, make sure you have the following:

- **Mailtrap Account**: Create an account on [Mailtrap](https://mailtrap.io/) if you don't already have one.

- ### Configuration

Follow these steps to configure Mailtrap with your project:

1. **Sign in to Mailtrap**

   Log in to your Mailtrap account and create a new mailbox. You will get SMTP configuration details (SMTP server, port, username, and password) for your mailbox.

2. **Update Project Configuration**

   Update the email settings with the following SMTP details provided by Mailtrap in .env file:

   - **SMTP Server**: `smtp.mailtrap.io`
   - **Port**: `2525` (or the port number provided by Mailtrap)
   - **Username**: Your Mailtrap username
   - **Password**: Your Mailtrap password

To start the project open the terminal and type text below:

```shell
npm run dev
```

From here the project is running.
