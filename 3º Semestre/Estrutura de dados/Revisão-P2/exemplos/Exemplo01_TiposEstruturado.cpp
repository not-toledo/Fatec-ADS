#include <stdio.h> 
#include <stdlib.h>


int posicao, continua;    


struct TbFicha  
{
  int codigo;
  char nome[40];
  char bairro[40];
  char cidade[60];     
  char telefone[10];
} ;
//acima defini uma tipo estrutura chamada TbCliente
struct TbFicha ficha[10];
//criei uma matriz de estrutura, assim em cada posicao alimento os 4 atributos

void insereCliente()
{
    printf("Informe um codigo para o cliente: ");
    scanf("%i", &ficha[posicao].codigo);
    printf("Informe o nome do cliente: ");
    fgets(ficha[posicao].nome, 40, stdin);
    printf("Informe o bairro do cliente: ");
    scanf("%s", ficha[posicao].bairro);
    printf("Informe a cidade do cliente: ");
    scanf("%s", ficha[posicao].cidade);
    printf("Informe o telefone");
    scanf("%s",ficha[posicao].telefone);
}


void exibeCliente()
{
  printf("Na posicao digitada estao as informacoes: \n");
  printf("Codigo %i \n", ficha[posicao].codigo);
  printf("Nome %s \n", ficha[posicao].nome);
  printf("Bairro %s \n", ficha[posicao].bairro);
  printf("Cidade %s \n", ficha[posicao].cidade);
  printf("O Telefone eh: %s\n",ficha[posicao].telefone);
}


int main() 
{
	char nome[10];
  do
  {
    printf("Informe uma posicao para guardar o registro: ");
    scanf("%i", &posicao);       
    //fflush(stdin);
    //fgets(nome,10,stdin);
    
    insereCliente();
    printf("Informe 1 para continuar: ");
    scanf("%i",&continua);    
    system("cls");    
  }
  while (continua == 1);   
  system("cls");
  printf("Informe a posicao para busca \n");
  scanf("%i", &posicao);       
  exibeCliente();
  system("pause");    
}    
