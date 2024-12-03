from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, PasswordChangeView, PasswordResetConfirmView, PasswordResetView
from django.core.paginator import Paginator
from django.contrib.messages.views import SuccessMessageMixin
from django.db.models import Count
from django.forms.formsets import ORDERING_FIELD_NAME
from django.http import HttpResponse, HttpResponseRedirect, HttpResponsePermanentRedirect, HttpResponseNotFound, \
    Http404, StreamingHttpResponse, FileResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404, get_list_or_404
from django.template import loader
from django.template.loader import get_template, render_to_string
from django.urls import reverse_lazy, reverse
from django.views.decorators.http import require_http_methods
from django.views.generic.dates import ArchiveIndexView, DateDetailView
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.views.generic.base import TemplateView, RedirectView
from django.views.generic.edit import CreateView, FormView, UpdateView, DeleteView
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from bboard.forms import BbForm, RubricFormSet, RubricForm, RegisterUserForm, LoginUserForm, SearchForm, \
    ProfileUserForm, UploadFileForm, UserSetNewPasswordForm, UserForgotPasswordForm
from bboard.models import Bb, Rubric, UploadFiles
from django.contrib import messages

from bboard.serializers import RubricSerializer, BbSerializer


def index(request):
    rubrics = Rubric.objects.order_by_bb_count()
    paginator = Paginator(rubrics, 6)
    if 'page' in request.GET:
        page_num = request.GET['page']
    else:
        page_num = 1
    page = paginator.get_page(page_num)
    bbs = Bb.objects.order_by('-published')
    context = {'rubrics': page.object_list, 'bbs': bbs, 'page': page}
    return render(request, 'bboard/index.html', context)


class BbIndexView(ArchiveIndexView):
    model = Bb
    date_field = 'published'
    date_list_period = 'year'
    template_name = 'bboard/index.html'
    context_object_name = 'bbs'
    allow_empty = True

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['rubrics'] = Rubric.objects.annotate(cnt=Count('bb')).filter(cnt__gt=0)
        return context


class BbByRubricView(ListView):
    template_name = 'bboard/by_rubric.html'
    context_object_name = 'bbs'

    def get_queryset(self):
        rubric = Rubric.objects.get(pk=self.kwargs['rubric_id'])
        return rubric.bb_set(manager='by_price').all()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['rubrics'] = Rubric.objects.annotate(cnt=Count('bb')).filter(cnt__gt=0)
        context['current_rubric'] = Rubric.objects.get(pk=self.kwargs['rubric_id'])
        paginator = Paginator(self.object_list, 6)

        page_num = self.request.GET.get('page', 1)
        page = paginator.get_page(page_num)

        context['bbs'] = page.object_list
        context['page'] = page
        return context


class CustomPagination(PageNumberPagination):
    page_size = 6


class BbApiByRubricView(generics.ListAPIView):
    serializer_class = BbSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        rubric_id = self.kwargs['rubric_id']
        return Bb.objects.filter(rubric_id=rubric_id).order_by('price')  # Assuming 'price' is the field to order by

    def get(self, request, *args, **kwargs):
        # Get the queryset and paginate it
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

        # Get the rubrics for the context
        rubrics = Rubric.objects.annotate(cnt=Count('bb')).filter(cnt__gt=0)
        current_rubric = Rubric.objects.get(pk=self.kwargs['rubric_id'])

        # Serialize the paginated bbs
        serializer = self.get_serializer(page, many=True)

        response_data = {
            'current_rubric': {
                'id': current_rubric.id,
                'name': current_rubric.name,
            },
            'bbs': serializer.data,
        }

        return Response(response_data)


class RubCreateView(LoginRequiredMixin, SuccessMessageMixin, CreateView):
    template_name = 'bboard/create2.html'
    form_class = RubricForm
    success_url = reverse_lazy('bboard:index')
    success_message = 'Рубрика "%(name)s" создано'


class BbCreateView(LoginRequiredMixin, SuccessMessageMixin, CreateView):
    template_name = 'bboard/create.html'
    form_class = BbForm
    success_url = '/{rubric_id}'
    success_message = 'Объявление "%(title)s" создано'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['rubrics'] = Rubric.objects.annotate(cnt=Count('bb')).filter(cnt__gt=0)
        return context


class BbEditView(LoginRequiredMixin, UpdateView):
    model = Bb
    form_class = BbForm
    success_url = '/{rubric_id}'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['rubrics'] = Rubric.objects.annotate(cnt=Count('bb')).filter(cnt__gt=0)
        return context


def commit_handler():
    print('Транзакция закоммичена')


@require_http_methods(['GET', 'POST'])
@login_required(login_url='login')
def edit_rubric(request, pk):
    rubric = Rubric.objects.get(pk=pk)
    if request.method == 'POST':
        form = RubricForm(request.POST, request.FILES, instance=rubric)
        if form.is_valid():
            form.save()
            messages.success(request, 'Рубрика исправлена!',
                             extra_tags='alert alert-success')
            return redirect('bboard:index')
    else:
        form = RubricForm(instance=rubric)
    return render(request, 'bboard/edit_rubric.html', {'form': form, 'rubric': rubric})


@require_http_methods(['GET', 'POST'])
@login_required(login_url='login')
def edit(request, pk):
    bb = Bb.objects.get(pk=pk)
    if request.method == 'POST':
        bbf = BbForm(request.POST, request.FILES, instance=bb, )
        if bbf.is_valid():
            if bbf.has_changed():
                bbf.save()
                messages.add_message(request, messages.SUCCESS, 'Объявление исправлено!',
                                     extra_tags='alert alert-success')
                messages.success(request, 'Объявление исправлено!',
                                 extra_tags='alert alert-success')
            return HttpResponseRedirect(
                reverse('bboard:by_rubric', kwargs={'rubric_id': bbf.cleaned_data['rubric'].pk}))
        else:
            context = {'form': bbf}
            return render(request, 'bboard/bb_form.html', context)
    else:
        bbf = BbForm(instance=bb)
        context = {'form': bbf}
        return render(request, 'bboard/bb_form.html', context)


