#include <stdio.h>
#include "vendas.h"


int main() {

    int opcao = 0;

    while (opcao != 6) {

        printf("\n=== SISTEMA DE VENDAS ===\n");
        printf("1 - Adicionar produto\n");
        printf("2 - Mostrar produtos\n");
        printf("3 - Verificar estoque\n");
        printf("4 - Fazer compra\n");
        printf("5 - Ver vendas\n");
        printf("6 - Sair\n");

        printf("Escolha uma opcao: ");
        scanf("%d", &opcao);

        switch (opcao) {

            case 1:
                adicionar_produto();
                break;

            case 2:
                mostrar_produtos();
                break;

            case 3:
                verificar_estoque();
                break;

            case 4:
                fazer_compra();
                break;

            case 5:
                mostrar_vendas();
                break;

            case 6:
                printf("Encerrando programa...\n");
                break;

            default:
                printf("Opcao invalida!\n");
        }
    }

    return 0;
}