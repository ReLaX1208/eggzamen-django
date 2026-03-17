from rest_framework import generics, permissions
from django.db.models import Count
from bboard.models import Rubric, Bb, Service
from bboard.serializers import RubricSerializer, BbSerializer, ServiceSerializer

class RubricListApi(generics.ListCreateAPIView):
    queryset = Rubric.objects.annotate(cnt=Count("bb")).order_by("-views")
    serializer_class = RubricSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class RubricDetailApi(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rubric.objects.all()
    serializer_class = RubricSerializer
    permission_classes = [permissions.IsAdminUser]

class BbListApi(generics.ListCreateAPIView):
    queryset = Bb.objects.order_by("-published")
    serializer_class = BbSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class BbDetailApi(generics.RetrieveUpdateDestroyAPIView):
    queryset = Bb.objects.all()
    serializer_class = BbSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class BbByRubricApi(generics.ListAPIView):
    serializer_class = BbSerializer

    def get_queryset(self):
        return Bb.objects.filter(
            rubric_id=self.kwargs["rubric_id"]
        ).order_by("price")

class ServiceListApi(generics.ListAPIView):
    queryset = Service.objects.all().order_by("-created_at")
    serializer_class = ServiceSerializer


class ServiceCreateApi(generics.CreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAdminUser]


class ServiceUpdateApi(generics.UpdateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAdminUser]


class ServiceDeleteApi(generics.DestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAdminUser]

class SearchApi(generics.ListAPIView):
    serializer_class = BbSerializer

    def get_queryset(self):
        q = self.request.query_params.get("q")
        if q:
            return Bb.objects.filter(title__icontains=q)
        return Bb.objects.none()
