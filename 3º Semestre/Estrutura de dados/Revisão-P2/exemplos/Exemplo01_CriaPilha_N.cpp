#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <string.h>
struct registro  
{ 
  char nome[40];
  registro* ant;
  //armazenara o endereco de memoria onde esta a
  //estrutura anterior               
} ;
//acima defini uma tipo estrutura chamada registro
typedef registro* ponteiro;
//defino um novo tipo, assim se for criado uma variavel do tipo ponteiro
//ele contera todos os campos da estrutura registro
void exibe(ponteiro u)
{
ponteiro  aux;
aux = u;
while (aux != NULL)
	{
		printf("%s\n", aux->nome);
		aux=aux->ant;      

	}

}


int main() 
{
ponteiro ult, aux;
char nomeb[200];
char resp='S';

//inicializando a pilha
ult = NULL;
aux = NULL;


while (toupper(resp)== 'S')
{
   printf("\nInforme o nome do cliente: \n");
   scanf("%s", nomeb);
   aux = new registro;
   //crio uma novo registro com todos os atributos
   //eh como se tivesse criado uma linha na tabela
   strcpy(aux->nome,nomeb);
   aux->ant = NULL;
      if (ult != NULL)
      {
	    aux->ant = ult;
      }       
	  ult = aux;
   printf("Informe S para continuar \n ");
   fflush(stdin);
   scanf("%c", &resp);          

}
aux=ult;
exibe(ult);  
  system("pause");  
  
}    