class BbAddView(LoginRequiredMixin, FormView):
    template_name = 'bboard/create.html'
    form_class = BbForm
    initial = {'price': 0.0}

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['rubrics'] = Rubric.objects.annotate(cnt=Count('bb')).filter(cnt__gt=0)
        return context

    def form_valid(self, form):
        form.save()
        return super().form_valid(form)

    def get_form(self, form_class=None):
        self.object = super().get_form(form_class)
        return self.object

    def get_success_url(self):
        return reverse('bboard:by_rubric',
                       kwargs={'rubric_id': self.object.cleaned_data['rubric'].pk})


@require_http_methods(['GET', 'POST'])
def add_and_save(request):
    if request.method == 'POST':
        bbf = BbForm(request.POST, request.FILES)

        if bbf.is_valid():
            bbf.save()
            return redirect('bboard:by_rubric',
                            rubric_id=bbf.cleaned_data['rubric'].pk)
        else:
            context = {'form': bbf}
            return render(request, 'bboard/create.html', context)
    else:
        bbf = BbForm()
        context = {'form': bbf}
        return render(request, 'bboard/create.html', context)


def detail(request, bb_id):
    bb = get_object_or_404(Bb, pk=bb_id)

    rubrics = Rubric.objects.annotate(cnt=Count('bb')).filter(cnt__gt=0)
    context = {'bb': bb, 'rubrics': rubrics}

    return render(request, 'bboard/detail.html', context)


class BbDetailView(DetailView):
    model = Bb

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['rubrics'] = Rubric.objects.annotate(cnt=Count('bb')).filter(cnt__gt=0)
        return context


class BbRedirectView(RedirectView):
    url = '/detail/%(pk)d'


class BbDeleteView(LoginRequiredMixin, DeleteView):
    model = Bb
    success_url = reverse_lazy('bboard:index')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['rubrics'] = Rubric.objects.annotate(cnt=Count('bb')).filter(cnt__gt=0)
        return context


class RubricDeleteView(LoginRequiredMixin, DeleteView):
    model = Rubric
    success_url = reverse_lazy('bboard:index')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['rubric'] = Rubric.objects.get(pk=self.kwargs['pk'])
        return context


class RubricListView(generics.ListAPIView):
    queryset = Rubric.objects.order_by_bb_count()
    serializer_class = RubricSerializer
    pagination_class = CustomPagination

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['bbs'] = Bb.objects.order_by('-published')
        return context


@login_required(login_url='login')
@require_http_methods(['GET', 'POST'])
def rubrics(request):
    rubrics = Rubric.objects.order_by_bb_count()

    paginator = Paginator(rubrics, 6)

    if 'page' in request.GET:
        page_num = request.GET['page']
    else:
        page_num = 1

    page = paginator.get_page(page_num)

    bbs = Bb.objects.order_by('-published')

    context = {'rubrics': page.object_list, 'bbs': bbs, 'page': page}

    return render(request, 'bboard/rubrics.html', context)


class Search(ListView):
    paginate_by = 3

    def get_queryset(self):
        query = self.request.GET.get("q")
        if query:
            return Bb.objects.filter(title__icontains=query)
        return Bb.objects.none()

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['bbs'] = Bb.objects.order_by('-published')
        if 'bb_id' in self.kwargs:
            context['current_bb'] = Bb.objects.get(pk=self.kwargs['bb_id'])
        paginator = Paginator(self.object_list, self.paginate_by)
        page_num = self.request.GET.get('page', 1)
        page = paginator.get_page(page_num)

        context['bbs'] = page.object_list
        context['page'] = page
        context["q"] = f'q={self.request.GET.get("q")}&'
        return context


class RegisterUser(CreateView):
    form_class = RegisterUserForm
    template_name = 'registration/register.html'
    extra_context = {'title': 'Регистрация'}
    success_url = reverse_lazy('login')


class LoginUser(LoginView):
    form_class = LoginUserForm
    template_name = 'registration/login.html'
    extra_context = {'title': 'Авторизация'}

    def get_success_url(self):
        return reverse_lazy('bboard:index')


class UserForgotPasswordView(SuccessMessageMixin, PasswordResetView):
    form_class = UserForgotPasswordForm
    template_name = 'registration/user_password_reset.html'
    success_url = reverse_lazy('bboard:index')
    success_message = 'Письмо с инструкцией по восстановлению пароля отправлена на ваш email'
    subject_template_name = 'registration/email/password_subject_reset_mail.txt'
    email_template_name = 'registration/email/password_reset_mail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Запрос на восстановление пароля'
        return context


class UserPasswordResetConfirmView(SuccessMessageMixin, PasswordResetConfirmView):
    form_class = UserSetNewPasswordForm
    template_name = 'registration/user_password_set_new.html'
    success_url = reverse_lazy('bboard:index')
    success_message = 'Пароль успешно изменен. Можете авторизоваться на сайте.'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Установить новый пароль'
        return context


class ProfileUser(LoginRequiredMixin, UpdateView):
    model = get_user_model()
    form_class = ProfileUserForm
    template_name = 'registration/profile.html'
    extra_context = {'title': "Профиль пользователя"}

    def get_success_url(self):
        return reverse_lazy('profile')

    def get_object(self, queryset=None):
        return self.request.user


def about(request):
    return render(request, 'bboard/about.html')
