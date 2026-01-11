from django.contrib import admin
from django.utils.safestring import mark_safe

from bboard.models import Bb, Rubric, Service

from django.contrib import admin
from django.utils.safestring import mark_safe


class BbAdmin(admin.ModelAdmin):
    list_display = ('title', 'content', 'price', 'post_photo', 'published', 'rubric')
    list_display_links = ('title', 'content',)
    search_fields = ('title', 'content')
    list_filter = ('published', 'rubric')
    list_editable = ('price',)

    fields = ('title', 'content', 'price', 'photo', 'published', 'rubric')
    readonly_fields = ('published', 'post_photo')

    def post_photo(self, bb: Bb):
        if bb.photo:
            return mark_safe(f"<img src='{bb.photo.url}' width=50>")
        return "Без фото"


admin.site.register(Bb, BbAdmin)
admin.site.register(Rubric)

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "created_at")
    search_fields = ("title",)