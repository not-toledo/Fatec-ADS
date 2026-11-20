#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <string.h>





struct cliente
{
  char nome[40];
  char bairro[50];
  char cpf[15];
  char rg[15];
  int codigo; 
  cliente *proximo;
  //armazenara o endereco de memoria onde estara a
  //apontando para a cliente anterior
  //para estrutura que nos criamos
  //o asterisco deve ser colocado do lado direito
} ;
//acima defini uma tipo estrutura chamada cliente

typedef cliente* clientes;

//defino um novo tipo, assim se for criado uma variavel do tipo cliente
//ele contera todos os campos da estrutura cliente

    
void Exibe(clientes primeiro)
{
 clientes temp;
 temp = primeiro;
 while (temp != NULL)
  {
    printf("%s\n", temp->nome);
    printf("%s\n", temp->bairro);
    printf("%s\n", temp->cpf);
    printf("%s\n", temp->rg);
    printf("%i\n", temp->codigo);
    temp=temp->proximo;
  }
}

int main()
{
clientes inicioFila, clienteAnterior, clienteTemp;
char cli[40];
char resp='S';
//inicializando a fila
inicioFila = NULL;
while (resp== 'S')
{
   printf("\nInforme o nome do cliente: \n");
   scanf("%s", cli);
   clienteTemp = new cliente; //instancia cliente
   strcpy(clienteTemp->nome,cli);
   printf("Informe o bairro");
   scanf("%s", clienteTemp->bairro);
   printf("Informe o rg");
   scanf("%s", clienteTemp->rg);
   printf("Informe o CPF");
   scanf("%s", clienteTemp->cpf);
   printf("Informe o codigo: ");
   scanf("%i", &clienteTemp->codigo); 
   clienteTemp->proximo = NULL;
      if (inicioFila == NULL)
      { inicioFila = clienteTemp;
         }
      else
      {
        clienteAnterior->proximo = clienteTemp;
        }
      clienteAnterior = clienteTemp;
   printf("Informe S para continuar \n ");
 
 
   scanf("%s", &resp);
}
Exibe(inicioFila);
inicioFila = inicioFila->proximo;
Exibe(inicioFila);

system("pause");
}


