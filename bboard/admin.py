from django.contrib import admin
from django.utils.safestring import mark_safe

from bboard.models import Bb, Rubric


class BbAdmin(admin.ModelAdmin):
    list_display = ('title', 'content', 'price', 'photo', 'post_photo', 'published', 'rubric')
    list_display_links = ('title', 'content')
    search_fields = ('title', 'content')

    def post_photo(self, bb: Bb):
        if bb.photo:
            return mark_safe(f"<img src='{bb.photo.url}' width=50>")
        return "Без фото"


admin.site.register(Bb, BbAdmin)
admin.site.register(Rubric)
