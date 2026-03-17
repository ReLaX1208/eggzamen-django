from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm, PasswordChangeForm, SetPasswordForm, \
    PasswordResetForm
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
# from django.core import validators
from django.forms import (ModelForm, modelform_factory, DecimalField,
                          modelformset_factory, BaseModelFormSet)
from django.forms.widgets import Select, TextInput, PasswordInput
from django import forms
from django.utils.safestring import mark_safe

from bboard.models import Bb, Rubric, Service
from captcha.fields import CaptchaField
from django.forms.widgets import ClearableFileInput
from .models import Profile
from .models import Accessory

class CustomClearableFileInput(ClearableFileInput):
    template_with_initial = (
        '%(initial_text)s: %(initial)s '
        '%(clear_template)s<br>'
        '%(input_text)s: %(input)s'
    )

    initial_text = mark_safe('<span class="initial-text">На данный момент</span>')
    input_text = mark_safe('<span class="input-text">Изменить</span>')
    clear_checkbox_label = mark_safe('<span class="clear-text">Очистить</span>')


class BbForm(ModelForm):
    title = forms.CharField(
        label='Название модели',
        strip=True)
    price = forms.DecimalField(label='Цена', decimal_places=2, initial=0.0)
    rubric = forms.ModelChoiceField(queryset=Rubric.objects.all(),
                                    label='Бренд',
                                    )


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
        fields = ('title', 'content', 'price', 'rubric', 'photo')
        labels = {'title': 'Название товара',
                  },
        widgets = {
            "photo": CustomClearableFileInput
        }

class RubricForm(ModelForm):
    name = forms.CharField(label='Название бренда')

    class Meta:
        model = Rubric
        fields = {'name', 'photo'}
        labels = {'name': 'Название'}


class RubricBaseFormSet(BaseModelFormSet):
    def clean(self):
        super().clean()
        names = [form.cleaned_data['name'] for form in self.forms
                 if 'name' in form.cleaned_data]


RubricFormSet = modelformset_factory(
    Rubric, fields=('name',),
    can_delete=True,
    formset=RubricBaseFormSet
)


class SearchForm(forms.Form):
    keyword = forms.CharField(max_length=20, label='Искомое слово')
    rubric = forms.ModelChoiceField(queryset=Rubric.objects.all(), label='Рубрика')


class RegisterUserForm(UserCreationForm):
    username = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Логин'}))
    password1 = forms.CharField(label='', widget=forms.PasswordInput(attrs={'placeholder': 'Пароль'}))
    password2 = forms.CharField(label='', widget=forms.PasswordInput(attrs={'placeholder': 'Повтор пароля'}))
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


class UserForgotPasswordForm(PasswordResetForm):
    """
    Запрос на восстановление пароля
    """

    def __init__(self, *args, **kwargs):
        """
        Обновление стилей формы
        """
        super().__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control',
                'autocomplete': 'off'
            })


class UserSetNewPasswordForm(SetPasswordForm):
    """
    Изменение пароля пользователя после подтверждения
    """

    def __init__(self, *args, **kwargs):
        """
        Обновление стилей формы
        """
        super().__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs.update({
                'class': 'form-control',
                'autocomplete': 'off'
            })

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

class ProfileForm(forms.ModelForm):
    remove_avatar = forms.BooleanField(required=False, label="Удалить аватар")
    class Meta:
        model = Profile
        fields = ["avatar"]
        labels = {"avatar": "Аватар"}
        widgets = {
            "avatar": forms.FileInput(attrs={"class": "form-control"})
        }
class ServiceForm(forms.ModelForm):
    delete_photo = forms.BooleanField(
        required=False,
        label="Удалить текущее фото"
    )

    class Meta:
        model = Service
        fields = ["title", "description", "photo", "delete_photo"]
        widgets = {
            "title": forms.TextInput(attrs={"class": "form-input"}),
            "description": forms.Textarea(attrs={"class": "form-input", "rows": 4}),
        }

class AccessoryForm(forms.ModelForm):
    delete_photo = forms.BooleanField(
        required=False,
        label="Удалить фотографию"
    )

    class Meta:
        model = Accessory
        fields = ["title", "description", "price", "photo", "is_active"]
