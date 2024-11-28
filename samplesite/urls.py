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

from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth.views import LogoutView, PasswordChangeDoneView, PasswordResetView, PasswordResetDoneView, \
    PasswordResetConfirmView, PasswordResetCompleteView
from django.urls import path, include, reverse_lazy
from django.views.decorators.cache import never_cache

from bboard.views import LoginUser, RegisterUser, ProfileUser, UserForgotPasswordView, UserPasswordResetConfirmView
from samplesite import settings
from django.contrib.staticfiles.views import serve

urlpatterns = [
    path('admin/', admin.site.urls),

    path('accounts/login/', LoginUser.as_view(), name='login'),
    path('accounts/logout/', LogoutView.as_view(), name='logout'),
    path('accounts/register/', RegisterUser.as_view(), name='register'),
    path('password-reset/', UserForgotPasswordView.as_view(), name='password_reset'),
    path('set-new-password/<uidb64>/<token>/', UserPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('', include('bboard.urls', namespace='bboard')),
    path('profile/', ProfileUser.as_view(), name='profile'),
]
urlpatterns += [
    path('captcha/', include('captcha.urls')),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns.append(path('static/<path:path>', never_cache(serve)))
