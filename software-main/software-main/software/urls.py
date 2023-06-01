from django.contrib import admin
from django.urls import path , include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.HomePage,name='home'),
    path('about/',views.AboutPage,name='about'),
    path('services/',views.ServePage,name='services'),
    path('contact/',views.ContactPage,name='contact'),
    path('blog/',views.BlogPage,name='blog'),
    path('plan/',views.Plan,name='plan'),
    path('accounts/',include('accounts.urls')),
] 
