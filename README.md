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

The frontend app runs on port `3000` by default. This app runs on a specific port, which you need to configure in your `.env` file. I used port `3001` as a default, but you can customize it to your preferences. Create a `.env` file in the root directory of the project if it doesn't already exist. You have .env.example of all env variables you should configure. For example, to run the backend on port `3001`, use:

```
    PORT=3001
```

### Configuration

You should have PostgreSQL installed on your system. If not, you can download it from the [official PostgreSQL website](https://www.postgresql.org/download/).

To configure the PostgreSQL database connection, you need to set the following environment variables:

- `DB_HOST`: The hostname or IP address of the PostgreSQL server.
- `DB_USERNAME`: The username for PostgreSQL authentication.
- `DB_PASSWORD`: The password for PostgreSQL authentication.

- ## Database Migration and Seeding

### Step 1: Database Creation

Before running migrations and seeders, make sure you have created the database where you want to apply these changes.

### Step 2: Running Migrations

To apply all pending migrations and create the corresponding database tables, use the following command:

```bash
npx sequelize-cli db:migrate
```

### Step 3: Running Seeders

To seed all initial data, use the following command:

```
npx sequelize-cli db:seed:all
```


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
