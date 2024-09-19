"""
URL configuration for samplesite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from tempfile import template
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView, PasswordChangeView, PasswordChangeDoneView
from django.urls import path, include

from bboard.views import LoginUser, RegisterUser

urlpatterns = [
    path('admin/', admin.site.urls),

    path('accounts/login/', LoginUser.as_view(), name='login'),
    path('accounts/logout/', LogoutView.as_view(), name='logout'),
    path('accounts/register/', RegisterUser.as_view(), name='register'),


    path('accounts/password_change/',
         PasswordChangeView.as_view(
             template_name='registration/change_password.html'),
         name='password_change'),
    path('accounts/password_change/done/',
         PasswordChangeDoneView.as_view(
             template_name='registration/password_changed.html'),
         name='password_change_done'),

    path('', include('bboard.urls', namespace='bboard')),
]
