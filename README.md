\# PharmaManager

Application de gestion de pharmacie — Test technique SMARTHOLOL



\## Stack Technique

\- Backend : Django 5.x + Django REST Framework + PostgreSQL

\- Frontend : React.js (Vite)

\- Documentation API : http://localhost:8000/api/schema/swagger-ui/



\## Installation Backend

```bash

cd backend

python -m venv venv

venv\\Scripts\\activate

pip install -r requirements.txt

cp .env.example .env

python manage.py migrate

python manage.py loaddata fixtures/initial\_data.json

python manage.py runserver

```



\## Installation Frontend

```bash

cd frontend

npm install

cp .env.example .env

npm run dev

```



\## Variables d'environnement Backend

```

DEBUG=True

SECRET\_KEY=your-secret-key

DB\_NAME=pharma\_db

DB\_USER=postgres

DB\_PASSWORD=

DB\_HOST=localhost

DB\_PORT=5432

```

