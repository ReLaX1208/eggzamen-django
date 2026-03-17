from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth.views import LogoutView
from django.urls import path, include
from django.views.decorators.cache import never_cache
from django.contrib.staticfiles.views import serve
from django.contrib.auth import views as auth_views

from bboard.views import (
    LoginUser, RegisterUser, ProfileUser,
    UserForgotPasswordView, UserPasswordResetConfirmView,
    RubricListView, BbApiByRubricView
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/rubrics/<int:rubric_id>/bbs/', BbApiByRubricView.as_view(), name='bbs-by-rubric'),
    path('api/v1/rubricslist/', RubricListView.as_view(), name='rubric-list'),
    path('accounts/login/', LoginUser.as_view(), name='login'),
    path('accounts/logout/', LogoutView.as_view(), name='logout'),
    path('accounts/register/', RegisterUser.as_view(), name='register'),
    path('password-reset/', UserForgotPasswordView.as_view(), name='password_reset'),
path("password_change/",
         auth_views.PasswordChangeView.as_view(
             template_name="registration/password_change_form.html"
         ),
         name="password_change"),
    path("password_change/done/",
         auth_views.PasswordChangeDoneView.as_view(
             template_name="registration/password_change_done.html"
         ),
         name="password_change_done"),
    path('set-new-password/<uidb64>/<token>/', UserPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('', include('bboard.urls', namespace='bboard')),
    path('profile/', ProfileUser.as_view(), name='profile'),
    path('captcha/', include('captcha.urls')),
path("api/", include("bboard.api_urls")),

]

if settings.DEBUG:

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


    urlpatterns.append(path('static/<path:path>', never_cache(serve)))
