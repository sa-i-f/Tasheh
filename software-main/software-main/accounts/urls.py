from django.urls import path
from . import views
urlpatterns = [
path("signup", views.signupV , name="signup"),
path("login", views.loginV, name="login"),
path("logout", views.logoutV, name="logout"),
]