#include <stdio.h>
#include <stdlib.h>







int numero[3];
int posicao;

void Exibe()
{
 for (posicao=0;posicao <3;posicao++)
 {
  printf("Na posicao %i ", posicao);
  printf(" esta o numero: %i \n", numero[posicao]);
 }    
  system("pause");      
}

void Ordena()
{
   int troca;
   int qtdTrocas=0;
   bool valida=false;
   posicao = 0;
   do
   {
     valida=false;
     for (posicao=0; posicao <2;posicao++)
     {
         if (numero[posicao]>numero[posicao+1])
         {
          qtdTrocas++;                                 
          troca = numero[posicao];
          numero[posicao] = numero[posicao+1];          
          numero[posicao+1] = troca;                    
          valida=true;
         }
     }    
   }while (valida == true);
 printf("\n Qtd de trocas %i", qtdTrocas);    
     
}

int main() 
{
 for (posicao=0;posicao <3;posicao++)
 {
  printf("\nInforme o numero da posicao %i ", posicao );
  scanf("%i",&numero[posicao]);   
 }    
 
 
printf("\n *** Exibe desordenado *** \n");
Exibe();
Ordena(); 
printf("\n *** Exibe apos ordenacao *** \n");
Exibe();

 
}
