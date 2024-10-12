from django.core import validators
from django.core.exceptions import ValidationError
from django.db import models
from precise_bbcode.fields import BBCodeTextField


def is_active_default():
    return True


class MinMaxValueValidator:
    def __init__(self, min_value, max_value):
        self.min_value = min_value
        self.max_value = max_value

    def __call__(self, val):
        if val < self.min_value or val > self.max_value:
            raise ValidationError('Введённое число должно находиться в диапазоне от '
                                  '%(min)s до %(max)s',
                                  code='out_of_range',
                                  params={'min': self.min_value, 'max': self.max_value})


class RubricQuerySet(models.QuerySet):
    def order_by_bb_count(self):
        return super().annotate(
            cnt=models.Count('bb')
        ).order_by('-cnt')


class RubricManager(models.Manager):

    def get_queryset(self):
        return RubricQuerySet(self.model, using=self._db)

    def order_by_bb_count(self):
        return self.get_queryset().order_by_bb_count()


class Rubric(models.Model):
    name = models.CharField(max_length=20, db_index=True, unique=True,
                            verbose_name='Название')
    photo = models.ImageField(upload_to="photos/%Y/%m/%d/", null=True, default=None,
                              blank=True, verbose_name="Фото")
    objects = models.Manager.from_queryset(RubricQuerySet)()
    bbs = RubricManager()

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return f"/{self.pk}/"

    class Meta:
        verbose_name = 'Рубрика'
        verbose_name_plural = 'Рубрики'
        ordering = ['name', '-photo']


class BbManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().order_by('price')


class Bb(models.Model):
    KINDS = (
        (None, 'Выберите тип публикуемого объявления'),
        ('b', 'Куплю'),
        ('s', 'Продам'),
        ('c', 'Обменяю'),
    )

    kind = models.CharField(max_length=1, choices=KINDS, default='s')

    rubric = models.ForeignKey('Rubric', null=True, on_delete=models.PROTECT,
                               verbose_name='Рубрика')
    title = models.CharField(max_length=50, verbose_name='Товар',
                             validators=[
                                 validators.RegexValidator(
                                     regex='^.{4,}$',
                                     message='Слишком мало букавак!',
                                     code='invalid',
                                 )
                             ],
                             error_messages={'invalid': 'Неправильное название товара!'}
                             )
    content = BBCodeTextField(null=True, blank=True, verbose_name='Описание')
    price = models.DecimalField(max_digits=15, decimal_places=2,
                                null=True, blank=True, verbose_name='Цена', )
    published = models.DateTimeField(auto_now_add=True, db_index=True,
                                     verbose_name='Опубликовано')
    photo = models.ImageField(upload_to="photos/%Y/%m/%d/", default=None,
                              blank=True, verbose_name="Фото")

    objects = models.Manager()
    by_price = BbManager()

    def title_and_price(self):
        if self.price:
            return f'{self.title} ({self.price:.2f})'
        else:
            return self.title

    title_and_price.short_description = 'Название и цена'

    def __str__(self):
        return f'{self.title} ({self.price} тг.)'

    def clean(self):
        errors = {}
        if not self.content:
            errors['content'] = ValidationError('Укажите описание продаваемого товара')

        if self.price and self.price < 0:
            errors['price'] = ValidationError('Укажите неотрицательное значение цены')

        if errors:
            raise ValidationError(errors)

    class Meta:
        verbose_name = 'Объявление'
        verbose_name_plural = 'Объявления'
        ordering = ['-published', 'title']
        get_latest_by = 'published'
        permissions = (("can_create", "Can create anything"),)


class UploadFiles(models.Model):
    file = models.FileField(upload_to='uploads_model')
