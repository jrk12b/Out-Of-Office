from django.shortcuts import render, redirect # type: ignore
from django.contrib.auth import authenticate, login, logout # type: ignore
from django.contrib.auth.forms import AuthenticationForm # type: ignore
from django.contrib import messages # type: ignore
from django.contrib.auth.decorators import login_required # type: ignore
from django.contrib.auth.forms import UserCreationForm # type: ignore
from django.http import JsonResponse # type: ignore

def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)  # Starts the session for the user
            messages.success(request, 'Login successful!')

            # Redirect to NiceGUI frontend
            return redirect('http://127.0.0.1:8080/')
        else:
            messages.error(request, 'Invalid credentials')
    else:
        form = AuthenticationForm()

    return render(request, 'templates/login.html', {'form': form})

def user_logout(request):
    logout(request)  # Ends the user session
    return redirect('http://127.0.0.1:8000/accounts/login/')  # Redirect to login page

def dashboard(request):
    return render(request, 'dashboard.html')

@login_required
def user_profile(request):
    return render(request, 'templates/profile.html')

def user_register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()  # Save the user
            return redirect('login')  # Redirect to the login page after registration
    else:
        form = UserCreationForm()

    return render(request, 'templates/register.html', {'form': form})

def is_authenticated(request):
    """Return 200 OK if the user is authenticated."""
    if request.user.is_authenticated:
        return JsonResponse({'authenticated': True})
    return JsonResponse({'authenticated': False}, status=401)
