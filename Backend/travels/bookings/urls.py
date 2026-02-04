from django.urls import path
from .views import *

urlpatterns = [
    path('buses/',BuslistCreateView.as_view(),name='bus-list-create'),
    path('buses/<int:pk>/',BusDetailView.as_view(),name='each-bus'),
    path('register/',RegisterView.as_view(),name='register'),
    path('login/',LoginView.as_view(),name='login'),
    path('user/<int:user_id>/bookings/', UserBookingsView.as_view(), name='user-bookings'),
    path('booking/',BookingView.as_view(),name='booking'),
]