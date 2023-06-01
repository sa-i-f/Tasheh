from django.db import models

class Accounts(models.Model):
    email = models.EmailField(max_length=70)
    password = models.CharField(max_length=50)
    username=models.CharField(max_length=20,unique=True)
    firstname = models.CharField(max_length=10)
    lastname = models.CharField(max_length=10)

    def __str__(self):
        return self.username
    
    def first_name(self):
        return self.firstname
    


