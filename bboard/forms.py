from django.contrib.auth.models import User
from django.forms import ModelForm
from django import forms
from bboard.models import Bb, Rubric


class BbForm(ModelForm):
    title = forms.CharField(label='Nazvanie')
    content = forms.CharField(label='Opisanie',
                               widget=forms.widgets.Textarea())
    price = forms.DecimalField(label='cena', decimal_places=2)
    rubric = forms.ModelChoiceField(queryset=Rubric.objects.all(),
                                    label='rubric',
                                    help_text='dont forget',
                                    widget=forms.widgets.Select(attrs={'size':4}))
    class Meta:
        model = Bb
        fields = ('title', 'content', 'price', 'rubric')
        labels = {'title': 'Nazvanie'}

class RubricForm(ModelForm):
    name = forms.CharField(label='Nazvanie')

    class Meta:
        model = Rubric
        fields = {'name'}
        labels = {'name': 'Nazvanie'}

class RegistrationUserForm(ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.widgets.PasswordInput())
    password2 = forms.CharField(label='Povtorite password')
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2', 'first_name','last_name')
