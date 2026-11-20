#include <stdio.h>
#include <stdlib.h>
#include <iostream>
int main()
{

  int *ponteiro;  
  int num01, num02;
  //obrigatoriamente voce deve dizer qual o tipo do ponteiro
  //para ele saber a qtd de bytes que ira reservar para esse endereco
  printf("Informe um numero qualquer ");
  scanf("%i", &num01);
  //armazena no endereco da variavel num01
  printf("O numero que voce digitou em num01 foi %i\n", num01);
  ponteiro = &num01; 
  //copia o endereco de memoria para a var ponteiro
  num02 = *ponteiro; 
  //copia o valor do endereco de num01 para a variavel num02
  printf("O numero exibido atraves do ponteiro em num02 eh: %i\n", num02);
  //acima exibe o conteudo da variaven num02 apontado pelo ponteiro
  printf("O endereco da variavel num02 eh: %i\n", &num02);
  printf("O endereco da variavel num01 eh: %i\n", &num01);


  system("pause");

}
