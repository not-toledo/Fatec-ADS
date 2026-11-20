#include <stdio.h>
#include <stdlib.h>

int main(){

    int x = 5;
    int *p = &x;

    printf("%d\n", x); 
    printf("%p\n", &x);   
    printf("%p\n", p);    
    printf("%d\n", *p);


    printf("Digite um numero :\n");
    scanf("%d", p);

    printf("%d", x);
}