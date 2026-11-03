#include <stdio.h> 
#include <stdlib.h>


int posicao, continua;    


struct TbProduto
{
	int codproduto;
	char nomeproduto[30];
	float valor;
	int qtd;
};

struct TbFicha  
{
  int codigo;
  char cpf[30];
  char rg[30];
  char nome[40];
  char bairro[40];
  char cidade[60];     
  char telefone[15];
};

struct TbVenda
{
  int idVenda;
  int idCliente;
  int idProduto;
  int idTotal;
  float totalVenda;
};
//acima defini uma tipo estrutura chamada TbCliente
struct TbFicha ficha[10];
struct TbProduto produto[10];
struct TbVenda venda[10];
//criei uma matriz de estrutura, assim em cada posicao alimento os 4 atributos

void fimserevenda()
{
  printf("Informe o Id da venda: ");
  scanf("%i", &venda[posicao].idVenda);

  venda[posicao].idCliente = ficha[posicao].codigo;
  venda[posicao].idProduto = produto[posicao].codproduto;
  venda[posicao].totalVenda = produto[posicao].valor * produto[posicao].qtd;
  venda[posicao].idTotal = venda[posicao].totalVenda;
}

void fimsereProduto()
{
	printf("Informe o codigo do produto: ");
	scanf("%i", &produto[posicao].codproduto);

	printf("Informe o nome do produto: ");
	scanf("%s", produto[posicao].nomeproduto);

	printf("Informe o valor do produto: ");
	scanf("%f", &produto[posicao].valor);
	fflush(stdin);

	printf("Informe a quantidade do produto: ");
	scanf("%i", &produto[posicao].qtd);
}

void insereCliente()
{
    printf("Informe um codigo para o cliente: ");
    scanf("%i", &ficha[posicao].codigo);
    fflush(stdin);

    printf("Informe seu CPF: ");
    scanf("%s",ficha[posicao].cpf);

    printf("Informe o seu RG: ");
    scanf("%s",ficha[posicao].rg);
    getchar();

    printf("Informe o nome do cliente: ");
    fgets(ficha[posicao].nome, 40, stdin);

    printf("Informe o bairro do cliente: ");
    scanf("%s", ficha[posicao].bairro);

    printf("Informe a cidade do cliente: ");
    scanf("%s", ficha[posicao].cidade);

    printf("Informe o telefone: ");
    scanf("%s",ficha[posicao].telefone);
    
}

void fexibeProduto()
{
  printf("Na posicao digitada estao as informacoes: \n");
  printf("Codigo do Produto %i \n", produto[posicao].codproduto);
  printf("Nome do Produto %s \n", produto[posicao].nomeproduto);
  printf("Valor do Produto %.2f \n", produto[posicao].valor);
  printf("Quantidade do Produto %i \n", produto[posicao].qtd);
}

void exibeCliente()
{
  printf("Codigo %i \n", ficha[posicao].codigo);
  printf("CPF %s \n", ficha[posicao].cpf);
  printf("RG %s \n", ficha[posicao].rg);
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
    fimsereProduto();
    fimserevenda();

    printf("Informe 1 para continuar: ");
    scanf("%i",&continua);    
    system("cls");    
  }
  while (continua == 1);   
  system("cls");
  printf("Informe a posicao para busca \n");
  scanf("%i", &posicao);       
  exibeCliente();
  fexibeProduto();
  system("pause");
}    
