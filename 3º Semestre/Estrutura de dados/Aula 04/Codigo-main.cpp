#include <stdio.h>
#include <stdlib.h>
#include "variaveis.h"
#include "soma.h"

int main(){
	
	printf("Informe o codigo: ");
	scanf("%i", &codigo);
	printf("Informe o valor: ");
	scanf("%i", &valor);
	printf("%i %i", codigo, valor);
	printf("A soma eh: %i", fsoma(10,10));
	system("pause");
	return 0;
}
