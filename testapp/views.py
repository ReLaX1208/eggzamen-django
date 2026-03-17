from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import ListView

from .models import SMS

class SMSListView(ListView):
    model = SMS
    template_name = 'testapp/sms_list.html'
    success_url = reverse_lazy('testapp:sms_list')
