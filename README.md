The backend of the Fundlevel platform.

# How to run

## Step by step (examples shown for Mac OS)

### Basic Setup

#### Prerequisites:

- Install [Go](https://go.dev/doc/install)
- Install Make, easily done via Homebrew (Mac OS), Chocolatey (Windows), or any other package manager.
- Install [Air](https://github.com/cosmtrek/air) for Go hot reloading.

#### Steps:

1. **Make a new working directory:**

   ```sh
   cd path/to/dev/directory
   mkdir -p fundlevel/api
   ```

2. **Clone the API repository and complete the environment variables:**

   ```sh
   git clone https://github.com/yakubu-llc/fundlevel-api.git ./fundlevel/api
   cp ./fundlevel/api/.env.example ./fundlevel/api/.env.local
   ```

   Fill out the environment variables accordingly. Please contact the team for the correct values if you do not have access. Note that if you want to use a self-hosted Supabase instance, you can follow the next section and use the values from there.

3. **Run the API:**

   ```sh
   cd ./fundlevel/api
   make watch
   ```

### Using a self-hosted Supabase instance

#### Prerequisites:

- Install the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=macos) if you want to use a self-hosted Supabase instance.
- Install [Docker](https://www.docker.com/products/docker-desktop/)
- Install [Goose](https://github.com/pressly/goose?tab=readme-ov-file#install)

#### Steps:

1. **Navigate to working directory:**

   ```sh
   # Navigate to the directory that you initiated in the previous section during step 1
   cd path/to/dev/directory
   cd fundlevel # Assuming you called the directory fundlevel
   ```

2. **Initialize the Supabase instance:**

   ```sh
   supabase init
   ```

3. **Replace default Supabase config files:**

   ```sh
   rm -f supabase/config.toml

   # Clone the configuration files
   git clone https://gist.github.com/a927a6354cd9590dd2954a59c28758d6.git
   mv ./a927a6354cd9590dd2954a59c28758d6/config.toml ./supabase
   mv ./a927a6354cd9590dd2954a59c28758d6/.env ./supabase
   rm -rf ./a927a6354cd9590dd2954a59c28758d6
   ```

   Note that you can confirm the values in the `config.toml` file are correct by checking the [Supabase docs](https://supabase.com/docs/guides/local-development/cli/config).

4. **Generate local OAuth credentials:**

   Note that we have the following assumptions:

   - Your frontend is running on `localhost:3000`
   - Your Supabase API is running on `localhost:54321` (set in the `supabase/.env` file via `API_URL`)

   - [Github](https://github.com/settings/applications/new)
     - Example (Assuming your frontend is running on `localhost:3000`):
       - Application name: Fundlevel
       - Homepage URL: `http://localhost:3000`
       - Callback URL: `http://localhost:3000/auth/v1/callback`
   - [Google](https://console.cloud.google.com/apis/credentials)
     - If you're not sure how to create a Google OAuth client, use YouTube or ChatGPT
     - Example (Assuming your frontend is running on `localhost:3000`):
       - Application Type: Web application
       - Name: Fundlevel
       - Authorized JavaScript origins: `http://localhost:3000`
       - Authorized redirect URIs: `http://localhost:54321/auth/v1/callback`

5. **Fill out the `./supabase/.env` file with the correct values. Values that have not yet been provided can be accessed by contacting a team lead.**

6. **Run the following command to start the Supabase server:**

   - Make sure your Docker Desktop is running

   ```sh
   cd ./fundlevel/supabase
   source .env && supabase start
   ```

7. **Reconfigure the API to use the self-hosted Supabase instance:**

   After a bit, you should see a screen that looks like this:

   ```sh
   ❯ source .env && supabase start
   Started supabase local development setup.

            API URL: http://127.0.0.1:54321
        GraphQL URL: http://127.0.0.1:54321/graphql/v1
             DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
         Studio URL: http://127.0.0.1:54323
       Inbucket URL: http://127.0.0.1:54324
         JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
           anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
   ```

   - Use the `API URL` as the `SUPABASE_HOST` value in the backend (use in the front end as well if you're running it locally).
   - Use the `DB URL` as the `DATABASE_URL` value in the backend.
   - Use the `anon key` as the `SUPABASE_ANON_KEY` value in the frontend if you're running it locally.
   - Use the `service_role key` as the `SUPABASE_SERVICE_KEY` value in the backend.

   Note:

   - If you try to auth in the frontend via email - you can see received emails in the `Inbucket URL`.
   - You can see the dashboard at `Studio URL`.

8. **Migrate DB:**

   ```sh
   cd ./fundlevel/api # Navigate to the API directory
   make db-status
   make db-up
   ```
