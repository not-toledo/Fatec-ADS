#include <stdio.h>
#include <stdlib.h>
#include <string.h>

 char Ad[6][6] = {"Eu", "Tu", "Ele", "Nos", "Vos", "Eles"};

 void Conjuga()
{
   int loop = 0;
   printf(" possui a seguinte conjugacao: \n");
   while (loop <6)
   {
     printf(" %s\n", Ad[loop]);    
     loop++;
   }  
}


int main()
{
    char verbo[10];
    printf("Informe o verbo a ser conjugado ");
    scanf(" %s",verbo);
    Conjuga();
    system("pause");
    return 0;
}
