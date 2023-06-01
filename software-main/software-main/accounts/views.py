from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import Accounts

def loginV(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        
        account = Accounts.objects.filter(username=username, password=password).first()
        if account and not User.objects.filter(username=username).exists():
            user = User.objects.create_user(username=username, password=password, is_superuser=False)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('plan')
        else:
            error_message = 'Invalid username or password.'
            return render(request, 'login.html', {'error_message': error_message})
    return render(request, 'login.html')

def signupV(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        firstname = request.POST['firstname']
        lastname = request.POST['lastname']
        username = request.POST['username']

        
        if Accounts.objects.filter(username=username).exists():
            error_message = 'this username already exists.'
            return render(request, 'signup.html', {'error_message': error_message})
        if not email or not password or not firstname or not lastname or not username:
            error_message = 'Please fill in all the required fields.'
            return render(request, 'signup.html', {'error_message': error_message})
        
        user = Accounts(email=email, password=password,username=username, firstname=firstname, lastname=lastname)
        user.save()
        return redirect('login')
    
    return render(request, 'signup.html')

def logoutV(request):
    logout(request)
    return redirect('login')
