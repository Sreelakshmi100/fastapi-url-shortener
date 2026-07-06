# FastAPI URL Shortener

A simple URL shortener built with **FastAPI**, **SQLAlchemy**, and **PostgreSQL**.

This project allows users to create shortened URLs, optionally provide a custom alias, and redirect short links to the original URL. It also tracks click counts and supports running the application with **Docker Compose**.

---

## Features

* Create short URLs from long URLs
* Support custom aliases
* Redirect short URLs to the original URL
* Track click counts for each shortened URL
* PostgreSQL database integration using SQLAlchemy
* Dockerized setup with FastAPI + Postgres
* Request validation using Pydantic

---

## Tech Stack

* **Python**
* **FastAPI**
* **SQLAlchemy**
* **PostgreSQL**
* **Pydantic**
* **Docker / Docker Compose**

---

## Project Structure

```bash
fastapi-url-shortener/
├── app/
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   └── utils.py
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── README.md
```

---

## API Endpoints

### 1. Create a short URL

**POST** `/api/v1/urls`

#### Request body

```json
{
  "original_url": "https://fastapi.tiangolo.com/",
  "custom_alias": "fastapi"
}
```

`custom_alias` is optional. If not provided, the application generates a short code automatically.

#### Success response

```json
{
  "id": 1,
  "original_url": "https://fastapi.tiangolo.com/",
  "short_code": "fastapi",
  "short_url": "http://localhost:8000/fastapi",
  "clicks": 0,
  "created_at": "2026-07-07T00:00:00"
}
```

---

### 2. Redirect to original URL

**GET** `/{short_code}`

Example:

```bash
GET /fastapi
```

This redirects the user to the original URL and increments the click count.

---

## Custom Alias Rules

Custom aliases:

* can contain **letters**, **numbers**, **underscores (`_`)**, and **hyphens (`-`)**
* cannot contain spaces or special characters like `/`, `?`, `&`, `#`

Examples of valid aliases:

* `google`
* `my-link`
* `my_link`
* `abc123`

Examples of invalid aliases:

* `my link`
* `my/link`
* `hello?`

---

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/Sreelakshmi100/fastapi-url-shortener.git
cd fastapi-url-shortener
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create a `.env` file

Use `.env.example` as reference:

```env
DATABASE_URL=postgresql://postgres:<your_password>@localhost:5432/url_shortener
BASE_URL=http://localhost:8000
```

Make sure PostgreSQL is running and the `url_shortener` database exists.

### 5. Run the app

```bash
uvicorn app.main:app --reload
```

The API will be available at:

* App: `http://127.0.0.1:8000`
* Swagger docs: `http://127.0.0.1:8000/docs`

---

## Running with Docker

### 1. Create a `.env.docker` file

Use `.env.docker.example` as reference:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/url_shortener
BASE_URL=http://localhost:8000
```

### 2. Start the application

```bash
docker compose up --build
```

The API will be available at:

* App: `http://127.0.0.1:8000`
* Swagger docs: `http://127.0.0.1:8000/docs`

---

## Example Test Scenarios

### Create URL without custom alias

```json
{
  "original_url": "https://www.google.com"
}
```

### Create URL with custom alias

```json
{
  "original_url": "https://www.google.com",
  "custom_alias": "google"
}
```

### Duplicate alias

If the alias already exists, the API returns a `400 Bad Request`.

### Invalid alias

If the alias contains unsupported characters, the API returns a `400 Bad Request`.

### Invalid original URL

If `original_url` is not a valid URL, the API returns a `422 Unprocessable Entity`.

---

## Notes / Limitations

This is a beginner-friendly MVP and intentionally keeps things simple. Some improvements that can be added later:

* Alembic migrations instead of `Base.metadata.create_all()`
* Unit and integration tests with pytest
* Better error handling and custom exception classes
* URL deduplication (return the same short URL for the same original URL)
* Expiry support for links
* Analytics / stats endpoint
* Rate limiting / authentication if exposed publicly

---

## Future Improvements

Some good next steps for this project:

* Add `GET /api/v1/urls/{short_code}` to fetch URL details and click count
* Add delete/update endpoints
* Add structured logging
* Add tests using pytest and a test database
* Deploy using Docker on Render, Railway, or Fly.io

---

## Learning Goals of This Project

This project was built as a beginner backend project to practice:

* FastAPI basics
* REST API design
* SQLAlchemy ORM with PostgreSQL
* request/response validation with Pydantic
* Dockerizing a backend application
* basic Git workflow using feature branches
