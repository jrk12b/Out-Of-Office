import requests # type: ignore
from nicegui import ui # type: ignore

def is_authenticated(session):
    """Check if the user is authenticated using the Django backend."""
    response = session.get('http://127.0.0.1:8000/accounts/is-authenticated/')
    return response.status_code == 200

def authentication_guard():
    """Redirect to login page if the user is not authenticated."""
    with requests.Session() as session:
        if not is_authenticated(session):
            ui.navigate.to('http://127.0.0.1:8000/accounts/login/')
