#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <string.h>


struct ficha
{
  char nome[40];
  char cpf[15];
  char rg[15];
  char codigo[5];
  ficha *proximo;
  //armazenara o endereco de memoria onde estara a
  //apontando para a ficha anterior
  //para estrutura que nos criamos
  //o asterisco deve ser colocado do lado direito
} ;
//acima defini uma tipo estrutura chamada ficha

typedef ficha* endmem;
//defino um novo tipo, assim se for criado uma variavel do tipo ficha
//ele contera todos os campos da estrutura ficha

    
void Exibe(endmem primeiro)
{
 endmem aux;
 aux = primeiro;
 while (aux != NULL)
  {
    printf("%s\n", aux->nome);
    printf("%s\n", aux->cpf);
    printf("%s\n", aux->rg);
    printf("%s\n", aux->codigo);
    aux=aux->proximo;
  }
}
void RemovePrimeiro(endmem &inicio)
{
    if (inicio == NULL)
    {
        printf("A fila esta vazia.\n");
        return;
    }

    endmem remover = inicio;      
    inicio = inicio->proximo;     
    delete remover;              
}

int main()
{
endmem inicioFila = NULL;
endmem fichaAnterior = NULL;
endmem auxiliarFicha = NULL;
char cliente[40];
char cpfCliente[15];
char rgCliente[15];
char codigoCliente[5];
char resp='S';
//inicializando a fila
inicioFila = NULL;
while (resp== 'S')
{
   printf("\nInforme o nome do cliente: \n");
   scanf("%s", cliente);
   printf("\nInforme o cpf do cliente: \n");
   scanf("%s", cpfCliente);
   printf("\nInforme o rg do cliente: \n");
   scanf("%s", rgCliente);
   printf("\nInforme o codigo do cliente: \n");
   scanf("%s", codigoCliente);
   auxiliarFicha = new ficha;
   strcpy(auxiliarFicha->nome,cliente);
   strcpy(auxiliarFicha->cpf,cpfCliente);
   strcpy(auxiliarFicha->rg,rgCliente);
   strcpy(auxiliarFicha->codigo,codigoCliente);
   auxiliarFicha->proximo = NULL;
      if (inicioFila == NULL)
      {
         inicioFila = auxiliarFicha;
         }
      else
      {
        fichaAnterior->proximo = auxiliarFicha;
        }
      fichaAnterior = auxiliarFicha;
   printf("Informe S para continuar \n ");
 
 
   scanf(" %c", &resp);
}
Exibe(inicioFila);
char opcao;
printf("\nDeseja apagar o primeiro registro? (S/N): ");
scanf(" %c", &opcao);

if (opcao == 'S' || opcao == 's')
{
    RemovePrimeiro(inicioFila);
    printf("\nRegistros apos a remocao:\n");
    Exibe(inicioFila);
}

system("pause");
return 0;
}


