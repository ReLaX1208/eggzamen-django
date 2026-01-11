from django.urls import path, re_path

from bboard.models import Bb
from bboard.views import (index, BbCreateView,
                          BbByRubricView, BbDetailView,
                          BbDeleteView, BbRedirectView, edit, RubCreateView, rubrics, about,
                          edit_rubric, RubricDeleteView, Search, brands_view, policy_view, services_view,
                          delete_service, edit_service, add_service, accessories_view, add_accessory, edit_accessory,
                          delete_accessory, )

app_name = 'bboard'

urlpatterns = [
    path('add/', BbCreateView.as_view(), name='add'),
    path('update/<int:pk>/', edit, name='update'),
    path('rubrics/<int:pk>/edit/', edit_rubric, name='edit_rubric'),
    path('rubrics/<int:pk>/delete/', RubricDeleteView.as_view(), name='delete_rubric'),
    path('addrub/', RubCreateView.as_view(), name='addrub'),
    path('delete/<int:pk>/', BbDeleteView.as_view(), name='delete'),
    path('<int:rubric_id>/', BbByRubricView.as_view(), name='by_rubric'),
    path('detail/<int:pk>/', BbDetailView.as_view(), name='detail'),
    path('detail/<int:year>/<int:month>/<int:day>/<int:pk>/',
         BbRedirectView.as_view(), name='old_detail'),
    path('rubrics/', rubrics, name='rubrics'),
    path('', index, name='index'),
    path('search/', Search.as_view(), name='search'),
    path('about/', about, name='about'),
    path('brands/', brands_view, name="Brands"),
path("policy/", policy_view, name="policy"),
path("services/", services_view, name="services"),
path("services/add/", add_service, name="add_service"),
path("services/add/", add_service, name="add_service"),
path("services/<int:pk>/edit/", edit_service, name="edit_service"),
path("services/<int:pk>/delete/", delete_service, name="delete_service"),
path("accessories/", accessories_view, name="accessories"),
path("accessories/add/", add_accessory, name="add_accessory"),
path("accessories/<int:pk>/edit/", edit_accessory, name="edit_accessory"),
path("accessories/<int:pk>/delete/", delete_accessory, name="delete_accessory"),



]
