from django.shortcuts import render

# Create your views here.

from .models import *
from django.contrib.auth import authenticate
from .seralizer import *
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework import status,generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

def home(request):
    return HttpResponse("Welcome to your Django backend!")



class RegisterView(APIView):
    def post(self,request):
        seralizer=UserSerializer(data=request.data)
        if seralizer.is_valid():
            user=seralizer.save()
            token,created=Token.objects.get_or_create(user=user)
            return Response(seralizer.data,status=status.HTTP_201_CREATED)
        
        return Response(seralizer.errors,status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self,request):
        Username=request.data.get('username')
        pasword=request.data.get('password')
        user=authenticate(username=Username,password=pasword)
        if user:
            token,created=Token.objects.get_or_create(user=user)
            return Response(
                {
                    'token':token.key,
                    'message':'Login Successful',
                    'username':user.username,
                    'userid':user.id
                },
                status=status.HTTP_200_OK
            )
        return Response({'error':'Invalid Credentials'},status=status.HTTP_401_UNAUTHORIZED)
    
class BuslistCreateView(generics.ListCreateAPIView):
    queryset=Bus.objects.all()
    serializer_class=BusSerializer


class BusDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset=Bus.objects.all()
    serializer_class=BusSerializer


class BookingView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        seat_id=request.data.get('seat_id')
        try:
            seat=Seat.objects.get(id=seat_id)
            if seat.is_booked:
                return Response({'error':'Seat already booked'},status=status.HTTP_400_BAD_REQUEST)
            seat.is_booked=True
            seat.save()

            booking=Booking.objects.create(
                user=request.user,
                bus=seat.bus,
                seat=seat
            )
            seralizer=BookingSerializer(booking)
            return Response(seralizer.data,status=status.HTTP_201_CREATED)
        except Seat.DoesNotExist:
            return Response({'error':'Seat does not exist'},status=status.HTTP_404_NOT_FOUND)


class UserBookingsView(APIView):
    parser_classes=[IsAuthenticated]

    def get(self,request,user_id):
        if request.user.id!=user_id:
            return Response({'error':'Unauthorized'},status=status.HTTP_401_UNAUTHORIZED)
        
        bookings=Booking.objects.filter(user_id=user_id)
        seralizer=BookingSerializer(bookings,many=True)
        return Response(seralizer.data,status=status.HTTP_200_OK)
    

