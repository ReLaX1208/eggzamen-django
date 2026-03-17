from django.urls import path
from bboard.api_views import (
    RubricListApi,
    RubricDetailApi,
    BbListApi,
    BbDetailApi,
    BbByRubricApi,
    ServiceListApi,
    ServiceCreateApi,
    ServiceUpdateApi,
    ServiceDeleteApi,
    SearchApi,
)

app_name = "bboard_api"

urlpatterns = [

    # ---------- RUBRICS ----------
    path("rubrics/", RubricListApi.as_view()),
    path("rubrics/<int:pk>/", RubricDetailApi.as_view()),

    # ---------- BB ----------
    path("bbs/", BbListApi.as_view()),
    path("bbs/<int:pk>/", BbDetailApi.as_view()),
    path("rubrics/<int:rubric_id>/bbs/", BbByRubricApi.as_view()),

    # ---------- SERVICES ----------
    path("services/", ServiceListApi.as_view()),
    path("services/add/", ServiceCreateApi.as_view()),
    path("services/<int:pk>/edit/", ServiceUpdateApi.as_view()),
    path("services/<int:pk>/delete/", ServiceDeleteApi.as_view()),

    # ---------- SEARCH ----------
    path("search/", SearchApi.as_view()),
]
