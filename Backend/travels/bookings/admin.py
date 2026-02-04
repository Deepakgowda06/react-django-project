from django.contrib import admin
from .models import *
# Register your models here.

class BusAdmin(admin.ModelAdmin):
    list_display = ('bus_name', 'bus_number', 'orgin', 'destination','no_of_seats' ,'start_time', 'reach_time', 'price')
    search_fields = ('bus_name', 'bus_number', 'orgin', 'destination')
    
class SeatAdmin(admin.ModelAdmin):
    list_display=('seat_number','bus','is_booked')

class BookAdmin(admin.ModelAdmin):
    list_display=('user','bus','seat','booking_time')


admin.site.register(Bus, BusAdmin)
admin.site.register(Seat,SeatAdmin)
admin.site.register(Booking,BookAdmin)