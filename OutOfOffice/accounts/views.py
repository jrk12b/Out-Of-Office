from django.shortcuts import render, redirect # type: ignore
from django.contrib.auth import authenticate, login, logout # type: ignore
from django.contrib.auth.forms import AuthenticationForm # type: ignore
from django.contrib import messages # type: ignore
from django.contrib.auth.decorators import login_required # type: ignore
from django.contrib.auth.forms import UserCreationForm # type: ignore

# Create your views here.

def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)  # Starts the session for the user
            messages.success(request, 'Login successful!')
            return redirect('dashboard')  # Redirect to a dashboard or home page
        else:
            messages.error(request, 'Invalid credentials')
    else:
        form = AuthenticationForm()

    return render(request, 'templates/login.html', {'form': form})

def user_logout(request):
    logout(request)  # Ends the user session
    return redirect('login')  # Redirect to login page

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