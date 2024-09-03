from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
# from django.core import validators
from django.forms import (ModelForm, modelform_factory, DecimalField,
                          modelformset_factory, BaseModelFormSet)
from django.forms.widgets import Select
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

class RubricBaseFormSet(BaseModelFormSet):
    def clean(self):
        super().clean()
        names = [form.cleaned_data['name'] for form in self.forms
                 if 'name' in form.cleaned_data]

        if ('Недвижимость' not in names) or ('Транспорт' not in names) \
            or ('Мебель' not in names):
            raise ValidationError('Добавьте рубрики недвижимость, транспорт и мебель')


RubricFormSet = modelformset_factory(
    Rubric, fields=('name',),
    can_order=True, can_delete=True, extra=2,
    formset=RubricBaseFormSet
)
