from django.db import models
from django.contrib.auth.models import User


# Create your models here.



class Bus(models.Model):
    bus_name=models.CharField(max_length=100)
    bus_number=models.CharField(max_length=100,unique=True)
    orgin=models.CharField(max_length=100)
    destination=models.CharField(max_length=100)
    features=models.TextField()
    start_time=models.TimeField()
    reach_time=models.TimeField()
    no_of_seats=models.PositiveBigIntegerField()
    price=models.DecimalField(max_digits=8,decimal_places=2)

    def __str__(self):
        return f"{self.bus_name} - {self.bus_number}"
    

class Seat(models.Model):
    bus=models.ForeignKey('Bus',on_delete=models.CASCADE,related_name='seats')
    seat_number=models.CharField(max_length=10)
    is_booked=models.BooleanField(default=False)

    def __str__(self):
        return f"{self.bus.bus_number} -{self.seat_number} - {'Booked' if self.is_booked else 'Available'}"


class Booking(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    bus=models.ForeignKey(Bus,on_delete=models.CASCADE)
    seat=models.ForeignKey(Seat,on_delete=models.CASCADE)
    booking_time=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking by {self.user.username} for {self.bus.bus_number} - {self.seat.seat_number}"