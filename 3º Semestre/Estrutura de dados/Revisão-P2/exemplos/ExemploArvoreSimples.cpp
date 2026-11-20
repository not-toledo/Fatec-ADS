#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include<windows.h>
#include<math.h>
struct registro  
{
  int codigo;  
  registro* direita;
  registro* esquerda;   
  //armazenara o endereco de memoria onde esta a
  //estrutura anterior               
} ;
//acima defini uma tipo estrutura chamada registro

typedef registro* ponteiro;
//defino um novo tipo, assim se for criado uma variavel do tipo ponteiro
//ele contera todos os campos da estrutura registro

void GoToXY(int column, int line)
{
    // Create a COORD structure and fill in its members.
    // This specifies the new position of the cursor that we will set.
    COORD coord;
    coord.X = column;
    coord.Y = line;

    // Obtain a handle to the console screen buffer.
    // (You're just using the standard console, so you can use STD_OUTPUT_HANDLE
    // in conjunction with the GetStdHandle() to retrieve the handle.)
    // Note that because it is a standard handle, we don't need to close it.
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);

    // Finally, call the SetConsoleCursorPosition function.
    if (!SetConsoleCursorPosition(hConsole, coord))
    {
        // Uh-oh! The function call failed, so you need to handle the error.
        // You can call GetLastError() to get a more specific error code.
        // ...
    }
}

//void gotoxy(int x, int y){
  //   SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE),(COORD){x-1,y-1});
//}

void Exibe(ponteiro raiz, int coluna, int linha)
{
 int desloque=3;
 GoToXY(coluna, linha);
 desloque = trunc(20/(linha * 1.15));
 desloque=linha;
 if (raiz == NULL)    
   {
      printf(".") ;   
   }
 else
   {
     printf("%i",raiz->codigo);
     Exibe(raiz->esquerda, coluna-desloque, linha + 2);                
     Exibe(raiz->direita, coluna+desloque, linha + 2);     
   }  
}

void AlocaDado(ponteiro raiz, ponteiro novoRegistro, int numero)
{
     if (numero > raiz->codigo)     
     {
         if (raiz->direita == NULL)       
          {
             raiz->direita =novoRegistro;              
          }
         else
          {
            AlocaDado(raiz->direita, novoRegistro, numero);
          } 
     }
     else
     {
         if (raiz->esquerda == NULL)
         {
            raiz->esquerda = novoRegistro;                
         }
         else
         {
            AlocaDado(raiz->esquerda, novoRegistro, numero);
         }
     }
}

int main() 
{

ponteiro raiz, auxiliar;
int dado;
//system("cls");
char resp='S';

raiz = NULL;
auxiliar = NULL;

while (resp== 'S')
{
   printf("Informe um numero qualquer: ");
   scanf("%i", &dado);          
   auxiliar = new registro;
   auxiliar->codigo=dado;
   auxiliar->direita = NULL;
   auxiliar->esquerda = NULL;   
      if (raiz != NULL)        
        AlocaDado(raiz, auxiliar, dado);
      else
        raiz=auxiliar;
   printf("Informe S para continuar e qualquer outro caracter para finalizar: ");
   scanf("%s", &resp);
   resp=toupper(resp);          
}
system("cls");
printf("Aperte enter para exibir a arvore");
scanf("");
system("cls");
printf("\n\n\n\n");
Exibe(raiz, 40,1);
printf("\n\n\n\n");
scanf("");
scanf("");
system("");
system("pause");
return 0;  
}    
