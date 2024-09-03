from django.urls import path
from testapp.views import SMSListView

app_name = 'testapp'

urlpatterns = [
    path('sms/', SMSListView.as_view(), name='sms_list'),
]