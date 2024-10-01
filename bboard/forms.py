from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm, PasswordChangeForm
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
        strip=True)
    price = forms.DecimalField(label='Цена', decimal_places=2, initial=0.0)
    rubric = forms.ModelChoiceField(queryset=Rubric.objects.all(),
                                    label='Рубрика',
                                    help_text='Не забудьте выбрать рубрику!',
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
        fields = ('title', 'content', 'photo', 'price', 'rubric')
        labels = {'title': 'Название товара'},


class RubricForm(ModelForm):
    name = forms.CharField(label='Название рубрики')

    class Meta:
        model = Rubric
        fields = {'name'}
        labels = {'name': 'Nazvanie'}


class RubricBaseFormSet(BaseModelFormSet):
    def clean(self):
        super().clean()
        names = [form.cleaned_data['name'] for form in self.forms
                 if 'name' in form.cleaned_data]

        if ('Недвижимость' not in names) or ('adas' not in names) \
                or ('jjkkjkn' not in names):
            raise ValidationError('da')


RubricFormSet = modelformset_factory(
    Rubric, fields=('name',),
    can_order=True, can_delete=True, extra=2,
    formset=RubricBaseFormSet
)


class SearchForm(forms.Form):
    keyword = forms.CharField(max_length=20, label='Искомое слово')
    rubric = forms.ModelChoiceField(queryset=Rubric.objects.all(), label='Рубрика')


class RegisterUserForm(UserCreationForm):
    username = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Логин'}))
    password1 = forms.CharField(label='',widget=forms.PasswordInput(attrs={'placeholder': 'Пароль'}))
    password2 = forms.CharField(label='',widget=forms.PasswordInput(attrs={'placeholder': 'Повтор пароля'}))
    captcha = CaptchaField(label='Введите код с картинки', error_messages={'invalid': 'Неправильный текст'})


    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'first_name', 'last_name', 'password1', 'password2']
        labels = {
            'email': '',
            'first_name': '',
            'last_name': '',
        }
        widgets = {
            'email': TextInput(attrs={'placeholder': 'Email'}),
            'first_name': TextInput(attrs={'placeholder': 'Имя'}),
            'last_name': TextInput(attrs={'placeholder': 'Фамилия'}),
        }

    def clean_email(self):
        email = self.cleaned_data['email']
        if get_user_model().objects.filter(email=email).exists():
            raise forms.ValidationError("Такой email уже существует")
        return email


class LoginUserForm(AuthenticationForm):
    username = forms.CharField(label='', widget=TextInput(attrs={'placeholder': 'Логин'}))
    password = forms.CharField(label='', widget=PasswordInput(attrs={'placeholder': 'Пароль'}))

    class Meta:
        model = get_user_model()
        fields = ['username', 'password']


class UserPasswordChangeForm(PasswordChangeForm):
    old_password = forms.CharField(label="Старый пароль", widget=forms.PasswordInput(attrs={'class': 'form-input'}))
    new_password1 = forms.CharField(label="Новый пароль", widget=forms.PasswordInput(attrs={'class': 'form-input'}))
    new_password2 = forms.CharField(label="Подтверждение пароля",
                                    widget=forms.PasswordInput(attrs={'class': 'form-input'}))


class ProfileUserForm(forms.ModelForm):
    username = forms.CharField(disabled=True, label='Логин', widget=forms.TextInput(attrs={'class': 'form-input'}))
    email = forms.CharField(disabled=True, label='E-mail', widget=forms.TextInput(attrs={'class': 'form-input'}))

    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'first_name', 'last_name']
        labels = {
            'first_name': 'Имя',
            'last_name': 'Фамилия',
        }
        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-input'}),
            'last_name': forms.TextInput(attrs={'class': 'form-input'}),
        }


class UploadFileForm(forms.Form):
    file = forms.ImageField(label="Файл")
