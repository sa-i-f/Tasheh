from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def HomePage(req):
    return render(req,"index.html",)
def AboutPage(req):
    return render(req,"about.html")
def BlogPage(req):
    return render(req,"blog.html",)
def ServePage(req):
    return render(req,"service.html",)
def ContactPage(req):
    return render(req,"contact.html",)
def Login(req):
    return render(req,"accounts/login.html",)
def Signup(req):
    return render(req,"account/signup.html",)

@login_required
def Plan(req):
    username=req.user.username
    return render(req,"plan.html", {'name': username})


