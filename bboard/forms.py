from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
# from django.core import validators
from django.forms import (ModelForm, modelform_factory, DecimalField,
                          modelformset_factory, BaseModelFormSet)
from django.forms.widgets import Select, TextInput, PasswordInput
from django import forms

from bboard.models import Bb, Rubric
from captcha.fields import CaptchaField




class BbForm(ModelForm):
    title = forms.CharField(
        label='Название товара',
        #         validators=[validators.RegexValidator(regex='^.{4,}$')],
        #         error_messages={'invalid': 'Слишком короткое название товара'},
        strip=True)
    # content = forms.CharField(label='Описание',
    #                           widget=forms.widgets.Textarea())
    price = forms.DecimalField(label='Цена', decimal_places=2, initial=0.0)
    rubric = forms.ModelChoiceField(queryset=Rubric.objects.all(),
                                    label='Рубрика',
                                    # label_suffix=':',
                                    help_text='Не забудьте выбрать рубрику!',
                                    widget=forms.widgets.Select(attrs={'size': 4}),
                                    # required=False,
                                    # disabled=True,
                                    )
    captcha = CaptchaField(label='Введите текст с картинки',
                           error_messages={'invalid': 'Неправильный текст'},
                           # generator='captcha.helpers.random_char_challenge',
                           # generator='captcha.helpers.math_challenge',
                           # generator='captcha.helpers.word_challenge',
                           )

    def clean_title(self):
        val = self.cleaned_data['title']
        if val == 'Прошлогодний снег':
            raise ValidationError('К продаже не допускается')
        return val

    def clean(self):
        super().clean()
        errors = {}

        if not self.cleaned_data['content']:
            errors['content'] = ValidationError(
                'Укажите описание продаваемого товара')

        if self.cleaned_data['price'] < 0:
            errors['price'] = ValidationError(
                'Укажите неотрицательное значение цены')

        if errors:
            raise ValidationError(errors)

    class Meta:
        model = Bb
        fields = ('title', 'content', 'price', 'rubric')
        labels = {'title': 'Название товара'},


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

class SearchForm(forms.Form):
    keyword = forms.CharField(max_length=20, label='Искомое слово')
    rubric = forms.ModelChoiceField(queryset=Rubric.objects.all(), label='Рубрика')
class RegisterUserForm(UserCreationForm):
    username = forms.CharField(label="Логин", widget=TextInput(attrs={'class': 'form-input'}))
    password1 = forms.CharField(label="Пароль", widget=forms.PasswordInput(attrs={'class': 'form-input'}))
    password2 = forms.CharField(label="Повтор пароля", widget=forms.PasswordInput(attrs={'class': 'form-input'}))

    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'first_name', 'last_name', 'password1', 'password2']
        labels = {
            'email': 'E-mail',
            'first_name': 'Имя',
            'last_name': "Фамилия",
        }
        widgets = {
            'email': TextInput(attrs={'class': 'form-input'}),
            'first_name': TextInput(attrs={'class': 'form-input'}),
            'last_name': TextInput(attrs={'class': 'form-input'}),
        }

    def clean_email(self):
        email = self.cleaned_data['email']
        if get_user_model().objects.filter(email=email).exists():
            raise forms.ValidationError("Такой email уже существует")
        return email


class LoginUserForm(AuthenticationForm):
    username = forms.CharField(label='Login', widget=TextInput(attrs={'class': 'form-input'}))
    password = forms.CharField(label='Password', widget=PasswordInput(attrs={'class': 'form-input'}))

    class Meta:
        model = get_user_model()
        fields = ['username', 'password']
