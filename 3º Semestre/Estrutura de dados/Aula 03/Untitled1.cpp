#include <stdio.h>

int codigo[100];
int preco[100];
int quantidade[100];
int total_produtos = 0;

int venda_codigo[100];
int venda_qtd[100];
int total_vendas = 0;

void adicionar_produto() {
    printf("Digite o codigo: ");
    scanf("%d", &codigo[total_produtos]);
    
    printf("Digite o preco (em centavos): ");
    scanf("%d", &preco[total_produtos]);
    
    printf("Digite a quantidade: ");
    scanf("%d", &quantidade[total_produtos]);
    
    total_produtos++;
    printf("Produto adicionado!\n");
}

void mostrar_produtos() {
    if (total_produtos == 0) {
        printf("Nenhum produto cadastrado!\n");
        return;
    }
    
    printf("\n=== LISTA DE PRODUTOS ===\n");
    printf("Codigo | Preco  | Quantidade\n");
    printf("------ | ------ | ----------\n");
    
    int i;
    for (i = 0; i < total_produtos; i++) {
        int reais = preco[i] / 100;
        int centavos = preco[i] % 100;
        printf("%d      | %d.%02d  | %d\n", codigo[i], reais, centavos, quantidade[i]);
    }
}

int encontrar_produto(int cod) {
    int i;
    for (i = 0; i < total_produtos; i++) {
        if (codigo[i] == cod) {
            return i;
        }
    }
    return -1;
}

void verificar_estoque() {
    int cod;
    printf("Digite o codigo do produto: ");
    scanf("%d", &cod);
    
    int posicao = encontrar_produto(cod);
    
    if (posicao == -1) {
        printf("Produto nao encontrado!\n");
        return;
    }
    
    printf("\nProduto encontrado:\n");
    printf("Codigo: %d\n", codigo[posicao]);
    
    int reais = preco[posicao] / 100;
    int centavos = preco[posicao] % 100;
    printf("Preco: %d.%02d\n", reais, centavos);
    printf("Quantidade em estoque: %d\n", quantidade[posicao]);
}

void fazer_compra() {
    int cod;
    int qtd;
    
    printf("Digite o codigo do produto: ");
    scanf("%d", &cod);
    
    int posicao = encontrar_produto(cod);
    
    if (posicao == -1) {
        printf("Produto nao encontrado!\n");
        return;
    }
    
    printf("Digite a quantidade desejada: ");
    scanf("%d", &qtd);
    
    if (qtd <= 0) {
        printf("Quantidade invalida!\n");
        return;
    }
    
    if (qtd > quantidade[posicao]) {
        printf("Quantidade insuficiente em estoque!\n");
        printf("Disponivel: %d\n", quantidade[posicao]);
        return;
    }
    
    quantidade[posicao] -= qtd;
    venda_codigo[total_vendas] = cod;
    venda_qtd[total_vendas] = qtd;
    total_vendas++;
    
    printf("Compra realizada com sucesso!\n");
}

void mostrar_vendas() {
    if (total_vendas == 0) {
        printf("Nenhuma venda realizada!\n");
        return;
    }
    
    printf("\n=== RESUMO DE VENDAS ===\n");
    printf("Codigo | Quantidade\n");
    printf("------ | ----------\n");
    
    int total_gasto = 0;
    int i;
    
    for (i = 0; i < total_vendas; i++) {
        int pos = encontrar_produto(venda_codigo[i]);
        int subtotal = venda_qtd[i] * preco[pos];
        
        printf("%d      | %d\n", venda_codigo[i], venda_qtd[i]);
        total_gasto += subtotal;
    }
    
    printf("------ | ----------\n");
    int reais = total_gasto / 100;
    int centavos = total_gasto % 100;
    printf("TOTAL: %d.%02d\n", reais, centavos);
}

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

